-- OTPs now go out on WhatsApp (Meta Cloud API). We generate every code ourselves, so each row
-- holds a code hash again; provider_ref keeps the WhatsApp message id (wamid) for debugging.
-- Pending Message Central codes can't be checked any more: drop them (people just resend).
delete from public.otp_codes where code_hash is null;
alter table public.otp_codes drop constraint if exists otp_codes_has_check;
alter table public.otp_codes alter column code_hash set not null;
comment on column public.otp_codes.provider_ref is 'WhatsApp message id (wamid) of the code, null in test mode';
