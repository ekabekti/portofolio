# Panduan Deployment — Vercel & Supabase

**Dokumen:** Panduan Deploy
**Versi:** 1.0

---

## 1. Setup Supabase
1. Buat project baru di supabase.com.
2. Jalankan migration SQL untuk tabel & RLS sesuai `04-SKEMA-DATABASE.md` (lewat SQL Editor atau Supabase CLI).
3. Buat 4 storage bucket: `profile-photos`, `project-images`, `certificate-badges`, `cv-files`, set kebijakan akses sesuai spesifikasi.
4. Buat akun admin di **Authentication > Users** (email + password); jangan aktifkan signup publik.
5. Catat `Project URL`, `anon public key`, dan `service_role key` dari **Project Settings > API**.

## 2. Setup Vercel
1. Import repository Git ke Vercel.
2. Framework preset: **Next.js** (otomatis terdeteksi).
3. Tambahkan Environment Variables di **Project Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only, jangan expose ke client)
4. Deploy branch `main` sebagai Production; branch lain otomatis menjadi Preview deployment.

## 3. Domain (opsional)
1. Tambahkan domain custom di **Project Settings > Domains**.
2. Arahkan DNS (A/CNAME) sesuai instruksi Vercel.
3. Tunggu propagasi & verifikasi SSL otomatis aktif.

## 4. Checklist Pasca-Deploy
- [ ] Halaman publik tampil benar dengan data dari Supabase
- [ ] Login admin berhasil, redirect ke dashboard
- [ ] CRUD proyek/sertifikat berfungsi dan langsung terlihat di halaman publik (ISR revalidate)
- [ ] Upload file (foto, CV, gambar) berhasil dan bisa diakses publik
- [ ] Form kontak berhasil submit dan muncul di kotak masuk admin
- [ ] Cek Lighthouse score di URL production
- [ ] Cek `robots.txt` & `sitemap.xml` bisa diakses

## 5. Catatan Biaya
- Vercel Hobby (gratis) & Supabase Free Tier cukup untuk tahap awal — traffic rendah, storage kecil.
- Pantau batas Supabase Free Tier (500MB database, 1GB storage, bandwidth) bila traffic mulai naik.
