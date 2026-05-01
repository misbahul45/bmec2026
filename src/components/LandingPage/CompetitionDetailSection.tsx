import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { competitions } from './Competition/data'
import CompetitionCard from './Competition/CompetitionCard'

gsap.registerPlugin(ScrollTrigger)

const CompetitionDetailSection = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.comp-header',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.comp-header',
            start: 'top 85%',
          },
        }
      )

      gsap.utils.toArray<HTMLElement>('.comp-card').forEach((card, i) => {
        const isEven = i % 2 === 0

        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: isEven ? -50 : 50,
            y: 20,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="competition"
      className="bg-background py-14 md:py-18 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="comp-header text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Detail Kompetisi
          </h2>

          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Pilih cabang kompetisi sesuai potensimu dan raih
            prestasi nasional di BMEC 2026.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {competitions.map((comp, i) => (
            <CompetitionCard key={comp.id} comp={comp} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CompetitionDetailSection