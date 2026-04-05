import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useCTAAnimation(sectionRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.cta-blob-1', {
        y: -20, x: 12, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })
      gsap.to('.cta-blob-2', {
        y: 18, x: -10, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      })

      tl.fromTo('.cta-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .fromTo('.cta-headline', { opacity: 0, y: 32, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'expo.out' }, '-=0.3')
        .fromTo('.cta-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .fromTo('.cta-stats', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .fromTo('.cta-actions', { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.4)' }, '-=0.2')
        .fromTo('.cta-footnote', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.1')
    }, sectionRef)

    return () => ctx.revert()
  }, [])
}
