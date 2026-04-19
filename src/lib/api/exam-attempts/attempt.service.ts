import { AppError } from '~/lib/utils/app-error'
import { PaginationMeta } from '~/lib/types/pagination'
import AttemptRepo, { AttemptQuery } from './attempt.repo'

export default class AttemptService {
  private repo = new AttemptRepo()

  async findByExam(query: AttemptQuery) {
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
    const attempt = await this.repo.findById(id)
    if (!attempt) throw new AppError('Attempt not found', 404)
    return { data: attempt, message: 'Attempt detail fetched' }
  }

  async getLeaderboard(examId: string) {
    const attempts = await this.repo.findByExam(
      { examId, finished: true },
      { totalScore: 'desc' },
      0,
      10000
    )
    return { data: attempts, message: 'Leaderboard fetched' }
  }
}
