import { AnswerStatus } from '~/hooks/exam/useExamAnswers'

interface ExamNavigatorGridProps {
  total: number
  currentIndex: number
  getStatus: (questionId: string) => AnswerStatus
  questionIds: string[]
  onNavigate: (index: number) => void
  disabled?: boolean
}

const statusStyles: Record<AnswerStatus | 'active', string> = {
  unanswered: 'bg-muted border-muted-foreground/20 text-muted-foreground',
  saved: 'bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-400',
  doubt: 'bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-400',
  active: 'bg-primary border-primary text-primary-foreground',
}

export function ExamNavigatorGrid({
  total,
  currentIndex,
  getStatus,
  questionIds,
  onNavigate,
  disabled = false,
}: ExamNavigatorGridProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        const isActive = i === currentIndex
        const status = isActive ? 'active' : getStatus(questionIds[i] ?? '')
        return (
          <button
            key={i}
            type="button"
            onClick={() => onNavigate(i)}
            disabled={disabled}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Soal ${i + 1}, ${isActive ? 'aktif' : status === 'saved' ? 'sudah dijawab' : status === 'doubt' ? 'ragu-ragu' : 'belum dijawab'}`}
            className={`h-9 w-9 rounded-lg border text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${statusStyles[status]}`}
          >
            {i + 1}
          </button>
        )
      })}
    </div>
  )
}
