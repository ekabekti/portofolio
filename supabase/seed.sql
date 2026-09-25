-- Eka / Systems — optional one-time seed
-- Run AFTER supabase/migrations/0001_initial.sql in the Supabase SQL Editor.
-- Safe to re-run. Afterwards manage everything from /admin/dashboard
-- instead of editing code.

-- 0. One credential_id = one row, so re-runs skip existing certificates.
create unique index if not exists certificates_credential_id_uidx
  on public.certificates (credential_id)
  where credential_id is not null;

-- 1. Profile (single row: inserted only when the table is still empty)
insert into public.profile (full_name, tagline, bio, photo_url, hero_image_url, cv_url, email, phone, location, social_links)
select
  'Ekabekti',
  'App Dev & Infra Enthusiast',
  'Membangun sistem monitoring dan infrastruktur digital untuk pemerintah kabupaten. Berpengalaman dalam pengembangan aplikasi web & mobile, sistem CCTV terpusat, dashboard monitoring distribusi pupuk, dan sistem kehadiran. Mengutamakan solusi yang skalabel, aman, dan mudah dikelola.',
  '',
  '',
  '',
  'ekabekti@example.com',
  '+62 812 3456 7890',
  'Jawa Timur, Indonesia',
  '{"linkedin": "https://linkedin.com/in/ekabekti", "github": "https://github.com/ekabekti", "whatsapp": "https://wa.me/6281234567890"}'::jsonb
where not exists (select 1 from public.profile);

-- 2. Projects (re-runs skip existing slugs)
insert into public.projects (title, slug, summary, description, tech_stack, role, is_featured, status, display_order)
values
  (
    'Sistem Monitoring CCTV Terpusat',
    'monitoring-cctv',
    'Platform monitoring CCTV terpusat untuk pemerintah kabupaten dengan dashboard realtime, manajemen kamera, dan notifikasi otomatis.',
    'Sistem monitoring CCTV terpusat yang mengintegrasikan ratusan kamera dari berbagai titik di wilayah kabupaten ke satu dashboard terpadu.',
    '{Next.js,Node.js,PostgreSQL,WebSocket,Docker}',
    'Lead Developer & System Architect',
    true,
    'published',
    1
  ),
  (
    'Dashboard Distribusi Pupuk',
    'distribusi-pupuk',
    'Dashboard monitoring distribusi pupuk bersubsidi untuk memastikan transparansi dan akuntabilitas di tingkat kabupaten.',
    'Aplikasi web untuk melacak distribusi pupuk bersubsidi dari gudang hingga ke petani.',
    '{React,Express.js,MongoDB,Chart.js,Mapbox}',
    'Full-Stack Developer',
    true,
    'published',
    2
  ),
  (
    'Sistem Kehadiran Digital',
    'sistem-kehadiran',
    'Aplikasi mobile dan web untuk manajemen kehadiran pegawai pemerintah dengan geolokasi dan face recognition.',
    'Sistem absensi digital dengan verifikasi biometrik dan lokasi GPS.',
    '{Flutter,Firebase,Go,TensorFlow Lite}',
    'Mobile & Backend Developer',
    true,
    'published',
    3
  ),
  (
    'Portal Layanan Publik',
    'portal-layanan',
    'Portal layanan publik terintegrasi untuk pengajuan dokumen dan informasi masyarakat.',
    'Platform satu pintu untuk layanan publik dengan tracking status pengajuan.',
    '{Next.js,Supabase,Tailwind CSS}',
    'Full-Stack Developer',
    false,
    'published',
    4
  )
on conflict (slug) do nothing;

-- 3. Certificates (re-runs skip existing credential ids)
insert into public.certificates (title, issuer, issue_date, expiry_date, credential_id, credential_url, display_order)
values
  ('AWS Solutions Architect Associate', 'Amazon Web Services', '2025-03-15', '2028-03-15', 'AWS-SAA-123456', 'https://aws.amazon.com/verification', 1),
  ('Google Cloud Professional Developer', 'Google Cloud', '2024-11-20', '2026-11-20', 'GCP-PD-789012', 'https://cloud.google.com/certification', 2),
  ('Meta Front-End Developer', 'Meta (Coursera)', '2024-06-10', null, 'META-FED-345678', 'https://coursera.org/verify', 3),
  ('Certified Kubernetes Administrator', 'CNCF', '2025-01-05', '2028-01-05', 'CKA-901234', 'https://training.linuxfoundation.org/certification/verify', 4)
on conflict (credential_id) do nothing;
