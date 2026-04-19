import { Badge } from '~/components/ui/badge'

interface StatusGroup {
  label: string
  data: Record<string, number>
}

interface Props {
  groups: StatusGroup[]
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  APPROVED: 'bg-green-100 text-green-700 border-green-300',
  REJECTED: 'bg-red-100 text-red-700 border-red-300',
}

export function StatusCards({ groups }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {groups.map((g) => (
        <div key={g.label} className="border rounded-xl p-4 bg-card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{g.label}</p>
          <div className="flex flex-wrap gap-2">
            {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
              <div key={s} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[s]}`}>
                <span>{s}</span>
                <span className="font-bold">{g.data[s] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
