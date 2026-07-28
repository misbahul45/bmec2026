import { useState } from 'react'
import { Grid3x3, Send } from 'lucide-react'
import { AnswerStatus } from '~/hooks/exam/useExamAnswers'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { ExamNavigatorGrid } from './ExamNavigatorGrid'

interface ExamMobileToolbarProps {
  total: number
  currentIndex: number
  questionIds: string[]
  getStatus: (questionId: string) => AnswerStatus
  summary: { saved: number; doubt: number; unanswered: number }
  onNavigate: (index: number) => void
  onSubmit: () => void
  disabled?: boolean
}

export function ExamMobileToolbar({
  total,
  currentIndex,
  questionIds,
  getStatus,
  summary,
  onNavigate,
  onSubmit,
  disabled = false,
}: ExamMobileToolbarProps) {
  const [open, setOpen] = useState(false)

  const handleNavigate = (index: number) => {
    onNavigate(index)
    setOpen(false)
  }

  return (
    <div className="lg:hidden flex items-center justify-between gap-3 border-b bg-muted/20 px-3 py-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl min-h-9"
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          <Grid3x3 size={14} />
          Daftar Soal
        </Button>

        <DialogContent className="rounded-2xl max-h-[80dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Navigasi Soal</DialogTitle>
            <DialogDescription>
              {summary.saved} dijawab · {summary.doubt} ragu-ragu · {summary.unanswered} belum dijawab
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-2">
            <ExamNavigatorGrid
              total={total}
              currentIndex={currentIndex}
              questionIds={questionIds}
              getStatus={getStatus}
              onNavigate={handleNavigate}
              disabled={disabled}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-xl min-h-9 border-destructive/50 text-destructive hover:bg-destructive/5"
        onClick={onSubmit}
        disabled={disabled}
      >
        <Send size={14} />
        Kumpulkan
      </Button>
    </div>
  )
}
