import { useState, useCallback } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { saveAnswer, finishExam } from '~/server/exam-attempt'
import { getAllDoubts, clearAllDoubts } from '~/lib/exam/exam-local-storage'
import { ExamType } from '@prisma/client'
interface UseExamSubmitOptions {
  attemptId: string
  teamId: string
  examType:ExamType
}

export function useExamSubmit({ attemptId, teamId, examType }: UseExamSubmitOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const router = useRouter()

  const flushDoubtsAndFinish = useCallback(async () => {
    const doubts = getAllDoubts(attemptId)
    for (const { questionId, answer } of doubts) {
      await saveAnswer({ data: { attemptId, questionId, answer: answer ?? '', teamId } })
    }
    await finishExam({ data: { attemptId } })
    clearAllDoubts(attemptId)
  }, [attemptId, teamId])

  const submitManual = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await flushDoubtsAndFinish()
      if(examType == 'TRYOUT'){
        router.navigate({ to: `/dashboard/team/exam/result/$attemptId`, params: { attemptId } })
      }else{
        router.navigate({ to: `/dashboard/team`})
      }
    } catch {
      toast.error('Gagal mengumpulkan ujian. Coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }, [flushDoubtsAndFinish, router, attemptId])

  const submitAuto = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await flushDoubtsAndFinish()
      toast.success('Waktu habis, ujian dikumpulkan otomatis.')
      if(examType == 'TRYOUT'){
        router.navigate({ to: `/dashboard/team/exam/result/$attemptId`, params: { attemptId } })
      }else{
        router.navigate({ to: `/dashboard/team`})
      }
    } catch {
      toast.error('Gagal mengumpulkan ujian secara otomatis.')
    } finally {
      setIsSubmitting(false)
    }
  }, [flushDoubtsAndFinish, router, attemptId])

  return { isSubmitting, submitManual, submitAuto, showConfirmDialog, setShowConfirmDialog }
}
