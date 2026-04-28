import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nodes } from './Why/data'
import { WhyCard } from './Why/WhyCard'
import { FlowPath } from './Why/FlowPath'

gsap.registerPlugin(ScrollTrigger)

const WhySection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const blob1Ref = useRef<HTMLDivElement>(null)
  const blob2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blob1Ref.current, {
        y: -24, x: 12, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })
      gsap.to(blob2Ref.current, {
        y: 20, x: -10, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })

      gsap.to('#why-node-3', {
        y: -8, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })

      gsap.fromTo(
        '.why-header',
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

      gsap.utils.toArray<HTMLElement>('.why-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 48, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6,
            delay: i * 0.08,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const [n1, n2, n3, n4, n5] = nodes

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background: 'linear-gradient(180deg, var(--primary) 10%, var(--background) 100%)',
      }}
    >
      <div
        ref={blob1Ref}
        className="absolute top-16 -left-16 w-80 h-80 rounded-full bg-accent/15 blur-3xl pointer-events-none"
      />
      <div
        ref={blob2Ref}
        className="absolute bottom-16 -right-16 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="why-header text-center mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why BMEC 2026?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Lebih dari sekadar kompetisi, ini adalah perjalanan untuk membangun masa depanmu
            di bidang Teknik Biomedis.
          </p>
        </div>

        <div ref={gridRef} className="hidden md:block relative">
          <FlowPath containerRef={gridRef} />

          <div className="relative z-10 flex flex-col gap-[120px]">
            <div className="grid grid-cols-2 gap-8 items-start">
              <div className="flex justify-start">
                <div className="w-[320px]">
                  <WhyCard node={n1} nodeId="why-node-1" />
                </div>
              </div>       
              <div className="flex justify-end">
                <div className="w-[320px]">
                  <WhyCard node={n2} nodeId="why-node-2" />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-[420px]">
                <WhyCard node={n3} nodeId="why-node-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 items-start">
              <div className="flex justify-start">
                <div className="w-[320px]">
                  <WhyCard node={n4} nodeId="why-node-4" />
                </div>
              </div>
              <div className="flex justify-end">
                <div className="w-[320px]">
                  <WhyCard node={n5} nodeId="why-node-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-accent/30" />
          <div className="flex flex-col gap-6 pl-10">
            {nodes.map((node) => (
              <div key={node.id} className="relative">
                <div
                  className="absolute -left-[2.1rem] top-5 w-3 h-3 rounded-full bg-accent border-2 border-background"
                  style={{ boxShadow: '0 0 8px color-mix(in srgb, var(--accent) 60%, transparent)' }}
                />
                <WhyCard node={node} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhySection
