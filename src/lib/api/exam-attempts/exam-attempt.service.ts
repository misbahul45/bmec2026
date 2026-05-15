import { ExamEventType, Prisma } from '@prisma/client'
import { prisma } from '~/lib/utils/prisma'
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

    const existing = await this.repo.findAttempt(input.teamId, input.examId)

    if (existing) {
      if (existing.finished) throw new AppError('Ujian sudah selesai dikerjakan', 400)

      if (input.deviceId && existing.deviceId && existing.deviceId !== input.deviceId) {
        await prisma.$transaction((tx) =>
          this.repo.logEventAndUpdateAttempt(
            tx,
            existing.id,
            ExamEventType.MULTIPLE_LOGIN,
            {
              blockedDeviceId: input.deviceId,
              originalDeviceId: existing.deviceId,
              ipAddress: input.ipAddress,
              userAgent: input.userAgent,
              timestamp: now.toISOString(),
            },
            SUSPICIOUS_WEIGHTS.MULTIPLE_LOGIN,
          ),
        )
        throw new AppError('Ujian sedang dikerjakan dari perangkat lain', 403)
      }

      return { data: existing, alreadyStarted: true }
    }

    try {
      const attempt = await this.repo.createAttempt({
        ...input,
        deviceId: '',
      })
      return { data: attempt, alreadyStarted: false }
    } catch (err: any) {
      if (err?.code === 'P2002') {
        const retry = await this.repo.findAttempt(input.teamId, input.examId)
        if (!retry) throw new AppError('Gagal memulai ujian', 500)

        if (input.deviceId && retry.deviceId && retry.deviceId !== input.deviceId) {
          await prisma.$transaction((tx) =>
            this.repo.logEventAndUpdateAttempt(
              tx,
              retry.id,
              ExamEventType.MULTIPLE_LOGIN,
              {
                blockedDeviceId: input.deviceId,
                originalDeviceId: retry.deviceId,
                ipAddress: input.ipAddress,
                userAgent: input.userAgent,
                timestamp: new Date().toISOString(),
              },
              SUSPICIOUS_WEIGHTS.MULTIPLE_LOGIN,
            ),
          )
          throw new AppError('Ujian sedang dikerjakan dari perangkat lain', 403)
        }

        return { data: retry, alreadyStarted: true }
      }
      throw err
    }
  }

  async verifyDevice(input: {
    attemptId: string
    deviceId: string
    ipAddress: string
    userAgent: string
  }) {
    const attempt = await this.repo.findAttemptById(input.attemptId)

    if (!attempt) return { allowed: false as const, reason: 'NOT_FOUND' as const }
    if (attempt.finished) return { allowed: false as const, reason: 'FINISHED' as const }

    if (!attempt.deviceId) {
      await this.repo.updateDeviceId(attempt.id, input.deviceId, input.ipAddress, input.userAgent)
      return { allowed: true as const }
    }

    if (attempt.deviceId !== input.deviceId) {
      await prisma.$transaction((tx) =>
        this.repo.logEventAndUpdateAttempt(
          tx,
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
        ),
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
    const attempt = await this.repo.findAttemptById(input.attemptId)
    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan', 404)
    if (attempt.finished) return { skipped: true, reason: 'EXAM_FINISHED' as const }

    const timeOk = await this.guardExamTime(input.attemptId, attempt.examId, attempt.startTime)
    if (!timeOk) return { skipped: true, reason: 'TIME_EXPIRED' as const }

    const question = await this.repo.findQuestion(input.questionId)
    if (!question) throw new AppError('Soal tidak ditemukan', 404)
    if (question.examId !== attempt.examId) throw new AppError('Soal tidak termasuk dalam ujian ini', 400)

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
    attemptId: string
  ) {
    return prisma.$transaction(
      async (tx) => {
        const attempt =
          await this.repo.findAttemptForFinish(
            tx,
            attemptId
          )

        if (!attempt) {
          throw new AppError(
            'Sesi ujian tidak ditemukan',
            404
          )
        }

        if (attempt.finished) {
          return {
            alreadyFinished: true,
            totalScore: null,
          }
        }

        const totalScore =
          attempt.answers.reduce(
            (
              sum,
              answer
            ) => {
              const question =
                answer.question

              const isEmpty =
                !answer.answer ||
                answer.answer.trim() === ''

              if (isEmpty) {
                return (
                  sum +
                  question.emptyScore
                )
              }

              if (
                answer.isCorrect
              ) {
                return (
                  sum +
                  question.correctScore
                )
              }

              return (
                sum +
                question.wrongScore
              )
            },
            0
          )

        await this.repo.finishAttempt(
          tx,
          attemptId,
          totalScore
        )

        return {
          alreadyFinished: false,
          totalScore,
        }
      },
      {
        maxWait: 5000,
        timeout: 15000,
      }
    )
  }


  async getResult(attemptId: string) {
    const attempt = await this.repo.findAttemptResult(attemptId)
    if (!attempt) throw new AppError('Sesi ujian tidak ditemukan', 404)
    if (!attempt.finished) throw new AppError('Ujian belum selesai', 400)
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
  }) {
    const attempt = await this.repo.findAttemptById(input.attemptId)
    if (!attempt || attempt.finished) return

    const weight = SUSPICIOUS_WEIGHTS[input.type] ?? 0

    await prisma.$transaction((tx) =>
      this.repo.logEventAndUpdateAttempt(
        tx,
        input.attemptId,
        input.type,
        (input.metadata ?? {}) as Prisma.InputJsonValue,
        weight,
      ),
    )
  }

  private async guardExamTime(attemptId: string, examId: string, startTime: Date): Promise<boolean> {
    const exam = await this.repo.findExamWindow(examId)
    if (!exam) return false

    const deadlineFromStart = new Date(startTime.getTime() + exam.duration * 60 * 1000)
    const effectiveDeadline = deadlineFromStart < exam.endDate ? deadlineFromStart : exam.endDate

    if (new Date() > effectiveDeadline) {
      await this.finishExam(attemptId)
      return false
    }

    return true
  }
}
