import { prisma } from "~/lib/utils/prisma";

export async function seedCompetitionOrsinil() {
  const competitionConfig = {
    OLIMPIADE: [90000, 120000, 150000],
    INFOGRAFIS: [60000, 75000, 90000],
    LKTI: [125000, 150000],
  } as const;


  const olimpiadeModules = [
    "https://drive.google.com/drive/folders/1xeZjjKWAJrmDzA7b4J5nirM2agHWcYAu",
    "https://drive.google.com/drive/folders/1AOkcD3gp3DNkf-6bN5SfziqQmvmmQ2XK",
    "https://drive.google.com/drive/folders/1_TgPcaJ-vps_6iU-Uz472ttE5SBaiUQx",
  ] as const

  const competitions = [
    {
      name: "OLIMPIADE",
      batches: [
        {
          name: "Batch 1",
          startDate: new Date("2026-05-25"),
          endDate: new Date("2026-06-24"),
          price: competitionConfig.OLIMPIADE[0],
          module_bacth: olimpiadeModules[0],
        },
        {
          name: "Batch 2",
          startDate: new Date("2026-07-01"),
          endDate: new Date("2026-07-31"),
          price: competitionConfig.OLIMPIADE[1],
          module_bacth: olimpiadeModules[1],
        },
        {
          name: "Batch 3",
          startDate: new Date("2026-08-03"),
          endDate: new Date("2026-09-04"),
          price: competitionConfig.OLIMPIADE[2],
          module_bacth: olimpiadeModules[2],
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
          price: competitionConfig.LKTI[0],
          module_bacth: "",
        },
        {
          name: "Batch 2 (Full Paper)",
          startDate: new Date("2026-08-03"),
          endDate: new Date("2026-09-04"),
          price: competitionConfig.LKTI[1],
          module_bacth: "",
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
          price: competitionConfig.INFOGRAFIS[0],
          module_bacth: "",
        },
        {
          name: "Batch 2",
          startDate: new Date("2026-07-01"),
          endDate: new Date("2026-07-31"),
          price: competitionConfig.INFOGRAFIS[1],
          module_bacth: "",
        },
        {
          name: "Batch 3",
          startDate: new Date("2026-08-03"),
          endDate: new Date("2026-09-04"),
          price: competitionConfig.INFOGRAFIS[2],
          module_bacth: "",
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
        update: {
          startDate: batch.startDate,
          endDate: batch.endDate,
          price: batch.price,
          module_bacth: batch.module_bacth,
        },
        create: {
          name: batch.name,
          startDate: batch.startDate,
          endDate: batch.endDate,
          price: batch.price,
          module_bacth: batch.module_bacth,
          competitionId: competition.id,
        },
      });
    }
  }

  console.log("✅ Competition + Batch seeded with real timeline");
}