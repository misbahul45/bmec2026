import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString, connectionTimeoutMillis: 5_000 });
const prisma = new PrismaClient({ adapter });

const today = (() => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate());
  d.setUTCHours(0, 0, 0, 0);
  return d;
})();

const examStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 6, 0, 0));
const examEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 10, 0, 0));

const sesi1Start = examStart;
const sesi1End = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 8, 0, 0));
const sesi2Start = sesi1End;
const sesi2End = examEnd;

const exam2JamStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 11, 0, 0));
const exam2JamEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 17, 0, 0));

const sesi2Jam1Start = exam2JamStart;
const sesi2Jam1End = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 14, 0, 0));
const sesi2Jam2Start = sesi2Jam1End;
const sesi2Jam2End = exam2JamEnd;

const TEST_USERS = [
  { suffix: 1, school: "SMA TEST 1" },
  { suffix: 2, school: "SMA TEST 2" },
  { suffix: 3, school: "SMA TEST 3" },
  { suffix: 4, school: "SMA TEST 4" },
  { suffix: 5, school: "SMA TEST 5" },
];

const SESSION_ASSIGN = (suffix: number): 1 | 2 => (suffix <= 2 ? 1 : 2);

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

const TEST_2JAM_QUESTIONS = [
  {
    question: "[2J-1] Proses metabolisme yang menghasilkan ATP dengan menggunakan oksigen disebut?",
    optionA: "Anaerob",
    optionB: "Aerob",
    optionC: "Fermentasi",
    optionD: "Glikolisis",
    optionE: "Kemosintesis",
    correctAnswer: "B",
    difficulty: "EASY" as const,
  },
  {
    question: "[2J-2] Bagian sel yang berfungsi mengendalikan seluruh aktivitas sel adalah?",
    optionA: "Mitokondria",
    optionB: "Ribosom",
    optionC: "Nukleus",
    optionD: "Lisosom",
    optionE: "Sitoplasma",
    correctAnswer: "C",
    difficulty: "EASY" as const,
  },
  {
    question: "[2J-3] Jaringan pada tumbuhan yang berfungsi mengangkut hasil fotosintesis adalah?",
    optionA: "Xilem",
    optionB: "Floem",
    optionC: "Epidermis",
    optionD: "Parenkim",
    optionE: "Kolenkim",
    correctAnswer: "B",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "[2J-4] Hewan yang termasuk kelompok vertebrata adalah?",
    optionA: "Cacing tanah",
    optionB: "Udang",
    optionC: "Kupu-kupu",
    optionD: "Ikan",
    optionE: "Laba-laba",
    correctAnswer: "D",
    difficulty: "EASY" as const,
  },
  {
    question: "[2J-5] Organ tubuh manusia yang berfungsi memompa darah adalah?",
    optionA: "Paru-paru",
    optionB: "Hati",
    optionC: "Jantung",
    optionD: "Ginjal",
    optionE: "Lambung",
    correctAnswer: "C",
    difficulty: "EASY" as const,
  },
];

const SHARED_PASSWORD = "test-12345";
const TEST_EXAM_TITLE = "TEST ADMIN OLIMPIADE";
const TEST_2JAM_EXAM_TITLE = "TEST 2 JAM OLIMPIADE";
const OLD_TRYOUT_TITLE = "TRYOUT TEST ADMIN OLIMPIADE";

export async function seedOlimpiadeTestFixtures() {
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

  const batch = await prisma.batch.findFirst({
    where: { competitionId: stage.competitionId },
    orderBy: { startDate: "asc" },
  });
  if (!batch) {
    throw new Error("Batch OLIMPIADE tidak ditemukan. Jalankan seedCompetition dulu.");
  }

  const legacy = await prisma.exam.findUnique({
    where: { title_stageId: { title: OLD_TRYOUT_TITLE, stageId: stage.id } },
  });
  if (legacy) {
    await prisma.examSessionTeam.deleteMany({ where: { examId: legacy.id } });
    await prisma.examSession.deleteMany({ where: { examId: legacy.id } });
    await prisma.examQuestion.deleteMany({ where: { examId: legacy.id } });
    await prisma.exam.delete({ where: { id: legacy.id } });
    console.log(`🗑️  Deleted legacy TRYOUT exam: "${OLD_TRYOUT_TITLE}"`);
  }

  const exam = await prisma.exam.upsert({
    where: {
      title_stageId: {
        title: TEST_EXAM_TITLE,
        stageId: stage.id,
      },
    },
    update: {
      type: "OLYMPIAD",
      startDate: examStart,
      endDate: examEnd,
      duration: 10,
    },
    create: {
      title: TEST_EXAM_TITLE,
      type: "OLYMPIAD",
      stageId: stage.id,
      startDate: examStart,
      endDate: examEnd,
      duration: 10,
    },
  });
  console.log(`📝 Exam: "${exam.title}" (${exam.id})`);
  console.log(`   Type: ${exam.type}`);
  console.log(`   Window: ${examStart.toISOString()} → ${examEnd.toISOString()} (hari ini 13:00–17:00 WIB)`);
  console.log(`   Duration: 10 menit`);

  await prisma.examQuestion.deleteMany({
    where: {
      examId: exam.id,
      id: { startsWith: "test-q-" },
    },
  });

  for (let i = 0; i < TEST_QUESTIONS.length; i++) {
    const q = TEST_QUESTIONS[i];
    const questionData = {
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      optionE: q.optionE,
      correctAnswer: q.correctAnswer,
      order: i + 1,
      difficulty: q.difficulty,
    };
    const existing = await prisma.examQuestion.findFirst({
      where: { examId: exam.id, order: i + 1 },
      select: { id: true },
    });
    if (existing) {
      await prisma.examQuestion.update({
        where: { id: existing.id },
        data: questionData,
      });
    } else {
      await prisma.examQuestion.create({
        data: {
          examId: exam.id,
          ...questionData,
          correctScore: 4,
          wrongScore: -1,
          emptyScore: 0,
        },
      });
    }
  }
  console.log(`   ✅ ${TEST_QUESTIONS.length} soal masuk`);

  await prisma.examSessionTeam.deleteMany({ where: { examId: exam.id } });
  await prisma.examSession.deleteMany({ where: { examId: exam.id } });

  const sesi1 = await prisma.examSession.create({
    data: { examId: exam.id, name: "sesi 1", startTime: sesi1Start, endTime: sesi1End },
  });
  console.log(`   ✅ Sesi 1: ${sesi1Start.toISOString()} → ${sesi1End.toISOString()} (hari ini 13:00–15:00 WIB)`);

  const sesi2 = await prisma.examSession.create({
    data: { examId: exam.id, name: "sesi 2", startTime: sesi2Start, endTime: sesi2End },
  });
  console.log(`   ✅ Sesi 2: ${sesi2Start.toISOString()} → ${sesi2End.toISOString()} (hari ini 15:00–17:00 WIB)`);

  const hashedPassword = await bcrypt.hash(SHARED_PASSWORD, 10);

  for (const u of TEST_USERS) {
    const email = `test${u.suffix}@gmail.com`;
    const teamName = `Tim Test ${u.suffix}`;
    const code = `OLM-TESTADMIN-${String(u.suffix).padStart(2, "0")}`;
    const sesiNum = SESSION_ASSIGN(u.suffix);
    const sessionId = sesiNum === 1 ? sesi1.id : sesi2.id;

    const team = await prisma.team.upsert({
      where: { email },
      update: {
        name: teamName,
        schoolName: u.school,
        schoolAddress: "Alamat test (seed fixture)",
        phone: `0812-0000-00${String(u.suffix).repeat(3)}`,
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

    await prisma.examSessionTeam.deleteMany({
      where: {
        teamId: team.id,
        NOT: { examId: exam.id },
      },
    });

    await prisma.mentor.upsert({
      where: { teamId: team.id },
      update: {
        name: `Mentor Test ${u.suffix}`,
        email: `mentor.test${u.suffix}@gmail.com`,
        phone: `0813-0000-00${String(u.suffix).repeat(3)}`,
      },
      create: {
        name: `Mentor Test ${u.suffix}`,
        email: `mentor.test${u.suffix}@gmail.com`,
        phone: `0813-0000-00${String(u.suffix).repeat(3)}`,
        teamId: team.id,
      },
    });

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

    await prisma.examSessionTeam.upsert({
      where: {
        teamId_examId: {
          teamId: team.id,
          examId: exam.id,
        },
      },
      update: { sessionId },
      create: {
        sessionId,
        teamId: team.id,
        examId: exam.id,
      },
    });

    console.log(`   ✅ ${email} | code=${team.code} | sesi ${sesiNum} | APPROVED`);
  }

  const extraTeamEmail = "test1@bmec.test";
  const extraTeam = await prisma.team.findUnique({ where: { email: extraTeamEmail } });
  if (extraTeam) {
    await prisma.examSessionTeam.deleteMany({
      where: { teamId: extraTeam.id, NOT: { examId: exam.id } },
    });
    await prisma.registration.upsert({
      where: { teamId: extraTeam.id },
      update: {
        status: "APPROVED",
        batchId: batch.id,
        competitionId: stage.competitionId,
      },
      create: {
        teamId: extraTeam.id,
        batchId: batch.id,
        competitionId: stage.competitionId,
        paymentProof: "https://test.local/payment-proof",
        status: "APPROVED",
      },
    });
    await prisma.examSessionTeam.upsert({
      where: { teamId_examId: { teamId: extraTeam.id, examId: exam.id } },
      update: { sessionId: sesi2.id },
      create: { sessionId: sesi2.id, teamId: extraTeam.id, examId: exam.id },
    });
    console.log(`   ✅ ${extraTeamEmail} | code=${extraTeam.code} | sesi 2 | APPROVED`);
  } else {
    console.log(`   ⚠️  ${extraTeamEmail} tidak ditemukan di DB, dilewati`);
  }

  const sesi1Count = await prisma.examSessionTeam.count({ where: { sessionId: sesi1.id } });
  const sesi2Count = await prisma.examSessionTeam.count({ where: { sessionId: sesi2.id } });
  console.log(`\n📊 Distribusi: sesi 1 = ${sesi1Count} tim, sesi 2 = ${sesi2Count} tim`);

  console.log(`\n🎯 Login info:`);
  console.log(`   Email:    test1@gmail.com … test5@gmail.com`);
  console.log(`   Password: ${SHARED_PASSWORD}`);
  console.log(`\n📋 Admin verification:`);
  console.log(`   1. Login admin → http://localhost:3000/admin/login`);
  console.log(`   2. Buka /admin/scoreboard → pilih "TEST ADMIN OLIMPIADE" → 6 tim test akan muncul`);
  console.log(`   3. Buka /admin/exams/<id>/sessions → 2 sesi (hari ini 13:00-15:00, 15:00-17:00) + 6 assignment`);
  console.log(`   4. Buka /admin/exams/<id>/reviews → list attempts`);
  console.log(`\n✅ seedOlimpiadeTestFixtures selesai.`);
}

export async function seedOlimpiadeTest2JamFixtures() {
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

  const batch = await prisma.batch.findFirst({
    where: { competitionId: stage.competitionId },
    orderBy: { startDate: "asc" },
  });
  if (!batch) {
    throw new Error("Batch OLIMPIADE tidak ditemukan. Jalankan seedCompetition dulu.");
  }

  const exam = await prisma.exam.upsert({
    where: {
      title_stageId: {
        title: TEST_2JAM_EXAM_TITLE,
        stageId: stage.id,
      },
    },
    update: {
      type: "OLYMPIAD",
      startDate: exam2JamStart,
      endDate: exam2JamEnd,
      duration: 120,
    },
    create: {
      title: TEST_2JAM_EXAM_TITLE,
      type: "OLYMPIAD",
      stageId: stage.id,
      startDate: exam2JamStart,
      endDate: exam2JamEnd,
      duration: 120,
    },
  });
  console.log(`📝 Exam: "${exam.title}" (${exam.id})`);
  console.log(`   Type: ${exam.type}`);
  console.log(`   Window: ${exam2JamStart.toISOString()} → ${exam2JamEnd.toISOString()} (hari ini 18:00–24:00 WIB)`);
  console.log(`   Duration: 120 menit (2 jam)`);

  await prisma.examQuestion.deleteMany({
    where: {
      examId: exam.id,
      id: { startsWith: "test2j-q-" },
    },
  });

  for (let i = 0; i < TEST_2JAM_QUESTIONS.length; i++) {
    const q = TEST_2JAM_QUESTIONS[i];
    const questionData = {
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      optionE: q.optionE,
      correctAnswer: q.correctAnswer,
      order: i + 1,
      difficulty: q.difficulty,
    };
    const existing = await prisma.examQuestion.findFirst({
      where: { examId: exam.id, order: i + 1 },
      select: { id: true },
    });
    if (existing) {
      await prisma.examQuestion.update({
        where: { id: existing.id },
        data: questionData,
      });
    } else {
      await prisma.examQuestion.create({
        data: {
          examId: exam.id,
          ...questionData,
          correctScore: 4,
          wrongScore: -1,
          emptyScore: 0,
        },
      });
    }
  }
  console.log(`   ✅ ${TEST_2JAM_QUESTIONS.length} soal masuk`);

  await prisma.examSessionTeam.deleteMany({ where: { examId: exam.id } });
  await prisma.examSession.deleteMany({ where: { examId: exam.id } });

  const sesi1 = await prisma.examSession.create({
    data: {
      examId: exam.id,
      name: "sesi 1",
      startTime: sesi2Jam1Start,
      endTime: sesi2Jam2End,
    },
  });
  console.log(`   ✅ Sesi 1: ${sesi2Jam1Start.toISOString()} → ${sesi2Jam2End.toISOString()} (hari ini 18:00–24:00 WIB)`);

  const hashedPassword = await bcrypt.hash(SHARED_PASSWORD, 10);

  for (const u of TEST_USERS) {
    const email = `test${u.suffix}@gmail.com`;
    const team = await prisma.team.findUnique({ where: { email } });
    if (!team) {
      console.log(`   ⚠️  ${email} tidak ditemukan, dilewati (jalankan seedOlimpiadeTestFixtures dulu)`);
      continue;
    }

    const teamUpdate = await prisma.team.update({
      where: { id: team.id },
      data: { password: hashedPassword },
    });

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

    console.log(`   ✅ ${email} | code=${teamUpdate.code} | sesi 1 | APPROVED`);
  }

  const extraTeamEmail = "test1@bmec.test";
  const extraTeam = await prisma.team.findUnique({ where: { email: extraTeamEmail } });
  if (extraTeam) {
    await prisma.examSessionTeam.upsert({
      where: { teamId_examId: { teamId: extraTeam.id, examId: exam.id } },
      update: { sessionId: sesi1.id },
      create: { sessionId: sesi1.id, teamId: extraTeam.id, examId: exam.id },
    });
    console.log(`   ✅ ${extraTeamEmail} | code=${extraTeam.code} | sesi 1 | APPROVED`);
  }

  const sesi1Count = await prisma.examSessionTeam.count({ where: { sessionId: sesi1.id } });
  console.log(`\n📊 Distribusi: sesi 1 = ${sesi1Count} tim`);

  console.log(`\n🎯 Login info (sama dengan exam test admin):`);
  console.log(`   Email:    test1@gmail.com … test5@gmail.com`);
  console.log(`   Password: ${SHARED_PASSWORD}`);
  console.log(`\n📋 Admin verification:`);
  console.log(`   1. Login admin → http://localhost:3000/admin/login`);
  console.log(`   2. Buka /admin/scoreboard → pilih "${TEST_2JAM_EXAM_TITLE}" → tim test akan muncul`);
  console.log(`   3. Buka /admin/exams/<id>/sessions → 1 sesi (hari ini 18:00–24:00) + assignments`);
  console.log(`   4. Buka /admin/exams/<id>/reviews → list attempts`);
  console.log(`\n✅ seedOlimpiadeTest2JamFixtures selesai.`);
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
