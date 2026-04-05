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
      y: -6,
      scale: 1.02,
      boxShadow: '0 16px 40px color-mix(in srgb, var(--primary) 12%, transparent)',
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const onMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: 'none',
      duration: 0.4,
      ease: 'power3.out',
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`timeline-card relative rounded-2xl border bg-card shadow-sm cursor-default overflow-hidden ${colors.border}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className={`h-1 w-full ${colors.line}`} />

      <div className="p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className={`w-7 h-7 rounded-lg ${colors.iconBg} flex items-center justify-center shrink-0`}>
            <Icon size={14} className={colors.iconText} />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block leading-none">
              Process {process.processNum}
            </span>
            <h3 className="text-sm font-bold text-card-foreground leading-tight">{process.title}</h3>
          </div>
          <span className={`ml-auto text-[10px] font-bold uppercase tracking-wide border rounded-full px-2 py-0.5 shrink-0 ${colors.badge}`}>
            {process.events.length} tahap
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {process.events.map((ev, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-xl bg-muted/50 border border-border px-3 py-2"
            >
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
              <span className="text-[11px] font-semibold text-muted-foreground w-[88px] shrink-0">
                {ev.date}
              </span>
              <span className="text-[11px] font-medium text-card-foreground leading-tight flex-1">
                {ev.label}
              </span>
              <span className={`text-[9px] font-bold uppercase border rounded-full px-1.5 py-0.5 shrink-0 ${phaseColors[ev.phase]}`}>
                {ev.phase}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
