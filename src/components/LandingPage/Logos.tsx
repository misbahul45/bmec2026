import { Image } from '@unpic/react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const images = [
  'https://xltn7i57i8.ufs.sh/f/KPvneZksE9vw0Y2yncIv1CYzLNqBEfMhnSRWZQmHXkxOl5ey',
  'https://xltn7i57i8.ufs.sh/f/KPvneZksE9vwFaBvdVHCQYUyF1uf4g2lLjXqDv3nH9ksIEpa',
  'https://xltn7i57i8.ufs.sh/f/KPvneZksE9vwS2c9P4Q46NZ8YrcKfMCWGkLQiapxAhlqjm1d',
  'https://xltn7i57i8.ufs.sh/f/KPvneZksE9vwAzQ6oM2gEIYKarU9Zpcbw8HoeFhLn5SG4XiP',
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