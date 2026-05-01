import { prisma } from "~/lib/utils/prisma";

export async function seedCompetition() {
  const competitions = [
    {
      name: "OLIMPIADE",
      batches: [
        {
          name: "Batch 1",
          startDate: new Date("2026-05-25"),
          endDate: new Date("2026-06-24"),
          price: 100000,
        },
        {
          name: "Batch 2",
          startDate: new Date("2026-07-01"),
          endDate: new Date("2026-07-31"),
          price: 125000,
        },
        {
          name: "Batch 3",
          startDate: new Date("2026-08-03"),
          endDate: new Date("2026-09-04"),
          price: 150000,
        },
      ],
    },
    {
      name: "LKTI",
      batches: [
        {
          name: "Batch 1 (Full Paper)",
          startDate: new Date("2026-07-16"),
          endDate: new Date("2026-07-31"),
          price: 100000,
        },
        {
          name: "Batch 2 (Full Paper)",
          startDate: new Date("2026-08-03"),
          endDate: new Date("2026-09-04"),
          price: 125000,
        },
      ],
    },
    {
      name: "INFOGRAFIS",
      batches: [
        {
          name: "Batch 1",
          startDate: new Date("2026-05-25"),
          endDate: new Date("2026-06-24"),
          price: 100000,
        },
        {
          name: "Batch 2",
          startDate: new Date("2026-07-01"),
          endDate: new Date("2026-07-31"),
          price: 125000,
        },
        {
          name: "Batch 3",
          startDate: new Date("2026-08-03"),
          endDate: new Date("2026-09-04"),
          price: 150000,
        },
      ],
    },
  ];

  for (const comp of competitions) {
    const competition = await prisma.competition.upsert({
      where: { name: comp.name },
      update: {},
      create: { name: comp.name },
    });

    for (const batch of comp.batches) {
      await prisma.batch.upsert({
        where: {
          name_competitionId: {
            name: batch.name,
            competitionId: competition.id,
          },
        },
        update: {},
        create: {
          name: batch.name,
          startDate: batch.startDate,
          endDate: batch.endDate,
          price: batch.price,
          module_bacth: `module-${comp.name.toLowerCase()}-${batch.name
            .toLowerCase()
            .replace(/\s/g, "-")}`,
          competitionId: competition.id,
        },
      });
    }
  }

  console.log("✅ Competition + Batch seeded with real timeline");
}