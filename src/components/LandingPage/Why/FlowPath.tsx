import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

const NODE_IDS = ['why-node-1', 'why-node-2', 'why-node-3', 'why-node-4', 'why-node-5']

interface Point { x: number; y: number }

function getCardCenter(id: string, containerRect: DOMRect): Point | null {
  const el = document.getElementById(id)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return {
    x: r.left - containerRect.left + r.width / 2,
    y: r.top - containerRect.top + r.height / 2,
  }
}

function pointsToCubicPath(pts: Point[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cpX = (prev.x + curr.x) / 2
    d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return d
}

interface Props {
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function FlowPath({ containerRef }: Props) {
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [pathD, setPathD] = useState('')
  const [dims, setDims] = useState({ w: 0, h: 0 })

  const buildPath = () => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    setDims({ w: rect.width, h: rect.height })
    const pts = NODE_IDS.map((id) => getCardCenter(id, rect)).filter(Boolean) as Point[]
    if (pts.length === 5) setPathD(pointsToCubicPath(pts))
  }

  useEffect(() => {
    const ro = new ResizeObserver(buildPath)
    if (containerRef.current) ro.observe(containerRef.current)
    setTimeout(buildPath, 100)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!pathD || !pathRef.current || !dotRef.current) return

    const path = pathRef.current
    const dot = dotRef.current
    const len = path.getTotalLength()

    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
    gsap.set(dot, { opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 65%',
        end: 'bottom 35%',
        scrub: 1.2,
      },
    })

    tl.to(path, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0)
    tl.to(dot, { opacity: 1, duration: 0.05 }, 0)
    tl.to(
      dot,
      {
        motionPath: {
          path: path,
          align: path,
          autoRotate: false,
          start: 0,
          end: 1,
        },
        duration: 1,
        ease: 'none',
      },
      0
    )

    return () => { tl.kill() }
  }, [pathD])

  if (!pathD || dims.w === 0) return null

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none"
      width={dims.w}
      height={dims.h}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <filter id="dot-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        ref={pathRef}
        d={pathD}
        stroke="var(--accent)"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeDasharray="10 6"
        strokeLinecap="round"
        fill="none"
      />

      <circle
        ref={dotRef}
        r="7"
        fill="var(--primary-foreground)"
        filter="url(#dot-glow)"
        opacity="0"
      />
    </svg>
  )
}
