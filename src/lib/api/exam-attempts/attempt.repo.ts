import { Prisma } from '@prisma/client'
import { prisma } from '~/lib/utils/prisma'

export interface AttemptQuery {
  examId: string
  search?: string
  sortBy?:
    | 'totalScore'
    | 'createdAt'
    | 'teamName'
    | 'cheatCount'
  sortOrder?:
    | 'asc'
    | 'desc'
  finished?: boolean
  flagged?: boolean
  page?: number
  limit?: number
}

export default class AttemptRepo {
  findByExam(
    where: Prisma.ExamAttemptWhereInput,
    orderBy: any,
    skip: number,
    take: number
  ) {
    return prisma.examAttempt.findMany({
      where,
      orderBy,
      skip,
      take,

      include: {
        team: {
          select: {
            id: true,
            name: true,
            schoolName: true,
            competitionType: true,
          },
        },

        exam: {
          select: {
            id: true,
            title: true,
            type: true,
            _count: {
              select: { questions: true },
            },
          },
        },

        answers: {
          include: {
            question: {
              select: {
                id: true,
                correctAnswer: true,
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

  count(
    where: Prisma.ExamAttemptWhereInput
  ) {
    return prisma.examAttempt.count({
      where,
    })
  }

  findOngoingAttemptsByExam(examId: string) {
    return prisma.examAttempt.findMany({
      where: { examId, finished: false },
      select: {
        id: true,
        teamId: true,
        startTime: true,
        examId: true,
      },
    })
  }

  findSessionEndByTeamExam(teamId: string, examId: string) {
    return prisma.examSessionTeam
      .findUnique({
        where: { teamId_examId: { teamId, examId } },
        select: { session: { select: { endTime: true } } },
      })
      .then((row) => row?.session?.endTime ?? null)
  }

  findExamLite(examId: string) {
    return prisma.exam.findUnique({
      where: { id: examId },
      select: { id: true, startDate: true, endDate: true, duration: true, type: true },
    })
  }

  findAttemptForAutoFinish(attemptId: string) {
    return prisma.examAttempt.findUnique({
      where: { id: attemptId },
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
                correctAnswer: true,
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

  finishAttemptOnce(attemptId: string, totalScore: number) {
    return prisma.examAttempt.updateMany({
      where: { id: attemptId, finished: false },
      data: { finished: true, endTime: new Date(), totalScore },
    })
  }

  findAttemptMetaById(attemptId: string) {
    return prisma.examAttempt.findUnique({
      where: { id: attemptId },
      select: { id: true, examId: true, finished: true },
    })
  }

  findById(id: string) {
    return prisma.examAttempt.findUnique({
      where: {
        id,
      },

      include: {
        team: {
          select: {
            id: true,
            name: true,
            schoolName: true,
            competitionType: true,
          },
        },

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
              orderBy: {
                order: 'asc',
              },
            },
          },
        },

        answers: {
          include: {
            question: {
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
              },
            },
          },

          orderBy: {
            answeredAt:
              'asc',
          },
        },

        events: {
          orderBy: {
            createdAt:
              'asc',
          },
        },
      },
    })
  }
}