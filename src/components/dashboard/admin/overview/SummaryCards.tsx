import { Users, UserCheck, ShieldCheck, Trophy, ClipboardList, FileText, BookOpen, ScrollText } from 'lucide-react'

const CARD_DEFS = [
  { key: 'teams', label: 'Total Tim', icon: Users },
  { key: 'members', label: 'Total Member', icon: UserCheck },
  { key: 'admins', label: 'Total Admin', icon: ShieldCheck },
  { key: 'competitions', label: 'Kompetisi', icon: Trophy },
  { key: 'registrations', label: 'Registrasi', icon: ClipboardList },
  { key: 'submissions', label: 'Submission', icon: FileText },
  { key: 'attempts', label: 'Exam Attempt', icon: BookOpen },
  { key: 'abstracts', label: 'Abstract', icon: ScrollText },
] as const

interface Props {
  counts: Record<string, number>
}

export function SummaryCards({ counts }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {CARD_DEFS.map(({ key, label, icon: Icon }) => (
        <div key={key} className="border rounded-xl p-4 bg-card flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground leading-none">{counts[key] ?? 0}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
