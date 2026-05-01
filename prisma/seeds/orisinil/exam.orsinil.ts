import { prisma } from "~/lib/utils/prisma"
import { StageType, ExamType, CompetitionType } from "@prisma/client"

export async function seedExam() {
  const olimpTeams = await prisma.team.findMany({
    where: {
      competitionType: CompetitionType.OLIMPIADE,
    },
    include: {
      registration: true,
    },
  })

  const competitionIds = [
    ...new Set(
      olimpTeams
        .map((t) => t.registration?.competitionId)
        .filter(Boolean)
    ),
  ] as string[]

  if (!competitionIds.length) {
    console.log("❌ Tidak ada competition untuk OLIMPIADE")
    return
  }

  const stages = await prisma.stage.findMany({
    where: {
      name: StageType.PENYISIHAN,
      competitionId: { in: competitionIds },
    },
    include: {
      competition: true,
    },
  })

  if (!stages.length) {
    console.log("❌ Stage PENYISIHAN tidak ditemukan")
    return
  }

  for (const stage of stages) {
    const exams = [
      {
        title: `Tryout 1 ${stage.competition.name}`,
        type: ExamType.TRYOUT,
        startDate: new Date("2026-08-01"),
        endDate: new Date("2026-08-01"),
      },
      {
        title: `Tryout 2 ${stage.competition.name}`,
        type: ExamType.TRYOUT,
        startDate: new Date("2026-09-06"),
        endDate: new Date("2026-09-06"),
      },
      {
        title: `Penyisihan ${stage.competition.name}`,
        type: ExamType.OLYMPIAD,
        startDate: new Date("2026-09-12"),
        endDate: new Date("2026-09-12"),
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
        update: {},
        create: {
          ...exam,
          stageId: stage.id,
        },
      })
    }
  }

  console.log("✅ Exam OLIMPIADE seeded (timeline sesuai)")
}