import { prisma } from "~/lib/utils/prisma";

async function main() {
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

    const batches = Array.from({ length: 3 }).map((_, i) => {
      const startDate = new Date(baseStartDate);
      startDate.setDate(baseStartDate.getDate() + i * 10);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 5);

      return {
        name: `Batch ${i + 1}`,
        startDate,
        endDate,
        price: 100000 + i * 25000,
        module_bacth: `module-${compName.toLowerCase()}-${i + 1}`,
        competitionId: competition.id,
      };
    });

    for (const batch of batches) {
      await prisma.batch.create({
        data: batch,
      });
    }
  }

  console.log("Seed completed 🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });