import { AppError } from '~/lib/utils/app-error'
import { PaginationMeta } from '~/lib/types/pagination'
import AttemptRepo, { AttemptQuery } from './attempt.repo'

export default class AttemptService {
  private repo = new AttemptRepo()

  async autoFinishExpiredAttempts(examId: string): Promise<number> {
    const exam = await this.repo.findExamLite(examId)
    if (!exam) return 0

    const ongoing = await this.repo.findOngoingAttemptsByExam(examId)
    if (ongoing.length === 0) return 0

    const now = Date.now()
    let finished = 0

    for (const attempt of ongoing) {
      const deadlineFromStart =
        attempt.startTime.getTime() + exam.duration * 60 * 1000
      let effectiveDeadline = Math.min(deadlineFromStart, exam.endDate.getTime())

      if (exam.type === 'OLYMPIAD') {
        const sessionEnd = await this.repo.findSessionEndByTeamExam(
          attempt.teamId,
          examId,
        )
        if (sessionEnd) {
          effectiveDeadline = Math.min(effectiveDeadline, sessionEnd.getTime())
        }
      }

      if (now >= effectiveDeadline) {
        try {
          await this.finishAttemptByDeadline(attempt.id)
          finished++
        } catch (err) {
          console.error(
            `[autoFinishExpiredAttempts] Gagal finish attempt ${attempt.id}:`,
            err,
          )
        }
      }
    }

    return finished
  }

  private async finishAttemptByDeadline(attemptId: string): Promise<void> {
    const attempt = await this.repo.findAttemptForAutoFinish(attemptId)
    if (!attempt || attempt.finished) return

    const answersByQuestion = new Map(
      attempt.answers.map((a) => [a.questionId, a]),
    )
    const totalScore = attempt.exam.questions.reduce((sum, q) => {
      const ans = answersByQuestion.get(q.id)
      const isEmpty = !ans?.answer || ans.answer.trim() === ''
      if (isEmpty) return sum + q.emptyScore
      const isCorrect = q.correctAnswer === ans.answer
      return sum + (isCorrect ? q.correctScore : q.wrongScore)
    }, 0)

    await this.repo.finishAttemptOnce(attemptId, totalScore)
  }

  async findByExam(query: AttemptQuery) {
    await this.autoFinishExpiredAttempts(query.examId)

    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const skip = (page - 1) * limit

    const where: any = { examId: query.examId }

    if (query.search) {
      where.team = {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { schoolName: { contains: query.search, mode: 'insensitive' } },
        ],
      }
    }

    if (typeof query.finished === 'boolean') where.finished = query.finished
    if (typeof query.flagged === 'boolean') where.flagged = query.flagged

    let orderBy: any = { createdAt: 'desc' }
    if (query.sortBy === 'totalScore') orderBy = { totalScore: query.sortOrder ?? 'desc' }
    else if (query.sortBy === 'cheatCount') orderBy = { cheatCount: query.sortOrder ?? 'desc' }
    else if (query.sortBy === 'createdAt') orderBy = { createdAt: query.sortOrder ?? 'desc' }

    const [attempts, total] = await Promise.all([
      this.repo.findByExam(where, orderBy, skip, limit),
      this.repo.count(where),
    ])

    const meta: PaginationMeta = { page, limit, total, totalPages: Math.ceil(total / limit) }

    return { data: { attempts, meta }, message: 'Attempts fetched' }
  }

  async findDetail(id: string) {
    const meta = await this.repo.findAttemptMetaById(id)
    if (!meta) throw new AppError('Attempt ujian tidak ditemukan. Pastikan ID attempt benar.', 404, 'ATTEMPT_NOT_FOUND')

    await this.autoFinishExpiredAttempts(meta.examId)

    const attempt = await this.repo.findById(id)
    return { data: attempt, message: 'Attempt detail fetched' }
  }

  async getLeaderboard(examId: string) {
    await this.autoFinishExpiredAttempts(examId)

    const attempts = await this.repo.findByExam(
      { examId, finished: true },
      { totalScore: 'desc' },
      0,
      10000
    )
    return { data: attempts, message: 'Leaderboard fetched' }
  }
}
