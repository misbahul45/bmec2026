import { useRef } from 'react'
import { gsap } from 'gsap'
import type { WhyNode } from './data'

interface Props {
  node: WhyNode
  nodeId?: string
  className?: string
}

export function WhyCard({ node, nodeId, className = '' }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { Icon } = node

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el, {
      rotateY: x * 4,
      rotateX: -y * 4,
      scale: 1.03,
      duration: 0.3,
      ease: 'power2.out',
      boxShadow: '0 12px 40px color-mix(in srgb, var(--accent) 25%, transparent)',
    })
  }

  const onMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power3.out',
      boxShadow: 'none',
    })
  }

  if (node.highlight) {
    return (
      <div
        ref={cardRef}
        id={nodeId}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={`why-card w-full rounded-3xl p-6 md:p-8 border border-accent/60 bg-accent/40 shadow-lg cursor-default ${className}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent-foreground/10 flex items-center justify-center shrink-0">
            <Icon size={20} className="text-accent-foreground" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-foreground/60 block">
              Step {node.step}
            </span>
            <h3 className="text-lg font-bold text-accent-foreground leading-tight">{node.title}</h3>
          </div>
        </div>
        <p className="text-accent-foreground/70 text-sm leading-relaxed mb-5">{node.desc}</p>
        {node.highlightItems && (
          <div className="grid grid-cols-3 gap-2">
            {node.highlightItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1.5 bg-background border border-border rounded-xl px-2 py-3"
              >
                <item.Icon size={16} className="text-accent-foreground" />
                <span className="text-xs font-semibold text-foreground text-center leading-tight">{item.label}</span>
                <span className="text-[10px] text-muted-foreground">{item.sub}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (node.compItems) {
    return (
      <div
        ref={cardRef}
        id={nodeId}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={`why-card w-full rounded-2xl p-5 border border-border bg-background/90 shadow-sm cursor-default hover:border-accent/60 transition-colors duration-300 ${className}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
            <Icon size={16} className="text-accent-foreground" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block">Step {node.step}</span>
            <h3 className="text-base font-bold text-foreground leading-tight">{node.title}</h3>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{node.desc}</p>
        <div className="flex flex-col gap-2">
          {node.compItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-3">
              <item.Icon size={14} className="text-accent-foreground shrink-0" />
              <div>
                <span className="text-xs font-semibold text-foreground">{item.title}</span>
                <span className="text-[11px] text-muted-foreground ml-2">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      id={nodeId}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`why-card w-full rounded-2xl p-5 border border-border bg-background/90 shadow-sm cursor-default hover:border-accent/60 hover:shadow-md transition-all duration-300 ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
            <Icon size={16} className="text-accent-foreground" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Step {node.step}
          </span>
        </div>
        {node.badge && (
          <span className="text-[10px] font-bold uppercase tracking-wide bg-accent/20 text-accent-foreground border border-accent/30 rounded-full px-2.5 py-0.5 shrink-0">
            {node.badge}
          </span>
        )}
      </div>
      <h3 className="text-base font-bold text-foreground mb-1.5">{node.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{node.desc}</p>
    </div>
  )
}
