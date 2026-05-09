import { Badge } from '~/components/ui/badge'
import { Progress } from '~/components/ui/progress'
import { ExamTimer } from './ExamTimer'

interface ExamHeaderProps {
  examTitle: string
  stageName: string
  answered: number
  total: number
  effectiveDeadline: Date
  onExpire: () => void
}

export function ExamHeader({
  examTitle,
  stageName,
  answered,
  total,
  effectiveDeadline,
  onExpire,
}: ExamHeaderProps) {
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0

  return (
    <header className="sticky top-0 z-30 h-14 bg-background border-b flex items-center px-4 gap-3">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="font-semibold text-sm truncate">{examTitle}</span>
        <Badge variant="outline" className="text-[10px] shrink-0">{stageName}</Badge>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {answered} / {total} dijawab
        </span>
        <Progress value={percent} className="w-24 h-1.5" />
      </div>

      <ExamTimer effectiveDeadline={effectiveDeadline} onExpire={onExpire} />
    </header>
  )
}
