-- Eka / Systems — dedicated hero image column
-- Run in the Supabase SQL Editor AFTER 0001_initial.sql.
-- Separates the hero visual from the profile portrait card.

alter table public.profile
  add column if not exists hero_image_url text not null default '';

-- Backfill: existing rows keep showing their portrait in the hero
-- until a dedicated hero image is uploaded.
update public.profile
set hero_image_url = photo_url
where hero_image_url = '';
