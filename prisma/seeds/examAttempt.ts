import { prisma } from "~/lib/utils/prisma"

export async function seedExamAttempts() {
  console.log("🌱 Seeding Exam Attempts (with anti-cheat)...")

  const teams = await prisma.team.findMany()
  const exams = await prisma.exam.findMany({
    include: { questions: true },
  })

  for (const team of teams) {
    for (const exam of exams) {
      try {
        let totalScore = 0
        let suspiciousScore = 0

        // 🔥 30% kemungkinan curang
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

            cheatCount: 0,
            suspiciousScore: 0,
            flagged: false,
          },
        })

        // ======================
        // 1. JAWAB SOAL
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
        // 2. GENERATE EVENT LOG
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
          ? Math.floor(Math.random() * 6) + 3 // 3–8 event
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
            metadata: {
              note: "auto-generated",
            },
          })

          // 🔥 scoring kecurangan
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

        // simpan event
        if (eventsData.length > 0) {
          await prisma.examEventLog.createMany({
            data: eventsData,
          })
        }

        const cheatCount = eventsData.length

        // ======================
        // 3. FLAGGING
        // ======================
        const duration =
          (endTime.getTime() - startTime.getTime()) / 1000

        // terlalu cepat → mencurigakan
        if (duration < exam.questions.length * 5) {
          suspiciousScore += 20
        }

        const flagged = suspiciousScore >= 50

        // ======================
        // 4. FINAL UPDATE
        // ======================
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
          `🧠 ${team.name} | Score: ${totalScore} | Cheat: ${cheatCount} | Suspicious: ${suspiciousScore} | ${
            flagged ? "🚨 CHEATER" : "✅ NORMAL"
          }`
        )
      } catch (err) {
        continue
      }
    }
  }

  console.log("✅ Exam Attempts Seeded (with anti-cheat)")
}