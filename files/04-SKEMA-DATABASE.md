# Skema Database (Supabase / Postgres)

**Dokumen:** Skema Data & Kebijakan Akses
**Versi:** 1.0

---

## 1. Tabel `profile` (single row)

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid, PK, default `gen_random_uuid()` | |
| full_name | text | |
| tagline | text | mis. "Full-Stack Developer & Infrastructure Architect" |
| bio | text | |
| photo_url | text | dari bucket `profile-photos` |
| cv_url | text | dari bucket `cv-files` |
| email | text | |
| phone | text | nullable |
| location | text | |
| social_links | jsonb | `{ "linkedin": "...", "github": "...", "whatsapp": "..." }` |
| updated_at | timestamptz | default `now()` |

Catatan: tabel didesain single-row (hanya 1 admin) — dibatasi lewat konvensi aplikasi, tidak perlu constraint khusus di MVP.

## 2. Tabel `projects`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid, PK | |
| title | text | |
| slug | text, unique | untuk URL `/proyek/[slug]` |
| summary | text | ringkasan pendek untuk kartu |
| description | text | konten lengkap |
| cover_image_url | text | |
| gallery | text[] | array URL gambar tambahan |
| tech_stack | text[] | mis. `{Next.js, Supabase, Flutter}` |
| project_url | text | nullable, link demo |
| repo_url | text | nullable |
| role | text | peran Eka di proyek |
| is_featured | boolean | default `false` |
| status | text | `draft` / `published` |
| display_order | int | urutan tampil manual |
| created_at | timestamptz | default `now()` |
| updated_at | timestamptz | default `now()` |

## 3. Tabel `certificates`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid, PK | |
| title | text | |
| issuer | text | |
| issue_date | date | |
| expiry_date | date | nullable |
| credential_id | text | nullable |
| credential_url | text | nullable, link verifikasi |
| badge_image_url | text | |
| display_order | int | |
| created_at | timestamptz | default `now()` |

## 4. Tabel `contact_messages`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid, PK | |
| name | text | |
| email | text | |
| subject | text | nullable |
| message | text | |
| is_read | boolean | default `false` |
| created_at | timestamptz | default `now()` |

## 5. Row Level Security (ringkasan kebijakan)

| Tabel | SELECT publik | INSERT publik | UPDATE/DELETE |
|---|---|---|---|
| profile | ✅ semua kolom | ❌ | hanya `authenticated` |
| projects | ✅ hanya `status = 'published'` | ❌ | hanya `authenticated` |
| certificates | ✅ | ❌ | hanya `authenticated` |
| contact_messages | ❌ | ✅ dengan validasi | hanya `authenticated` |

Contoh policy SQL (ilustratif, sesuaikan saat implementasi):

```sql
alter table projects enable row level security;

create policy "Publik bisa baca proyek published"
on projects for select
using (status = 'published');

create policy "Admin bisa kelola semua proyek"
on projects for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
```

Pola yang sama diterapkan pada `profile`, `certificates`, dan `contact_messages` (dengan penyesuaian pada kebijakan INSERT publik untuk `contact_messages`).

## 6. Storage Buckets

| Bucket | Akses baca | Akses tulis |
|---|---|---|
| profile-photos | Publik | `authenticated` |
| project-images | Publik | `authenticated` |
| certificate-badges | Publik | `authenticated` |
| cv-files | Publik | `authenticated` |
