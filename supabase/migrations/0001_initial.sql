-- Eka / Systems — initial Supabase schema
-- Run this migration in Supabase SQL Editor or through the Supabase CLI.

create extension if not exists pgcrypto;

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  tagline text not null,
  bio text not null,
  photo_url text not null default '',
  cv_url text not null default '',
  email text not null,
  phone text,
  location text not null,
  social_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  description text not null default '',
  cover_image_url text not null default '',
  gallery text[] not null default '{}',
  tech_stack text[] not null default '{}',
  project_url text,
  repo_url text,
  role text not null default '',
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date date not null,
  expiry_date date,
  credential_id text,
  credential_url text,
  badge_image_url text not null default '',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists projects_public_order_idx
  on public.projects (status, display_order);
create index if not exists certificates_order_idx
  on public.certificates (display_order);
create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profile_set_updated_at on public.profile;
create trigger profile_set_updated_at
before update on public.profile
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists certificates_set_updated_at on public.certificates;
create trigger certificates_set_updated_at
before update on public.certificates
for each row execute function public.set_updated_at();

alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.contact_messages enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.profile, public.projects, public.certificates to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant insert, update, delete on public.profile, public.projects, public.certificates to authenticated;

-- Public reads: only published projects are visible.
drop policy if exists "Public can read profile" on public.profile;
create policy "Public can read profile"
on public.profile for select
to anon, authenticated
using (true);

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public can read certificates" on public.certificates;
create policy "Public can read certificates"
on public.certificates for select
to anon, authenticated
using (true);

-- The single admin account can manage public content.
drop policy if exists "Authenticated can manage profile" on public.profile;
create policy "Authenticated can manage profile"
on public.profile for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage projects" on public.projects;
create policy "Authenticated can manage projects"
on public.projects for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage certificates" on public.certificates;
create policy "Authenticated can manage certificates"
on public.certificates for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Messages are not publicly readable. Public insert is kept as a fallback;
-- the application API uses the service role and performs stricter validation.
drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated can read messages" on public.contact_messages;
create policy "Authenticated can read messages"
on public.contact_messages for select
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "Authenticated can update messages" on public.contact_messages;
create policy "Authenticated can update messages"
on public.contact_messages for update
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can delete messages" on public.contact_messages;
create policy "Authenticated can delete messages"
on public.contact_messages for delete
to authenticated
using (auth.role() = 'authenticated');

-- Public storage buckets. Upload/write remains authenticated-only.
insert into storage.buckets (id, name, public)
values
  ('profile-photos', 'profile-photos', true),
  ('project-images', 'project-images', true),
  ('certificate-badges', 'certificate-badges', true),
  ('cv-files', 'cv-files', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read portfolio files" on storage.objects;
create policy "Public can read portfolio files"
on storage.objects for select
to public
using (bucket_id in ('profile-photos', 'project-images', 'certificate-badges', 'cv-files'));

drop policy if exists "Authenticated can upload portfolio files" on storage.objects;
create policy "Authenticated can upload portfolio files"
on storage.objects for insert
to authenticated
with check (bucket_id in ('profile-photos', 'project-images', 'certificate-badges', 'cv-files'));

drop policy if exists "Authenticated can update portfolio files" on storage.objects;
create policy "Authenticated can update portfolio files"
on storage.objects for update
to authenticated
using (bucket_id in ('profile-photos', 'project-images', 'certificate-badges', 'cv-files'))
with check (bucket_id in ('profile-photos', 'project-images', 'certificate-badges', 'cv-files'));

drop policy if exists "Authenticated can delete portfolio files" on storage.objects;
create policy "Authenticated can delete portfolio files"
on storage.objects for delete
to authenticated
using (bucket_id in ('profile-photos', 'project-images', 'certificate-badges', 'cv-files'));
