import { useEffect, useRef } from "react"
import gsap from 'gsap'

const RibbonSVG = () => {
  const pathRef = useRef<SVGPathElement>(null)
  const path2Ref = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!pathRef.current || !path2Ref.current) return

    gsap.to(pathRef.current, {
      attr: { d: 'M0,40 Q200,0 400,35 T800,30 T1200,40 T1600,30 L1600,0 L0,0 Z' },
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    gsap.to(path2Ref.current, {
      attr: { d: 'M0,50 Q300,10 600,45 T1000,25 T1400,45 T1600,40 L1600,0 L0,0 Z' },
      duration: 5.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1,
    })
  }, [])

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1600 64"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ribbonGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.06" />
          <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="ribbonGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.03" />
          <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d="M0,32 Q200,10 400,30 T800,25 T1200,35 T1600,25 L1600,0 L0,0 Z"
        fill="url(#ribbonGrad1)"
      />
      <path
        ref={path2Ref}
        d="M0,45 Q300,15 600,40 T1000,20 T1400,40 T1600,35 L1600,0 L0,0 Z"
        fill="url(#ribbonGrad2)"
      />
    </svg>
  )
}

export default RibbonSVG;