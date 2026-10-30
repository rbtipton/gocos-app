-- GOCOS field tools: station log table and photo storage.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
--
-- Access model: only signed-in SSI crew can add or read field records.
-- Crew accounts are invited by an admin (Authentication > Users > Invite user),
-- and public sign-ups stay off, so nobody else can get an account.
-- The public dataset tables (pfas_ocean, pfas_inland, pfas_arctic) are not touched.

create table if not exists public.field_samples (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null unique,          -- created on the phone; makes uploads safe to retry
  station_id      text not null,                 -- e.g. CST-021
  site_name       text,
  sampled_at      timestamptz not null,
  lat             double precision check (lat between -90 and 90),
  lng             double precision check (lng between -180 and 180),
  gps_accuracy_m  real,
  sample_types    text[] not null default '{}',
  bottle_ids      text,
  water_temp_c    real,
  salinity_psu    real,
  sea_state       text,
  weather         text,
  notes           text,
  photo_paths     text[] not null default '{}',
  collected_by    uuid references auth.users (id) default auth.uid(),
  qa_status       text not null default 'logged'  -- logged > in_lab > qa_checked > published
                  check (qa_status in ('logged', 'in_lab', 'qa_checked', 'published')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists field_samples_station_idx on public.field_samples (station_id);
create index if not exists field_samples_time_idx on public.field_samples (sampled_at desc);

alter table public.field_samples enable row level security;

drop policy if exists "crew can read field samples" on public.field_samples;
create policy "crew can read field samples"
  on public.field_samples for select to authenticated using (true);

drop policy if exists "crew can add field samples" on public.field_samples;
create policy "crew can add field samples"
  on public.field_samples for insert to authenticated with check (collected_by = auth.uid());

drop policy if exists "crew can fix own field samples" on public.field_samples;
create policy "crew can fix own field samples"
  on public.field_samples for update to authenticated
  using (collected_by = auth.uid()) with check (collected_by = auth.uid());

-- Private bucket for station photos (not publicly readable).
insert into storage.buckets (id, name, public)
values ('field-photos', 'field-photos', false)
on conflict (id) do nothing;

drop policy if exists "crew can upload field photos" on storage.objects;
create policy "crew can upload field photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'field-photos');

drop policy if exists "crew can update field photos" on storage.objects;
create policy "crew can update field photos"
  on storage.objects for update to authenticated
  using (bucket_id = 'field-photos');

drop policy if exists "crew can view field photos" on storage.objects;
create policy "crew can view field photos"
  on storage.objects for select to authenticated
  using (bucket_id = 'field-photos');
