import { prisma } from "~/lib/utils/prisma"
import { StageType, ExamType } from "@prisma/client"

export async function seedExam() {
  const stages = await prisma.stage.findMany({
    where: {
      name: StageType.PENYISIHAN,
      competition: {
        name: "OLIMPIADE",
      },
    },
    include: {
      competition: true,
    },
  })

  if (!stages.length) {
    console.log("❌ Stage PENYISIHAN OLIMPIADE tidak ditemukan")
    return
  }

  const today = new Date()

  for (const stage of stages) {
    const exams = [
      {
        title: `Tryout 1 ${stage.competition.name}`,
        type: ExamType.TRYOUT,
        startDate: today,
        endDate: today,
        duration: 60,
      },
      {
        title: `Tryout 2 ${stage.competition.name}`,
        type: ExamType.TRYOUT,
        startDate: today,
        endDate: today,
        duration: 60,
      },
      {
        title: `Penyisihan ${stage.competition.name}`,
        type: ExamType.OLYMPIAD,
        startDate: today,
        endDate: today,
        duration: 90,
      },
    ]

    for (const exam of exams) {
      await prisma.exam.upsert({
        where: {
          title_stageId: {
            title: exam.title,
            stageId: stage.id,
          },
        },
        update: {
          duration: exam.duration,
          startDate: exam.startDate,
          endDate: exam.endDate,
        },
        create: {
          ...exam,
          stageId: stage.id,
        },
      })
    }
  }

  console.log("✅ Exam OLIMPIADE seeded")
}