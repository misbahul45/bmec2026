import { Badge } from '~/components/ui/badge'

const EVENT_LABELS: Record<string, string> = {
  TAB_SWITCH: 'Tab Switch',
  WINDOW_BLUR: 'Window Blur',
  WINDOW_FOCUS: 'Window Focus',
  COPY: 'Copy',
  PASTE: 'Paste',
  FULLSCREEN_EXIT: 'Fullscreen Exit',
  MULTIPLE_LOGIN: 'Multiple Login',
  NETWORK_CHANGE: 'Network Change',
  DEVTOOLS_OPEN: 'DevTools Open',
}

const HIGH_RISK = ['COPY', 'PASTE', 'DEVTOOLS_OPEN', 'MULTIPLE_LOGIN']

export function EventTypeBadge({ type }: { type: string }) {
  const isHigh = HIGH_RISK.includes(type)
  return (
    <Badge variant={isHigh ? 'destructive' : 'outline'} className="font-mono text-[10px]">
      {EVENT_LABELS[type] ?? type}
    </Badge>
  )
}
