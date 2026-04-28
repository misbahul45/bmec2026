import { useRef, useState } from 'react'
import { bmecGallery } from './Gallery/bmecGallery'
import { GalleryCarousel } from './Gallery/GalleryCarousel'
import { GalleryThreeAmbient } from './Gallery/GalleryThreeAmbient'
import { useGalleryAnimation, useParallax } from './Gallery/useGalleryAnimation'

const GalerySection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useGalleryAnimation(sectionRef, activeIndex, bmecGallery.length)
  useParallax(stageRef)

  const active = bmecGallery[activeIndex]

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative bg-background py-8 overflow-hidden"
    >
      <GalleryThreeAmbient />

      <div className="relative z-10 max-w-6xl mx-auto px-2 sm:px-4 md:px-6">
        <div className="gallery-header text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Momen BMEC 2026
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Setiap momen adalah cerita. Dari pembukaan hingga malam penghargaan.
          </p>
        </div>

        <div
          ref={stageRef}
          className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-xl"
          style={{ height: 'clamp(320px, 52vw, 560px)' }}
        >
          {bmecGallery.map((item, i) => (
            <div
              key={item.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === activeIndex ? 1 : 0, pointerEvents: i === activeIndex ? 'auto' : 'none' }}
            >
              <img
                src={item.image}
                alt={item.id}
                className="gallery-bg-img w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/70 via-foreground/10 to-transparent" />
            </div>
          ))}

          <div className="gallery-meta absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-2 mt-4">
              {bmecGallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="absolute top-4 right-4">
            <span className="text-[10px] font-mono text-white/50">
              {String(activeIndex + 1).padStart(2, '0')} / {String(bmecGallery.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <GalleryCarousel activeIndex={activeIndex} onSelect={setActiveIndex} />
        </div>
      </div>
    </section>
  )
}

export default GalerySection
