import { ExamEventType, Prisma } from '@prisma/client'
import { prisma } from '~/lib/utils/prisma'

export default class ExamAttemptRepo {
  findAttemptById(id: string) {
    return prisma.examAttempt.findUnique({
      where: { id },
      select: { id: true, finished: true, deviceId: true, startTime: true, examId: true, teamId: true },
    })
  }

  upsertAttempt(data: {
    teamId: string
    examId: string
    deviceId: string
    ipAddress: string
    userAgent: string
    startTime: Date
  }) {
    return prisma.examAttempt.upsert({
      where: {
        teamId_examId: {
          teamId: data.teamId,
          examId: data.examId,
        },
      },
      update: {},
      create: {
        teamId: data.teamId,
        examId: data.examId,
        deviceId: data.deviceId || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        startTime: data.startTime,
      },
      select: { id: true, startTime: true, finished: true, teamId: true, examId: true, deviceId: true },
    })
  }

  updateDeviceId(attemptId: string, deviceId: string, ipAddress: string, userAgent: string) {
    return prisma.examAttempt.update({
      where: { id: attemptId },
      data: { deviceId, ipAddress, userAgent },
      select: { id: true },
    })
  }

  findAttemptWithAnswers(teamId: string, examId: string) {
    return prisma.examAttempt.findUnique({
      where: { teamId_examId: { teamId, examId } },
      select: {
        id: true,
        startTime: true,
        finished: true,
        answers: {
          select: { questionId: true, answer: true },
        },
      },
    })
  }

  findAttemptForAnswer(id: string) {
    return prisma.examAttempt.findUnique({
      where: { id },
      select: {
        id: true,
        finished: true,
        startTime: true,
        examId: true,
        teamId: true,
        exam: {
          select: {
            endDate: true,
            duration: true,
          },
        },
      },
    })
  }

  findAttemptForFinish(attemptId: string) {
    return prisma.examAttempt.findUnique({
      where: {
        id: attemptId,
      },
      select: {
        teamId: true,
        finished: true,
        examId: true,
        answers: {
          select: {
            questionId: true,
            answer: true,
            isCorrect: true,
          },
        },
        exam: {
          select: {
            questions: {
              select: {
                id: true,
                correctScore: true,
                wrongScore: true,
                emptyScore: true,
              },
            },
          },
        },
      },
    })
  }

  finishAttempt(attemptId: string, totalScore: number) {
    return prisma.examAttempt.updateMany({
      where: { id: attemptId, finished: false },
      data: { finished: true, endTime: new Date(), totalScore },
    })
  }

  upsertAnswer(data: {
    attemptId: string
    questionId: string
    answer: string
    isCorrect: boolean
  }) {
    return prisma.examAnswer.upsert({
      where: { attemptId_questionId: { attemptId: data.attemptId, questionId: data.questionId } },
      create: {
        attemptId: data.attemptId,
        questionId: data.questionId,
        answer: data.answer,
        isCorrect: data.isCorrect,
        answeredAt: new Date(),
      },
      update: {
        answer: data.answer,
        isCorrect: data.isCorrect,
        answeredAt: new Date(),
      },
      select: { id: true },
    })
  }

  findQuestion(questionId: string) {
    return prisma.examQuestion.findUnique({
      where: { id: questionId },
      select: { correctAnswer: true, examId: true },
    })
  }

  findExamWindow(examId: string) {
    return prisma.exam.findUnique({
      where: { id: examId },
      select: { id: true, startDate: true, endDate: true, duration: true },
    })
  }

  findExamWithQuestions(examId: string) {
    return prisma.exam.findUnique({
      where: { id: examId },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        duration: true,
        type: true,
        stage: {
          select: {
            name: true,
          },
        },
        questions: {
          select: {
            id: true,
            question: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            optionE: true,
          },
          orderBy: [
            { order: 'asc' },
            { createdAt: 'asc' },
          ],
        },
      },
    })
  }

  findReviewAttempt(teamId: string, examId: string) {
    return prisma.examAttempt.findUnique({
      where: { teamId_examId: { teamId, examId } },
      select: {
        id: true,
        totalScore: true,
        finished: true,
        answers: {
          select: {
            questionId: true,
            answer: true,
            isCorrect: true,
          },
        },
        exam: {
          select: {
            id: true,
            title: true,
            type: true,
            questions: {
              select: {
                id: true,
                question: true,
                optionA: true,
                optionB: true,
                optionC: true,
                optionD: true,
                optionE: true,
                correctAnswer: true,
                difficulty: true,
                correctScore: true,
                wrongScore: true,
                emptyScore: true,
                order: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })
  }

  findAttemptResult(
    attemptId: string
  ) {
    return prisma.examAttempt.findUnique({
      where: {
        id: attemptId,
      },
      select: {
        id: true,
        teamId: true,
        totalScore: true,
        finished: true,
        startTime: true,
        endTime: true,
        cheatCount: true,
        suspiciousScore: true,
        flagged: true,

        exam: {
          select: {
            type: true,
            _count: {
              select: { questions: true },
            },
            questions: {
              select: {
                correctScore: true,
              },
            },
          },
        },

        answers: {
          select: {
            questionId: true,
            answer: true,
            isCorrect: true,

            question: {
              select: {
                difficulty: true,
                correctScore: true,
                wrongScore: true,
                emptyScore: true,
              },
            },
          },
        },
      },
    })
  }
  logEventAndUpdateAttempt(
    attemptId: string,
    type: ExamEventType,
    metadata: Prisma.InputJsonValue,
    weight: number,
  ) {
    const createEvent = prisma.examEventLog.create({
      data: { attemptId, type, metadata },
    })

    if (weight <= 0) return createEvent

    return Promise.all([
      createEvent,
      prisma.examAttempt.updateMany({
        where: { id: attemptId, finished: false },
        data: {
          cheatCount: { increment: 1 },
          suspiciousScore: { increment: weight },
          ...(weight >= 25 ? { flagged: true } : {}),
        },
      }),
    ])
  }
}
