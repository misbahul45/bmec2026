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

  // Helper tambah hari
  const addDays = (date: Date, days: number) => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + days)
    return newDate
  }

  for (const stage of stages) {
    const exams = [
      {
        title: `Tryout 1 ${stage.competition.name}`,
        type: ExamType.TRYOUT,
        startDate: addDays(today, 0),
        endDate: addDays(today, 1),
        duration: 120,
      },
      {
        title: `Tryout 2 ${stage.competition.name}`,
        type: ExamType.TRYOUT,
        startDate: addDays(today, 0),
        endDate: addDays(today, 1),
        duration: 120,
      },
      {
        title: `Penyisihan ${stage.competition.name}`,
        type: ExamType.OLYMPIAD,
        startDate: addDays(today, 0),
        endDate: addDays(today, 1),
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
          duration: exam.duration,
          startDate: exam.startDate,
          endDate: exam.endDate,
        },
        create: {
          ...exam,
          stageId: stage.id,
        },
      })

      console.log(`✅ ${exam.title} seeded`)
    }
  }

  console.log("✅ Exam OLIMPIADE seeded selesai")
}