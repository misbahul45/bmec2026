import React, { useEffect, useRef, useId } from 'react'
import gsap from 'gsap'
import { cn } from '~/lib/utils'

interface Props {
  className: string
}

const Pita: React.FC<Props> = ({ className }) => {
  const pathRef = useRef<SVGPathElement>(null)
  const gradientId = useId() // biar gak bentrok kalau multiple instance

  useEffect(() => {
    if (!pathRef.current) return

    const length = pathRef.current.getTotalLength()

    gsap.set(pathRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
    })

    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power2.out',
    })
  }, [])

  return (
    <svg
      viewBox="0 0 1200 200"
      className={cn('pointer-events-none', className)}
    >
      {/* glow / pita background */}
      <path
        d="M0,120 C250,20 950,220 1200,120"
        stroke="oklch(var(--primary) / 0.2)"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
      />

      {/* main animated line */}
      <path
        ref={pathRef}
        d="M0,120 C250,20 950,220 1200,120"
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient id={gradientId}>
          <stop offset="0%" stopColor="oklch(var(--primary))" />
          <stop offset="50%" stopColor="oklch(var(--secondary))" />
          <stop offset="100%" stopColor="oklch(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Pita