import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString, connectionTimeoutMillis: 5_000 });
const prisma = new PrismaClient({ adapter });

const TEST_EXAM_TITLES = ["TEST ADMIN OLIMPIADE", "TEST 2 JAM OLIMPIADE"];

async function cleanupTestExams() {
  const exams = await prisma.exam.findMany({
    where: { title: { in: TEST_EXAM_TITLES } },
    select: { id: true, title: true },
  });

  if (exams.length === 0) {
    console.log("ℹ️  Tidak ada test exam ditemukan di DB.");
    return [];
  }

  const examIds = exams.map((e) => e.id);
  console.log(`🎯 Target cleanup: ${exams.length} exam`);
  for (const e of exams) console.log(`   - ${e.title} (${e.id})`);

  const attempts = await prisma.examAttempt.findMany({
    where: { examId: { in: examIds } },
    select: { id: true },
  });
  const attemptIds = attempts.map((a) => a.id);
  console.log(`   📦 ${attemptIds.length} attempt terkait`);

  const questions = await prisma.examQuestion.findMany({
    where: { examId: { in: examIds } },
    select: { id: true, order: true },
  });
  const questionIds = questions.map((q) => q.id);
  console.log(`   📦 ${questionIds.length} question terkait`);

  const deletedAnswers = await prisma.examAnswer.deleteMany({
    where: { attemptId: { in: attemptIds } },
  });
  console.log(`   🗑️  ExamAnswer dihapus: ${deletedAnswers.count}`);

  const deletedEvents = await prisma.examEventLog.deleteMany({
    where: { attemptId: { in: attemptIds } },
  });
  console.log(`   🗑️  ExamEventLog dihapus: ${deletedEvents.count}`);

  const deletedAttempts = await prisma.examAttempt.deleteMany({
    where: { id: { in: attemptIds } },
  });
  console.log(`   🗑️  ExamAttempt dihapus: ${deletedAttempts.count}`);

  const deletedSessionTeams = await prisma.examSessionTeam.deleteMany({
    where: { examId: { in: examIds } },
  });
  console.log(`   🗑️  ExamSessionTeam dihapus: ${deletedSessionTeams.count}`);

  const deletedSessions = await prisma.examSession.deleteMany({
    where: { examId: { in: examIds } },
  });
  console.log(`   🗑️  ExamSession dihapus: ${deletedSessions.count}`);

  const deletedQuestions = await prisma.examQuestion.deleteMany({
    where: { id: { in: questionIds } },
  });
  console.log(`   🗑️  ExamQuestion dihapus: ${deletedQuestions.count}`);

  const deletedExams = await prisma.exam.deleteMany({
    where: { id: { in: examIds } },
  });
  console.log(`   🗑️  Exam dihapus: ${deletedExams.count}`);

  return examIds;
}

async function main() {
  console.log("=".repeat(60));
  console.log("🧹 CLEANUP TEST EXAMS (only)");
  console.log("=".repeat(60));
  await cleanupTestExams();

  console.log("\n" + "=".repeat(60));
  console.log("🌱 RE-SEED TEST EXAMS");
  console.log("=".repeat(60));

  const { seedOlimpiadeTestFixtures, seedOlimpiadeTest2JamFixtures } = await import(
    "./seeds/olimpiade-test.fixtures"
  );
  await seedOlimpiadeTestFixtures();
  await seedOlimpiadeTest2JamFixtures();

  console.log("\n" + "=".repeat(60));
  console.log("🔍 VERIFIKASI: Cek ID soal sekarang harus UUID valid");
  console.log("=".repeat(60));
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const verify = await prisma.examQuestion.findMany({
    where: { exam: { title: { in: TEST_EXAM_TITLES } } },
    select: { id: true, order: true, exam: { select: { title: true } } },
    orderBy: [{ exam: { title: "asc" } }, { order: "asc" }],
  });
  let allValid = true;
  for (const q of verify) {
    const valid = UUID_RE.test(q.id);
    if (!valid) allValid = false;
    console.log(
      `   ${valid ? "✅" : "❌"} ${q.exam.title} | order=${q.order} | id=${q.id}`,
    );
  }
  console.log(allValid ? "\n🎉 Semua ID soal valid UUID!" : "\n❌ Masih ada ID non-UUID!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
