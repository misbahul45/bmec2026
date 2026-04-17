import { prisma } from "~/lib/utils/prisma"
import { StageType } from "@prisma/client"

export async function seedExam() {
  const stage = await prisma.stage.findFirst({
    where: {
      name: StageType.PENYISIHAN,
    },
  })

  if (!stage) {
    console.log("❌ Stage PENYISIHAN tidak ditemukan")
    return
  }

  await prisma.exam.createMany({
    data: [
      {
        title: "Tryout 1",
        type: "TRYOUT",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-08-05"),
        stageId: stage.id,
      },
      {
        title: "Tryout 2",
        type: "TRYOUT",
        startDate: new Date("2025-08-10"),
        endDate: new Date("2025-08-15"),
        stageId: stage.id,
      },
      {
        title: "Olympiad",
        type: "OLYMPIAD",
        startDate: new Date("2025-08-20"),
        endDate: new Date("2025-08-25"),
        stageId: stage.id,
      },
    ],
  })

  console.log("✅ Exam seeded")
}