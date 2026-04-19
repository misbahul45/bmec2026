import { prisma } from "~/lib/utils/prisma"

export async function seedSubmissionsWithoutScore() {
  console.log("🌱 Seeding Submissions (Non-Olimpiade Only)...")

  const teams = await prisma.team.findMany({
    where: {
      competitionType: {
        not: "OLIMPIADE", // 🔥 FILTER DI SINI
      },
    },
    include: {
      registration: true,
    },
  })

  const competitions = await prisma.competition.findMany({
    include: {
      stages: true,
    },
  })

  let created = 0

  for (const team of teams) {
    if (!team.registration) continue

    const competition = competitions.find(
      (c) => c.id === team.registration!.competitionId
    )

    if (!competition) continue

    for (const stage of competition.stages) {
      try {
        await prisma.submission.create({
          data: {
            teamId: team.id,
            stageId: stage.id,
            title: `Submission ${team.name} - ${stage.name}`,
            fileUrl: `https://example.com/${team.id}/${stage.name}.pdf`,
            status: "PENDING",
          },
        })

        created++
        console.log(`📄 ${team.name} → ${stage.name}`)
      } catch {
        continue
      }
    }
  }

  console.log(`✅ ${created} Submissions Created`)
}