import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useFAQAnimation(sectionRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-header',
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.utils.toArray<HTMLElement>('.faq-item').forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0,
            duration: 0.55,
            delay: i * 0.06,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])
}

export function animateAccordionOpen(contentEl: HTMLElement, iconEl: HTMLElement) {
  const fullHeight = contentEl.scrollHeight
  gsap.fromTo(
    contentEl,
    { height: 0, opacity: 0 },
    { height: fullHeight, opacity: 1, duration: 0.38, ease: 'power3.out' }
  )
  gsap.to(iconEl, { rotation: 45, duration: 0.3, ease: 'power2.out' })
}

export function animateAccordionClose(contentEl: HTMLElement, iconEl: HTMLElement) {
  gsap.to(contentEl, { height: 0, opacity: 0, duration: 0.3, ease: 'power3.in' })
  gsap.to(iconEl, { rotation: 0, duration: 0.3, ease: 'power2.out' })
}
