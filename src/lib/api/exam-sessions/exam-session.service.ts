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
    if (!exam) {
      throw new AppError(
        'Ujian tidak ditemukan. Pastikan ID ujian benar.',
        404,
        'EXAM_NOT_FOUND',
        'examId',
      )
    }
    if (exam.type !== 'OLYMPIAD') {
      throw new AppError(
        'Sesi hanya tersedia untuk ujian tipe Olimpiade, bukan Tryout.',
        400,
        'SESSION_OLYMPIAD_ONLY',
        'examId',
      )
    }

    if (data.startTime < exam.startDate) {
      throw new AppError(
        `Jam mulai sesi (${data.startTime.toISOString()}) tidak boleh sebelum jadwal ujian dimulai (${exam.startDate.toISOString()}). Periksa zona waktu (WIB = UTC+7).`,
        400,
        'SESSION_START_BEFORE_EXAM',
        'startTime',
      )
    }
    if (data.endTime > exam.endDate) {
      throw new AppError(
        `Jam selesai sesi (${data.endTime.toISOString()}) tidak boleh setelah jadwal ujian berakhir (${exam.endDate.toISOString()}). Periksa zona waktu (WIB = UTC+7).`,
        400,
        'SESSION_END_AFTER_EXAM',
        'endTime',
      )
    }

    const existingByName = await this.repo.findSessionByName(
      data.examId,
      data.name.trim(),
    )
    if (existingByName) {
      throw new AppError(
        `Nama sesi "${data.name}" sudah dipakai pada ujian ini. Gunakan nama lain.`,
        400,
        'SESSION_NAME_DUPLICATE',
        'name',
      )
    }

    const overlapping = await this.repo.findOverlappingSessions(
      data.examId,
      data.startTime,
      data.endTime,
    )
    if (overlapping.length > 0) {
      const conflict = overlapping[0]
      throw new AppError(
        `Rentang waktu sesi bentrok dengan sesi "${conflict.name}" (${conflict.startTime.toISOString()} – ${conflict.endTime.toISOString()}). Pilih rentang di luar sesi tersebut.`,
        400,
        'SESSION_OVERLAP',
        'startTime',
      )
    }

    try {
      const session = await this.repo.createSession({
        examId: data.examId,
        name: data.name.trim(),
        startTime: data.startTime,
        endTime: data.endTime,
      })
      return { data: session, message: 'Sesi berhasil dibuat' }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AppError(
          `Nama sesi "${data.name}" sudah dipakai pada ujian ini. Gunakan nama lain.`,
          400,
          'SESSION_NAME_DUPLICATE',
          'name',
        )
      }
      throw error
    }
  }

  async update(data: UpdateExamSessionData) {
    const session = await this.repo.findSessionById(data.id)
    if (!session) {
      throw new AppError(
        'Sesi ujian tidak ditemukan. Pastikan ID sesi benar.',
        404,
        'SESSION_NOT_FOUND',
      )
    }

    const startTime = data.startTime ?? session.startTime
    const endTime = data.endTime ?? session.endTime
    if (endTime <= startTime) {
      throw new AppError(
        'Jam selesai sesi harus setelah jam mulai sesi.',
        400,
        'SESSION_END_BEFORE_START',
        'endTime',
      )
    }

    if (startTime < session.exam.startDate) {
      throw new AppError(
        `Jam mulai sesi tidak boleh sebelum jadwal ujian dimulai (${session.exam.startDate.toISOString()}).`,
        400,
        'SESSION_START_BEFORE_EXAM',
        'startTime',
      )
    }
    if (endTime > session.exam.endDate) {
      throw new AppError(
        `Jam selesai sesi tidak boleh setelah jadwal ujian berakhir (${session.exam.endDate.toISOString()}).`,
        400,
        'SESSION_END_AFTER_EXAM',
        'endTime',
      )
    }

    if (data.startTime || data.endTime) {
      const overlapping = await this.repo.findOverlappingSessions(
        session.exam.id,
        startTime,
        endTime,
        session.id,
      )
      if (overlapping.length > 0) {
        const conflict = overlapping[0]
        throw new AppError(
          `Rentang waktu sesi bentrok dengan sesi "${conflict.name}". Pilih rentang di luar sesi tersebut.`,
          400,
          'SESSION_OVERLAP',
          'startTime',
        )
      }
    }

    try {
      const updated = await this.repo.updateSession(data.id, {
        ...(data.name !== undefined ? { name: data.name.trim() } : {}),
        ...(data.startTime !== undefined ? { startTime: data.startTime } : {}),
        ...(data.endTime !== undefined ? { endTime: data.endTime } : {}),
      })
      return { data: updated, message: 'Sesi berhasil diperbarui' }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AppError(
          'Nama sesi sudah dipakai pada ujian ini. Gunakan nama lain.',
          400,
          'SESSION_NAME_DUPLICATE',
          'name',
        )
      }
      throw error
    }
  }

  async remove(id: string) {
    const session = await this.repo.findSessionById(id)
    if (!session) {
      throw new AppError(
        'Sesi ujian tidak ditemukan. Pastikan ID sesi benar.',
        404,
        'SESSION_NOT_FOUND',
      )
    }

    await this.repo.deleteSession(id)
    return { data: null, message: 'Sesi berhasil dihapus' }
  }

  async assign(input: AssignTeamsToSessionData) {
    const session = await this.repo.findSessionById(input.sessionId)
    if (!session) {
      throw new AppError(
        'Sesi ujian tidak ditemukan. Pastikan ID sesi benar.',
        404,
        'SESSION_NOT_FOUND',
      )
    }

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
        `Tidak ada tim dengan nomor kode ${input.codeFrom}-${input.codeTo} yang terdaftar. Pastikan rentang kode benar dan pola kode tim sesuai (mis. OLM-001).`,
        400,
        'NO_TEAMS_IN_RANGE',
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
    if (deleted.count === 0) {
      throw new AppError(
        'Penugasan tim tidak ditemukan pada sesi ini. Mungkin sudah dihapus sebelumnya.',
        404,
        'TEAM_ASSIGNMENT_NOT_FOUND',
      )
    }
    return { data: null, message: 'Tim dikeluarkan dari sesi' }
  }
}
