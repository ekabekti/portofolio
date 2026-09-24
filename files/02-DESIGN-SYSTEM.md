# Design System — "Command Node"

**Dokumen:** Sistem Desain & UI/UX
**Versi:** 1.0

---

## 1. Konsep & Rasional

Eka membangun sistem monitoring dan infrastruktur digital untuk pemerintah kabupaten (CCTV terpusat, pemantauan distribusi pupuk, sistem kehadiran). Alih-alih glassmorphism dekoratif generik, tema visual didasarkan pada **ruang kendali (control room) yang memantau jaringan hidup** — merefleksikan pekerjaan nyata Eka: membangun dan mengawasi node-node infrastruktur yang saling terhubung. Dari sini lahir nama tema: **Command Node**.

Kesan "megah" dicapai lewat tiga elemen yang punya makna, bukan sekadar dekorasi:
1. Latar malam berkedalaman (bukan hitam pekat generik atau krem hangat default),
2. jaringan partikel/garis yang saling terhubung sebagai motif berulang — merepresentasikan node/sistem yang dipantau,
3. panel kaca (glass panel) yang meniru layar dashboard monitoring sungguhan.

## 2. Palet Warna

| Token | Hex | Peran |
|---|---|---|
| `--bg-base` | `#0A0E1A` | Latar utama — deep indigo-night |
| `--bg-panel` | `#121A2E` | Latar panel kaca / kartu |
| `--bg-panel-hover` | `#182541` | Panel saat hover/aktif |
| `--accent-signal` | `#2DE1C2` | Aksen utama — "sinyal aktif" (CTA, link, status hidup) |
| `--accent-warn` | `#FFB454` | Aksen sekunder — highlight, badge, notifikasi |
| `--text-primary` | `#E8ECF4` | Teks utama, off-white lembut |
| `--text-muted` | `#8892A6` | Teks sekunder/caption |
| `--border-glass` | `rgba(255,255,255,0.08)` | Border tipis panel kaca |

Catatan desain: palet ini sengaja menghindari dua kombinasi paling umum pada desain hasil AI — krem hangat + aksen terracotta, atau hitam pekat + hijau neon tunggal. Dua-nada sinyal (cyan = aktif, amber = peringatan) meniru indikator status pada dashboard monitoring sungguhan, sesuai dunia kerja Eka.

## 3. Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Display/Headline | **Space Grotesk** | Geometris, berkarakter teknikal tanpa terasa klise "coding font" |
| Body | **Inter** | Keterbacaan tinggi lintas ukuran layar |
| Data/kode fungsional | **JetBrains Mono** | Hanya untuk cuplikan kode, tanggal, atau tag tech-stack pada kartu proyek — bukan label dekoratif di semua tempat |

Skala tipe (px): 14 / 16 / 20 / 28 / 40 / 64. Line-height headline besar 1.05–1.15, body 1.6. Line length body dijaga di bawah 80 karakter.

Dihindari: caps-lock pada label dekoratif, eyebrow text di atas tiap heading, dan aksen satu-kata (bold/italic tunggal) pada headline — ini pola default yang membuat desain terasa generik.

## 4. Layout & Grid

Konsep: **panel dashboard asimetris**, bukan grid kartu seragam simetris.

```
Hero:
┌───────────────────────────────────────────┐
│  Nama / Peran / Tagline        Visual 3D   │
│  [Lihat Karya] [Unduh CV]      jaringan    │
│                                 partikel   │
└───────────────────────────────────────────┘

Proyek (asimetris, bukan grid seragam):
┌──────────────┬───────────┐
│  Proyek besar│  Proyek B │
│  (span 2 kol)├───────────┤
│              │  Proyek C │
└──────────────┴───────────┘
```

- Alignment: kiri-align untuk teks panjang (bio, deskripsi proyek); center-align hanya di hero.
- Spacing antar section: 96px desktop / 56px mobile, konsisten di semua halaman.
- Radius panel: 20px — satu radius konsisten, tidak dicampur berbagai radius pada elemen sejenis.

## 5. Motion & Animasi

Prinsip: **satu momen orkestrasi besar, sisanya senyap.**

- **Sekuens muat hero** (sekali saat halaman dibuka): node-node partikel muncul satu per satu lalu saling terhubung membentuk jaringan — referensi langsung ke pekerjaan Eka membangun jaringan sistem. Implementasi via React Three Fiber/WebGL, dengan fallback canvas 2D ringan untuk perangkat lemah.
- **Scroll reveal**: dipakai terbatas — hanya pada transisi antar section utama, bukan fade-in satu per satu di tiap kartu proyek (pola default yang harus dihindari).
- **Hover proyek**: glow tipis pada border panel + sedikit elevasi, meniru "sinyal aktif" saat kursor mendekat — bukan fade generik.
- **Reduced motion**: semua animasi non-esensial dimatikan bila `prefers-reduced-motion: reduce` aktif; digantikan transisi opacity sederhana.

## 6. Komponen Kunci

- **Glass Panel** — `background: var(--bg-panel); backdrop-filter: blur(16px); border: 1px solid var(--border-glass);`
- **Signal Button** (CTA utama) — solid `--accent-signal`, teks gelap, glow halus saat hover.
- **Ghost Button** (CTA sekunder) — border tipis, transparan, teks `--text-primary`.
- **Project Card** — glass panel + gambar cover + tag tech-stack (mono font) + judul (Space Grotesk).
- **Badge Sertifikat** — glass panel kecil + logo penerbit + tanggal.

## 7. Struktur Halaman Publik

1. Hero — identitas + visual 3D jaringan partikel
2. Tentang — bio singkat + skill dalam bentuk grup tag (bukan progress bar generik)
3. Proyek Unggulan — 2–3 proyek besar (layout asimetris) + tautan "lihat semua"
4. Semua Proyek (halaman `/proyek`, opsional untuk MVP awal)
5. Sertifikat — grid badge
6. CV — panel ringkas + tombol lihat/unduh
7. Kontak — form + tautan langsung (email, LinkedIn, GitHub, WhatsApp)
8. Footer

## 8. Aksesibilitas & Kualitas Dasar

- Kontras teks-background minimal 4.5:1 untuk teks body.
- Fokus keyboard terlihat jelas (outline `--accent-signal` 2px).
- Semua gambar punya alt text bermakna.
- Animasi WebGL punya fallback statis untuk perangkat low-end.

---
Referensi implementasi library animasi: lihat `03-ARSITEKTUR-TEKNIS.md`.
