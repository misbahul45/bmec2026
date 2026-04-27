import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { processes, accentMap } from './Timeline/data'
import { TimelineCard } from './Timeline/TimelineCard'
import { TimelinePath } from './Timeline/TimelinePath'
import { TimelineParticles } from './Timeline/TimelineParticles'

gsap.registerPlugin(ScrollTrigger)

const sides: ('left' | 'right')[] = ['left', 'right', 'left']

const TimelineSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tl-header',
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.utils.toArray<HTMLElement>('.tl-dot').forEach((dot) => {
        gsap.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.5,
            ease: 'back.out(2.5)',
            immediateRender: false,
            scrollTrigger: {
              trigger: dot,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('.timeline-card').forEach((card, i) => {
        const fromLeft = sides[i] === 'left'
        gsap.fromTo(
          card,
          { opacity: 0, x: fromLeft ? -48 : 48, y: 12 },
          {
            opacity: 1, x: 0, y: 0,
            duration: 0.7,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
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
      id="timeline"
      className="relative overflow-hidden py-20 md:py-28 bg-background"
    >
      <TimelineParticles />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="tl-header text-center mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Timeline BMEC 2026
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Tiga jalur kompetisi, satu perjalanan. Pilih jalurmu dan mulai persiapan dari sekarang.
          </p>
        </div>

        {/* Desktop */}
        <div ref={gridRef} className="hidden md:block relative">
          <TimelinePath containerRef={gridRef} />

          <div className="relative z-10 flex flex-col gap-20">
            {processes.map((proc, i) => {
              const side = sides[i]
              const isLeft = side === 'left'
              const colors = accentMap[proc.accent]
              const dotId = `tl-dot-${proc.processNum}`

              return (
                <div key={proc.id} className="relative flex items-start">
                  {isLeft ? (
                    <>
                      <div className="flex-1 flex justify-end pr-10">
                        <div className="w-[360px]">
                          <TimelineCard process={proc} dotId={dotId} />
                        </div>
                      </div>
                      <div className="flex flex-col items-center pt-6" style={{ width: '48px' }}>
                        <div
                          id={dotId}
                          className={`tl-dot w-4 h-4 rounded-full ${colors.dot} border-[3px] border-background z-10 shrink-0`}
                          style={{
                            boxShadow: '0 0 0 4px color-mix(in srgb, var(--primary) 15%, transparent), 0 0 16px color-mix(in srgb, var(--primary) 30%, transparent)',
                          }}
                        />
                      </div>
                      <div className="flex-1" />
                    </>
                  ) : (
                    <>
                      <div className="flex-1" />
                      <div className="flex flex-col items-center pt-6" style={{ width: '48px' }}>
                        <div
                          id={dotId}
                          className={`tl-dot w-4 h-4 rounded-full ${colors.dot} border-[3px] border-background z-10 shrink-0`}
                          style={{
                            boxShadow: '0 0 0 4px color-mix(in srgb, var(--primary) 15%, transparent), 0 0 16px color-mix(in srgb, var(--primary) 30%, transparent)',
                          }}
                        />
                      </div>
                      <div className="flex-1 flex justify-start pl-10">
                        <div className="w-[360px]">
                          <TimelineCard process={proc} dotId={dotId} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-primary/20" />
          <div className="flex flex-col gap-8 pl-12">
            {processes.map((proc) => {
              const colors = accentMap[proc.accent]
              return (
                <div key={proc.id} className="relative">
                  <div
                    className={`tl-dot absolute -left-[2.1rem] top-6 w-3.5 h-3.5 rounded-full ${colors.dot} border-2 border-background shrink-0`}
                    style={{
                      boxShadow: '0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent), 0 0 10px color-mix(in srgb, var(--primary) 25%, transparent)',
                    }}
                  />
                  <TimelineCard process={proc} dotId={`tl-dot-mobile-${proc.processNum}`} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimelineSection
