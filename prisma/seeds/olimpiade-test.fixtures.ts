/**
 * Seed: Test fixtures untuk admin & user testing OLIMPIADE.
 *
 * Isi:
 *   - 5 tim OLIMPIADE (test1-5@gmail.com), pw = test-12345 (bcrypt-hashed)
 *   - Setiap tim punya 1 ketua + 1 mentor
 *   - Registration status = APPROVED (langsung terverifikasi)
 *   - Assign ke sesi 1 olimpiade (id dari seed-exam-sessions.olimpiade)
 *   - 1 Exam TRYOUT "TRYOUT TEST ADMIN OLIMPIADE"
 *       - Window: besok (11 Sep 2026) 09:00 – 13:00 WIB (02:00 – 06:00 UTC)
 *       - Duration: 10 menit
 *       - Stage: PENYISIHAN OLIMPIADE (supaya muncul di dashboard olimpiade)
 *   - 2 ExamQuestion (A–E, benar = A, easy)
 *
 * Catatan:
 *   - Pakai type TRYOUT agar tidak ganggu OLYMPIAD sungguhan (12 Sep 2026)
 *   - Idempotent: re-run aman, tim/exam/soal di-upsert, registration di-upsert
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString, connectionTimeoutMillis: 5_000 });
const prisma = new PrismaClient({ adapter });

// Besok = tambah 1 hari dari "hari ini" runtime
const tomorrow = (() => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
})();
const examStart = new Date(Date.UTC(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate(), 2, 0, 0)); // 09:00 WIB
const examEnd = new Date(Date.UTC(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate(), 6, 0, 0)); // 13:00 WIB

const TEST_USERS = [
  { suffix: 1, school: "SMA TEST 1" },
  { suffix: 2, school: "SMA TEST 2" },
  { suffix: 3, school: "SMA TEST 3" },
  { suffix: 4, school: "SMA TEST 4" },
  { suffix: 5, school: "SMA TEST 5" },
];

const TEST_QUESTIONS = [
  {
    question: "[Test 1] Organel sel yang berfungsi sebagai pusat energi (ATP) adalah?",
    optionA: "Mitokondria",
    optionB: "Ribosom",
    optionC: "Lisosom",
    optionD: "Badan Golgi",
    optionE: "Retikulum Endoplasma",
    correctAnswer: "A",
    difficulty: "EASY" as const,
  },
  {
    question: "[Test 2] Proses pengangkutan air dari akar ke daun pada tumbuhan terjadi melalui jaringan?",
    optionA: "Floem",
    optionB: "Xilem",
    optionC: "Epidermis",
    optionD: "Parenkim",
    optionE: "Kolenkim",
    correctAnswer: "B",
    difficulty: "EASY" as const,
  },
];

const SHARED_PASSWORD = "test-12345";
const TEST_EXAM_TITLE = "TRYOUT TEST ADMIN OLIMPIADE";

export async function seedOlimpiadeTestFixtures() {
  // 1. Cari Stage PENYISIHAN OLIMPIADE
  const stage = await prisma.stage.findFirst({
    where: {
      name: "PENYISIHAN",
      competition: { name: "OLIMPIADE" },
    },
    include: { competition: true },
  });
  if (!stage) {
    throw new Error("Stage PENYISIHAN OLIMPIADE tidak ditemukan. Jalankan seedStage dulu.");
  }

  // 2. Cari batch OLIMPIADE yang paling awal untuk dipakai registration
  const batch = await prisma.batch.findFirst({
    where: { competitionId: stage.competitionId },
    orderBy: { startDate: "asc" },
  });
  if (!batch) {
    throw new Error("Batch OLIMPIADE tidak ditemukan. Jalankan seedCompetition dulu.");
  }

  // 3. Cari sesi 1 OLIMPIADE (idempotent: harus sudah ada dari seed sebelumnya)
  const sesi1 = await prisma.examSession.findFirst({
    where: { exam: { stageId: stage.id }, name: "sesi 1" },
  });
  if (!sesi1) {
    throw new Error('Sesi "sesi 1" olimpiade tidak ditemukan. Jalankan seedExamSessionsOlimpiade dulu.');
  }

  // 4. Buat TRYOUT exam (idempotent via title_stageId)
  const exam = await prisma.exam.upsert({
    where: {
      title_stageId: {
        title: TEST_EXAM_TITLE,
        stageId: stage.id,
      },
    },
    update: {
      type: "TRYOUT",
      startDate: examStart,
      endDate: examEnd,
      duration: 10,
    },
    create: {
      title: TEST_EXAM_TITLE,
      type: "TRYOUT",
      stageId: stage.id,
      startDate: examStart,
      endDate: examEnd,
      duration: 10,
    },
  });
  console.log(`📝 Exam: "${exam.title}" (${exam.id})`);
  console.log(`   Window: ${examStart.toISOString()} → ${examEnd.toISOString()}`);
  console.log(`   Duration: 10 menit`);

  // 5. Buat 2 ExamQuestion (idempotent via examId+order)
  for (let i = 0; i < TEST_QUESTIONS.length; i++) {
    const q = TEST_QUESTIONS[i];
    await prisma.examQuestion.upsert({
      where: { id: `test-q-${exam.id}-${i + 1}` },
      update: {
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        optionE: q.optionE,
        correctAnswer: q.correctAnswer,
        order: i + 1,
        difficulty: q.difficulty,
      },
      create: {
        id: `test-q-${exam.id}-${i + 1}`,
        examId: exam.id,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        optionE: q.optionE,
        correctAnswer: q.correctAnswer,
        correctScore: 4,
        wrongScore: -1,
        emptyScore: 0,
        order: i + 1,
        difficulty: q.difficulty,
      },
    });
  }
  console.log(`   ✅ ${TEST_QUESTIONS.length} soal masuk`);

  // 6. Buat 5 user test (tim + mentor + ketua + registration + session assignment)
  const hashedPassword = await bcrypt.hash(SHARED_PASSWORD, 10);

  for (const u of TEST_USERS) {
    const email = `test${u.suffix}@gmail.com`;
    const teamName = `Tim Test ${u.suffix}`;
    const code = `OLM-TESTADMIN-${String(u.suffix).padStart(2, "0")}`;

    // Team (upsert by email)
    const team = await prisma.team.upsert({
      where: { email },
      update: {
        name: teamName,
        schoolName: u.school,
        schoolAddress: "Alamat test (seed fixture)",
        phone: `0812-0000-00${u.suffix}${u.suffix}${u.suffix}`,
        competitionType: "OLIMPIADE",
        sourceInfo: "Test Admin Seed",
      },
      create: {
        name: teamName,
        code,
        email,
        password: hashedPassword,
        phone: `0812-0000-00${String(u.suffix).repeat(3)}`,
        schoolName: u.school,
        schoolAddress: "Alamat test (seed fixture)",
        sourceInfo: "Test Admin Seed",
        competitionType: "OLIMPIADE",
      },
    });

    // Mentor
    await prisma.mentor.upsert({
      where: { teamId: team.id },
      update: {
        name: `Mentor Test ${u.suffix}`,
        email: `mentor.test${u.suffix}@gmail.com`,
        phone: `0813-0000-00${u.suffix}${u.suffix}${u.suffix}`,
      },
      create: {
        name: `Mentor Test ${u.suffix}`,
        email: `mentor.test${u.suffix}@gmail.com`,
        phone: `0813-0000-00${String(u.suffix).repeat(3)}`,
        teamId: team.id,
      },
    });

    // Ketua (member)
    await prisma.member.upsert({
      where: { email: `ketua.test${u.suffix}@gmail.com` },
      update: {
        name: `Ketua Test ${u.suffix}`,
        role: "KETUA",
        phone: `0814-0000-00${String(u.suffix).repeat(3)}`,
        teamId: team.id,
      },
      create: {
        name: `Ketua Test ${u.suffix}`,
        role: "KETUA",
        email: `ketua.test${u.suffix}@gmail.com`,
        phone: `0814-0000-00${String(u.suffix).repeat(3)}`,
        teamId: team.id,
      },
    });

    // Registration APPROVED
    await prisma.registration.upsert({
      where: { teamId: team.id },
      update: {
        status: "APPROVED",
        batchId: batch.id,
        competitionId: stage.competitionId,
      },
      create: {
        teamId: team.id,
        batchId: batch.id,
        competitionId: stage.competitionId,
        paymentProof: "https://test.local/payment-proof",
        status: "APPROVED",
      },
    });

    // Assign ke sesi 1 (upsert by teamId_examId)
    await prisma.examSessionTeam.upsert({
      where: {
        teamId_examId: {
          teamId: team.id,
          examId: exam.id,
        },
      },
      update: { sessionId: sesi1.id },
      create: {
        sessionId: sesi1.id,
        teamId: team.id,
        examId: exam.id,
      },
    });

    console.log(`   ✅ ${email} | code=${team.code} | sesi 1 | APPROVED`);
  }

  console.log(`\n🎯 Login info:`);
  console.log(`   Email:    test1@gmail.com … test5@gmail.com`);
  console.log(`   Password: ${SHARED_PASSWORD}`);
  console.log(`\n📋 Admin verification:`);
  console.log(`   1. Login admin → http://localhost:3000/admin/login`);
  console.log(`   2. Buka halaman Sesi/Exam → akan terlihat sesi 1 (175 tim) + 5 tim test baru`);
  console.log(`   3. Cek Scoreboard TRYOUT → tim test akan muncul setelah mulai ujian`);
  console.log(`\n✅ seedOlimpiadeTestFixtures selesai.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedOlimpiadeTestFixtures()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
