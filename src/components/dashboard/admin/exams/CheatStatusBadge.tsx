import { Badge } from '~/components/ui/badge'
import { ShieldAlert, ShieldCheck } from 'lucide-react'

export function CheatStatusBadge({ flagged, cheatCount }: { flagged: boolean; cheatCount: number }) {
  if (flagged) {
    return (
      <Badge variant="destructive" className="gap-1">
        <ShieldAlert className="size-3" />
        Flagged ({cheatCount})
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 text-green-600 border-green-300">
      <ShieldCheck className="size-3" />
      Normal
    </Badge>
  )
}
