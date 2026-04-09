import { COMPETITIONS } from '~/contants'
import CompetitionCard from './CompetitionCard'
import { useStackedCarousel } from '../../hooks/useStackedCarousel'

export function StackedCarousel() {
  const { active, goTo, pause, resume, cardRefs } = useStackedCarousel(COMPETITIONS.length)

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div
        className="relative flex items-center justify-center"
        style={{ height: '340px', width: '100%' }}
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {COMPETITIONS.map((item, i) => (
          <div
            key={item.label}
            ref={(el) => { cardRefs.current[i] = el }}
            className="absolute"
            style={{
              width: '260px',
              transformOrigin: 'center center',
              willChange: 'transform, opacity',
            }}
            onClick={() => goTo(i)}
          >
            <CompetitionCard
              {...item}
              isActive={i === active}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {COMPETITIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-6 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
