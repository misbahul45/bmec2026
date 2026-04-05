import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DOT_IDS = ['tl-dot-1', 'tl-dot-2', 'tl-dot-3']

interface Props {
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function TimelinePath({ containerRef }: Props) {
  const pathRef = useRef<SVGPathElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const build = () => {
      const container = containerRef.current
      const svg = svgRef.current
      const path = pathRef.current
      if (!container || !svg || !path) return

      const cRect = container.getBoundingClientRect()

      const pts = DOT_IDS.map((id) => {
        const el = document.getElementById(id)
        if (!el) return null
        const r = el.getBoundingClientRect()
        return {
          x: r.left - cRect.left + r.width / 2,
          y: r.top - cRect.top + r.height / 2,
        }
      }).filter(Boolean) as { x: number; y: number }[]

      if (pts.length < 2) return

      svg.setAttribute('width', String(cRect.width))
      svg.setAttribute('height', String(cRect.height))

      let d = `M ${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i - 1]
        const c = pts[i]
        const mx = (p.x + c.x) / 2
        d += ` C ${mx} ${p.y}, ${mx} ${c.y}, ${c.x} ${c.y}`
      }
      path.setAttribute('d', d)

      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })

      ScrollTrigger.create({
        trigger: container,
        start: 'top 65%',
        end: 'bottom 40%',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(path, { strokeDashoffset: len * (1 - self.progress) })
        },
      })
    }

    const timer = setTimeout(build, 120)
    const ro = new ResizeObserver(build)
    if (containerRef.current) ro.observe(containerRef.current)

    return () => {
      clearTimeout(timer)
      ro.disconnect()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none hidden md:block"
      style={{ overflow: 'visible' }}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="tl-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        ref={pathRef}
        stroke="var(--primary)"
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeDasharray="10 7"
        strokeLinecap="round"
        fill="none"
        filter="url(#tl-glow)"
      />
    </svg>
  )
}
