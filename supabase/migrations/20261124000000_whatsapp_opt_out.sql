-- Set by the WhatsApp webhook when a member replies STOP (cleared on START). Launch messages
-- must skip members where this is not null (Privacy §3).
alter table public.members add column whatsapp_opted_out_at timestamptz;
