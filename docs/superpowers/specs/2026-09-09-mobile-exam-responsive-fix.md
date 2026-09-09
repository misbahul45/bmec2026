# Mobile Responsiveness Fix — Exam Pengerjaan

**Tanggal:** 2026-09-09
**Status:** Approved, in implementation
**Scope:** Minimal CSS/HTML fixes untuk iPhone notch & progress info mobile

## Latar Belakang

Halaman ujian (`/dashboard/team/exam/$examId/`) sudah responsif di mobile Android, namun memiliki 3 gap pada iPhone modern (notch / dynamic island / home indicator):

1. **Tanpa `viewport-fit=cover`** — iOS tidak izinkan layout延伸到 area notch.
2. **Tanpa `env(safe-area-inset-*)` padding** — header bisa overlap status bar/notch; action bar bisa tertutup home indicator.
3. **Progress info tersembunyi di mobile** — `hidden sm:flex` pada blok "X/Y dijawab + progress bar" membuat user mobile tidak tahu jumlah soal yang sudah dijawab tanpa membuka dialog "Daftar Soal".

## Tujuan

Mempertahankan layout Android (tidak regresi) sekaligus membuat halaman ujian nyaman di iPhone dengan notch.

## Fix

### Fix 1 — Viewport fit cover
**File:** `src/routes/__root.tsx`

```diff
- content: 'width=device-width, initial-scale=1'
+ content: 'width=device-width, initial-scale=1, viewport-fit=cover'
```

### Fix 2 — Safe area padding
**File:** `src/components/exam/ExamHeader.tsx`
```diff
- <header className="sticky top-0 z-30 h-14 bg-background border-b flex items-center px-4 gap-3">
+ <header className="sticky top-0 z-30 h-14 bg-background border-b flex items-center px-4 gap-3 pt-[env(safe-area-inset-top)]">
```

**File:** `src/components/exam/ExamActionBar.tsx`
```diff
- <div className="sticky bottom-0 bg-background border-t px-3 sm:px-6 py-3 grid grid-cols-3 items-center gap-2 sm:gap-3">
+ <div className="sticky bottom-0 bg-background border-t px-3 sm:px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] grid grid-cols-3 items-center gap-2 sm:gap-3">
```

### Fix 3 — Progress info on mobile
**File:** `src/components/exam/ExamHeader.tsx`

```diff
- <div className="hidden sm:flex items-center gap-2 shrink-0">
-   <span className="text-xs text-muted-foreground whitespace-nowrap">
-     {answered} / {total} dijawab
-   </span>
-   <Progress value={percent} className="w-24 h-1.5" />
- </div>
+ <div className="flex items-center gap-2 shrink-0">
+   <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
+     {answered}/{total}
+   </span>
+   <Progress value={percent} className="hidden sm:block w-24 h-1.5" />
+ </div>
```

## Verification

- `tsc --noEmit` harus lulus tanpa error baru.
- Visual check di Chrome DevTools (device iPhone 14 Pro) untuk konfirmasi padding notch/home indicator.
- Tidak ada file modified user (19 file modified sebelumnya) yang disentuh.

## Non-Goals (di luar scope "dikit")

- Meningkatkan touch target ke 44px+ (perlu redesign tombol).
- Optimasi landscape orientation.
- Swipe gesture untuk navigasi soal.
- Safe area di `ExamMobileToolbar` DialogContent (bisa diperbaiki nanti).

## Risk

🟢 **Rendah.** Semua perubahan bersifat CSS / HTML attribute. Tidak ada perubahan logic. Rollback = `git checkout` 3 file.
