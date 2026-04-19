import { Prisma, SubmissionStatus } from '@prisma/client'
import { prisma } from '~/lib/utils/prisma'

export interface SubmissionQuery {
  search?: string
  stageId?: string
  status?: SubmissionStatus | 'ALL'
  page?: number
  limit?: number
}

export default class SubmissionRepo {
  findAll(where: Prisma.SubmissionWhereInput, skip: number, take: number) {
    return prisma.submission.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        team: { select: { id: true, name: true, schoolName: true, competitionType: true } },
        stage: { select: { id: true, name: true, competition: { select: { name: true } } } },
        admin: { select: { id: true, name: true } },
      },
    })
  }

  count(where: Prisma.SubmissionWhereInput) {
    return prisma.submission.count({ where })
  }

  findById(id: string) {
    return prisma.submission.findUnique({
      where: { id },
      include: {
        team: true,
        stage: { include: { competition: true } },
        admin: true,
      },
    })
  }

  approve(id: string, adminId: string) {
    return prisma.submission.update({
      where: { id },
      data: { status: SubmissionStatus.APPROVED, reviewedBy: adminId },
    })
  }

  reject(id: string, adminId: string) {
    return prisma.submission.update({
      where: { id },
      data: { status: SubmissionStatus.REJECTED, reviewedBy: adminId },
    })
  }

  updateScore(id: string, score: number, feedback: string | null, adminId: string) {
    return prisma.submission.update({
      where: { id },
      data: { score, feedback, reviewedBy: adminId },
    })
  }

  findLeaderboard(competitionType: string, stageType?: string) {
    return prisma.submission.findMany({
      where: {
        team: { competitionType: competitionType as any },
        ...(stageType ? { stage: { name: stageType as any } } : {}),
        score: { not: null },
      },
      orderBy: { score: 'desc' },
      include: {
        team: { select: { id: true, name: true, schoolName: true, competitionType: true } },
        stage: { select: { id: true, name: true } },
        admin: { select: { id: true, name: true } },
      },
    })
  }
}
