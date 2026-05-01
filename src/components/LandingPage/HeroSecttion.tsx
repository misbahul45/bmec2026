import { Image } from '@unpic/react'
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from '@tanstack/react-router'
import Logos from './Logos'

const HeroSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const maskotLeftRef = useRef<HTMLDivElement>(null)
  const maskotRightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo(
        wrapperRef.current,
        { clipPath: 'circle(0% at 96% 96%)' },
        { clipPath: 'circle(170% at 96% 96%)', duration: 1.1 }
      )
        .fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          descRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.5'
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          maskotLeftRef.current,
          { y: 60, opacity: 0, scale: 0.8, rotate: -10 },
          { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.7)' },
          '-=0.6'
        )
        .fromTo(
          maskotRightRef.current,
          { y: -60, opacity: 0, scale: 0.8, rotate: 10 },
          { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.7)' },
          '-=0.7'
        )

      gsap.to(maskotLeftRef.current, {
        y: -12,
        rotate: -3,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1,
      })

      gsap.to(maskotRightRef.current, {
        y: 12,
        rotate: 3,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.2,
      })

      gsap.to(maskotLeftRef.current, {
        x: 6,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      gsap.to(maskotRightRef.current, {
        x: -6,
        duration: 4.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="home" className="h-screen relative overflow-hidden">
      <div ref={wrapperRef} className="absolute inset-0">
        <Image
          alt="hero bg"
          src="/images/app/hero.png"
          layout="fullWidth"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-xs sm:max-w-lg lg:max-w-2xl px-4 sm:px-6 text-center flex flex-col items-center gap-3 sm:gap-5 lg:gap-6">
            <Logos />
            <h1
              ref={titleRef}
              className="text-2xl sm:text-4xl lg:text-6xl font-black leading-[1.05]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <span className="text-primary">Biomedical</span>{' '}
              Engineering
              <br />
              <span className="relative inline-block">
                Competition
                <span className="absolute -bottom-1 left-0 w-full h-0.75 bg-primary/60 rounded-full" />
              </span>{' '}
              2026
            </h1>
            <p
              ref={descRef}
              className="text-sm opacity-90 md:text-md sm:text-lg lg:text-xl sm:max-w-md lg:max-w-2xl leading-relaxed"
            >
              Kompetisi nasional Teknik Biomedis untuk pelajar dan mahasiswa
              seluruh Indonesia. Hadir dengan cabang Olimpiade, Infografis,
              dan LKTI untuk melahirkan inovasi baru di bidang kesehatan.
            </p>

            <div ref={ctaRef} className="flex gap-2 sm:gap-3 flex-wrap justify-center">
              <a
                href='#competition'
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                Detail Kompetisi →
              </a>
              <a
                href="#timeline"
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-background/10 backdrop-blur border font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all duration-200"
              >
                Lihat Timeline
              </a>
            </div>
          </div>
        </div>
      </div>

      <div ref={maskotLeftRef} className="absolute bottom-[12%] left-[5%]">
        <Image
          alt="maskot"
          src="/images/app/maskot.png"
          layout="fullWidth"
          className="w-full max-w-40 sm:max-w-28 lg:max-w-40 drop-shadow-2xl"
        />
      </div>

      <div ref={maskotRightRef} className="absolute top-[10%] right-[5%]">
        <Image
          alt="maskot"
          src="/images/app/maskot.png"
          layout="fullWidth"
          className="w-full max-w-40 sm:max-w-28 lg:max-w-40 drop-shadow-2xl"
        />
      </div>
    </section>
  )
}

export default HeroSection