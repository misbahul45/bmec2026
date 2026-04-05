import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGalleryAnimation(
  sectionRef: React.RefObject<HTMLElement | null>,
  activeIndex: number,
  total: number
) {
  const prevIndex = useRef(activeIndex)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-header',
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.fromTo(
        '.gallery-strip',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.fromTo(
        '.gallery-meta',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, delay: 0.35, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const prev = prevIndex.current
    if (prev === activeIndex) return
    prevIndex.current = activeIndex

    gsap.fromTo(
      '.gallery-active-title',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
    )
    gsap.fromTo(
      '.gallery-active-desc',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, delay: 0.08, ease: 'power3.out' }
    )
    gsap.fromTo(
      '.gallery-active-cat',
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
    )

    gsap.utils.toArray<HTMLElement>('.gallery-thumb').forEach((thumb, i) => {
      const isActive = i === activeIndex
      gsap.to(thumb, {
        scale: isActive ? 1.06 : 0.94,
        opacity: isActive ? 1 : 0.55,
        filter: isActive ? 'blur(0px) brightness(1)' : 'blur(1px) brightness(0.75)',
        duration: 0.5,
        ease: 'power2.out',
      })
    })
  }, [activeIndex])

  useEffect(() => {
    gsap.utils.toArray<HTMLElement>('.gallery-thumb').forEach((thumb, i) => {
      const isActive = i === activeIndex
      gsap.set(thumb, {
        scale: isActive ? 1.06 : 0.94,
        opacity: isActive ? 1 : 0.55,
        filter: isActive ? 'blur(0px) brightness(1)' : 'blur(1px) brightness(0.75)',
      })
    })
  }, [])
}

export function useParallax(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      gsap.to('.gallery-bg-img', {
        x: x * 18,
        y: y * 12,
        duration: 1.2,
        ease: 'power2.out',
      })
      gsap.to('.gallery-meta', {
        x: x * 6,
        y: y * 4,
        duration: 1.4,
        ease: 'power2.out',
      })
    }

    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])
}
