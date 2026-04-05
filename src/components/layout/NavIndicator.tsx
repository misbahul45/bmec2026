import { useEffect, useRef } from "react"
import gsap from "gsap"

const NavIndicator = ({
  activeIndex,
  navRefs,
  isScroll,
}: {
  activeIndex: number
  navRefs: React.MutableRefObject<(HTMLAnchorElement | null)[]>
  isScroll: boolean
}) => {
  const indicatorRef = useRef<HTMLDivElement>(null)
  const prevIndex = useRef<number>(-1)

  useEffect(() => {
    const indicator = indicatorRef.current
    const activeEl = navRefs.current[activeIndex]
    if (!indicator || !activeEl) return

    const rect = activeEl.getBoundingClientRect()
    const parentRect = activeEl.offsetParent
      ? (activeEl.offsetParent as HTMLElement).getBoundingClientRect()
      : { left: 0 }

    const left = rect.left - parentRect.left
    const width = rect.width

    if (prevIndex.current === -1) {
      gsap.set(indicator, { left, width, opacity: isScroll ? 1 : 0 })
    } else {
      gsap.to(indicator, {
        left,
        width,
        opacity: isScroll ? 1 : 0,
        duration: 0.35,
        ease: "power3.out",
      })
    }

    prevIndex.current = activeIndex
  }, [activeIndex, navRefs, isScroll])

  useEffect(() => {
    if (!indicatorRef.current) return

    gsap.to(indicatorRef.current, {
      opacity: isScroll ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
    })
  }, [isScroll])

  return (
    <div
      ref={indicatorRef}
      className="absolute top-0 h-full rounded-full pointer-events-none"
      style={{
        background: isScroll
          ? "linear-gradient(135deg, color-mix(in srgb, var(--primary) 24%, transparent), color-mix(in srgb, var(--primary) 20%, transparent))"
          : "transparent",
        boxShadow: isScroll
          ? "0 0 12px color-mix(in srgb, var(--primary) 20%, transparent)"
          : "none",
        opacity: 0,
      }}
    />
  )
}

export default NavIndicator