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
    if (!exam) throw new AppError('Ujian tidak ditemukan', 404)

    const now = new Date()
    if (now < exam.startDate || now > exam.endDate) {
      throw new AppError('Ujian tidak dalam periode aktif', 400)
    }

    const attempt = await this.repo.upsertAttempt({
      ...input,
      deviceId: '',
      startTime: now,
    })

    if (attempt.finished) throw new AppError('Ujian sudah selesai dikerjakan', 400)

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
      throw new AppError('Ujian sedang dikerjakan dari perangkat lain', 403)
    }

    return {
      data: attempt,
      alreadyStarted: attempt.startTime.getTime() !== now.getTime(),
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
      throw new AppError('Akses ujian ditolak', 403)
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
    const attempt = await this.repo.findAttemptWithAnswers(teamId, examId)
    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan', 404)
    if (attempt.finished) throw new AppError('Ujian sudah selesai dikerjakan', 400)

    const exam = await this.repo.findExamWindow(examId)
    if (!exam) throw new AppError('Ujian tidak ditemukan', 404)

    const deadlineFromStart = new Date(attempt.startTime.getTime() + exam.duration * 60 * 1000)
    const effectiveDeadline = deadlineFromStart < exam.endDate ? deadlineFromStart : exam.endDate
    const remainingMs = effectiveDeadline.getTime() - Date.now()

    if (remainingMs <= 0) {
      await this.finishExam(attempt.id)
      throw new AppError('Waktu ujian telah habis', 400)
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
      this.repo.findAttemptWithAnswers(teamId, examId),
      this.repo.findExamWithQuestions(examId),
    ])

    if (!exam) throw new AppError('Ujian tidak ditemukan', 404)
    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan. Mulai ujian terlebih dahulu', 404)
    if (attempt.finished) throw new AppError('Ujian sudah selesai dikerjakan', 400)

    const deadlineFromStart = new Date(attempt.startTime.getTime() + exam.duration * 60 * 1000)
    const effectiveDeadline = deadlineFromStart < exam.endDate ? deadlineFromStart : exam.endDate
    const remainingMs = effectiveDeadline.getTime() - Date.now()

    if (remainingMs <= 0) {
      await this.finishExam(attempt.id)
      throw new AppError('Waktu ujian telah habis', 400)
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

    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan', 404)
    if (attempt.teamId !== input.teamId) throw new AppError('Akses ujian ditolak', 403)
    if (attempt.finished) return { skipped: true, reason: 'EXAM_FINISHED' as const }

    if (!question) throw new AppError('Soal tidak ditemukan', 404)
    if (question.examId !== attempt.examId) throw new AppError('Soal tidak termasuk dalam ujian ini', 400)

    const deadlineFromStart = new Date(
      attempt.startTime.getTime() + attempt.exam.duration * 60 * 1000,
    )
    const effectiveDeadline =
      deadlineFromStart < attempt.exam.endDate
        ? deadlineFromStart
        : attempt.exam.endDate

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

    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan', 404)
    if (expectedTeamId && attempt.teamId !== expectedTeamId) {
      throw new AppError('Akses ujian ditolak', 403)
    }
    if (attempt.finished) return { alreadyFinished: true, totalScore: null }

    const answersByQuestion = new Map(
      attempt.answers.map((answer) => [answer.questionId, answer]),
    )
    const totalScore = attempt.exam.questions.reduce((sum, question) => {
      const answer = answersByQuestion.get(question.id)
      const isEmpty = !answer?.answer || answer.answer.trim() === ''

      if (isEmpty) return sum + question.emptyScore
      if (answer.isCorrect) return sum + question.correctScore
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
    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan', 404)
    if (expectedTeamId && attempt.teamId !== expectedTeamId) {
      throw new AppError('Akses ujian ditolak', 403)
    }
    if (!attempt.finished) throw new AppError('Ujian belum selesai', 400)
    if (attempt.exam.type === 'OLYMPIAD') {
      throw new AppError('Hasil detail olimpiade tidak tersedia untuk peserta', 403)
    }
    return { data: attempt }
  }

  async getExamReview(examId: string, teamId: string) {
    const attempt = await this.repo.findReviewAttempt(teamId, examId)
    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan', 404)
    if (!attempt.finished) throw new AppError('Ujian belum selesai dikerjakan', 400)
    if (attempt.exam.type !== 'TRYOUT') throw new AppError('Pembahasan hanya tersedia untuk Tryout', 403)

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
      throw new AppError('Akses ujian ditolak', 403)
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
