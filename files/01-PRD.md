# PRD — Landing Page Portofolio Eka

**Dokumen:** Product Requirements Document
**Versi:** 1.0
**Tanggal:** 24 September 2026
**Status:** Draft untuk direview sebelum eksekusi

---

## 1. Latar Belakang

Eka membutuhkan landing page portofolio pribadi yang menampilkan identitas profesional sebagai full-stack developer dan arsitek infrastruktur digital, dengan fokus pada proyek-proyek pemerintahan tingkat kabupaten (sistem monitoring, dashboard, aplikasi mobile & web). Konten yang ditampilkan (foto profil, portofolio, CV, sertifikat, proyek, kontak) harus bisa diubah tanpa mengedit kode, sehingga dibutuhkan backend sederhana untuk mengelola data tersebut.

## 2. Tujuan

- Menyajikan kesan profesional, megah, dan kreatif kepada calon klien/atasan/rekruter.
- Memudahkan Eka memperbarui konten (proyek baru, sertifikat baru, CV terbaru) tanpa redeploy kode setiap kali ganti isi.
- Menjadi single source of truth link portofolio yang bisa dibagikan (LinkedIn, email lamaran, dokumen tender/procurement).

## 3. Target Pengguna

| Persona | Kebutuhan |
|---|---|
| Rekruter / HR | Scan cepat skill, proyek, dan CV |
| Klien/instansi pemerintah | Validasi rekam jejak proyek, bukti kredibilitas (sertifikat) |
| Kolega/komunitas tech | Melihat detail teknis proyek, kontak |
| Eka (admin) | Update konten cepat tanpa sentuh kode |

## 4. Lingkup (Scope)

### 4.1 In-scope (MVP)
- Halaman publik: Hero, Tentang, Proyek, Sertifikat, CV, Kontak, Footer
- Dashboard admin: login, CRUD profil, CRUD proyek, CRUD sertifikat, upload file (foto, CV, gambar proyek, badge sertifikat), kotak masuk pesan kontak
- Form kontak publik tersimpan ke database (dan opsional notifikasi email)
- Desain dark, futuristik, glassmorphism, animasi 3D/particle, glow

### 4.2 Out-of-scope (fase mendatang)
- Blog/artikel
- Multi-bahasa (ID/EN)
- Analitik pengunjung custom (bisa pakai Vercel Analytics bawaan)
- Sistem komentar/testimoni publik
- CMS multi-admin/multi-role

## 5. Fitur Utama — Frontend Publik

| # | Fitur | Deskripsi |
|---|---|---|
| F1 | Hero | Nama, peran, tagline, visual animasi 3D/particle sebagai identitas, CTA "Lihat Karya" & "Unduh CV" |
| F2 | Tentang | Bio, skill stack, filosofi kerja |
| F3 | Proyek | Grid/list proyek unggulan dari database, detail per proyek |
| F4 | Sertifikat | Daftar sertifikat dengan penerbit, tanggal, badge, link verifikasi |
| F5 | CV | Tombol lihat/unduh CV (file PDF dari storage) |
| F6 | Kontak | Form (nama, email, pesan) tersimpan ke DB + link sosial media/email langsung |
| F7 | Footer | Copyright, link sosial, navigasi cepat |

## 6. Fitur Utama — Admin Dashboard

| # | Fitur | Deskripsi |
|---|---|---|
| A1 | Login | Autentikasi via Supabase Auth (email+password), hanya akun admin |
| A2 | Kelola Profil | Edit foto profil, nama, tagline, bio, kontak, link sosial, upload CV |
| A3 | Kelola Proyek | CRUD proyek: judul, deskripsi, tech stack, gambar, link demo/repo, urutan tampil, status publish/draft |
| A4 | Kelola Sertifikat | CRUD sertifikat: judul, penerbit, tanggal, badge image, link verifikasi |
| A5 | Kotak Masuk Kontak | Lihat & tandai pesan dari form kontak sebagai sudah dibaca |
| A6 | Upload File | Upload gambar/PDF ke Supabase Storage dengan preview |

## 7. User Stories (contoh)

- Sebagai pengunjung, saya ingin melihat proyek unggulan Eka dengan cepat agar bisa menilai kompetensinya.
- Sebagai rekruter, saya ingin mengunduh CV terbaru dalam satu klik.
- Sebagai Eka (admin), saya ingin menambah proyek baru lengkap dengan gambar tanpa menyentuh kode.
- Sebagai Eka (admin), saya ingin melihat semua pesan kontak yang masuk di satu tempat.

## 8. Kebutuhan Non-Fungsional

- **Performa:** skor Lighthouse Performance ≥ 90 di halaman publik, animasi tidak menghambat FCP/LCP.
- **Responsif:** mobile-first, teruji di breakpoint 375px–1920px.
- **Aksesibilitas:** kontras warna sesuai WCAG AA, `prefers-reduced-motion` dihormati, navigasi keyboard.
- **SEO:** meta tag dinamis, Open Graph image, sitemap.xml.
- **Keamanan:** Row Level Security di Supabase, route admin terproteksi middleware, validasi input form kontak (anti-spam sederhana).
- **Biaya:** memanfaatkan tier gratis Vercel + Supabase selama traffic masih rendah.

## 9. Stack Teknologi (disepakati)

- Frontend: **Next.js** (React, App Router)
- Backend/data: **Supabase** (Postgres, Auth, Storage)
- Hosting: **Vercel**
- Styling: Tailwind CSS
- Animasi: Framer Motion (transisi UI) + React Three Fiber/GSAP (efek 3D/particle)

## 10. Metrik Sukses

- Waktu update konten (tambah proyek baru) < 5 menit lewat admin dashboard, tanpa deploy ulang.
- Waktu muat halaman utama < 2.5 detik (4G).
- Tidak ada downtime terkait perubahan konten (karena konten dinamis dari DB, bukan hardcode).

## 11. Asumsi & Batasan

- Hanya satu admin (Eka) — tidak perlu sistem multi-role di MVP.
- Konten awal (foto, teks bio, proyek) akan diisi manual oleh Eka setelah sistem admin jadi.
- Tidak ada anggaran khusus — semua tooling open-source/tier gratis.

## 12. Dokumen Terkait

- `02-DESIGN-SYSTEM.md` — sistem desain & UI/UX
- `03-ARSITEKTUR-TEKNIS.md` — arsitektur teknis
- `04-SKEMA-DATABASE.md` — skema database Supabase
- `05-SPESIFIKASI-API.md` — spesifikasi akses data
- `06-RENCANA-IMPLEMENTASI.md` — rencana eksekusi bertahap
- `07-PANDUAN-DEPLOYMENT.md` — panduan deploy ke Vercel & Supabase
