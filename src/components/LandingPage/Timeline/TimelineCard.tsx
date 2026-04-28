import { useRef } from 'react'
import { gsap } from 'gsap'
import type { TimelineProcess } from './data'
import { accentMap, phaseColors } from './data'

interface Props {
  process: TimelineProcess
  dotId: string
}

export function TimelineCard({ process, dotId }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { Icon } = process
  const colors = accentMap[process.accent]

  const onMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -5,
      scale: 1.015,
      duration: 0.3,
      ease: 'power2.out',
    })
    const dot = document.getElementById(dotId)
    if (dot) {
      gsap.to(dot, { scale: 1.4, duration: 0.25, ease: 'back.out(2)' })
    }
  }

  const onMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power3.out',
    })
    const dot = document.getElementById(dotId)
    if (dot) {
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' })
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`timeline-card relative rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm cursor-default overflow-hidden ${colors.border}`}
    >
      <div className={`h-0.5 w-full ${colors.line}`} />

      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-9 h-9 rounded-xl ${colors.iconBg} flex items-center justify-center shrink-0`}>
            <Icon size={16} className={colors.iconText} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block leading-none mb-0.5">
              Kompetisi {process.processNum}
            </span>
            <h3 className="text-sm font-bold text-card-foreground leading-tight">{process.title}</h3>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wide border rounded-full px-2 py-0.5 shrink-0 ${colors.badge}`}>
            {process.events.length} tahap
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {process.events.map((ev, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-lg bg-muted/40 border border-border/60 px-3 py-2 group/ev hover:bg-muted/70 transition-colors"
            >
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
              <span className="text-[11px] font-semibold text-muted-foreground shrink-0 tabular-nums">
                {ev.date}
              </span>
              <span className="text-[11px] font-medium text-card-foreground leading-tight flex-1 truncate">
                {ev.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
