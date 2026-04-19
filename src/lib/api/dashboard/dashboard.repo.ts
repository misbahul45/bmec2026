import { prisma } from '~/lib/utils/prisma'

export default class DashboardRepo {
  getCounts() {
    return Promise.all([
      prisma.team.count(),
      prisma.member.count(),
      prisma.admin.count(),
      prisma.competition.count(),
      prisma.registration.count(),
      prisma.submission.count(),
      prisma.examAttempt.count(),
      prisma.abstractSubmission.count(),
    ])
  }

  getRegistrationByStatus() {
    return prisma.registration.groupBy({ by: ['status'], _count: { _all: true } })
  }

  getSubmissionByStatus() {
    return prisma.submission.groupBy({ by: ['status'], _count: { _all: true } })
  }

  getAbstractByStatus() {
    return prisma.abstractSubmission.groupBy({ by: ['status'], _count: { _all: true } })
  }

  getRegistrationByCompetition() {
    return prisma.registration.groupBy({
      by: ['competitionId'],
      _count: { _all: true },
    })
  }

  getCompetitions() {
    return prisma.competition.findMany({ select: { id: true, name: true } })
  }

  getSubmissionByStage() {
    return prisma.submission.groupBy({
      by: ['stageId'],
      _count: { _all: true },
    })
  }

  getStages() {
    return prisma.stage.findMany({ select: { id: true, name: true } })
  }

  getExamAttemptsByDate() {
    return prisma.examAttempt.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    })
  }

  getCheatStats() {
    return Promise.all([
      prisma.examAttempt.count({ where: { flagged: true } }),
      prisma.examAttempt.count({ where: { flagged: false } }),
      prisma.examAttempt.aggregate({ _sum: { cheatCount: true } }),
    ])
  }

  getAvgScore() {
    return prisma.examAttempt.aggregate({
      _avg: { totalScore: true },
      where: { finished: true },
    })
  }

  getMostActiveTeam() {
    return prisma.submission.groupBy({
      by: ['teamId'],
      _count: { _all: true },
      orderBy: { _count: { teamId: 'desc' } },
      take: 1,
    })
  }

  getTeamById(id: string) {
    return prisma.team.findUnique({ where: { id }, select: { name: true } })
  }

  getMostPopularCompetition() {
    return prisma.registration.groupBy({
      by: ['competitionId'],
      _count: { _all: true },
      orderBy: { _count: { competitionId: 'desc' } },
      take: 1,
    })
  }

  getMostActiveStage() {
    return prisma.submission.groupBy({
      by: ['stageId'],
      _count: { _all: true },
      orderBy: { _count: { stageId: 'desc' } },
      take: 1,
    })
  }

  getStageById(id: string) {
    return prisma.stage.findUnique({ where: { id }, select: { name: true } })
  }

  getCompetitionById(id: string) {
    return prisma.competition.findUnique({ where: { id }, select: { name: true } })
  }

  getRecentRegistrations() {
    return prisma.registration.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { team: { select: { name: true } }, competition: { select: { name: true } } },
    })
  }

  getRecentSubmissions() {
    return prisma.submission.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { team: { select: { name: true } }, stage: { select: { name: true } } },
    })
  }

  getRecentAttempts() {
    return prisma.examAttempt.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { team: { select: { name: true } }, exam: { select: { title: true } } },
    })
  }
}
