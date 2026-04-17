import { prisma } from "~/lib/utils/prisma"
import  * as bcrypt from "bcrypt"

const schools = [
  "SMAN 1 Surabaya",
  "SMAN 2 Surabaya",
  "SMKN 1 Surabaya",
  "SMAN 5 Surabaya",
  "SMAN 1 Malang",
  "SMAN 3 Malang",
  "SMAN 1 Jakarta",
  "SMAN 8 Jakarta",
  "SMAN 1 Bandung",
  "SMAN 3 Bandung",
]

const addresses = [
  "Jl. Ahmad Yani No. 10",
  "Jl. Diponegoro No. 25",
  "Jl. Sudirman No. 12",
  "Jl. Gajah Mada No. 30",
  "Jl. Pemuda No. 18",
]

const competitions = [
  "OLIMPIADE",
  "LKTI",
  "INFOGRAFIS",
] as const

export async function seedTeams() {
  const password = await bcrypt.hash(
    "password123",
    10
  )

  for (let i = 1; i <= 100; i++) {
    const school =
      schools[
        Math.floor(
          Math.random() * schools.length
        )
      ]

    const address =
      addresses[
        Math.floor(
          Math.random() * addresses.length
        )
      ]

    const competitionType =
      competitions[
        Math.floor(
          Math.random() *
            competitions.length
        )
      ]

    const team = await prisma.team.create({
      data: {
        name: `Team ${i}`,
        code: `TEAM-${i
          .toString()
          .padStart(3, "0")}`,

        email: `team${i}@gmail.com`,
        password,

        phone: `08123${Math.floor(
          1000000 + Math.random() * 9000000
        )}`,

        schoolName: school,
        schoolAddress: `${address}, Indonesia`,

        competitionType,

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
      `✅ Created Team ${team.name}`
    )
  }

  console.log(
    "🚀 100 Teams + Members Seeded"
  )
}