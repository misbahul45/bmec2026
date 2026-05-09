import { Grid3x3 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { ExamNavigatorGrid } from './ExamNavigatorGrid'
import { AnswerStatus } from '~/hooks/exam/useExamAnswers'

interface ExamSidebarProps {
  total: number
  currentIndex: number
  questionIds: string[]
  getStatus: (questionId: string) => AnswerStatus
  summary: { saved: number; doubt: number; unanswered: number }
  onNavigate: (index: number) => void
  onSubmit: () => void
}

export function ExamSidebar({
  total,
  currentIndex,
  questionIds,
  getStatus,
  summary,
  onNavigate,
  onSubmit,
}: ExamSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r bg-muted/20 h-full overflow-y-auto">
      <div className="p-4 space-y-4 flex-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <Grid3x3 size={13} />
          Navigasi Soal
        </div>

        <ExamNavigatorGrid
          total={total}
          currentIndex={currentIndex}
          questionIds={questionIds}
          getStatus={getStatus}
          onNavigate={onNavigate}
        />

        <Separator />

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-muted-foreground">{summary.saved} dijawab</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-muted-foreground">{summary.doubt} ragu-ragu</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40 shrink-0" />
            <span className="text-muted-foreground">{summary.unanswered} belum dijawab</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-xl text-xs border-destructive/50 text-destructive hover:bg-destructive/5"
          onClick={onSubmit}
        >
          Submit Ujian
        </Button>
      </div>
    </aside>
  )
}
