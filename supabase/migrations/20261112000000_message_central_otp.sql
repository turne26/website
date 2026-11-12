-- OTPs via Message Central VerifyNow: they generate and check the code, so a row holds their
-- verificationId instead of a code hash. Test-mode rows still use code_hash.
alter table public.otp_codes alter column code_hash drop not null;
alter table public.otp_codes add column provider_ref text;
alter table public.otp_codes add constraint otp_codes_has_check
  check (code_hash is not null or provider_ref is not null);
