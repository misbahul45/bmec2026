# Pre-Exam Rules Dialog (Aturan Pra-Ujian)

**Tanggal:** 2026-09-09
**Status:** Approved, in implementation
**Scope:** Tambah dialog aturan sebelum ujian benar-benar dimulai

## Latar Belakang

Saat ini user yang menavigasi ke `/dashboard/team/exam/$examId/` langsung dibuat attempt-nya oleh loader — timer mulai langsung berjalan. Ini tidak adil karena user belum sempat membaca aturan. Sistem anti-cheat (`useExamAntiCheat`) sudah aktif, tapi user belum pernah diinformasikan aturannya secara eksplisit.

## Tujuan

Menampilkan **dialog berisi 5 aturan pengerjaan ujian** sebelum user benar-benar memulai. Timer hanya mulai setelah user klik tombol "Mulai Ujian" (dan wajib mencentang checkbox persetujuan).

## 5 Aturan (Hardcoded, Bukan dari DB)

Sesuai keputusan eksplisit user: aturan disimpan sebagai **konstanta di kode** (bukan di database / admin panel).

| # | Judul | Penjelasan | Konsekuensi |
|---|---|---|---|
| 1 | **Satu Perangkat Selama Ujian** | Peserta hanya dapat mengerjakan ujian menggunakan satu perangkat dari awal hingga selesai. Jika akun dibuka pada perangkat lain, sistem akan mendeteksinya. | Otomatis ditandai sebagai indikasi kecurangan dan sesi dapat diblokir. |
| 2 | **Tidak Boleh Berpindah Halaman** | Selama ujian, peserta harus tetap berada di halaman ujian. Berpindah tab, membuka halaman lain, atau meninggalkan halaman ujian akan terdeteksi. | Otomatis ditandai sebagai indikasi kecurangan. |
| 3 | **Soal Tidak Dapat Disalin** | Peserta tidak dapat menyalin, memblok, atau menempelkan teks soal maupun jawaban selama ujian. | Aktivitas tersebut terdeteksi sebagai pelanggaran. |
| 4 | **Tampilan Ujian Harus Tetap Penuh** | Peserta harus mengerjakan dalam tampilan layar penuh/ukuran yang telah ditentukan. Mengecilkan atau mengubah ukuran tampilan ujian akan terdeteksi. | Otomatis ditandai sebagai indikasi kecurangan. |
| 5 | **Tidak Boleh Membuka Aplikasi atau Situs Lain** | Selama ujian, peserta hanya diperbolehkan menggunakan halaman ujian dan tidak membuka aplikasi, browser, atau situs lain untuk mencari jawaban. | Aktivitas yang meninggalkan lingkungan ujian terdeteksi sebagai indikasi kecurangan. |

## Alur Baru

```
User navigasi ke /dashboard/team/exam/$examId/
        ↓
LOADER: getExamPreview (validasi window + assignment + return metadata)
        ↓
Render <ExamStartDialog>
  - Tampilkan 5 aturan
  - Checkbox "Saya sudah membaca dan menyetujui"
  - Tombol "Mulai Ujian" (disabled sampai checkbox)
        ↓
User klik "Mulai Ujian"
        ↓
Panggil startExamSession (serverFn) → attempt dibuat, timer mulai
        ↓
Render <ExamShell> dengan timer berjalan
```

## Implementasi

### File Baru
1. `src/components/exam/ExamStartDialog.tsx` — Komponen dialog
2. `src/components/exam/exam-rules.ts` — Konstanta 5 aturan

### File Diubah
1. `src/server/exam-attempt.ts` — tambah `getExamPreview` serverFn
2. `src/lib/api/exam-attempts/exam-attempt.service.ts` — tambah method `getExamPreview`
3. `src/lib/api/exam-attempts/exam-attempt.query-options.ts` — tambah `examPreviewQueryOptions`
4. `src/routes/dashboard/_authed/team/exam/$examId/index.tsx` — ubah loader & component

### Konstanta Aturan (`exam-rules.ts`)
```ts
export interface ExamRule {
  number: number
  title: string
  description: string
  consequence: string
}

export const EXAM_RULES: ReadonlyArray<ExamRule> = [
  {
    number: 1,
    title: 'Satu Perangkat Selama Ujian',
    description: '...',
    consequence: '...',
  },
  // ... 4 lainnya
]
```

## Behavior Penting

- **Reload page** → dialog muncul lagi, timer tidak jalan sampai klik Mulai lagi.
- **Device verification** tetap dilakukan di `startExamSession` saat tombol Mulai diklik, bukan di dialog.
- **Error handling** (`EXAM_NOT_FOUND`, `NOT_ASSIGNED_TO_SESSION`, `SESSION_NOT_STARTED`, dll.) tetap muncul via `errorComponent` route.
- **Tidak ada localStorage** — setiap reload = dialog fresh.

## Verification

- `tsc --noEmit` harus lulus.
- File modified user (19 file) TIDAK boleh tersentuh.
- Tidak ada perubahan schema/DB.

## Non-Goals

- Aturan dinamis dari database (user eksplisit menolak).
- Fullscreen enforcement di dialog (cukup CSS min-h).
- Animasi transisi fancy (cukup pakai default Radix).
