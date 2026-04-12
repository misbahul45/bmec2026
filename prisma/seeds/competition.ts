import { prisma } from "~/lib/utils/prisma";

export async function seedCompetition() {
  const competitions = ["OLIMPIADE", "LKTI", "INFOGRAFIS"] as const;

  const baseStartDate = new Date();

  for (const compName of competitions) {
    const competition = await prisma.competition.upsert({
      where: { name: compName },
      update: {},
      create: {
        name: compName,
      },
    });

    for (let i = 0; i < 3; i++) {
      const startDate = new Date(baseStartDate);
      startDate.setDate(baseStartDate.getDate() + i * 10);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 5);

      await prisma.batch.upsert({
        where: {
          name_competitionId: {
            name: `Batch ${i + 1}`,
            competitionId: competition.id,
          },
        },
        update: {},
        create: {
          name: `Batch ${i + 1}`,
          startDate,
          endDate,
          price: 100000 + i * 25000,
          module_bacth: `module-${compName.toLowerCase()}-${i + 1}`,
          competitionId: competition.id,
        },
      });
    }
  }

  console.log("✅ Competition + Batch seeded");
}