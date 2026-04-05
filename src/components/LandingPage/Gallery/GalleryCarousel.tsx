import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { bmecGallery } from './bmecGallery'
import { GalleryCard } from './GalleryCard'

interface Props {
  activeIndex: number
  onSelect: (i: number) => void
}

export function GalleryCarousel({ activeIndex, onSelect }: Props) {
  const stripRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'prev' | 'next') => {
    const next = dir === 'next'
      ? Math.min(activeIndex + 1, bmecGallery.length - 1)
      : Math.max(activeIndex - 1, 0)
    onSelect(next)

    const strip = stripRef.current
    if (!strip) return
    const thumb = strip.children[next] as HTMLElement
    if (thumb) thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <div className="gallery-strip relative flex items-center gap-3">
      <button
        onClick={() => scroll('prev')}
        disabled={activeIndex === 0}
        className="shrink-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 disabled:opacity-30"
        aria-label="Previous"
      >
        <ChevronLeft size={14} />
      </button>

      <div
        ref={stripRef}
        className="flex gap-2.5 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {bmecGallery.map((item, i) => (
          <GalleryCard
            key={item.id}
            item={item}
            index={i}
            isActive={i === activeIndex}
            onClick={onSelect}
          />
        ))}
      </div>

      <button
        onClick={() => scroll('next')}
        disabled={activeIndex === bmecGallery.length - 1}
        className="shrink-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 disabled:opacity-30"
        aria-label="Next"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}
