import { Link, ErrorComponentProps } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Users, ArrowLeft, Home, AlertTriangle } from "lucide-react"

export function TeamNotFound({ error }: ErrorComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const decorRef = useRef<HTMLDivElement>(null)

  const isNotFound =
    (error as any)?.message?.toLowerCase?.().includes("not found") ||
    (error as any)?.status === 404

  useEffect(() => {
    const ctx = gsap.context(() => {
      const decorElements = decorRef.current?.children

      if (decorElements) {
        gsap.fromTo(
          Array.from(decorElements),
          { y: 80, opacity: 0, scale: 0.8 },
          {
            y: 0,
            opacity: 0.1,
            scale: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "elastic.out(1,0.5)",
          }
        )

        Array.from(decorElements).forEach((el, i) => {
          gsap.to(el, {
            y: "random(-20,20)",
            x: "random(-20,20)",
            duration: "random(3,5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.4,
          })
        })
      }

      if (iconRef.current) {
        gsap.from(iconRef.current, {
          scale: 0,
          rotate: -180,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
      }

      if (contentRef.current) {
        gsap.from(Array.from(contentRef.current.children), {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.4,
          ease: "power3.out",
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
    >
      <div
        ref={decorRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-destructive/5 rounded-full blur-2xl" />
      </div>

      <div className="text-center space-y-8 max-w-xl relative z-10">
        {/* Icon */}
        <div
          ref={iconRef}
          className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
        >
          {isNotFound ? (
            <Users className="w-10 h-10 text-primary" />
          ) : (
            <AlertTriangle className="w-10 h-10 text-destructive" />
          )}
        </div>

        {/* Content */}
        <div ref={contentRef} className="space-y-4">
          <h1 className="text-3xl font-bold">
            {isNotFound ? "Team Not Found" : "Something Went Wrong"}
          </h1>

          <p className="text-muted-foreground max-w-md mx-auto">
            {isNotFound
              ? "The team you are looking for does not exist, has been deleted, or you don't have permission to access it."
              : "An unexpected error occurred. Please try again later or contact support if the problem persists."}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium 
                         bg-secondary text-secondary-foreground 
                         hover:bg-secondary/80 transition-all
                         hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>

            <Link
              to="/"
              className="group flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium 
                         bg-primary text-primary-foreground 
                         hover:opacity-90 transition-all
                         hover:scale-105 active:scale-95"
            >
              <Home className="w-4 h-4" />
              Back Home
            </Link>
          </div>

          <p className="text-sm text-muted-foreground/60 pt-6 border-t border-border/50">
            {isNotFound
              ? "Try checking the team URL or contact the administrator."
              : "If this keeps happening, please refresh the page or contact support."}
          </p>
        </div>
      </div>
    </div>
  )
}