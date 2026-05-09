import { Clock } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { useExamTimer } from '~/hooks/exam/useExamTimer'
import { TIMER_WARNING_THRESHOLD, TIMER_CRITICAL_THRESHOLD } from '~/lib/exam/exam-constants'

interface ExamTimerProps {
  effectiveDeadline: Date
  onExpire: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function ExamTimer({ effectiveDeadline, onExpire }: ExamTimerProps) {
  const { remainingSeconds } = useExamTimer({ effectiveDeadline, onExpire })

  const isCritical = remainingSeconds <= TIMER_CRITICAL_THRESHOLD
  const isWarning = remainingSeconds <= TIMER_WARNING_THRESHOLD && !isCritical
  const isExpired = remainingSeconds === 0

  const containerClass = isCritical
    ? 'bg-destructive/10 border-destructive/30'
    : isWarning
      ? 'bg-amber-500/10 border-amber-500/30'
      : 'bg-muted/60 border-border'

  const textClass = isCritical
    ? 'text-destructive'
    : isWarning
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-foreground'

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${containerClass}`}>
      <Clock size={13} className={textClass} />
      <span className={`font-mono font-bold text-sm tabular-nums ${textClass} ${isCritical ? 'animate-pulse' : ''}`}>
        {isExpired ? 'Waktu Habis' : formatTime(remainingSeconds)}
      </span>
      {isCritical && !isExpired && (
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Hampir Habis</Badge>
      )}
      {isWarning && (
        <Badge className="text-[10px] px-1.5 py-0 bg-amber-500 text-white">Segera Habis</Badge>
      )}
    </div>
  )
}
