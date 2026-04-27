import { prisma } from "~/lib/utils/prisma"
import * as bcrypt from "bcrypt"

const schools = [
  "SMAN 1 Surabaya",
  "SMAN 2 Surabaya",
  "SMKN 1 Surabaya",
  "SMAN 5 Surabaya",
  "SMAN 1 Malang",
]

const addresses = [
  "Jl. Ahmad Yani",
  "Jl. Diponegoro",
  "Jl. Sudirman",
]

const competitionsType = [
  "OLIMPIADE",
  "LKTI",
  "INFOGRAFIS",
] as const

export async function seedTeams() {
  console.log("🌱 Seeding Teams + Registration...")

  const password = await bcrypt.hash("password123", 10)

  const competitions = await prisma.competition.findMany({
    include: { batches: true },
  })

  if (!competitions.length) {
    console.log("❌ No competitions found")
    return
  }

  for (let i = 1; i <= 5; i++) {
    const competition =
      competitions[Math.floor(Math.random() * competitions.length)]

    const batch =
      competition.batches[
        Math.floor(Math.random() * competition.batches.length)
      ]

    const competitionType =
      competitionsType[
        Math.floor(Math.random() * competitionsType.length)
      ]

    // 🔥 ambil stage pertama (order = 1)
    const firstStage = await prisma.stage.findFirst({
      where: {
        competitionId: competition.id,
        order: 1,
      },
    })

    if (!firstStage) {
      console.log(`❌ No stage order=1 for ${competition.name}`)
      continue
    }

    const team = await prisma.team.create({
      data: {
        name: `Team ${i}`,
        code: `TEAM-${i.toString().padStart(3, "0")}`,
        email: `team${i}@gmail.com`,
        password,
        phone: `08123${Math.floor(1000000 + Math.random() * 9000000)}`,

        schoolName:
          schools[Math.floor(Math.random() * schools.length)],
        schoolAddress:
          addresses[Math.floor(Math.random() * addresses.length)],

        competitionType,

        // 🔥 SET STAGE AWAL
        currentStageId: firstStage.id,

        registration: {
          create: {
            competitionId: competition.id,
            batchId: batch.id,
            status: "APPROVED",
          },
        },

        members: {
          create: [
            {
              name: `Ketua Team ${i}`,
              studentId: `KETUA-${i}`,
              role: "KETUA",
            },
            {
              name: `Anggota 1 Team ${i}`,
              studentId: `ANGGOTA1-${i}`,
              role: "ANGGOTA",
            },
            {
              name: `Anggota 2 Team ${i}`,
              studentId: `ANGGOTA2-${i}`,
              role: "ANGGOTA",
            },
          ],
        },
      },
    })

    console.log(
      `✅ ${team.name} → ${competition.name} | Stage: ${firstStage.name}`
    )
  }

  console.log("🚀 Teams + Registration Seeded")
}