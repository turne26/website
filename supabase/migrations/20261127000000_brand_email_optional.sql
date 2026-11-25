-- Work email is optional on brand registrations (the WhatsApp-verified mobile is the contact).
-- The short /brands/enquiry form still requires one; the api function checks that.
alter table public.brand_enquiries alter column email drop not null;
