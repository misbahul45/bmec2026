import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  competitions,
  accentTokens,
} from './Competition/data'
import { Link } from '@tanstack/react-router'
import {
  Trophy,
  Medal,
  Award,
  BookOpen,
  UserPlus,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

type AccentKey = keyof typeof accentTokens

const rankIcons = [Trophy, Medal, Award]
const rankColors = [
  'text-yellow-500',
  'text-slate-400',
  'text-amber-600',
]

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

      gsap.utils.toArray<HTMLElement>('.comp-card').forEach(
        (card, i) => {
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
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="competition"
      className="bg-background py-16 md:py-24 overflow-hidden"
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
          {competitions.map((comp, i) => {
            const isEven = i % 2 === 0
            const tokens =
              accentTokens[comp.accent as AccentKey]
            const { Icon } = comp

            return (
              <div
                key={comp.id}
                className={`comp-card flex flex-col md:flex-row rounded-2xl overflow-hidden border shadow-sm ${tokens.border}`}
              >
                <div
                  className={`relative flex-1 min-h-64 ${
                    !isEven ? 'md:order-2' : ''
                  }`}
                >
                  <img
                    src={comp.image}
                    alt={comp.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/45" />

                  <div className="absolute top-3 left-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${tokens.bg}`}
                    >
                      <Icon
                        size={14}
                        className={tokens.text}
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white text-lg font-bold">
                      {comp.title}
                    </h3>
                  </div>
                </div>

                <div className="flex-1 bg-card p-4 sm:p-5 flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comp.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {comp.registerFees.map(
                      (fee: string, idx: number) => (
                        <span
                          key={idx}
                          className={`text-[10px] px-2 py-1 rounded-full border font-medium ${tokens.badge}`}
                        >
                          {fee}
                        </span>
                      )
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {comp.prizes.map((p, j) => {
                      const RankIcon = rankIcons[j]

                      return (
                        <div
                          key={j}
                          className="flex items-center gap-1"
                        >
                          <RankIcon
                            size={12}
                            className={rankColors[j]}
                          />
                          <span className="text-xs font-semibold">
                            {p.amount}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex gap-2 flex-wrap mt-auto">
                    <a
                      href={comp.guideUrl}
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border ${tokens.badge}`}
                    >
                      <BookOpen size={11} />
                      Guidebook
                    </a>

                    <Link
                      to="/auth/register"
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground"
                    >
                      <UserPlus size={11} />
                      Daftar
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CompetitionDetailSection