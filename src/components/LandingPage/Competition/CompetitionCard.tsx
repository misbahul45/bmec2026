import { Link } from '@tanstack/react-router'
import { Trophy, Medal, Award, BookOpen, UserPlus } from 'lucide-react'
import { accentTokens } from './data'

type AccentKey = keyof typeof accentTokens

const rankIcons = [Trophy, Medal, Award]
const rankColors = [
  'text-yellow-500',
  'text-slate-400',
  'text-amber-600',
]

type CompetitionCardProps = {
  comp: any
  index: number
}

const CompetitionCard = ({ comp, index }: CompetitionCardProps) => {
  const isEven = index % 2 === 0
  const tokens = accentTokens[comp.accent as AccentKey]
  const { Icon } = comp

  return (
    <div
      className={`comp-card flex flex-col md:flex-row rounded-2xl overflow-hidden border shadow-sm ${tokens.border}`}
    >
      <div
        className={`relative flex-1 min-h-64 ${
          !isEven ? 'md:order-2' : ''
        }`}
      >
        <img
          src={comp.image}
          alt={comp.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute top-3 left-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${tokens.bg}`}
          >
            <Icon size={14} className={tokens.text} />
          </div>
        </div>

        <div className="absolute bottom-3 left-3">
          <h3 className="text-white text-lg font-bold">
            {comp.title}
          </h3>
        </div>
      </div>

      <div className="flex-1 bg-card p-4 sm:p-5 flex flex-col gap-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {comp.desc}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {comp.registerFees.map((fee: string, idx: number) => (
            <span
              key={idx}
              className={`text-[10px] px-2 py-1 rounded-full border font-medium ${tokens.badge}`}
            >
              {fee}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          {comp.prizes.map((p: any, j: number) => {
            const RankIcon = rankIcons[j] || Award
            const color =
              rankColors[j] || 'text-muted-foreground'

            return (
              <div
                key={j}
                className="flex items-start gap-2 text-xs"
              >
                <RankIcon size={13} className={color} />

                <div className="leading-snug">
                  <span className="font-semibold">
                    {p.title}
                  </span>
                  <span className="text-muted-foreground">
                    {' '}
                    — {p.reward}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ACTION */}
        <div className="flex gap-2 flex-wrap mt-auto">
          <a
            href={comp.guideUrl}
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border ${tokens.badge}`}
          >
            <BookOpen size={11} />
            Guidebook
          </a>

          <Link
            to="/auth/register"
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground"
          >
            <UserPlus size={11} />
            Daftar
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CompetitionCard