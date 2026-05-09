import { Badge } from '~/components/ui/badge'
import { TipTapRenderer } from './TipTapRenderer'
import { ExamOptionList } from './ExamOptionList'
import { AnswerStatus } from '~/hooks/exam/useExamAnswers'
import { ExamQuestion } from '~/types/exam.type'

interface ExamQuestionViewProps {
  question: ExamQuestion
  currentIndex: number
  total: number
  status: AnswerStatus
  selectedAnswer: string | null
  onSelect: (answer: string) => void
}

const OPTIONS = ['A', 'B', 'C', 'D', 'E'] as const
type OptionKey = 'optionA' | 'optionB' | 'optionC' | 'optionD' | 'optionE'
const OPTION_KEYS: OptionKey[] = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE']

export function ExamQuestionView({
  question,
  currentIndex,
  total,
  status,
  selectedAnswer,
  onSelect,
}: ExamQuestionViewProps) {
  const options = OPTIONS.map((label, i) => ({
    label,
    content: question[OPTION_KEYS[i]],
  }))

  return (
    <div key={question.id} className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Soal {currentIndex + 1} dari {total}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Skor: {question.score} poin</p>
        </div>
        {status === 'doubt' && (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/50 text-[10px]">
            Ragu-ragu
          </Badge>
        )}
        {status === 'saved' && (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/50 text-[10px]">
            Sudah Dijawab
          </Badge>
        )}
      </div>

      <div className="rounded-xl border bg-muted/20 p-4">
        <TipTapRenderer content={question.question} />
      </div>

      <ExamOptionList
        options={options}
        selectedAnswer={selectedAnswer}
        onSelect={onSelect}
      />
    </div>
  )
}
