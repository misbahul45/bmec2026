import React, { useEffect, useRef } from 'react'
import {
  School,
  Mail,
  Phone,
  MapPin,
  Trophy,
  BookOpen,
  Info as InfoIcon,
  GraduationCap,
} from 'lucide-react'
import gsap from 'gsap'
import { TeamWithRelations } from '~/types/team.type'
import { Badge } from '~/components/ui/badge'

type Props = {
  data: TeamWithRelations & {
    mentor?: {
      name: string
      email: string
      phone: string
    } | null
  }
}

const competitionLabel: Record<string, string> = {
  OLIMPIADE: 'Olimpiade',
  LKTI: 'LKTI',
  INFOGRAFIS: 'Infografis',
}

const competitionColor: Record<string, string> = {
  OLIMPIADE: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  LKTI: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  INFOGRAFIS: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
}

const NodeCard: React.FC<{
  className?: string
  topLabel: React.ReactNode
  name: string
  sub?: string | null
  phone?: string | null
  extra?: React.ReactNode
  glow?: boolean
  isKetua?: boolean
}> = ({ className = '', topLabel, name, sub, phone, extra, glow, isKetua }) => (
  <div
    className={`relative flex flex-col items-center gap-1.5 px-5 py-4 sm:px-6 sm:py-5 rounded-2xl border backdrop-blur-sm
      bg-background/70 shadow-lg transition-all duration-300 select-none
      hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-xl hover:border-primary/50
      ${glow ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border/60'}
      ${isKetua ? 'bg-primary/5' : ''}
      ${className}`}
  >
    {glow && (
      <span className="absolute -inset-px rounded-2xl bg-primary/5 pointer-events-none" />
    )}
    <span className="text-[10px] font-bold tracking-widest uppercase text-primary/70 flex items-center gap-1">
      {topLabel}
    </span>
    <span className="font-semibold text-xs sm:text-sm text-foreground leading-tight text-center max-w-[160px] sm:max-w-[200px] break-words">
      {name}
    </span>
    {sub && (
      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[160px]">{sub}</span>
    )}
    {phone && (
      <span className="text-[10px] text-muted-foreground font-mono">{phone}</span>
    )}
    {extra && <div className="mt-1 flex flex-wrap gap-1 justify-center">{extra}</div>}
  </div>
)

const TeamTree: React.FC<{
  team: TeamWithRelations
  isLKTI: boolean
}> = ({ team, isLKTI }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const ketua = team.members.find((m) => m.role === 'KETUA')
  const anggota = team.members.filter((m) => m.role === 'ANGGOTA')

  const drawLines = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, rect.width, rect.height)

    const teamEl = container.querySelector('.tree-team-node') as HTMLElement
    const ketuaEl = container.querySelector('.tree-ketua-node') as HTMLElement
    const anggotaEls = container.querySelectorAll('.tree-anggota-node')

    const mid = (el: HTMLElement) => {
      const r = el.getBoundingClientRect()
      return {
        x: r.left + r.width / 2 - rect.left,
        top: r.top - rect.top,
        bottom: r.bottom - rect.top,
      }
    }

    const drawCurve = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      const grad = ctx.createLinearGradient(x1, y1, x2, y2)
      grad.addColorStop(0, color + 'cc')
      grad.addColorStop(1, color + '33')
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.bezierCurveTo(x1, (y1 + y2) / 2, x2, (y1 + y2) / 2, x2, y2)
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.5
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
    }

    if (teamEl && ketuaEl) {
      const t = mid(teamEl)
      const k = mid(ketuaEl)
      drawCurve(t.x, t.bottom, k.x, k.top, '#6366f1')
    }

    if (ketuaEl && anggotaEls.length > 0) {
      const k = mid(ketuaEl)
      anggotaEls.forEach((el) => {
        const a = mid(el as HTMLElement)
        drawCurve(k.x, k.bottom, a.x, a.top, '#818cf8')
      })
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.tree-team-node', { opacity: 0, y: -28, scale: 0.88, duration: 0.55 })
        .from('.tree-ketua-node', { opacity: 0, y: -20, scale: 0.88, duration: 0.5 }, '-=0.2')
        .from('.tree-anggota-node', {
          opacity: 0,
          y: 28,
          scale: 0.88,
          stagger: 0.1,
          duration: 0.5,
          ease: 'back.out(1.5)',
        }, '-=0.15')
    }, containerRef)

    const redraw = () => requestAnimationFrame(() => requestAnimationFrame(drawLines))
    const ro = new ResizeObserver(redraw)
    ro.observe(containerRef.current!)
    window.addEventListener('resize', redraw)
    redraw()

    return () => {
      ctx.revert()
      ro.disconnect()
      window.removeEventListener('resize', redraw)
    }
  }, [team])

  return (
    <div
      ref={containerRef}
      className="relative w-full py-10 sm:py-14 flex flex-col items-center gap-8 sm:gap-10
        bg-muted/20 border border-border/50 rounded-2xl overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      <div className="relative z-10 tree-team-node">
        <NodeCard
          topLabel={<><Trophy size={10} /> Tim</>}
          name={team.name}
          sub={`#${(team as any).code ?? ''}`}
          glow
        />
      </div>

      {ketua && (
        <div className="relative z-10 tree-ketua-node">
          <NodeCard
            topLabel={<>👑 Ketua Tim</>}
            name={ketua.name}
            sub={ketua.email}
            phone={ketua.phone}
            isKetua
            glow
            extra={
              isLKTI && (ketua.major || ketua.faculty)
                ? <>
                    {ketua.major && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{ketua.major}</Badge>}
                    {ketua.faculty && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{ketua.faculty}</Badge>}
                  </>
                : undefined
            }
          />
        </div>
      )}

      {anggota.length > 0 && (
        <div className="relative z-10 flex flex-wrap justify-center gap-3 sm:gap-4 px-4 sm:px-8 w-full">
          {anggota.map((m) => (
            <div key={m.id} className="tree-anggota-node w-[calc(50%-6px)] sm:w-56 md:w-64">
              <NodeCard
                topLabel="Anggota"
                name={m.name}
                sub={m.email}
                phone={m.phone}
                extra={
                  isLKTI && (m.major || m.faculty)
                    ? <>
                        {m.major && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{m.major}</Badge>}
                        {m.faculty && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{m.faculty}</Badge>}
                      </>
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TeamTree;