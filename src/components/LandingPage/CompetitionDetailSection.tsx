import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { competitions } from './Competition/data'
import { CompetitionCard3D } from './Competition/CompetitionCard3D'

gsap.registerPlugin(ScrollTrigger)

const CompetitionDetailSection = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.comp-header',
        { opacity: 0.3, y: 30 },
        {
          opacity: 1, y: 0, ease: 'power2.out',
          scrollTrigger: {
            trigger: '.comp-header',
            start: 'top 90%',
            end: 'top 50%',
            scrub: 0.6,
          },
        }
      )

      gsap.utils.toArray<HTMLElement>('.comp-panel').forEach((panel, i) => {
        const isEven = i % 2 === 0
        const text = panel.querySelector<HTMLElement>('.comp-text')
        const image = panel.querySelector<HTMLElement>('.comp-image')
        const card = panel.querySelector<HTMLElement>('.comp-card')

        const common = {
          scrollTrigger: {
            trigger: panel,
            start: 'top 88%',
            end: 'top 30%',
            scrub: 0.6,
          },
        }

        if (text) {
          gsap.fromTo(text,
            { opacity: 0.3, x: isEven ? -30 : 30, y: 24 },
            { opacity: 1, x: 0, y: 0, ease: 'power2.out', ...common }
          )
        }

        if (image) {
          gsap.fromTo(image,
            { opacity: 0.3, scale: 0.96, y: 20 },
            { opacity: 1, scale: 1, y: 0, ease: 'power2.out', ...common }
          )
        }

        if (card) {
          gsap.fromTo(card,
            { opacity: 0.3, x: isEven ? 30 : -30, y: 24 },
            { opacity: 1, x: 0, y: 0, ease: 'power2.out', ...common }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="competition"
      className="bg-background py-20 md:py-28"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="comp-header text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Detail Kompetisi
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed text-sm">
            Pilih jalur kompetisimu. Setiap cabang dirancang untuk mengembangkan potensi berbeda.
          </p>
        </div>

        <div className="flex flex-col gap-32">
          {competitions.map((comp, i) => {
            const isEven = i % 2 === 0
            return (
              <div key={comp.id} className="comp-panel">
                <div className={`grid md:grid-cols-2 gap-10 lg:gap-16 items-start ${!isEven ? 'md:[&>*:first-child]:order-2' : ''}`}>
                  <div className="comp-text flex flex-col gap-6">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                        {comp.label}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                        {comp.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1 font-medium">{comp.subtitle}</p>
                      <p className="text-muted-foreground leading-relaxed text-sm">{comp.desc}</p>
                    </div>

                    <div className="comp-image relative rounded-2xl overflow-hidden shadow-lg aspect-4/3">
                      <img
                        src={comp.image}
                        alt={comp.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-foreground/20 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                          {comp.prize} Total Hadiah
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="comp-card">
                    <CompetitionCard3D comp={comp} />
                  </div>
                </div>

                {i < competitions.length - 1 && (
                  <div className="mt-20 flex items-center gap-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">next</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CompetitionDetailSection
