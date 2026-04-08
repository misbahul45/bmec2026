import { ChevronDown } from 'lucide-react'
import { cn } from '~/lib/utils'
import { CompetitionType, competitionTypes } from '~/schemas/auth.schema'

const labels: Record<CompetitionType, string> = {
  OLIMPIADE: 'Olimpiade',
  LKTI: 'LKTI — Lomba Karya Tulis Ilmiah',
  INFOGRAFIS: 'Infografis',
}

interface Props {
  value: CompetitionType | ''
  onChange: (val: CompetitionType) => void
  error?: boolean
}

export function CompetitionSelect({ value, onChange, error }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CompetitionType)}
        aria-invalid={error}
        className={cn(
          'w-full h-8 appearance-none rounded border border-border bg-background px-2.5 pr-8 text-xs',
          'focus:outline-none focus:ring-1 focus:ring-ring/50 focus:border-ring',
          'text-foreground',
          !value && 'text-muted-foreground',
          error && 'border-destructive ring-1 ring-destructive/20'
        )}
      >
        <option value="" disabled>Pilih jenis lomba</option>
        {competitionTypes.map((t) => (
          <option key={t} value={t}>{labels[t]}</option>
        ))}
      </select>
      <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
    </div>
  )
}
