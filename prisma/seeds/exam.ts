import { prisma } from "~/lib/utils/prisma"
import { StageType, ExamType, CompetitionType } from "@prisma/client"

export async function seedExam() {
  console.log("🌱 Seeding Exam (OLIMPIADE only)...")

  // 🔥 ambil competition yang dipakai team OLIMPIADE
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

  // 🔥 ambil stage PENYISIHAN dari competition tersebut
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
    await prisma.exam.createMany({
      data: [
        {
          title: `Tryout 1 ${stage.competition.name}`,
          type: ExamType.TRYOUT,
          startDate: new Date("2026-08-01"),
          endDate: new Date("2026-08-05"),
          stageId: stage.id,
        },
        {
          title: `Tryout 2 ${stage.competition.name}`,
          type: ExamType.TRYOUT,
          startDate: new Date("2026-08-10"),
          endDate: new Date("2026-08-15"),
          stageId: stage.id,
        },
        {
          title: `Olympiad ${stage.competition.name}`,
          type: ExamType.OLYMPIAD,
          startDate: new Date("2026-08-20"),
          endDate: new Date("2026-08-25"),
          stageId: stage.id,
        },
      ],
      skipDuplicates: true,
    })
  }

  console.log("✅ Exam OLIMPIADE seeded")
}