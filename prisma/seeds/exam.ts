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

  const addDays = (date: Date, days: number) => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + days)
    return newDate
  }

  const baseDate = new Date()

  for (const stage of stages) {
    const tryout1Start = baseDate
    const tryout1End = addDays(tryout1Start, 7)

    const tryout2Start = addDays(tryout1End, 1)
    const tryout2End = addDays(tryout2Start, 7)

    const penyisihanStart = addDays(tryout2End, 1)
    const penyisihanEnd = addDays(penyisihanStart, 7)

    const exams = [
      {
        title: `Tryout 1 ${stage.competition.name}`,
        type: ExamType.TRYOUT,
        startDate: tryout1Start,
        endDate: tryout1End,
        duration: 60,
      },
      {
        title: `Tryout 2 ${stage.competition.name}`,
        type: ExamType.TRYOUT,
        startDate: tryout2Start,
        endDate: tryout2End,
        duration: 60,
      },
      {
        title: `Penyisihan ${stage.competition.name}`,
        type: ExamType.OLYMPIAD,
        startDate: penyisihanStart,
        endDate: penyisihanEnd,
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