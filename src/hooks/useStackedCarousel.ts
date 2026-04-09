import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

const OFFSETS = [
  { x: -200, scale: 0.82, opacity: 0.35, zIndex: 1 },
  { x: -100, scale: 0.91, opacity: 0.6, zIndex: 2 },
  { x: 0, scale: 1, opacity: 1, zIndex: 4 },
  { x: 100, scale: 0.91, opacity: 0.6, zIndex: 2 },
  { x: 200, scale: 0.82, opacity: 0.35, zIndex: 1 },
]

function getOffset(pos: number, total: number, active: number) {
  let rel = pos - active
  if (rel > total / 2) rel -= total
  if (rel < -total / 2) rel += total
  const clamped = Math.max(-2, Math.min(2, rel))
  return OFFSETS[clamped + 2]
}

export function useStackedCarousel(total: number, autoDelay = 4000) {
  const [active, setActive] = useState(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const isPaused = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const applyPositions = useCallback((activeIdx: number) => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const { x, scale, opacity, zIndex } = getOffset(i, total, activeIdx)
      gsap.to(el, {
        x,
        scale,
        opacity,
        zIndex,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: true,
      })
    })
  }, [total])

  useEffect(() => {
    applyPositions(active)
  }, [active, applyPositions])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!isPaused.current) {
        setActive((prev) => (prev + 1) % total)
      }
    }, autoDelay)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [total, autoDelay])

  const goTo = (idx: number) => setActive(idx)
  const pause = () => { isPaused.current = true }
  const resume = () => { isPaused.current = false }

  return { active, goTo, pause, resume, cardRefs }
}
