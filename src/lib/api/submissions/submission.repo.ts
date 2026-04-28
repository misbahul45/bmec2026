import { Prisma, SubmissionStatus } from '@prisma/client'
import { prisma } from '~/lib/utils/prisma'

export interface SubmissionQuery {
  search?: string
  stageId?: string
  status?: SubmissionStatus | 'ALL'
  competitionType?: string
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
        team: {
          select: {
            id: true, name: true, schoolName: true, competitionType: true,
            registration: { select: { paymentProof: true, status: true } },
          },
        },
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

  create(data: { teamId: string; stageId: string; fileUrl: string; title?: string }) {
    return prisma.submission.create({ data })
  }

  upsert(data: { teamId: string; stageId: string; title?: string; turnitinUrl?: string; orsinalitasUrl?: string, abstractUrl?:string, fileUrl?:string }) {
    return prisma.submission.upsert({
      where: { teamId_stageId: { teamId: data.teamId, stageId: data.stageId } },
      update: { title: data.title, status:'PENDING' , turnitinUrl: data.turnitinUrl, orsinalitasUrl: data.orsinalitasUrl, abstractUrl:data.abstractUrl },
      create: {
        ...data,
        status:!data.turnitinUrl?'APPROVED':'PENDING'
      },
    })
  }

  updateFileUrl(teamId: string, stageId: string, data: { fileUrl?: string; turnitinUrl?: string; orsinalitasUrl?: string }) {
    return prisma.submission.update({
      where: { teamId_stageId: { teamId, stageId } },
      data,
    })
  }

  findByTeamAndStage(teamId: string, stageId: string) {
    return prisma.submission.findUnique({
      where: { teamId_stageId: { teamId, stageId } },
    })
  }

  updatePaymentProof(teamId: string, paymentProof: string) {
    return prisma.registration.update({
      where: { teamId },
      data: { paymentProof },
    })
  }

  findRegistrationByTeamId(teamId: string) {
    return prisma.registration.findUnique({ where: { teamId } })
  }

  createRegistration(data: { teamId: string; competitionId: string; batchId: string; paymentProof: string }) {
    return prisma.registration.create({ data })
  }

  findActiveLKTIBatch() {
    const now = new Date()
    return prisma.competition.findUnique({
      where: { name: 'LKTI' },
      include: {
        batches: {
          where: { startDate: { lte: now }, endDate: { gte: now } },
          orderBy: { startDate: 'asc' },
          take: 1,
        },
      },
    })
  }
}