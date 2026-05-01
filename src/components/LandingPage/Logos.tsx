import { Image } from '@unpic/react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const images = [
  '/images/logos/unair.png',
  '/images/logos/hmtb.png',
  '/images/logos/Metamorfosa.png',
  '/images/logos/bmec.png',
]

const Logos = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.logo-item',
        {
          opacity: 0,
          x: -40,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center gap-6 flex-wrap mt-8"
    >
      {images.map((src, index) => (
        <div key={index} className="logo-item">
          <Image
            src={src}
            alt={`Logo ${index + 1}`}
            layout="constrained"
            width={40}
            height={40}
            className="object-contain opacity-80 hover:opacity-100 transition"
          />
        </div>
      ))}
    </div>
  )
}

export default Logos