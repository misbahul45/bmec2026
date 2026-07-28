import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useExamAnswers } from '~/hooks/exam/useExamAnswers'
import { useExamNavigation } from '~/hooks/exam/useExamNavigation'
import { useExamSubmit } from '~/hooks/exam/useExamSubmit'
import { useExamAntiCheat } from '~/hooks/exam/useExamAntiCheat'
import { useDeviceVerification } from '~/hooks/exam/useDeviceVerification'
import { ExamHeader } from './ExamHeader'
import { ExamSidebar } from './ExamSidebar'
import { ExamQuestionView } from './ExamQuestionView'
import { ExamActionBar } from './ExamActionBar'
import { ExamSubmitDialog } from './ExamSubmitDialog'
import { ExamDeviceLockScreen } from './ExamDeviceLockScreen'
import { ExamBlockedScreen } from './ExamBlockedScreen'
import { ExamMobileToolbar } from './ExamMobileToolbar'
import { saveAnswer } from '~/server/exam-attempt'
import { ExamQuestion } from '~/types/exam.type'
import { ExamType } from '@prisma/client'

interface ExamAttemptData {
  id: string
  deviceId: string | null
  answers: { questionId: string; answer: string }[]
}

interface ExamData {
  id: string
  title: string
  endDate: string | Date
  duration: number
  stage?: { name: string }
  type : ExamType
}

interface ExamShellProps {
  attempt: ExamAttemptData
  exam: ExamData
  questions: ExamQuestion[]
  teamId: string
  examId:string
  effectiveDeadline: Date
}

export function ExamShell({
  attempt,
  exam,
  questions,
  teamId,
  examId,
  effectiveDeadline,
}: ExamShellProps) {
  const deviceState = useDeviceVerification(attempt.id)
  const [isSaving, setIsSaving] = useState(false)

  const questionIds = questions.map((q) => q.id)

  const {
    answers,
    selectedAnswer,
    setSelectedAnswer,
    markAsSaved,
    markAsDoubt,
    getStatus,
    getSummary,
  } = useExamAnswers({
    attemptId: attempt.id,
    questionIds,
    dbAnswers: attempt.answers,
  })

  const { currentIndex, currentQuestion, goToNext, goToPrev, goToIndex, isFirst, isLast } =
    useExamNavigation(questions)

  const { isSubmitting, submitManual, submitAuto, showConfirmDialog, setShowConfirmDialog } =
    useExamSubmit({ attemptId: attempt.id, examType:exam.type, examId })

  useExamAntiCheat({
    enabled: exam.type === 'OLYMPIAD',
    attemptId: attempt.id,
    isFinished: isSubmitting,
  })

  useEffect(() => {
    if (!currentQuestion) return
    const existing = answers[currentQuestion.id]
    setSelectedAnswer(existing?.answer ?? null)
  }, [currentIndex, currentQuestion?.id, answers, setSelectedAnswer])

  const persistAnswer = useCallback(async (questionId: string, answer: string) => {
    const response = await saveAnswer({
      data: {
        attemptId: attempt.id,
        questionId,
        answer,
        teamId,
      },
    })

    const result = response.data as { skipped?: boolean; reason?: string } | undefined
    if (result?.skipped) {
      throw new Error(result.reason ?? 'ANSWER_NOT_SAVED')
    }
  }, [attempt.id, teamId])

  const handleDoubt = useCallback(async () => {
    if (!currentQuestion || !selectedAnswer || isSaving || isSubmitting) return

    setIsSaving(true)
    try {
      await persistAnswer(currentQuestion.id, selectedAnswer)
      markAsDoubt(currentQuestion.id, selectedAnswer)
      goToNext()
    } catch (error) {
      if (error instanceof Error && error.message === 'TIME_EXPIRED') {
        void submitAuto()
      } else {
        toast.error('Gagal menyimpan jawaban ragu-ragu. Coba lagi.')
      }
    } finally {
      setIsSaving(false)
    }
  }, [currentQuestion, selectedAnswer, isSaving, isSubmitting, persistAnswer, markAsDoubt, goToNext, submitAuto])

  const handleSave = useCallback(async () => {
    if (!currentQuestion || !selectedAnswer || isSaving || isSubmitting) return

    setIsSaving(true)
    try {
      await persistAnswer(currentQuestion.id, selectedAnswer)
      markAsSaved(currentQuestion.id, selectedAnswer)
      if (!isLast) goToNext()
    } catch (error) {
      if (error instanceof Error && error.message === 'TIME_EXPIRED') {
        void submitAuto()
      } else {
        toast.error('Gagal menyimpan jawaban. Coba lagi.')
      }
    } finally {
      setIsSaving(false)
    }
  }, [currentQuestion, selectedAnswer, isSaving, isSubmitting, persistAnswer, markAsSaved, isLast, goToNext, submitAuto])

  const hasUnsavedSelection = useCallback(() => {
    if (!currentQuestion) return false
    return selectedAnswer !== (answers[currentQuestion.id]?.answer ?? null)
  }, [answers, currentQuestion, selectedAnswer])

  const handleNavigate = useCallback((index: number) => {
    if (isSaving || isSubmitting) return
    if (hasUnsavedSelection()) {
      toast.warning('Simpan jawaban sebelum berpindah soal.')
      return
    }
    goToIndex(index)
  }, [goToIndex, hasUnsavedSelection, isSaving, isSubmitting])

  const handlePrev = useCallback(() => {
    if (isSaving || isSubmitting) return
    if (hasUnsavedSelection()) {
      toast.warning('Simpan jawaban sebelum berpindah soal.')
      return
    }
    goToPrev()
  }, [goToPrev, hasUnsavedSelection, isSaving, isSubmitting])

  const handleExpire = useCallback(() => {
    void submitAuto()
  }, [submitAuto])

  if (deviceState === 'device_locked') return <ExamDeviceLockScreen />
  if (deviceState === 'verifying') return <ExamBlockedScreen state="verifying" />
  if (deviceState === 'finished') return <ExamBlockedScreen state="finished" />
  if (deviceState === 'not_found') return <ExamBlockedScreen state="not_found" />

  if (!currentQuestion) return (
    <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
      Tidak ada soal tersedia untuk ujian ini.
    </div>
  )

  const summary = getSummary()
  const answered = summary.saved + summary.doubt

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <ExamHeader
        examTitle={exam.title}
        stageName={exam.stage?.name ?? ''}
        answered={answered}
        total={questions.length}
        effectiveDeadline={effectiveDeadline}
        onExpire={handleExpire}
      />

      <ExamMobileToolbar
        total={questions.length}
        currentIndex={currentIndex}
        questionIds={questionIds}
        getStatus={getStatus}
        summary={summary}
        onNavigate={handleNavigate}
        onSubmit={() => setShowConfirmDialog(true)}
        disabled={isSaving || isSubmitting}
      />

      <div className="flex flex-1 overflow-hidden">
        <ExamSidebar
          total={questions.length}
          currentIndex={currentIndex}
          questionIds={questionIds}
          getStatus={getStatus}
          summary={summary}
          onNavigate={handleNavigate}
          onSubmit={() => setShowConfirmDialog(true)}
          disabled={isSaving || isSubmitting}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <ExamQuestionView
            question={currentQuestion}
            currentIndex={currentIndex}
            total={questions.length}
            status={getStatus(currentQuestion.id)}
            selectedAnswer={selectedAnswer}
            onSelect={setSelectedAnswer}
            disabled={isSaving || isSubmitting}
          />

          <ExamActionBar
            isFirst={isFirst}
            isLast={isLast}
            selectedAnswer={selectedAnswer}
            onPrev={handlePrev}
            onDoubt={handleDoubt}
            onSave={handleSave}
            isBusy={isSaving || isSubmitting}
          />
        </div>
      </div>

      <ExamSubmitDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        summary={summary}
        isSubmitting={isSubmitting}
        onConfirm={submitManual}
      />
    </div>
  )
}
