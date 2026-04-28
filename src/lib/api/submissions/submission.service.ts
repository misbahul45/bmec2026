import { SubmissionStatus } from '@prisma/client'
import { AppError } from '~/lib/utils/app-error'
import { PaginationMeta } from '~/lib/types/pagination'
import SubmissionRepo, { SubmissionQuery } from './submission.repo'

export default class SubmissionService {
  private repo = new SubmissionRepo()

  async findAll(query: SubmissionQuery) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const skip = (page - 1) * limit

    const where: any = {}

    if (query.search) {
      where.team = {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { schoolName: { contains: query.search, mode: 'insensitive' } },
        ],
      }
    }

    if (query.stageId) where.stageId = query.stageId
    if (query.status && query.status !== 'ALL') where.status = query.status
    if (query.competitionType && query.competitionType !== 'ALL') {
      where.team = { ...where.team, competitionType: query.competitionType as any }
    }

    const [submissions, total] = await Promise.all([
      this.repo.findAll(where, skip, limit),
      this.repo.count(where),
    ])

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }

    return { data: { submissions, meta }, message: 'Submissions fetched' }
  }

  async approve(id: string, adminId: string) {
    const sub = await this.repo.findById(id)
    if (!sub) throw new AppError('Submission not found', 404)
    if (sub.status !== SubmissionStatus.PENDING) throw new AppError('Already reviewed', 400)
    const updated = await this.repo.approve(id, adminId)
    return { data: updated, message: 'Approved' }
  }

  async reject(id: string, adminId: string) {
    const sub = await this.repo.findById(id)
    if (!sub) throw new AppError('Submission not found', 404)
    if (sub.status !== SubmissionStatus.PENDING) throw new AppError('Already reviewed', 400)
    const updated = await this.repo.reject(id, adminId)
    return { data: updated, message: 'Rejected' }
  }

  async updateScore(id: string, score: number, feedback: string | null, adminId: string) {
    const sub = await this.repo.findById(id)
    if (!sub) throw new AppError('Submission not found', 404)
    const updated = await this.repo.updateScore(id, score, feedback, adminId)
    return { data: updated, message: 'Score updated' }
  }

  async getLeaderboard(competitionType: string, stageType?: string) {
    const data = await this.repo.findLeaderboard(competitionType, stageType)
    return { data, message: 'Leaderboard fetched' }
  }

  async upsertSubmission(data: { teamId: string; stageId: string; title?: string; turnitinUrl?: string; orsinalitasUrl?: string, abstractUrl?:string, fileUrl?:string }) {
    const result = await this.repo.upsert(data)
    return { data: result, message: 'Submission saved' }
  }

  async updateSubmissionFiles(teamId: string, stageId: string, data: { fileUrl?: string; turnitinUrl?: string; orsinalitasUrl?: string }) {
    const existing = await this.repo.findByTeamAndStage(teamId, stageId)
    if (!existing) throw new AppError('Submission not found', 404)
    const result = await this.repo.updateFileUrl(teamId, stageId, data)
    return { data: result, message: 'Submission updated' }
  }

  async submitWithPayment(data: { teamId: string; stageId: string; fileUrl: string; paymentProof: string; title?: string }) {
    const { paymentProof, ...submissionData } = data

    const existing = await this.repo.findRegistrationByTeamId(data.teamId)

    if (existing) {
      const [submission] = await Promise.all([
        this.repo.upsert(submissionData),
        this.repo.updatePaymentProof(data.teamId, paymentProof),
      ])
      return { data: submission, message: 'Submission and payment saved' }
    }

    const competition = await this.repo.findActiveLKTIBatch()
    if (!competition) throw new AppError('Kompetisi LKTI tidak ditemukan', 404)

    const batch = competition.batches?.[0]
    if (!batch) throw new AppError('Tidak ada batch LKTI aktif saat ini', 400)

    const [submission] = await Promise.all([
      this.repo.upsert(submissionData),
      this.repo.createRegistration({
        teamId: data.teamId,
        competitionId: competition.id,
        batchId: batch.id,
        paymentProof,
      }),
    ])

    return { data: submission, message: 'Submission, registration, and payment saved' }
  }

  async getByTeamAndStage(teamId: string, stageId: string) {
    const data = await this.repo.findByTeamAndStage(teamId, stageId)
    return { data, message: 'Submission fetched' }
  }
}
