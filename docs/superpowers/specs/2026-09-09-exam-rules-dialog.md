# Dialog Aturan Pra-Ujian

**Tanggal:** 2026-09-09
**Status:** Approved, in implementation
**Scope:** Tambah dialog aturan sebelum ujian dimulai

## Latar Belingkasan

Sebelum peserta mengerjakan ujian (Olimpiade), mereka harus membaca dan menyetujui 5 aturan. Timer ujian baru berjalan setelah peserta mengklik tombol "Mulai Ujian" — bukan sejak halaman dibuka. Ini mencegah peserta kehilangan waktu karena loading/baru baca aturan.

## 5 Aturan (Hardcoded Constant di Komponen)

1. **Satu Perangkat Selama Ujian** — Peserta hanya dapat mengerjakan ujian menggunakan satu perangkat dari awal hingga selesai. Jika akun dibuka pada perangkat lain, sistem akan mendeteksinya. *Otomatis ditandai sebagai indikasi kecurangan dan sesi dapat diblokir.*
2. **Tidak Boleh Berpindah Halaman** — Berpindah tab, membuka halaman lain, atau meninggalkan halaman ujian akan terdeteksi. *Otomatis ditandai sebagai indikasi kecurangan.*
3. **Soal Tidak Dapat Disalin** — Peserta tidak dapat menyalin, memblok, atau menempelkan teks soal maupun jawaban selama ujian. *Aktivitas tersebut terdeteksi sebagai pelanggaran.*
4. **Tampilan Ujian Harus Tetap Penuh** — Peserta harus mengerjakan dalam tampilan layar penuh/ukuran yang telah ditentukan. Mengecilkan atau mengubah ukuran tampilan ujian akan terdeteksi. *Otomatis ditandai sebagai indikasi kecurangan.*
5. **Tidak Boleh Membuka Aplikasi atau Situs Lain** — Peserta hanya diperbolehkan menggunakan halaman ujian. *Aktivitas yang meninggalkan lingkungan ujian terdeteksi sebagai indikasi kecurangan.*

## Alur Baru

```
User navigasi ke /dashboard/team/exam/$examId/
       ↓
Loader: getExamPreview serverFn
   - Validasi: exam exists, team registered, exam window, session assignment
   - TIDAK buat attempt / TIDAK mulai timer
   - Return: exam title, duration, stage, total questions
       ↓
Component renders <ExamStartDialog>
   - 5 aturan hardcoded
   - Tombol "Mulai Ujian" disabled sampai checkbox dicentang
       ↓
User klik "Mulai Ujian"
       ↓
startExamSession serverFn dipanggil
   - Buat attempt, mulai timer (deadline = now + duration)
   - Return session data
       ↓
Re-render <ExamShell> dengan timer berjalan
```

## File yang Berubah

| Aksi | File |
|---|---|
| **Buat** | `src/components/exam/ExamStartDialog.tsx` |
| Ubah | `src/server/exam-attempt.ts` — tambah `getExamPreview` |
| Ubah | `src/lib/api/exam-attempts/exam-attempt.service.ts` — tambah `getExamPreview` |
| Ubah | `src/lib/api/exam-attempts/exam-attempt.query-options.ts` — tambah `examPreviewQueryOptions` |
| Ubah | `src/routes/dashboard/_authed/team/exam/$examId/index.tsx` — loader pakai `getExamPreview`, conditional render Dialog/Shell |

## Non-Goals

- Tidak ada perubahan schema DB (aturan hardcoded di komponen).
- Tidak ada perubahan device verification flow (tetap di `startExam`).
- Tidak ada localStorage cache (reload = dialog muncul lagi).
- Aturan tidak editable via admin panel.

## Verification

- `tsc --noEmit` harus lulus tanpa error.
- Visual: dialog muncul dengan 5 aturan + checkbox; tombol Mulai disabled sampai dicentang; reload → dialog muncul lagi.
- Tidak ada file modified user (19 file) yang disentuh.

## Risk

🟡 **Sedang.** Loader berubah dari auto-start ke validasi saja. Rollback = revert 4 file modified + hapus 1 file.
