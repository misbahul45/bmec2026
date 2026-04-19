import DashboardRepo from './dashboard.repo'

export default class DashboardService {
  private repo = new DashboardRepo()

  async getSummary() {
    const [
      [teams, members, admins, competitions, registrations, submissions, attempts, abstracts],
      regByStatus,
      subByStatus,
      absByStatus,
      regByComp,
      allComps,
      subByStage,
      allStages,
      attemptDates,
      [flagged, normal, cheatAgg],
      avgScore,
    ] = await Promise.all([
      this.repo.getCounts(),
      this.repo.getRegistrationByStatus(),
      this.repo.getSubmissionByStatus(),
      this.repo.getAbstractByStatus(),
      this.repo.getRegistrationByCompetition(),
      this.repo.getCompetitions(),
      this.repo.getSubmissionByStage(),
      this.repo.getStages(),
      this.repo.getExamAttemptsByDate(),
      this.repo.getCheatStats(),
      this.repo.getAvgScore(),
    ])

    const compMap = Object.fromEntries(allComps.map((c) => [c.id, c.name]))
    const stageMap = Object.fromEntries(allStages.map((s) => [s.id, s.name]))

    const toStatusMap = (arr: { status: string; _count: { _all: number } }[]) =>
      Object.fromEntries(arr.map((r) => [r.status, r._count._all]))

    const dateCountMap: Record<string, number> = {}
    for (const a of attemptDates) {
      const d = new Date(a.createdAt).toISOString().slice(0, 10)
      dateCountMap[d] = (dateCountMap[d] ?? 0) + 1
    }

    const [mostActiveTeamGroup, mostPopularCompGroup, mostActiveStageGroup] = await Promise.all([
      this.repo.getMostActiveTeam(),
      this.repo.getMostPopularCompetition(),
      this.repo.getMostActiveStage(),
    ])

    const [mostActiveTeam, mostPopularComp, mostActiveStage] = await Promise.all([
      mostActiveTeamGroup[0] ? this.repo.getTeamById(mostActiveTeamGroup[0].teamId) : null,
      mostPopularCompGroup[0] ? this.repo.getCompetitionById(mostPopularCompGroup[0].competitionId) : null,
      mostActiveStageGroup[0] ? this.repo.getStageById(mostActiveStageGroup[0].stageId) : null,
    ])

    const [recentRegs, recentSubs, recentAttempts] = await Promise.all([
      this.repo.getRecentRegistrations(),
      this.repo.getRecentSubmissions(),
      this.repo.getRecentAttempts(),
    ])

    return {
      counts: { teams, members, admins, competitions, registrations, submissions, attempts, abstracts },
      registrationByStatus: toStatusMap(regByStatus as any),
      submissionByStatus: toStatusMap(subByStatus as any),
      abstractByStatus: toStatusMap(absByStatus as any),
      registrationByCompetition: regByComp.map((r) => ({
        name: compMap[r.competitionId] ?? r.competitionId,
        count: r._count._all,
      })),
      submissionByStage: subByStage.map((s) => ({
        name: stageMap[s.stageId] ?? s.stageId,
        count: s._count._all,
      })),
      attemptsByDate: Object.entries(dateCountMap).map(([date, count]) => ({ date, count })),
      cheat: {
        flagged,
        normal,
        totalCheatEvents: cheatAgg._sum.cheatCount ?? 0,
      },
      avgExamScore: Math.round(avgScore._avg.totalScore ?? 0),
      insights: {
        mostActiveTeam: mostActiveTeam?.name ?? '—',
        mostPopularCompetition: mostPopularComp?.name ?? '—',
        mostActiveStage: mostActiveStage?.name ?? '—',
        flaggedAttempts: flagged,
      },
      recent: {
        registrations: recentRegs,
        submissions: recentSubs,
        attempts: recentAttempts,
      },
    }
  }
}
