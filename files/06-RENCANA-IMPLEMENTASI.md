# Rencana Implementasi Bertahap

**Dokumen:** Rencana Eksekusi
**Versi:** 1.0

Disusun agar bisa dieksekusi langsung oleh AI coding agent, fase demi fase. Setiap fase punya tujuan dan checklist tugas.

---

## Fase 0 — Setup Proyek
**Tujuan:** kerangka proyek siap jalan lokal & ter-deploy skeleton ke Vercel.
- [ ] Inisialisasi Next.js (App Router, TypeScript, Tailwind CSS)
- [ ] Setup ESLint + Prettier
- [ ] Buat project Supabase baru, catat URL & keys
- [ ] Konfigurasi `.env.local` dan `.env.example`
- [ ] Hubungkan repo ke Vercel, deploy skeleton awal

## Fase 1 — Database & Backend
**Tujuan:** struktur data siap dipakai frontend & admin.
- [ ] Buat tabel `profile`, `projects`, `certificates`, `contact_messages` (lihat `04-SKEMA-DATABASE.md`)
- [ ] Aktifkan RLS + policy sesuai spesifikasi
- [ ] Buat 4 storage bucket + policy akses
- [ ] Buat akun admin manual di Supabase Auth
- [ ] Isi data dummy secukupnya untuk keperluan development

## Fase 2 — Fondasi Desain
**Tujuan:** design token & komponen dasar siap dipakai di semua halaman.
- [ ] Konfigurasi warna, font, radius di `tailwind.config.ts` sesuai `02-DESIGN-SYSTEM.md`
- [ ] Import font (Space Grotesk, Inter, JetBrains Mono)
- [ ] Bangun komponen dasar: GlassPanel, SignalButton, GhostButton, Badge, Tag
- [ ] Setup layout dasar + navigasi

## Fase 3 — Frontend Publik
**Tujuan:** seluruh halaman publik hidup dengan data dari Supabase.
- [ ] Hero + visual 3D/particle (React Three Fiber), dengan fallback ringan
- [ ] Halaman Tentang
- [ ] Halaman Proyek (grid asimetris) + halaman detail per slug
- [ ] Halaman Sertifikat
- [ ] Section CV (lihat/unduh)
- [ ] Form Kontak + integrasi `api/kontak`
- [ ] Footer

## Fase 4 — Admin Dashboard
**Tujuan:** Eka bisa kelola semua konten sendiri.
- [ ] Halaman login admin + proteksi middleware
- [ ] Form kelola profil (termasuk upload foto & CV)
- [ ] CRUD proyek (termasuk upload gambar, atur `display_order`, toggle publish/draft)
- [ ] CRUD sertifikat (termasuk upload badge)
- [ ] Kotak masuk pesan kontak (list, tandai dibaca)

## Fase 5 — Animasi & Polish
**Tujuan:** kesan "megah" sesuai brief tercapai.
- [ ] Sekuens muat hero (sekali, orkestrasi partikel membentuk jaringan)
- [ ] Scroll reveal terbatas di transisi antar section besar
- [ ] Hover micro-interaction pada kartu proyek (glow + elevasi)
- [ ] Hormati `prefers-reduced-motion`
- [ ] Review visual menyeluruh (screenshot tiap breakpoint) & self-critique sesuai prinsip desain

## Fase 6 — SEO, Performa, Aksesibilitas
- [ ] Meta tag dinamis + Open Graph image
- [ ] `sitemap.xml` & `robots.txt`
- [ ] Audit Lighthouse (Performance, Accessibility, SEO ≥ 90)
- [ ] Optimasi gambar (`next/image`, lazy load)
- [ ] Cek kontras warna & navigasi keyboard

## Fase 7 — Testing & Go-Live
- [ ] Uji alur admin end-to-end (login → CRUD → tampil di publik)
- [ ] Uji form kontak (submit → masuk DB → tampil di admin)
- [ ] Uji responsif di beberapa device/breakpoint
- [ ] Deploy production ke Vercel (lihat `07-PANDUAN-DEPLOYMENT.md`)
- [ ] Setup domain custom (jika ada)
