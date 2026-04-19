import { prisma } from "~/lib/utils/prisma"

export async function seedExamAttempts() {
  console.log("🌱 Seeding Exam Attempts (Olimpiade Only)...")

  const teams = await prisma.team.findMany({
    where: {
      competitionType: "OLIMPIADE",
    },
  })

  const exams = await prisma.exam.findMany({
    where: {
      stage: {
        competition: {
          name: {
            contains: "Olimpiade",
          },
        },
      },
    },
    include: { questions: true },
  })

  for (const team of teams) {
    for (const exam of exams) {
      try {
        let totalScore = 0
        let suspiciousScore = 0

        const isCheater = Math.random() < 0.3

        const startTime = new Date(
          Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)
        )
        const endTime = new Date()

        const attempt = await prisma.examAttempt.create({
          data: {
            teamId: team.id,
            examId: exam.id,
            finished: true,
            startTime,
            endTime,

            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            userAgent: "Mozilla/5.0",
            deviceId: `device-${team.id}`,
          },
        })

        // ======================
        // ANSWERS
        // ======================
        for (const question of exam.questions) {
          const options = ["A", "B", "C", "D", "E"]

          const answer = isCheater
            ? Math.random() < 0.8
              ? question.correctAnswer
              : options[Math.floor(Math.random() * options.length)]
            : options[Math.floor(Math.random() * options.length)]

          const isCorrect = answer === question.correctAnswer

          if (isCorrect) totalScore += question.score

          await prisma.examAnswer.create({
            data: {
              attemptId: attempt.id,
              questionId: question.id,
              answer,
              isCorrect,
            },
          })
        }

        // ======================
        // EVENTS
        // ======================
        const eventsData: any[] = []
        const eventTypes = [
          "TAB_SWITCH",
          "COPY",
          "PASTE",
          "FULLSCREEN_EXIT",
          "DEVTOOLS_OPEN",
        ] as const

        const eventCount = isCheater
          ? Math.floor(Math.random() * 6) + 3
          : Math.random() < 0.2
          ? 1
          : 0

        for (let i = 0; i < eventCount; i++) {
          const type =
            eventTypes[
              Math.floor(Math.random() * eventTypes.length)
            ]

          eventsData.push({
            attemptId: attempt.id,
            type,
            metadata: { note: "auto-generated" },
          })

          switch (type) {
            case "TAB_SWITCH":
              suspiciousScore += 10
              break
            case "COPY":
            case "PASTE":
              suspiciousScore += 15
              break
            case "FULLSCREEN_EXIT":
              suspiciousScore += 20
              break
            case "DEVTOOLS_OPEN":
              suspiciousScore += 25
              break
          }
        }

        if (eventsData.length > 0) {
          await prisma.examEventLog.createMany({
            data: eventsData,
          })
        }

        const cheatCount = eventsData.length

        const duration =
          (endTime.getTime() - startTime.getTime()) / 1000

        if (duration < exam.questions.length * 5) {
          suspiciousScore += 20
        }

        const flagged = suspiciousScore >= 50

        await prisma.examAttempt.update({
          where: { id: attempt.id },
          data: {
            totalScore,
            cheatCount,
            suspiciousScore,
            flagged,
          },
        })

        console.log(
          `🧠 ${team.name} | Score: ${totalScore} | ${
            flagged ? "🚨 CHEATER" : "✅ NORMAL"
          }`
        )
      } catch {
        continue
      }
    }
  }

  console.log("✅ Exam Attempts Seeded")
}