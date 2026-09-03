import { prisma } from '~/lib/utils/prisma'

export default class ExamSessionRepo {
  findManyByExamId(examId: string) {
    return prisma.examSession.findMany({
      where: { examId },
      orderBy: { startTime: 'asc' },
      include: {
        assignments: {
          include: {
            team: {
              select: { id: true, code: true, name: true, schoolName: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  findExamMeta(examId: string) {
    return prisma.exam.findUnique({
      where: { id: examId },
      select: {
        id: true,
        type: true,
        startDate: true,
        endDate: true,
        stage: { select: { competition: { select: { name: true } } } },
      },
    })
  }

  findSessionById(id: string) {
    return prisma.examSession.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        startTime: true,
        endTime: true,
        exam: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            stage: { select: { competition: { select: { name: true } } } },
          },
        },
      },
    })
  }

  createSession(data: {
    examId: string
    name: string
    startTime: Date
    endTime: Date
  }) {
    return prisma.examSession.create({ data, select: { id: true } })
  }

  updateSession(
    id: string,
    data: { name?: string; startTime?: Date; endTime?: Date },
  ) {
    return prisma.examSession.update({ where: { id }, data, select: { id: true } })
  }

  deleteSession(id: string) {
    return prisma.examSession.delete({ where: { id }, select: { id: true } })
  }

  findTeamsByCompetition(competitionName: string) {
    return prisma.team.findMany({
      where: {
        competitionType: competitionName as any,
        registration: { status: 'APPROVED' },
      },
      select: { id: true, code: true, name: true },
    })
  }

  assignTeams(sessionId: string, teamIds: string[]) {
    return prisma.$transaction(async (tx) => {
      const session = await tx.examSession.findUniqueOrThrow({
        where: { id: sessionId },
        select: { id: true, name: true, examId: true },
      })

      let added = 0
      let moved = 0

      for (const teamId of teamIds) {
        const existing = await tx.examSessionTeam.findUnique({
          where: {
            teamId_examId: { teamId, examId: session.examId },
          },
          select: { id: true, sessionId: true },
        })

        if (existing?.sessionId === sessionId) continue

        if (existing) moved += 1
        else added += 1

        await tx.examSessionTeam.upsert({
          where: {
            teamId_examId: { teamId, examId: session.examId },
          },
          update: { sessionId },
          create: { sessionId, teamId, examId: session.examId },
        })
      }

      return { sessionName: session.name, added, moved }
    })
  }

  removeTeamAssignment(sessionId: string, teamId: string) {
    return prisma.examSessionTeam.deleteMany({
      where: { sessionId, teamId },
    })
  }
}
