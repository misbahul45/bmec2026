# Fix Team Sessions via API (Local)

**Tanggal**: 2026-09-12
**Status**: Approved (informal)
**Scope**: Local dev only, tidak menyentuh produksi

## Tujuan

Mengubah penetapan sesi untuk beberapa tim OLIMPIADE pada exam PENYISIHAN, plus menambahkan tim test ke sesi penyisihan, **tanpa** mengubah seed atau menjalankan ulang seed:

| Aksi | Tim | Asal sekolah |
|---|---|---|
| Pindah ke sesi 1 | `ABS` | SMA Negeri 2 Depok |
| Pindah ke sesi 2 | `mercy chewy melty` | MAS ISLAM TERPADU BAITUL QUR'AN AL JAHRA MAGETAN |
| Pindah ke sesi 2 | `MafiaSragen` | SMA Unggulan Rushd |
| Verifikasi sesi 1 (sudah benar) | `OLIMPIADE TEST 01` | SMA Test 1 |
| Tambah ke sesi 1 | `Tim Test 1`, `Tim Test 2` | SMA TEST 1, SMA TEST 2 |
| Tambah ke sesi 2 | `Tim Test 3`, `Tim Test 4`, `Tim Test 5` | SMA TEST 3, SMA TEST 4, SMA TEST 5 |

## Pendekatan

Service + server function + CLI runner. Tidak ada edit seed, tidak ada rerun seed.

## Arsitektur

```
Service (pure TS, idempotent, transactional)
  └─ ExamSessionService.setTeamsByNames(payload)
       ├─ Resolve exam by (competition, stage, type)
       ├─ Pre-resolve sesi 1 & sesi 2 by name
       ├─ Batch lookup tim by normalized (name, school)
       ├─ Untuk setiap assignment: tambah / pindah / skip
       └─ Return diff {added, moved, skipped, notFound[]}

Server function (admin-only HTTP)
  └─ setTeamsByNames → requireAdminSession → panggil service

CLI runner (lokal)
  └─ scripts/fix-team-sessions.ts → instantiate service, panggil setTeamsByNames
```

## File yang berubah / ditambah

| File | Aksi |
|---|---|
| `src/schemas/exam-session.schema.ts` | + `setTeamsByNamesSchema` |
| `src/lib/api/exam-sessions/exam-session.repo.ts` | + `findTeamByNameSchool`, reuse existing untuk sessions |
| `src/lib/api/exam-sessions/exam-session.service.ts` | + `setTeamsByNames` |
| `src/server/exam-session.ts` | + server function `setTeamsByNames` (admin-only) |
| `scripts/fix-team-sessions.ts` | CLI runner (Node + tsx) |
| `scripts/fix-team-sessions.payload.json` | Payload siap-cuplik |

## Kontrak API

### Schema (Zod)
```ts
{
  examLookup: {
    competition: "OLIMPIADE",
    stage: "PENYISIHAN",
    type: "OLYMPIAD"
  },
  assignments: [
    { teamName: string, schoolName: string, sessionName: "sesi 1" | "sesi 2" }
  ]
}
```

### Response
```ts
{
  success: true,
  message: "Penugasan sesi tim selesai",
  data: {
    exam: { id, title },
    summary: { added: number, moved: number, skipped: number, notFoundCount: number },
    notFound: [
      { teamName, schoolName, sessionName, reason: "TEAM_NOT_FOUND" | "AMBIGUOUS" }
    ]
  }
}
```

### Idempotensi
- Tim tidak ketemu → masuk `notFound`, lanjut.
- Tim sudah di session target → `skipped`.
- Tim di session lain → `moved` (update).
- Tim belum punya ExamSessionTeam untuk exam ini → `added` (insert).
- Semua dalam satu `prisma.$transaction`.

## Auth

- Server function: `requireAdminSession()` → 401 jika bukan admin.
- CLI runner: langsung panggil service (skip HTTP auth), hanya untuk trusted local script.

## Caveat

`prisma/seeds/olimpiade-test.fixtures.ts` (line 270–275) menghapus
`ExamSessionTeam` untuk `Tim Test 1–5` di exam selain TEST_ADMIN.
**Setelah perubahan via API/CLI, jangan jalankan ulang `seedOlimpiadeTestFixtures`
atau `pnpm prisma db seed`** atau penetapan Tim Test ke PENYISIHAN akan hilang.

## Verifikasi

```sql
SELECT t.name, t."schoolName", es.name AS sesi
FROM "exam_session_team" est
JOIN "team" t ON t.id = est."teamId"
JOIN "exam_session" es ON es.id = est."sessionId"
WHERE t.name IN ('ABS', 'mercy chewy melty', 'MafiaSragen', 'OLIMPIADE TEST 01',
                 'Tim Test 1', 'Tim Test 2', 'Tim Test 3', 'Tim Test 4', 'Tim Test 5')
ORDER BY t.name;
```

Expected:
- ABS → sesi 1
- MafiaSragen → sesi 2
- mercy chewy melty → sesi 2
- OLIMPIADE TEST 01 → sesi 1
- Tim Test 1 → sesi 1
- Tim Test 2 → sesi 1
- Tim Test 3 → sesi 2
- Tim Test 4 → sesi 2
- Tim Test 5 → sesi 2
