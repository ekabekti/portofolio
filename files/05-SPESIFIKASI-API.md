# Spesifikasi Akses Data (API)

**Dokumen:** Spesifikasi Data Layer
**Versi:** 1.0

Sebagian besar akses data dilakukan langsung lewat Supabase client (bukan REST API custom penuh), dibantu satu API route untuk form kontak.

---

## 1. Query Publik (Supabase client, anon key + RLS)

| Halaman | Query |
|---|---|
| Hero / Tentang | `select * from profile limit 1` |
| Proyek unggulan | `select * from projects where status='published' and is_featured=true order by display_order` |
| Semua proyek | `select * from projects where status='published' order by display_order` |
| Detail proyek | `select * from projects where slug=:slug and status='published'` |
| Sertifikat | `select * from certificates order by display_order` |

## 2. API Route — Kirim Pesan Kontak

`POST /api/kontak`

Request body:
```json
{
  "name": "string",
  "email": "string",
  "subject": "string?",
  "message": "string",
  "honeypot": ""
}
```

Alur:
1. Validasi field wajib (`name`, `email`, `message`) dan format email.
2. Tolak jika field `honeypot` terisi (indikasi bot).
3. Insert ke tabel `contact_messages` via service role (server-side).
4. *(Opsional fase lanjutan)* kirim notifikasi email ke Eka via layanan email transaksional, mis. Resend — tidak wajib di MVP.
5. Response: `{ "success": true }` atau pesan error yang spesifik.

## 3. Operasi Admin (Supabase client dengan sesi authenticated)

| Aksi | Operasi |
|---|---|
| Update profil | `update profile set ... where id=:id` |
| Tambah/ubah/hapus proyek | `insert` / `update` / `delete` ke `projects` |
| Tambah/ubah/hapus sertifikat | `insert` / `update` / `delete` ke `certificates` |
| Upload file | `supabase.storage.from(bucket).upload(path, file)`, lalu simpan public URL ke kolom terkait |
| Lihat pesan masuk | `select * from contact_messages order by created_at desc` |
| Tandai dibaca | `update contact_messages set is_read=true where id=:id` |

## 4. Penanganan Error

- Semua form admin menampilkan pesan error spesifik (bukan pesan generik "terjadi kesalahan") — sebutkan apa yang salah dan cara memperbaikinya.
- Upload file: validasi tipe dan ukuran file di sisi client sebelum diunggah (mis. maksimal 5MB untuk gambar, 10MB untuk PDF CV).
