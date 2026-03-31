import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Home, ArrowLeft, Search } from 'lucide-react' // Install: npm install lucide-react

export function NotFound({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const decorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background floating elements
      const decorElements = decorRef.current?.children
      if (decorElements) {
        gsap.fromTo(
          Array.from(decorElements),
          { 
            y: 100, 
            opacity: 0,
            scale: 0.8 
          },
          { 
            y: 0, 
            opacity: 0.1, 
            scale: 1,
            duration: 1.5, 
            stagger: 0.2, 
            ease: 'elastic.out(1, 0.5)' 
          }
        )

        // Continuous floating animation
        Array.from(decorElements).forEach((el, i) => {
          gsap.to(el, {
            y: 'random(-20, 20)',
            x: 'random(-20, 20)',
            rotation: 'random(-10, 10)',
            duration: 'random(3, 5)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.5
          })
        })
      }

      // 404 Title - Glitch effect style
      if (titleRef.current) {
        const tl = gsap.timeline()
        
        tl.from(titleRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.7)'
        })
        .to(titleRef.current, {
          x: -5,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'none'
        })
        .to(titleRef.current, {
          x: 0,
          duration: 0.1
        })
      }

      // Subtitle slide up
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.5,
          ease: 'power3.out'
        })
      }

      // Content stagger
      if (contentRef.current) {
        const elements = contentRef.current.children
        gsap.from(Array.from(elements), {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.7,
          ease: 'power3.out'
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden "
    >
      {/* Floating Background Decorations */}
      <div ref={decorRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-destructive/5 rounded-full blur-2xl" />
      </div>

      <div className="text-center space-y-8 max-w-2xl relative z-10">
        {/* 404 Title with Gradient */}
        <div ref={subtitleRef}>
          <h1
            ref={titleRef}
            className="text-[10rem] md:text-[12rem] font-black leading-none tracking-tighter bg-linear-to-b from-foreground to-muted-foreground bg-clip-text text-transparent select-none"
          >
            404
          </h1>
          <div className="w-24 h-1 bg-linear-to-r from-primary to-accent mx-auto rounded-full mt-4" />
        </div>

        {/* Content */}
        <div ref={contentRef} className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              {children || "The page you're looking for doesn't exist or has been moved."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium 
                         bg-secondary text-secondary-foreground 
                         hover:bg-secondary/80 transition-all duration-300
                         hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </button>

            <Link
              to="/"
              className="group flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium 
                         bg-primary text-primary-foreground 
                         hover:opacity-90 transition-all duration-300
                         hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-primary/25
                         w-full sm:w-auto justify-center"
            >
              <Home className="w-4 h-4" />
              Back Home
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-sm text-muted-foreground/60 pt-8 border-t border-border/50">
            Lost? Try checking the URL or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}