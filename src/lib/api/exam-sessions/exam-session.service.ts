import { Prisma } from '@prisma/client'
import { AppError } from '~/lib/utils/app-error'
import ExamSessionRepo from './exam-session.repo'
import type {
  AssignTeamsToSessionData,
  CreateExamSessionData,
  UpdateExamSessionData,
} from '~/schemas/exam-session.schema'

function parseCodeNumber(code: string | null): number {
  if (!code) return Number.NaN
  const n = Number.parseInt(code.split('-')[1] ?? '', 10)
  return Number.isNaN(n) ? Number.NaN : n
}

export default class ExamSessionService {
  private repo = new ExamSessionRepo()

  async list(examId: string) {
    const sessions = await this.repo.findManyByExamId(examId)
    return { data: sessions, message: 'Berhasil memuat sesi' }
  }

  async create(data: CreateExamSessionData) {
    const exam = await this.repo.findExamMeta(data.examId)
    if (!exam) throw new AppError('Ujian tidak ditemukan', 404)
    if (exam.type !== 'OLYMPIAD') {
      throw new AppError('Sesi hanya tersedia untuk ujian Olimpiade', 400)
    }

    if (data.startTime < exam.startDate) {
      throw new AppError('Jam mulai sesi tidak boleh sebelum ujian dimulai', 400)
    }
    if (data.endTime > exam.endDate) {
      throw new AppError('Jam selesai sesi tidak boleh setelah ujian berakhir', 400)
    }

    try {
      const session = await this.repo.createSession({
        examId: data.examId,
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
      })
      return { data: session, message: 'Sesi berhasil dibuat' }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AppError('Nama sesi sudah dipakai pada ujian ini', 400)
      }
      throw error
    }
  }

  async update(data: UpdateExamSessionData) {
    const session = await this.repo.findSessionById(data.id)
    if (!session) throw new AppError('Sesi tidak ditemukan', 404)

    const startTime = data.startTime ?? session.startTime
    const endTime = data.endTime ?? session.endTime
    if (endTime <= startTime) {
      throw new AppError('Jam selesai harus setelah jam mulai', 400)
    }

    if (startTime < session.exam.startDate) {
      throw new AppError('Jam mulai sesi tidak boleh sebelum ujian dimulai', 400)
    }
    if (endTime > session.exam.endDate) {
      throw new AppError('Jam selesai sesi tidak boleh setelah ujian berakhir', 400)
    }

    try {
      const updated = await this.repo.updateSession(data.id, {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.startTime !== undefined ? { startTime: data.startTime } : {}),
        ...(data.endTime !== undefined ? { endTime: data.endTime } : {}),
      })
      return { data: updated, message: 'Sesi berhasil diperbarui' }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AppError('Nama sesi sudah dipakai pada ujian ini', 400)
      }
      throw error
    }
  }

  async remove(id: string) {
    const session = await this.repo.findSessionById(id)
    if (!session) throw new AppError('Sesi tidak ditemukan', 404)

    await this.repo.deleteSession(id)
    return { data: null, message: 'Sesi berhasil dihapus' }
  }

  async assign(input: AssignTeamsToSessionData) {
    const session = await this.repo.findSessionById(input.sessionId)
    if (!session) throw new AppError('Sesi tidak ditemukan', 404)

    const candidates = await this.repo.findTeamsByCompetition(
      session.exam.stage.competition.name,
    )

    const matched = candidates.filter((team) => {
      const num = parseCodeNumber(team.code)
      return (
        !Number.isNaN(num) && num >= input.codeFrom && num <= input.codeTo
      )
    })

    if (matched.length === 0) {
      throw new AppError(
        `Tidak ada tim dengan nomor kode ${input.codeFrom}-${input.codeTo}`,
        400,
      )
    }

    const result = await this.repo.assignTeams(
      input.sessionId,
      matched.map((t) => t.id),
    )

    return {
      data: {
        requested: input.codeTo - input.codeFrom + 1,
        matched: matched.length,
        added: result.added,
        moved: result.moved,
      },
      message: `${result.added} tim ditambahkan, ${result.moved} tim dipindah ke ${result.sessionName}`,
    }
  }

  async removeTeam(input: { sessionId: string; teamId: string }) {
    const deleted = await this.repo.removeTeamAssignment(
      input.sessionId,
      input.teamId,
    )
    if (deleted.count === 0) throw new AppError('Penugasan tim tidak ditemukan', 404)
    return { data: null, message: 'Tim dikeluarkan dari sesi' }
  }
}
