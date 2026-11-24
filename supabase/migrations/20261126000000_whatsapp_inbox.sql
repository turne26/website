-- WhatsApp inbox for the admin panel: every message in and out of the Turne WhatsApp number.
-- Incoming messages and delivery ticks arrive through the webhook; outgoing ones are the OTP
-- codes (logged without the code) and replies sent from /admin/. Only the api Edge Function
-- (service role) can read or write these, like every other table here.

create table public.wa_contacts (
  wa_id          text primary key,                 -- international number without "+", e.g. 919876543210
  profile_name   text,                             -- the name they set in WhatsApp
  last_at        timestamptz not null default now(),
  last_in_at     timestamptz,                      -- last message from them: opens a 24-hour reply window
  last_body      text,
  last_direction text check (last_direction in ('in', 'out')),
  unread         integer not null default 0
);
create index wa_contacts_last_idx on public.wa_contacts (last_at desc);

create table public.wa_messages (
  id          bigint generated always as identity primary key,
  wamid       text unique,                         -- WhatsApp's message id
  wa_id       text not null references public.wa_contacts (wa_id) on delete cascade,
  direction   text not null check (direction in ('in', 'out')),
  kind        text not null default 'text',        -- text, image, otp, button, reaction, ...
  body        text,
  media_id    text,                                -- WhatsApp media id for images, audio, documents
  media_mime  text,
  status      text,                                -- out: sent, delivered, read, failed. in: received
  error       text,
  sent_by     text,                                -- admin email, or 'system' for OTP codes
  created_at  timestamptz not null default now(),
  status_at   timestamptz
);
create index wa_messages_thread_idx on public.wa_messages (wa_id, created_at desc);

alter table public.wa_contacts enable row level security;
alter table public.wa_messages enable row level security;
revoke all on public.wa_contacts, public.wa_messages from anon, authenticated;

-- Log one message and update its conversation in one step. A webhook retry with the same
-- wamid changes nothing. Returns the message id (null for a duplicate).
create or replace function public.wa_log_message(
  p_wa_id text, p_direction text, p_kind text, p_body text,
  p_wamid text default null, p_media_id text default null, p_media_mime text default null,
  p_status text default null, p_sent_by text default null, p_profile_name text default null,
  p_created_at timestamptz default now()
) returns bigint
language plpgsql security definer set search_path = public as $$
declare v_id bigint;
begin
  insert into wa_contacts (wa_id, profile_name, last_at)
  values (p_wa_id, p_profile_name, p_created_at)
  on conflict (wa_id) do update set profile_name = coalesce(excluded.profile_name, wa_contacts.profile_name);

  insert into wa_messages (wamid, wa_id, direction, kind, body, media_id, media_mime, status, sent_by, created_at, status_at)
  values (p_wamid, p_wa_id, p_direction, p_kind, p_body, p_media_id, p_media_mime,
          coalesce(p_status, case when p_direction = 'in' then 'received' else 'sent' end), p_sent_by, p_created_at, p_created_at)
  on conflict (wamid) do nothing
  returning id into v_id;

  if v_id is not null then
    update wa_contacts set
      last_at = greatest(last_at, p_created_at),
      last_body = case when p_created_at >= last_at or last_body is null then p_body else last_body end,
      last_direction = case when p_created_at >= last_at or last_direction is null then p_direction else last_direction end,
      last_in_at = case when p_direction = 'in' then greatest(coalesce(last_in_at, p_created_at), p_created_at) else last_in_at end,
      unread = case when p_direction = 'in' then unread + 1 else unread end
    where wa_id = p_wa_id;
  end if;
  return v_id;
end $$;

-- Apply a delivery status from the webhook. Ticks only move forward (sent -> delivered -> read);
-- failed always wins.
create or replace function public.wa_set_status(p_wamid text, p_status text, p_error text default null, p_at timestamptz default now())
returns void
language sql security definer set search_path = public as $$
  update wa_messages set status = p_status, error = coalesce(p_error, error), status_at = p_at
  where wamid = p_wamid and (
    p_status = 'failed' or status is null or
    (array_position(array['sent','delivered','read'], p_status) > coalesce(array_position(array['sent','delivered','read'], status), 0)
     and status <> 'failed')
  );
$$;

revoke all on function public.wa_log_message(text, text, text, text, text, text, text, text, text, text, timestamptz) from public, anon, authenticated;
revoke all on function public.wa_set_status(text, text, text, timestamptz) from public, anon, authenticated;
