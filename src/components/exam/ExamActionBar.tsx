import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface ExamActionBarProps {
  isFirst: boolean
  isLast: boolean
  selectedAnswer: string | null
  onPrev: () => void
  onDoubt: () => void
  onSave: () => void
}

export function ExamActionBar({
  isFirst,
  isLast,
  selectedAnswer,
  onPrev,
  onDoubt,
  onSave,
}: ExamActionBarProps) {
  const hasAnswer = selectedAnswer !== null

  return (
    <div className="sticky bottom-0 bg-background border-t px-6 py-3 flex items-center justify-between gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="rounded-xl gap-1.5 text-xs"
        onClick={onPrev}
        disabled={isFirst}
      >
        <ChevronLeft size={14} />
        Sebelumnya
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="rounded-xl gap-1.5 text-xs text-amber-600 border-amber-500/40 hover:bg-amber-500/5"
        onClick={onDoubt}
        disabled={!hasAnswer}
      >
        <HelpCircle size={14} />
        Ragu-ragu
      </Button>

      <Button
        size="sm"
        className="rounded-xl gap-1.5 text-xs"
        onClick={onSave}
        disabled={!hasAnswer}
      >
        {isLast ? 'Simpan' : (
          <>
            Simpan & Lanjut
            <ChevronRight size={14} />
          </>
        )}
      </Button>
    </div>
  )
}
