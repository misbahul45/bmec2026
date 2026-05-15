import { ExamEventType, Prisma } from '@prisma/client'
import { prisma } from '~/lib/utils/prisma'

export default class ExamAttemptRepo {
  findAttempt(teamId: string, examId: string) {
    return prisma.examAttempt.findUnique({
      where: { teamId_examId: { teamId, examId } },
      select: { id: true, finished: true, deviceId: true, startTime: true, examId: true },
    })
  }

  findAttemptById(id: string) {
    return prisma.examAttempt.findUnique({
      where: { id },
      select: { id: true, finished: true, deviceId: true, startTime: true, examId: true, teamId: true },
    })
  }

  createAttempt(data: {
    teamId: string
    examId: string
    deviceId: string
    ipAddress: string
    userAgent: string
  }) {
    return prisma.examAttempt.create({
      data: {
        teamId: data.teamId,
        examId: data.examId,
        deviceId: data.deviceId || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        startTime: new Date(),
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
          select: { questionId: true, answer: true, isCorrect: true, answeredAt: true },
        },
      },
    })
  }

  findAttemptForFinish(
    tx: Prisma.TransactionClient,
    attemptId: string
  ) {
    return tx.examAttempt.findUnique({
      where: {
        id: attemptId,
      },
      select: {
        finished: true,
        examId: true,
        answers: {
          select: {
            answer: true,
            isCorrect: true,
            question: {
              select: {
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

  finishAttempt(tx: Prisma.TransactionClient, attemptId: string, totalScore: number) {
    return tx.examAttempt.update({
      where: { id: attemptId },
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
        questions: {
          select: {
            id: true,
            question: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            optionE: true,
            correctScore:true,
            wrongScore:true,
            emptyScore:true,    
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  findReviewAttempt(teamId: string, examId: string) {
    return prisma.examAttempt.findUnique({
      where: { teamId_examId: { teamId, examId } },
      include: {
        answers: true,
        exam: {
          include: {
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
        totalScore: true,
        finished: true,
        startTime: true,
        endTime: true,
        cheatCount: true,
        suspiciousScore: true,
        flagged: true,

        exam: {
          select: {
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
    tx: Prisma.TransactionClient,
    attemptId: string,
    type: ExamEventType,
    metadata: Prisma.InputJsonValue,
    weight: number,
  ) {
    return Promise.all([
      tx.examEventLog.create({
        data: { attemptId, type, metadata },
      }),
      tx.examAttempt.update({
        where: { id: attemptId },
        data: {
          cheatCount: { increment: weight > 0 ? 1 : 0 },
          suspiciousScore: { increment: weight },
          ...(weight >= 25 ? { flagged: true } : {}),
        },
      }),
    ])
  }
}
