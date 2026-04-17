import { prisma } from "~/lib/utils/prisma"

export async function seedExamQuestions() {
  const exams = await prisma.exam.findMany()

  if (!exams.length) {
    console.log("❌ Tidak ada exam")
    return
  }

  for (const exam of exams) {
    const questions = Array.from({ length: 10 }).map((_, i) => ({
      question: `Soal ${i + 1} untuk ${exam.title}`,
      optionA: "Pilihan A",
      optionB: "Pilihan B",
      optionC: "Pilihan C",
      optionD: "Pilihan D",
      optionE: "Pilihan E",
      correctAnswer: ["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)],
      score: 5,
      examId: exam.id,
    }))

    await prisma.examQuestion.createMany({
      data: questions,
      skipDuplicates: true,
    })
  }

  console.log("✅ Exam Questions seeded (10 per exam)")
}