import { prisma } from "~/lib/utils/prisma"

export async function seedStage() {
  const competitions =
    await prisma.competition.findMany()

  const stages = [
    "PENYISIHAN",
    "SEMIFINAL",
    "FINAL",
  ] as const

  for (const competition of competitions) {
    for (const stageName of stages) {
      await prisma.stage.upsert({
        where: {
          name_competitionId: {
            name: stageName,
            competitionId:
              competition.id,
          },
        },
        update: {},
        create: {
          name: stageName,
          competitionId:
            competition.id,
        },
      })
    }
  }

  console.log(
    "✅ Stage seeded successfully"
  )
}