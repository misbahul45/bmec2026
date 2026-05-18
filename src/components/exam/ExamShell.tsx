import { useCallback, useEffect } from 'react'
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
import { saveAnswer } from '~/server/exam-attempt'
import { ExamQuestion } from '~/types/exam.type'
import { ExamType } from '@prisma/client'

interface ExamAttemptData {
  id: string
  startTime: string | Date
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
}

export function ExamShell({ attempt, exam, questions, teamId, examId }: ExamShellProps) {
  const deviceState = useDeviceVerification(attempt.id)

  const effectiveDeadline = (() => {
    const start = new Date(attempt.startTime)
    const deadlineFromStart = new Date(start.getTime() + exam.duration * 60 * 1000)
    const examEnd = new Date(exam.endDate)
    return deadlineFromStart < examEnd ? deadlineFromStart : examEnd
  })()

  const questionIds = questions.map((q) => q.id)

  const {
    answers,
    selectedAnswer,
    setSelectedAnswer,
    markAsSaved,
    rollbackAnswer,
    markAsDoubt,
    getStatus,
    getSummary,
    flushAndClear,
  } = useExamAnswers({
    attemptId: attempt.id,
    questionIds,
    dbAnswers: attempt.answers,
  })

  const { currentIndex, currentQuestion, goToNext, goToPrev, goToIndex, isFirst, isLast } =
    useExamNavigation(questions)

  const { isSubmitting, submitManual, submitAuto, showConfirmDialog, setShowConfirmDialog } =
    useExamSubmit({ attemptId: attempt.id, teamId, examType:exam.type, examId })

  useExamAntiCheat({ attemptId: attempt.id, isFinished: false })

  useEffect(() => {
    if (!currentQuestion) return
    const existing = answers[currentQuestion.id]
    setSelectedAnswer(existing?.answer ?? null)
  }, [currentIndex, currentQuestion?.id, answers, setSelectedAnswer])

  const handleDoubt = useCallback(() => {
    if (!currentQuestion) return
    const answerToSave = selectedAnswer ?? ''
    markAsDoubt(currentQuestion.id, answerToSave)
    goToNext()
  }, [currentQuestion, selectedAnswer, markAsDoubt, goToNext])

  const handleSave = useCallback(async () => {
    if (!currentQuestion) return
    const answerToSave = selectedAnswer ?? ''
    const previous = answers[currentQuestion.id]
    markAsSaved(currentQuestion.id, answerToSave)
    try {
      await saveAnswer({
        data: {
          attemptId: attempt.id,
          questionId: currentQuestion.id,
          answer: answerToSave,
          teamId,
        },
      })
    } catch {
      rollbackAnswer(currentQuestion.id, previous)
      toast.error('Gagal menyimpan jawaban. Coba lagi.')
      return
    }
    if (!isLast) goToNext()
  }, [currentQuestion, selectedAnswer, answers, attempt.id, teamId, markAsSaved, rollbackAnswer, isLast, goToNext])

  const handleExpire = useCallback(() => {
    submitAuto()
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
    <div className="flex flex-col min-h-screen">
      <ExamHeader
        examTitle={exam.title}
        stageName={exam.stage?.name ?? ''}
        answered={answered}
        total={questions.length}
        effectiveDeadline={effectiveDeadline}
        onExpire={handleExpire}
      />

      <div className="flex flex-1 overflow-hidden">
        <ExamSidebar
          total={questions.length}
          currentIndex={currentIndex}
          questionIds={questionIds}
          getStatus={getStatus}
          summary={summary}
          onNavigate={goToIndex}
          onSubmit={() => setShowConfirmDialog(true)}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <ExamQuestionView
            question={currentQuestion}
            currentIndex={currentIndex}
            total={questions.length}
            status={getStatus(currentQuestion.id)}
            selectedAnswer={selectedAnswer}
            onSelect={setSelectedAnswer}
          />

          <ExamActionBar
            isFirst={isFirst}
            isLast={isLast}
            selectedAnswer={selectedAnswer}
            onPrev={goToPrev}
            onDoubt={handleDoubt}
            onSave={handleSave}
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
