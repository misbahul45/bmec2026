import { TrendingUp, Star, Layers, ShieldAlert, BarChart2 } from 'lucide-react'

interface Props {
  insights: {
    mostActiveTeam: string
    mostPopularCompetition: string
    mostActiveStage: string
    flaggedAttempts: number
  }
  avgExamScore: number
}

export function InsightCards({ insights, avgExamScore }: Props) {
  const items = [
    { icon: Star, label: 'Kompetisi Terpopuler', value: insights.mostPopularCompetition },
    { icon: Layers, label: 'Stage Paling Aktif', value: insights.mostActiveStage },
    { icon: TrendingUp, label: 'Tim Paling Aktif', value: insights.mostActiveTeam },
    { icon: BarChart2, label: 'Rata-rata Skor Exam', value: String(avgExamScore) },
    { icon: ShieldAlert, label: 'Attempt Flagged', value: String(insights.flaggedAttempts) },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="border rounded-xl p-4 bg-card flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Icon size={13} />
            <span className="text-[10px] uppercase tracking-widest font-semibold">{label}</span>
          </div>
          <p className="text-sm font-bold text-foreground truncate">{value}</p>
        </div>
      ))}
    </div>
  )
}
