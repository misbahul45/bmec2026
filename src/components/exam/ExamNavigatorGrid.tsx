import { AnswerStatus } from '~/hooks/exam/useExamAnswers'

interface ExamNavigatorGridProps {
  total: number
  currentIndex: number
  getStatus: (questionId: string) => AnswerStatus
  questionIds: string[]
  onNavigate: (index: number) => void
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
}: ExamNavigatorGridProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        const isActive = i === currentIndex
        const status = isActive ? 'active' : getStatus(questionIds[i] ?? '')
        return (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className={`h-8 w-8 rounded-lg border text-xs font-medium transition-colors ${statusStyles[status]}`}
          >
            {i + 1}
          </button>
        )
      })}
    </div>
  )
}
