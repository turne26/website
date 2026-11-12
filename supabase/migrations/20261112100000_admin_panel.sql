-- Admin panel support. Like everything else here, only the `api` Edge Function (service role)
-- can read or write these; anon/authenticated get nothing.

-- ---------------------------------------------------------------- inbox status
alter table public.brand_enquiries
  add column status text not null default 'new' check (status in ('new', 'in_progress', 'done', 'spam')),
  add column admin_note text;
alter table public.contact_messages
  add column status text not null default 'new' check (status in ('new', 'in_progress', 'done', 'spam')),
  add column admin_note text;
create index brand_enquiries_status_idx on public.brand_enquiries (status, created_at desc);
create index contact_messages_status_idx on public.contact_messages (status, created_at desc);

-- ---------------------------------------------------------------- audit log
-- Every change made from the admin panel. Deleted members are logged by position and a masked
-- phone only, so the log doesn't undo a deletion request.
create table public.admin_log (
  id            bigint generated always as identity primary key,
  admin_email   text not null,
  action        text not null,
  target        text,
  detail        jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);
create index admin_log_created_idx on public.admin_log (created_at desc);
alter table public.admin_log enable row level security;
revoke all on public.admin_log from anon, authenticated;

-- ---------------------------------------------------------------- members, admin view
create or replace view public.admin_members
with (security_invoker = true) as
  select m.id, m.position, m.name, m.phone, m.dob, m.city, m.premium, m.invite_code, m.ref_code,
         r.position as referrer_position, r.name as referrer_name,
         (select count(*) from public.members x where x.referred_by = m.id) as referrals,
         m.utm ->> 'source' as utm_source, m.utm ->> 'medium' as utm_medium,
         m.utm ->> 'campaign' as utm_campaign, m.landing, m.created_at
  from public.members m
  left join public.members r on r.id = m.referred_by;
revoke all on public.admin_members from anon, authenticated;

-- ---------------------------------------------------------------- overview numbers
-- One round trip for the whole Overview tab. Days are India days (Asia/Kolkata).
create or replace function public.turne_admin_overview(p_premium_limit integer)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with t as (select (now() at time zone 'Asia/Kolkata')::date as today)
  select jsonb_build_object(
    'members',      (select count(*) from public.members),
    'premium',      (select count(*) from public.members where premium),
    'premiumLimit', p_premium_limit,
    'today',        (select count(*) from public.members, t
                      where (created_at at time zone 'Asia/Kolkata')::date = t.today),
    'last7',        (select count(*) from public.members, t
                      where (created_at at time zone 'Asia/Kolkata')::date > t.today - 7),
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object('day', d.day, 'count', coalesce(c.n, 0)) order by d.day), '[]'::jsonb)
      from (select generate_series(t.today - 29, t.today, interval '1 day')::date as day from t) d
      left join (select (created_at at time zone 'Asia/Kolkata')::date as day, count(*) as n
                 from public.members group by 1) c on c.day = d.day),
    'cities', (
      select coalesce(jsonb_agg(jsonb_build_object('name', city, 'count', n) order by n desc, city), '[]'::jsonb)
      from (select city, count(*) as n from public.members group by city order by n desc, city limit 50) x),
    'sources', (
      select coalesce(jsonb_agg(jsonb_build_object('name', src, 'count', n) order by n desc, src), '[]'::jsonb)
      from (select coalesce(nullif(utm ->> 'source', ''), 'direct') as src, count(*) as n
            from public.members group by 1 order by n desc, 1 limit 10) x),
    'referrers', (
      select coalesce(jsonb_agg(jsonb_build_object('position', position, 'name', name, 'inviteCode', invite_code,
                                                   'count', n) order by n desc, position), '[]'::jsonb)
      from (select r.position, r.name, r.invite_code, count(m.id) as n
            from public.members r join public.members m on m.referred_by = r.id
            group by r.id order by n desc, r.position limit 10) x),
    'smsToday',      (select count(*) from public.otp_sends, t
                       where (sent_at at time zone 'Asia/Kolkata')::date = t.today),
    'smsTotal',      (select count(*) from public.otp_sends),
    'verifiedTotal', (select count(*) from public.verification_tokens),
    'enquiriesNew',  (select count(*) from public.brand_enquiries where status = 'new'),
    'messagesNew',   (select count(*) from public.contact_messages where status = 'new')
  )
  from t;
$$;

revoke execute on function public.turne_admin_overview(integer) from public, anon, authenticated;
grant execute on function public.turne_admin_overview(integer) to service_role;
