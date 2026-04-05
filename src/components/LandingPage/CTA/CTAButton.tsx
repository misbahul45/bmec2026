import { useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from '@tanstack/react-router'
import { cn } from '~/lib/utils'

interface Props {
  to: string
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
  className?: string
}

export function CTAButton({ to, variant = 'primary', children, className }: Props) {
  const btnRef = useRef<HTMLAnchorElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = btnRef.current
    const glow = glowRef.current
    if (!el || !glow) return
    const r = el.getBoundingClientRect()
    gsap.to(glow, {
      x: e.clientX - r.left - r.width / 2,
      y: e.clientY - r.top - r.height / 2,
      duration: 0.35, ease: 'power2.out',
    })
    gsap.to(el, { scale: 1.05, duration: 0.25, ease: 'power2.out' })
  }

  const onMouseLeave = () => {
    gsap.to(btnRef.current, { scale: 1, duration: 0.45, ease: 'power3.out' })
    gsap.to(glowRef.current, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' })
  }

  const onMouseDown = () => gsap.to(btnRef.current, { scale: 0.96, duration: 0.1 })
  const onMouseUp = () => gsap.to(btnRef.current, { scale: 1.05, duration: 0.18, ease: 'back.out(2)' })

  if (variant === 'primary') {
    return (
      <Link
        ref={btnRef}
        to={to}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className={cn(
          'relative overflow-hidden inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl',
          'bg-primary-foreground text-primary font-bold text-sm tracking-wide',
          'shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.25)]',
          'hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_12px_40px_rgba(0,0,0,0.35)]',
          'transition-shadow duration-300',
          className
        )}
        style={{ willChange: 'transform' }}
      >
        <span
          ref={glowRef}
          className="absolute w-32 h-32 rounded-full bg-primary/20 blur-2xl pointer-events-none"
          style={{ willChange: 'transform' }}
        />
        <span className="relative z-10 flex items-center gap-2.5">{children}</span>
      </Link>
    )
  }

  return (
    <Link
      ref={btnRef}
      to={to}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className={cn(
        'relative overflow-hidden inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl',
        'border border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground font-semibold text-sm',
        'hover:bg-primary-foreground/20 hover:border-primary-foreground/40',
        'backdrop-blur-sm transition-colors duration-200',
        className
      )}
      style={{ willChange: 'transform' }}
    >
      <span
        ref={glowRef}
        className="absolute w-28 h-28 rounded-full bg-primary-foreground/10 blur-2xl pointer-events-none"
        style={{ willChange: 'transform' }}
      />
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </Link>
  )
}
