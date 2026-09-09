import { ExamEventType, Prisma } from '@prisma/client'
import { AppError } from '~/lib/utils/app-error'
import ExamAttemptRepo from './exam-attempt.repo'

const SUSPICIOUS_WEIGHTS: Record<ExamEventType, number> = {
  TAB_SWITCH: 20,
  WINDOW_BLUR: 10,
  WINDOW_FOCUS: 0,
  COPY: 15,
  PASTE: 15,
  FULLSCREEN_EXIT: 25,
  MULTIPLE_LOGIN: 50,
  NETWORK_CHANGE: 5,
  DEVTOOLS_OPEN: 40,
}

export default class ExamAttemptService {
  private repo = new ExamAttemptRepo()

  async startExam(input: {
    teamId: string
    examId: string
    deviceId: string
    ipAddress: string
    userAgent: string
  }) {
    const exam = await this.repo.findExamWindow(input.examId)
    if (!exam) throw new AppError('Ujian tidak ditemukan. Pastikan ID ujian benar.', 404, 'EXAM_NOT_FOUND')

    const now = new Date()

    if (exam.type === 'OLYMPIAD') {
      const sessionCount = await this.repo.countSessionsByExamId(input.examId)

      if (sessionCount === 0) {
        // Fallback: exam olimpiade belum punya sesi → window exam (D4)
        if (now < exam.startDate || now > exam.endDate) {
          throw new AppError('Ujian tidak dalam periode aktif. Periksa jadwal ujian pada dashboard.', 400, 'EXAM_NOT_IN_WINDOW')
        }
      } else {
        // Ada sesi: attempt baru hanya boleh dibuat dalam window sesi tim (D3).
        // Attempt yang sudah ada boleh resume melewati akhir sesi.
        const existingAttempt = await this.repo.findAttemptLite(
          input.teamId,
          input.examId,
        )

        if (!existingAttempt) {
          const assignment = await this.repo.findAssignment(
            input.teamId,
            input.examId,
          )

          if (!assignment) {
            throw new AppError('Tim belum di-assign ke sesi ujian. Hubungi admin untuk penugasan sesi.', 400, 'NOT_ASSIGNED_TO_SESSION')
          }
          if (now < assignment.session.startTime) {
            throw new AppError('Sesi ujian belum dimulai. Mohon tunggu hingga sesi dimulai.', 400, 'SESSION_NOT_STARTED')
          }
          if (now > assignment.session.endTime) {
            throw new AppError('Sesi ujian telah berakhir. Anda tidak dapat memulai ujian lagi.', 400, 'SESSION_ENDED')
          }
        }
      }
    } else if (now < exam.startDate || now > exam.endDate) {
      throw new AppError('Ujian tidak dalam periode aktif. Periksa jadwal ujian pada dashboard.', 400, 'EXAM_NOT_IN_WINDOW')
    }

    const attempt = await this.repo.upsertAttempt({
      ...input,
      startTime: now,
    })

    if (attempt.finished) throw new AppError('Ujian sudah selesai dikerjakan. Anda tidak dapat memulai lagi.', 400, 'EXAM_ALREADY_FINISHED')

    if (input.deviceId && attempt.deviceId && attempt.deviceId !== input.deviceId) {
      await this.repo.logEventAndUpdateAttempt(
        attempt.id,
        ExamEventType.MULTIPLE_LOGIN,
        {
          blockedDeviceId: input.deviceId,
          originalDeviceId: attempt.deviceId,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          timestamp: now.toISOString(),
        },
        SUSPICIOUS_WEIGHTS.MULTIPLE_LOGIN,
      )
      throw new AppError('Ujian sedang dikerjakan dari perangkat lain. Jika ini bukan Anda, hubungi admin.', 403, 'MULTIPLE_DEVICE_DETECTED')
    }

    return {
      data: attempt,
      alreadyStarted: attempt.startTime.getTime() !== now.getTime(),
    }
  }

  async getExamPreview(teamId: string, examId: string) {
    const exam = await this.repo.findExamPreview(examId)
    if (!exam) {
      throw new AppError('Ujian tidak ditemukan. Pastikan ID ujian benar.', 404, 'EXAM_NOT_FOUND')
    }

    const existingAttempt = await this.repo.findAttemptLite(teamId, examId)
    if (existingAttempt?.finished) {
      throw new AppError('Ujian sudah selesai dikerjakan. Anda tidak dapat memulai lagi.', 400, 'EXAM_ALREADY_FINISHED')
    }

    const now = new Date()

    if (exam.type === 'OLYMPIAD') {
      const sessionCount = await this.repo.countSessionsByExamId(examId)

      if (sessionCount === 0) {
        if (now < exam.startDate || now > exam.endDate) {
          throw new AppError('Ujian tidak dalam periode aktif. Periksa jadwal ujian pada dashboard.', 400, 'EXAM_NOT_IN_WINDOW')
        }
      } else if (!existingAttempt) {
        const assignment = await this.repo.findAssignment(teamId, examId)
        if (!assignment) {
          throw new AppError('Tim belum di-assign ke sesi ujian. Hubungi admin untuk penugasan sesi.', 400, 'NOT_ASSIGNED_TO_SESSION')
        }
        if (now < assignment.session.startTime) {
          throw new AppError('Sesi ujian belum dimulai. Mohon tunggu hingga sesi dimulai.', 400, 'SESSION_NOT_STARTED')
        }
        if (now > assignment.session.endTime) {
          throw new AppError('Sesi ujian telah berakhir. Anda tidak dapat memulai ujian lagi.', 400, 'SESSION_ENDED')
        }
      }
    } else if (now < exam.startDate || now > exam.endDate) {
      throw new AppError('Ujian tidak dalam periode aktif. Periksa jadwal ujian pada dashboard.', 400, 'EXAM_NOT_IN_WINDOW')
    }

    return {
      data: {
        examId: exam.id,
        examTitle: exam.title,
        stageName: exam.stage?.name ?? null,
        duration: exam.duration,
        totalQuestions: exam._count.questions,
      },
    }
  }

  async verifyDevice(input: {
    attemptId: string
    deviceId: string
    ipAddress: string
    userAgent: string
    teamId: string
  }) {
    const attempt = await this.repo.findAttemptById(input.attemptId)

    if (!attempt) return { allowed: false as const, reason: 'NOT_FOUND' as const }
    if (attempt.teamId !== input.teamId) {
      throw new AppError('Akses ditolak: Anda tidak memiliki izin untuk memverifikasi perangkat pada sesi ujian ini.', 403, 'ATTEMPT_ACCESS_DENIED')
    }
    if (attempt.finished) return { allowed: false as const, reason: 'FINISHED' as const }

    if (!attempt.deviceId) {
      await this.repo.updateDeviceId(attempt.id, input.deviceId, input.ipAddress, input.userAgent)
      return { allowed: true as const }
    }

    if (attempt.deviceId !== input.deviceId) {
      await this.repo.logEventAndUpdateAttempt(
        attempt.id,
        ExamEventType.MULTIPLE_LOGIN,
        {
          blockedDeviceId: input.deviceId,
          originalDeviceId: attempt.deviceId,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          timestamp: new Date().toISOString(),
        },
        SUSPICIOUS_WEIGHTS.MULTIPLE_LOGIN,
      )
      return { allowed: false as const, reason: 'DEVICE_LOCKED' as const }
    }

    return { allowed: true as const }
  }

  async resumeExam(teamId: string, examId: string) {
    const attempt = await this.repo.findAttemptWithSession(teamId, examId)
    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan. Mulai ujian terlebih dahulu.', 404, 'ATTEMPT_NOT_FOUND')
    if (attempt.finished) throw new AppError('Ujian sudah selesai dikerjakan. Anda tidak dapat melanjutkan.', 400, 'EXAM_ALREADY_FINISHED')

    const exam = await this.repo.findExamWindow(examId)
    if (!exam) throw new AppError('Ujian tidak ditemukan. Pastikan ID ujian benar.', 404, 'EXAM_NOT_FOUND')

    const deadlineFromStart = new Date(attempt.startTime.getTime() + exam.duration * 60 * 1000)
    let effectiveDeadline = deadlineFromStart < exam.endDate ? deadlineFromStart : exam.endDate

    // For OLYMPIAD with sessions, session endTime is a hard stop for new answers
    if (exam.type === 'OLYMPIAD' && attempt.session) {
      const sessionEnd = new Date(attempt.session.endTime)
      if (sessionEnd < effectiveDeadline) {
        effectiveDeadline = sessionEnd
      }
    }

    const remainingMs = effectiveDeadline.getTime() - Date.now()

    if (remainingMs <= 0) {
      await this.finishExam(attempt.id)
      throw new AppError('Waktu ujian telah habis. Ujian otomatis diselesaikan.', 400, 'TIME_EXPIRED')
    }

    return {
      data: {
        attempt,
        remainingSeconds: Math.floor(remainingMs / 1000),
        effectiveDeadline,
      },
    }
  }

  async getExamSession(teamId: string, examId: string) {
    const [attempt, exam] = await Promise.all([
      this.repo.findAttemptWithSession(teamId, examId),
      this.repo.findExamWithQuestions(examId),
    ])

    if (!exam) throw new AppError('Ujian tidak ditemukan. Pastikan ID ujian benar.', 404, 'EXAM_NOT_FOUND')
    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan. Mulai ujian terlebih dahulu sebelum mengakses halaman ini.', 404, 'ATTEMPT_NOT_FOUND')
    if (attempt.finished) throw new AppError('Ujian sudah selesai dikerjakan. Anda tidak dapat melanjutkan.', 400, 'EXAM_ALREADY_FINISHED')

    const deadlineFromStart = new Date(attempt.startTime.getTime() + exam.duration * 60 * 1000)
    let effectiveDeadline = deadlineFromStart < exam.endDate ? deadlineFromStart : exam.endDate

    // For OLYMPIAD with sessions, session endTime is a hard stop for new answers
    if (exam.type === 'OLYMPIAD' && attempt.session) {
      const sessionEnd = new Date(attempt.session.endTime)
      if (sessionEnd < effectiveDeadline) {
        effectiveDeadline = sessionEnd
      }
    }

    const remainingMs = effectiveDeadline.getTime() - Date.now()

    if (remainingMs <= 0) {
      await this.finishExam(attempt.id)
      throw new AppError('Waktu ujian telah habis. Ujian otomatis diselesaikan.', 400, 'TIME_EXPIRED')
    }

    return {
      data: {
        attemptId: attempt.id,
        remainingSeconds: Math.floor(remainingMs / 1000),
        effectiveDeadline,
        answers: attempt.answers,
        exam,
      },
    }
  }

  async saveAnswer(input: {
    attemptId: string
    questionId: string
    answer: string
    teamId: string
  }) {
    const [attempt, question] = await Promise.all([
      this.repo.findAttemptForAnswer(input.attemptId),
      this.repo.findQuestion(input.questionId),
    ])

    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan. Mulai ujian terlebih dahulu.', 404, 'ATTEMPT_NOT_FOUND')
    if (attempt.teamId !== input.teamId) throw new AppError('Akses ditolak: Anda tidak memiliki izin untuk sesi ujian ini.', 403, 'ATTEMPT_ACCESS_DENIED')
    if (attempt.finished) return { skipped: true, reason: 'EXAM_FINISHED' as const }

    if (!question) throw new AppError('Soal tidak ditemukan. Pastikan ID soal benar.', 404, 'QUESTION_NOT_FOUND')
    if (question.examId !== attempt.examId) throw new AppError('Soal tidak termasuk dalam ujian ini. Periksa kembali ID soal dan ujian.', 400, 'QUESTION_NOT_IN_EXAM')

    const deadlineFromStart = new Date(
      attempt.startTime.getTime() + attempt.exam.duration * 60 * 1000,
    )
    let effectiveDeadline =
      deadlineFromStart < attempt.exam.endDate
        ? deadlineFromStart
        : attempt.exam.endDate

    // For OLYMPIAD with sessions, session endTime is a hard stop
    if (attempt.exam.type === 'OLYMPIAD') {
      const assignment = await this.repo.findAssignment(input.teamId, attempt.examId)
      if (assignment) {
        const sessionEnd = new Date(assignment.session.endTime)
        if (sessionEnd < effectiveDeadline) {
          effectiveDeadline = sessionEnd
        }
      }
    }

    if (new Date() > effectiveDeadline) {
      await this.finishExam(attempt.id, attempt.teamId)
      return { skipped: true, reason: 'TIME_EXPIRED' as const }
    }

    const isEmpty = !input.answer || input.answer.trim() === ''
    const isCorrect = isEmpty ? false : question.correctAnswer === input.answer

    await this.repo.upsertAnswer({
      attemptId: input.attemptId,
      questionId: input.questionId,
      answer: input.answer ?? '',
      isCorrect,
    })

    return { skipped: false }
  }



  async finishExam(
    attemptId: string,
    expectedTeamId?: string,
  ) {
    const attempt = await this.repo.findAttemptForFinish(attemptId)

    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan. Pastikan ID attempt benar.', 404, 'ATTEMPT_NOT_FOUND')
    if (expectedTeamId && attempt.teamId !== expectedTeamId) {
      throw new AppError('Akses ditolak: Anda tidak memiliki izin untuk menyelesaikan ujian ini.', 403, 'ATTEMPT_ACCESS_DENIED')
    }
    if (attempt.finished) return { alreadyFinished: true, totalScore: null }

    const answersByQuestion = new Map(
      attempt.answers.map((answer) => [answer.questionId, answer]),
    )
    const totalScore = attempt.exam.questions.reduce((sum, question) => {
      const answer = answersByQuestion.get(question.id)
      const isEmpty = !answer?.answer || answer.answer.trim() === ''

      if (isEmpty) return sum + question.emptyScore
      const isCorrect = question.correctAnswer === answer.answer
      if (isCorrect) return sum + question.correctScore
      return sum + question.wrongScore
    }, 0)

    const updated = await this.repo.finishAttempt(attemptId, totalScore)

    if (updated.count === 0) {
      return { alreadyFinished: true, totalScore: null }
    }

    return { alreadyFinished: false, totalScore }
  }


  async getResult(attemptId: string, expectedTeamId?: string) {
    const attempt = await this.repo.findAttemptResult(attemptId)
    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan. Pastikan ID attempt benar.', 404, 'ATTEMPT_NOT_FOUND')
    if (expectedTeamId && attempt.teamId !== expectedTeamId) {
      throw new AppError('Akses ditolak: Anda tidak memiliki izin untuk melihat hasil ujian ini.', 403, 'ATTEMPT_ACCESS_DENIED')
    }
    if (!attempt.finished) throw new AppError('Ujian belum selesai. Hasil hanya tersedia setelah ujian diselesaikan.', 400, 'EXAM_NOT_FINISHED')
    if (attempt.exam.type === 'OLYMPIAD') {
      throw new AppError('Hasil detail olimpiade tidak tersedia untuk peserta. Hubungi admin untuk informasi skor.', 403, 'OLYMPIAD_RESULT_RESTRICTED')
    }
    return { data: attempt }
  }

  async getExamReview(examId: string, teamId: string) {
    const attempt = await this.repo.findReviewAttempt(teamId, examId)
    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan. Pastikan ID attempt benar.', 404, 'ATTEMPT_NOT_FOUND')
    if (!attempt.finished) throw new AppError('Ujian belum selesai dikerjakan. Pembahasan hanya tersedia setelah ujian selesai.', 400, 'EXAM_NOT_FINISHED')
    if (attempt.exam.type !== 'TRYOUT') throw new AppError('Pembahasan hanya tersedia untuk ujian tipe Tryout, bukan Olimpiade.', 403, 'REVIEW_TRYOUT_ONLY')

    return { data: attempt, message: 'Berhasil memuat pembahasan' }
  }

  async logEvent(input: {
    attemptId: string
    type: ExamEventType
    metadata?: Record<string, unknown>
    teamId: string
  }) {
    const attempt = await this.repo.findAttemptById(input.attemptId)
    if (!attempt || attempt.finished) return
    if (attempt.teamId !== input.teamId) {
      throw new AppError('Akses ditolak: Anda tidak memiliki izin untuk mencatat event pada sesi ujian ini.', 403, 'ATTEMPT_ACCESS_DENIED')
    }

    const weight = SUSPICIOUS_WEIGHTS[input.type] ?? 0

    await this.repo.logEventAndUpdateAttempt(
      input.attemptId,
      input.type,
      (input.metadata ?? {}) as Prisma.InputJsonValue,
      weight,
    )
  }

}
