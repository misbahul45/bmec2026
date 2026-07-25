import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const MEDIA_PARTNERS = [
  {
    id: 1,
    image:
      'https://4s0138q05g.ufs.sh/f/L7c2JRqY80pw6lhydx5LyApYEHq3UsFjwOgGdx5oX2hzRTQ6',
    alt: 'Media Partner 1',
  },
  {
    id: 2,
    image:
      'https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwILLqnSm0EnHZwk9itfhKbPQzUrlByMFRoumj',
    alt: 'Media Partner 2',
  },
  {
    id: 3,
    image:
      'https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwlMuE1dRLB1rsV2ZztOSq46HQcJNPUhy75Fmp',
    alt: 'Media Partner 3',
  },
  {
    id: 4,
    image:
      'https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwzui9WMHJdxIHqJhQXWeyvOCk70GDjVUFsw9A',
    alt: 'Media Partner 4',
  },
  {
    id: 5,
    image:
      'https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwFSxaPKZOnDCB9l8iJZ63xSyXRMUQpc1EVejF',
    alt: 'Media Partner 5',
  },
  {
    id: 6,
    image:
      'https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwsHXtaSrqmSAs4kbx1Kl5zBFWpXRJUGcL3Pa8',
    alt: 'Media Partner 6',
  },
  {
    id: 7,
    image:
      'https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwauiM7i2WcCwaURSiLsKVODv8jkhfQPlATYHd',
    alt: 'Media Partner 7',
  },
  {
    id: 8,
    image:
      'https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwq1dQEAFGZyXrWdVj7kNlJvzbL0CDAO14PcIE',
    alt: 'Media Partner 8',
  },
] as const

const MediaPartnerSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  useGSAP(
    () => {
      if (!trackRef.current) return

      animationRef.current = gsap.fromTo(
        trackRef.current,
        {
          xPercent: 0,
        },
        {
          xPercent: -50,
          duration: 25,
          ease: 'none',
          repeat: -1,
        },
      )

      gsap.from('.media-partner-heading', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.from('.media-partner-description', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
      })
    },
    {
      scope: sectionRef,
    },
  )

  const handleMouseEnter = () => {
    animationRef.current?.pause()
  }

  const handleMouseLeave = () => {
    animationRef.current?.resume()
  }

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden py-16 md:py-24"
    >
      <div className="mx-auto mb-10 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="media-partner-heading text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Media Partners
        </h2>

        <p className="media-partner-description mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
          Supported by media partners who help us expand our reach and share
          meaningful information with a wider audience.
        </p>
      </div>

      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-32" />

        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-32" />

        <div
          ref={trackRef}
          className="flex w-max items-center will-change-transform"
        >
          {[...MEDIA_PARTNERS, ...MEDIA_PARTNERS].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="group mx-3 flex h-28 w-44 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md sm:h-32 sm:w-52 md:mx-4 md:h-36 md:w-60"
            >
              <img
                src={partner.image}
                alt={partner.alt}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MediaPartnerSection