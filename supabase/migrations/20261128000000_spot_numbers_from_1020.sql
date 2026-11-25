-- Waitlist spot numbers continue from 1020 (existing members keep theirs). Premium is now
-- decided by how many people joined before you, not by your spot number, so it still goes to
-- the first 10,000 people whatever the numbering (Terms B1: "verified registration order").

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
  c_first_spot constant integer := 1020;  -- the first spot number handed out from now on
  v_pos      integer;
  v_before   integer;
  v_premium  boolean;
  v_code     text;
  v_referrer bigint;
  v_alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  -- no 0/O/1/I
begin
  perform pg_advisory_xact_lock(hashtext('turne_join'));

  return query
    select m.position, m.premium, m.invite_code from public.members m where m.phone = p_phone;
  if found then return; end if;

  select greatest(coalesce(max(m.position), 0) + 1, c_first_spot), count(*)
    into v_pos, v_before from public.members m;
  v_premium := v_before < p_premium_limit;

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
  values (p_phone, p_name, p_dob, p_city, v_pos, v_premium, v_code,
          v_referrer, p_ref, coalesce(p_utm, '{}'::jsonb), p_landing);

  return query select v_pos, v_premium, v_code;
end;
$$;

-- The spot number the next person will get, for the site's "Next spot" ticket.
create or replace function public.turne_next_spot()
returns integer
language sql stable security definer set search_path = '' as $$
  select greatest(coalesce(max(position), 0) + 1, 1020) from public.members;
$$;
revoke all on function public.turne_next_spot() from public, anon, authenticated;
