/**
 * Seed: Exam Session + Exam Session Team assignment untuk OLIMPIADE.
 *
 * Behavior (idempotent):
 *   1. Cari Exam "Penyisihan OLIMPIADE" (OLYMPIAD type, PENYISIHAN stage)
 *   2. Hapus semua sesi existing untuk exam tersebut (cascade ke assignments)
 *   3. Buat 2 sesi baru dengan split half-half dalam window exam:
 *        - Sesi 1: 01:00 – 03:30 UTC (08:00 – 10:30 WIB)
 *        - Sesi 2: 03:30 – 06:00 UTC (10:30 – 13:00 WIB)
 *   4. Assign 350 tim olimpiade (175 per sesi) sesuai list di session-teams.data
 *
 * Match strategy:
 *   1. exact (normalized name + normalized school)
 *   2. exact (normalized name only) — prefer olm-* code, fallback pending-*
 *
 * Catatan: Tim dengan kode "OLM-TEST-01" (OLIMPIADE TEST 01) tetap di-assign
 * ke sesi 1 sesuai list user — bukan test fixture, ini tim resmi dari input.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { SESSION_TEAMS_RAW } from "./session-teams.data";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString, connectionTimeoutMillis: 5_000 });
const prisma = new PrismaClient({ adapter });

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

// Window exam: 01:00 – 06:00 UTC (08:00 – 13:00 WIB, 12 Sep 2026)
// Sesi 1: 01:00 – 03:30 UTC (2.5 jam pertama)
// Sesi 2: 03:30 – 06:00 UTC (2.5 jam kedua)
const SESSION_WINDOWS = [
  {
    name: "sesi 1",
    startTime: new Date("2026-09-12T01:00:00.000Z"),
    endTime: new Date("2026-09-12T03:30:00.000Z"),
  },
  {
    name: "sesi 2",
    startTime: new Date("2026-09-12T03:30:00.000Z"),
    endTime: new Date("2026-09-12T06:00:00.000Z"),
  },
] as const;

export async function seedExamSessionsOlimpiade() {
  // 1. Cari exam
  const exam = await prisma.exam.findFirst({
    where: {
      type: "OLYMPIAD",
      stage: {
        name: "PENYISIHAN",
        competition: { name: "OLIMPIADE" },
      },
    },
  });

  if (!exam) {
    throw new Error(
      "Exam 'Penyisihan OLIMPIADE' (OLYMPIAD/PENYISIHAN/OLIMPIADE) tidak ditemukan. Jalankan seed exam terlebih dahulu.",
    );
  }

  console.log(`📌 Exam: "${exam.title}" (${exam.id})`);
  console.log(`   Window exam: ${exam.startDate.toISOString()} → ${exam.endDate.toISOString()}`);

  // 2. Hapus semua sesi existing untuk exam ini (cascade → assignments otomatis)
  const existingSessions = await prisma.examSession.findMany({
    where: { examId: exam.id },
    select: { id: true, name: true, _count: { select: { assignments: true } } },
  });

  if (existingSessions.length > 0) {
    console.log(`\n🗑️  Menghapus ${existingSessions.length} sesi existing:`);
    for (const s of existingSessions) {
      console.log(`   - "${s.name}" (${s._count.assignments} assignments)`);
    }
    await prisma.examSession.deleteMany({ where: { examId: exam.id } });
  } else {
    console.log(`\n🆕 Belum ada sesi existing, langsung buat baru.`);
  }

  // 3. Buat 2 sesi baru
  const createdSessions: { id: string; name: string }[] = [];
  for (const w of SESSION_WINDOWS) {
    const s = await prisma.examSession.create({
      data: {
        examId: exam.id,
        name: w.name,
        startTime: w.startTime,
        endTime: w.endTime,
      },
    });
    createdSessions.push({ id: s.id, name: s.name });
    console.log(`✅ Created session "${s.name}" (${w.startTime.toISOString()} → ${w.endTime.toISOString()})`);
  }

  // 4. Load semua tim OLIMPIADE untuk match
  const allTeams = await prisma.team.findMany({
    where: { competitionType: "OLIMPIADE" },
    select: { id: true, code: true, name: true, schoolName: true },
  });

  // Build lookups
  const exactLookup = new Map<string, typeof allTeams>();
  const nameLookup = new Map<string, typeof allTeams>();
  for (const t of allTeams) {
    const k1 = `${norm(t.name)}|${norm(t.schoolName)}`;
    if (!exactLookup.has(k1)) exactLookup.set(k1, []);
    exactLookup.get(k1)!.push(t);
    const k2 = norm(t.name);
    if (!nameLookup.has(k2)) nameLookup.set(k2, []);
    nameLookup.get(k2)!.push(t);
  }

  // 5. Match semua tim + assign ke sesi
  let assigned = 0;
  const failed: Array<{ no: number; name: string; school: string }> = [];

  for (const entry of SESSION_TEAMS_RAW) {
    const k1 = `${norm(entry.name)}|${norm(entry.school)}`;
    let candidates = exactLookup.get(k1);

    if (!candidates || candidates.length === 0) {
      const k2 = norm(entry.name);
      candidates = nameLookup.get(k2);
      if (candidates && candidates.length > 0) {
        const olm = candidates.find((c) => c.code.startsWith("olm-"));
        const chosen = olm ?? candidates[0];
        candidates = [chosen];
      }
    } else if (candidates.length > 1) {
      const olm = candidates.find((c) => c.code.startsWith("olm-"));
      const chosen = olm ?? candidates[0];
      candidates = [chosen];
    }

    if (!candidates || candidates.length === 0) {
      failed.push(entry);
      continue;
    }

    const team = candidates[0];
    const session = createdSessions.find((s) => s.name === `sesi ${entry.session}`);
    if (!session) {
      failed.push(entry);
      continue;
    }

    await prisma.examSessionTeam.upsert({
      where: { teamId_examId: { teamId: team.id, examId: exam.id } },
      update: { sessionId: session.id },
      create: { sessionId: session.id, teamId: team.id, examId: exam.id },
    });
    assigned++;
  }

  console.log(`\n📊 Hasil assignment:`);
  console.log(`   ✅ Assigned: ${assigned}/${SESSION_TEAMS_RAW.length}`);
  if (failed.length > 0) {
    console.log(`   ❌ Gagal match: ${failed.length}`);
    for (const f of failed) {
      console.log(`      #${f.no} | "${f.name}" @ "${f.school}"`);
    }
  }

  // Summary per sesi
  for (const s of createdSessions) {
    const count = await prisma.examSessionTeam.count({
      where: { sessionId: s.id },
    });
    console.log(`   - ${s.name}: ${count} tim`);
  }

  console.log(`\n✅ seedExamSessionsOlimpiade selesai.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedExamSessionsOlimpiade()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
