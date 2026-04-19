import { Prisma } from '@prisma/client'
import { prisma } from '~/lib/utils/prisma'

export interface AttemptQuery {
  examId: string
  search?: string
  sortBy?: 'totalScore' | 'createdAt' | 'teamName' | 'cheatCount'
  sortOrder?: 'asc' | 'desc'
  finished?: boolean
  flagged?: boolean
  page?: number
  limit?: number
}

export default class AttemptRepo {
  findByExam(where: Prisma.ExamAttemptWhereInput, orderBy: any, skip: number, take: number) {
    return prisma.examAttempt.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        team: { select: { id: true, name: true, schoolName: true, competitionType: true } },
        exam: { select: { id: true, title: true, type: true } },
        answers: {
          include: {
            question: { select: { id: true, score: true, correctAnswer: true } },
          },
        },
      },
    })
  }

  count(where: Prisma.ExamAttemptWhereInput) {
    return prisma.examAttempt.count({ where })
  }

  findById(id: string) {
    return prisma.examAttempt.findUnique({
      where: { id },
      include: {
        team: { select: { id: true, name: true, schoolName: true, competitionType: true } },
        exam: { include: { questions: { orderBy: { createdAt: 'asc' } } } },
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
                score: true,
              },
            },
          },
          orderBy: { answeredAt: 'asc' },
        },
        events: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }
}
