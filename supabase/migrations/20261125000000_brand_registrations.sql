-- Brand registrations from brands.turne.in. They land in the same inbox as /brands/ enquiries
-- (so the admin panel's status + notes workflow covers both), tagged source = 'registration'
-- and carrying the extra details the registration form collects.
alter table public.brand_enquiries
  add column source        text not null default 'enquiry' check (source in ('enquiry', 'registration')),
  add column legal_name    text,
  add column role          text,
  add column website_url   text,
  add column category      text,
  add column city          text,
  add column company_size  text,
  add column interests     text[],
  add column timeline      text;
