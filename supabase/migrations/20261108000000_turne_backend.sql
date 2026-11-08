-- Turne waitlist backend.
-- Every table has RLS on and no policies, and anon/authenticated have no grants, so the
-- public API keys can't read or write anything. Only the `api` Edge Function (service role)
-- touches this data.

-- ---------------------------------------------------------------- members
create table public.members (
  id            bigint generated always as identity primary key,
  phone         text not null unique check (phone ~ '^[6-9][0-9]{9}$'),
  name          text not null check (char_length(name) between 2 and 100),
  dob           date not null,
  city          text not null check (char_length(city) between 1 and 80),
  position      integer not null unique check (position > 0),
  premium       boolean not null,
  invite_code   text not null unique,
  referred_by   bigint references public.members (id) on delete set null,
  ref_code      text,                -- the ?ref= code as received, even if it matched no one
  utm           jsonb not null default '{}'::jsonb,
  landing       text,
  created_at    timestamptz not null default now()
);
create index members_referred_by_idx on public.members (referred_by);

-- ---------------------------------------------------------------- OTPs
-- One live code per phone. The code is stored as a salted SHA-256 hash, never in clear.
create table public.otp_codes (
  phone         text primary key,
  code_hash     text not null,
  attempts      integer not null default 0,
  expires_at    timestamptz not null,
  sent_at       timestamptz not null default now()
);

-- Send log, used for rate limiting by phone and by IP.
create table public.otp_sends (
  id            bigint generated always as identity primary key,
  phone         text not null,
  ip            text,
  sent_at       timestamptz not null default now()
);
create index otp_sends_phone_idx on public.otp_sends (phone, sent_at desc);
create index otp_sends_ip_idx on public.otp_sends (ip, sent_at desc);

-- Short-lived proof that a phone passed OTP; spent by POST /waitlist. Stored hashed.
create table public.verification_tokens (
  token_hash    text primary key,
  phone         text not null,
  expires_at    timestamptz not null,
  used_at       timestamptz,
  created_at    timestamptz not null default now()
);
create index verification_tokens_phone_idx on public.verification_tokens (phone);

-- ---------------------------------------------------------------- forms
create table public.brand_enquiries (
  id            bigint generated always as identity primary key,
  name          text not null,
  company       text not null,
  email         text not null,
  phone         text,
  plan          text,
  message       text,
  ip            text,
  created_at    timestamptz not null default now()
);
create index brand_enquiries_ip_idx on public.brand_enquiries (ip, created_at desc);

create table public.contact_messages (
  id            bigint generated always as identity primary key,
  name          text not null,
  email         text not null,
  topic         text,
  message       text not null,
  ip            text,
  created_at    timestamptz not null default now()
);
create index contact_messages_ip_idx on public.contact_messages (ip, created_at desc);

-- ---------------------------------------------------------------- lock down
alter table public.members             enable row level security;
alter table public.otp_codes           enable row level security;
alter table public.otp_sends           enable row level security;
alter table public.verification_tokens enable row level security;
alter table public.brand_enquiries     enable row level security;
alter table public.contact_messages    enable row level security;

revoke all on public.members, public.otp_codes, public.otp_sends, public.verification_tokens,
              public.brand_enquiries, public.contact_messages
  from anon, authenticated;

-- ---------------------------------------------------------------- join
-- Adds a phone to the waitlist and returns its spot. Positions are handed out one at a time
-- under a lock so two people can never get the same number. Calling it again for a phone
-- that's already in returns the existing spot unchanged.
create or replace function public.turne_join(
  p_phone         text,
  p_name          text,
  p_dob           date,
  p_city          text,
  p_ref           text,
  p_utm           jsonb,
  p_landing       text,
  p_premium_limit integer
)
returns table (member_position integer, member_premium boolean, member_invite_code text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_pos      integer;
  v_code     text;
  v_referrer bigint;
  v_alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  -- no 0/O/1/I
begin
  perform pg_advisory_xact_lock(hashtext('turne_join'));

  return query
    select m.position, m.premium, m.invite_code from public.members m where m.phone = p_phone;
  if found then return; end if;

  select coalesce(max(m.position), 0) + 1 into v_pos from public.members m;

  loop
    select string_agg(substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1), '')
      into v_code from generate_series(1, 6);
    exit when not exists (select 1 from public.members m where m.invite_code = v_code);
  end loop;

  if p_ref is not null then
    select m.id into v_referrer from public.members m where m.invite_code = upper(p_ref);
  end if;

  insert into public.members (phone, name, dob, city, position, premium, invite_code,
                              referred_by, ref_code, utm, landing)
  values (p_phone, p_name, p_dob, p_city, v_pos, v_pos <= p_premium_limit, v_code,
          v_referrer, p_ref, coalesce(p_utm, '{}'::jsonb), p_landing);

  return query select v_pos, v_pos <= p_premium_limit, v_code;
end;
$$;

revoke execute on function public.turne_join(text, text, date, text, text, jsonb, text, integer)
  from public, anon, authenticated;
grant execute on function public.turne_join(text, text, date, text, text, jsonb, text, integer)
  to service_role;

-- Handy for the team: who brought in the most people.
create or replace view public.referral_leaderboard
with (security_invoker = true) as
  select r.position, r.name, r.invite_code, count(m.id) as referrals
  from public.members r
  join public.members m on m.referred_by = r.id
  group by r.id
  order by referrals desc;

revoke all on public.referral_leaderboard from anon, authenticated;
