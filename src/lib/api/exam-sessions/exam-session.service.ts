import { Prisma } from '@prisma/client'
import { AppError } from '~/lib/utils/app-error'
import { prisma } from '~/lib/utils/prisma'
import ExamSessionRepo from './exam-session.repo'
import type {
  AssignTeamsToSessionData,
  CreateExamSessionData,
  SetTeamsByNamesData,
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

  async setTeamsByNames(payload: SetTeamsByNamesData) {
    const exam = await this.repo.findExamByLookup({
      competitionName: payload.examLookup.competition,
      stageName: payload.examLookup.stage,
      type: payload.examLookup.type,
    })
    if (!exam) {
      throw new AppError(
        `Ujian dengan competition="${payload.examLookup.competition}", stage="${payload.examLookup.stage}", type="${payload.examLookup.type}" tidak ditemukan. Periksa kembali triplet exam.`,
        404,
        'EXAM_NOT_FOUND',
        'examLookup',
      )
    }

    const sessionsMeta = await this.repo.findSessionsMetaByExamId(exam.id)
    const sessionByName = new Map(sessionsMeta.map((s) => [s.name, s.id]))

    const uniqueSessionNames = new Set(payload.assignments.map((a) => a.sessionName))
    for (const name of uniqueSessionNames) {
      if (!sessionByName.has(name)) {
        throw new AppError(
          `Sesi "${name}" tidak ditemukan pada ujian "${exam.title}". Sesi yang tersedia: ${sessionsMeta.map((s) => `"${s.name}"`).join(', ') || '(kosong)'}.`,
          404,
          'SESSION_NOT_FOUND',
          'sessionName',
        )
      }
    }

    const candidates = await this.repo.findTeamsByNameSchool(
      payload.assignments.map((a) => ({
        teamName: a.teamName,
        schoolName: a.schoolName,
      })),
    )

    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
    const byKey = new Map<string, Array<(typeof candidates)[number]>>()
    for (const c of candidates) {
      const k = `${norm(c.name)}|${norm(c.schoolName)}`
      if (!byKey.has(k)) byKey.set(k, [])
      byKey.get(k)!.push(c)
    }

    type Resolved = {
      teamId: string
      sessionId: string
      sessionName: string
      teamName: string
      schoolName: string
    }
    const notFound: Array<{
      teamName: string
      schoolName: string
      sessionName: string
      reason: 'TEAM_NOT_FOUND' | 'AMBIGUOUS'
      matches?: Array<{ id: string; code: string; name: string; schoolName: string }>
    }> = []
    const resolved: Resolved[] = []

    for (const a of payload.assignments) {
      const k = `${norm(a.teamName)}|${norm(a.schoolName)}`
      let matches = byKey.get(k) ?? []

      if (matches.length === 0) {
        notFound.push({ ...a, reason: 'TEAM_NOT_FOUND' })
        continue
      }

      if (matches.length > 1) {
        const olm = matches.find((m) => m.code.startsWith('olm-'))
        if (olm) {
          matches = [olm]
        } else {
          notFound.push({
            ...a,
            reason: 'AMBIGUOUS',
            matches: matches.map((m) => ({
              id: m.id,
              code: m.code,
              name: m.name,
              schoolName: m.schoolName,
            })),
          })
          continue
        }
      }

      resolved.push({
        teamId: matches[0].id,
        sessionId: sessionByName.get(a.sessionName)!,
        sessionName: a.sessionName,
        teamName: a.teamName,
        schoolName: a.schoolName,
      })
    }

    let added = 0
    let moved = 0
    let skipped = 0

    if (resolved.length > 0) {
      await prisma.$transaction(async (tx) => {
        for (const r of resolved) {
          const existing = await tx.examSessionTeam.findUnique({
            where: {
              teamId_examId: { teamId: r.teamId, examId: exam.id },
            },
            select: { id: true, sessionId: true },
          })

          if (!existing) {
            await tx.examSessionTeam.create({
              data: {
                teamId: r.teamId,
                examId: exam.id,
                sessionId: r.sessionId,
              },
            })
            added += 1
            continue
          }

          if (existing.sessionId === r.sessionId) {
            skipped += 1
            continue
          }

          await tx.examSessionTeam.update({
            where: { id: existing.id },
            data: { sessionId: r.sessionId },
          })
          moved += 1
        }
      })
    }

    return {
      data: {
        exam: { id: exam.id, title: exam.title },
        summary: {
          added,
          moved,
          skipped,
          notFoundCount: notFound.length,
          totalRequested: payload.assignments.length,
        },
        notFound,
      },
      message: `Penugasan selesai: ${added} ditambah, ${moved} dipindah, ${skipped} sudah sesuai, ${notFound.length} tidak ditemukan.`,
    }
  }
}
