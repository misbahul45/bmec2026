import { prisma } from "~/lib/utils/prisma"
import { StageType, ExamType } from "@prisma/client"

export async function seedExamOrsinil() {
  const competition = await prisma.competition.findUnique({
    where: {
      name: "OLIMPIADE",
    },
  })

  if (!competition) {
    console.log("❌ Competition OLIMPIADE tidak ditemukan")
    return
  }

  const stage = await prisma.stage.findFirst({
    where: {
      name: StageType.PENYISIHAN,
      competitionId: competition.id,
    },
    include: {
      competition: true,
    },
  })

  if (!stage) {
    console.log("❌ Stage PENYISIHAN untuk OLIMPIADE tidak ditemukan")
    return
  }

  const exams = [
    {
      title: `Tryout 1 ${stage.competition.name}`,
      type: ExamType.TRYOUT,
      startDate: new Date(2026, 7, 1, 7, 0, 0),
      endDate: new Date(2026, 7, 1, 19, 0, 0),
      duration: 120,
    },
    {
      title: `Tryout 2 ${stage.competition.name}`,
      type: ExamType.TRYOUT,
      startDate: new Date(2026, 8, 6, 7, 0, 0),
      endDate: new Date(2026, 8, 6, 19, 0, 0),
      duration: 120,
    },
    {
      title: `Penyisihan ${stage.competition.name}`,
      type: ExamType.OLYMPIAD,
      startDate: new Date(2026, 8, 12, 8, 0, 0),
      endDate: new Date(2026, 8, 12, 13, 0, 0),
      duration: 120,
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
        type: exam.type,
        startDate: exam.startDate,
        endDate: exam.endDate,
        duration: exam.duration,
      },
      create: {
        ...exam,
        stageId: stage.id,
      },
    })
  }

  console.log("✅ Exam OLIMPIADE seeded")
}