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
    if (!exam) throw new AppError('Ujian tidak ditemukan. Pastikan ID ujian benar.', 404, 'EXAM_NOT_FOUND')
    if (exam.type !== 'OLYMPIAD') {
      throw new AppError('Sesi hanya tersedia untuk ujian tipe Olimpiade, bukan Tryout.', 400, 'SESSION_OLYMPIAD_ONLY')
    }

    if (data.startTime < exam.startDate) {
      throw new AppError('Jam mulai sesi tidak boleh sebelum jadwal ujian dimulai.', 400, 'SESSION_START_BEFORE_EXAM')
    }
    if (data.endTime > exam.endDate) {
      throw new AppError('Jam selesai sesi tidak boleh setelah jadwal ujian berakhir.', 400, 'SESSION_END_AFTER_EXAM')
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
        throw new AppError('Nama sesi sudah dipakai pada ujian ini. Gunakan nama lain.', 400, 'SESSION_NAME_DUPLICATE')
      }
      throw error
    }
  }

  async update(data: UpdateExamSessionData) {
    const session = await this.repo.findSessionById(data.id)
    if (!session) throw new AppError('Sesi ujian tidak ditemukan. Pastikan ID sesi benar.', 404, 'SESSION_NOT_FOUND')

    const startTime = data.startTime ?? session.startTime
    const endTime = data.endTime ?? session.endTime
    if (endTime <= startTime) {
      throw new AppError('Jam selesai sesi harus setelah jam mulai sesi.', 400, 'SESSION_END_BEFORE_START')
    }

    if (startTime < session.exam.startDate) {
      throw new AppError('Jam mulai sesi tidak boleh sebelum jadwal ujian dimulai.', 400, 'SESSION_START_BEFORE_EXAM')
    }
    if (endTime > session.exam.endDate) {
      throw new AppError('Jam selesai sesi tidak boleh setelah jadwal ujian berakhir.', 400, 'SESSION_END_AFTER_EXAM')
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
        throw new AppError('Nama sesi sudah dipakai pada ujian ini. Gunakan nama lain.', 400, 'SESSION_NAME_DUPLICATE')
      }
      throw error
    }
  }

  async remove(id: string) {
    const session = await this.repo.findSessionById(id)
    if (!session) throw new AppError('Sesi ujian tidak ditemukan. Pastikan ID sesi benar.', 404, 'SESSION_NOT_FOUND')

    await this.repo.deleteSession(id)
    return { data: null, message: 'Sesi berhasil dihapus' }
  }

  async assign(input: AssignTeamsToSessionData) {
    const session = await this.repo.findSessionById(input.sessionId)
    if (!session) throw new AppError('Sesi ujian tidak ditemukan. Pastikan ID sesi benar.', 404, 'SESSION_NOT_FOUND')

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
        `Tidak ada tim dengan nomor kode ${input.codeFrom}-${input.codeTo} yang terdaftar. Pastikan rentang kode benar.`,
        400,
        'NO_TEAMS_IN_RANGE'
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
    if (deleted.count === 0) throw new AppError('Penugasan tim tidak ditemukan pada sesi ini. Mungkin sudah dihapus sebelumnya.', 404, 'TEAM_ASSIGNMENT_NOT_FOUND')
    return { data: null, message: 'Tim dikeluarkan dari sesi' }
  }
}
