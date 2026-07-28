import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface ExamActionBarProps {
  isFirst: boolean
  isLast: boolean
  selectedAnswer: string | null
  onPrev: () => void
  onDoubt: () => void
  onSave: () => void
  isBusy?: boolean
}

export function ExamActionBar({
  isFirst,
  isLast,
  selectedAnswer,
  onPrev,
  onDoubt,
  onSave,
  isBusy = false,
}: ExamActionBarProps) {
  const hasAnswer = selectedAnswer !== null

  return (
    <div className="sticky bottom-0 bg-background border-t px-3 sm:px-6 py-3 grid grid-cols-3 items-center gap-2 sm:gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="rounded-xl gap-1.5 text-[11px] sm:text-xs min-h-10"
        onClick={onPrev}
        disabled={isFirst || isBusy}
      >
        <ChevronLeft size={14} />
        <span className="hidden sm:inline">Sebelumnya</span>
        <span className="sm:hidden">Kembali</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="rounded-xl gap-1.5 text-[11px] sm:text-xs text-amber-600 border-amber-500/40 hover:bg-amber-500/5 min-h-10"
        onClick={onDoubt}
        disabled={!hasAnswer || isBusy}
      >
        <HelpCircle size={14} />
        Ragu-ragu
      </Button>

      <Button
        size="sm"
        className="rounded-xl gap-1.5 text-[11px] sm:text-xs min-h-10"
        onClick={onSave}
        disabled={!hasAnswer || isBusy}
      >
        {isLast ? (
          'Simpan'
        ) : (
          <>
            Simpan & Lanjut
            <ChevronRight size={14} />
          </>
        )}
      </Button>
    </div>
  )
}
