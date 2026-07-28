import { useState, useCallback, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { finishExam } from '~/server/exam-attempt'
import { clearAllDoubts } from '~/lib/exam/exam-local-storage'
import { ExamType } from '@prisma/client'
interface UseExamSubmitOptions {
  attemptId: string
  examType:ExamType
  examId:string
}

export function useExamSubmit({ attemptId, examType, examId }: UseExamSubmitOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const router = useRouter()
  const submissionRef = useRef<Promise<void> | null>(null)

  const flushDoubtsAndFinish = useCallback(async () => {
    await finishExam({ data: { attemptId } })
    clearAllDoubts(attemptId)
  }, [attemptId])

  const runSubmission = useCallback(() => {
    if (!submissionRef.current) {
      submissionRef.current = flushDoubtsAndFinish().finally(() => {
        submissionRef.current = null
      })
    }

    return submissionRef.current
  }, [flushDoubtsAndFinish])

  const goToCompletion = useCallback(() => {
    if (examType === 'TRYOUT') {
      return router.navigate({
        to: '/dashboard/team/exam/$examId/review',
        params: { examId },
      })
    }

    return router.navigate({ to: '/dashboard/team' })
  }, [examId, examType, router])

  const submitManual = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await runSubmission()
      await goToCompletion()
    } catch {
      toast.error('Gagal mengumpulkan ujian. Coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }, [goToCompletion, runSubmission])

  const submitAuto = useCallback(async () => {
    setIsSubmitting(true)
    try {
      let lastError: unknown

      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          await runSubmission()
          toast.success('Waktu habis, ujian dikumpulkan otomatis.')
          await goToCompletion()
          return
        } catch (error) {
          lastError = error
          if (attempt < 3) {
            await new Promise((resolve) => window.setTimeout(resolve, (attempt + 1) * 1000))
          }
        }
      }

      throw lastError
    } catch {
      toast.error('Koneksi bermasalah. Pengumpulan otomatis belum berhasil, silakan coba Kumpulkan Ujian.', {
        duration: 10_000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [goToCompletion, runSubmission])

  return { isSubmitting, submitManual, submitAuto, showConfirmDialog, setShowConfirmDialog }
}
