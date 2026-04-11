import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        duration: 0.4,
      })

      if (cardRef.current) {
        gsap.from(cardRef.current, {
          y: 40,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: "power3.out",
        })
      }

      if (iconRef.current) {
        gsap.from(iconRef.current, {
          scale: 0,
          rotate: -180,
          duration: 0.7,
          ease: "back.out(1.7)",
        })
      }

      if (contentRef.current) {
        gsap.from(Array.from(contentRef.current.children), {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden"
    >
      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-destructive/10 blur-3xl rounded-full" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />
      </div>

      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card shadow-xl p-6"
      >
        {/* icon */}
        <div ref={iconRef} className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        {/* content */}
        <div ref={contentRef} className="text-center space-y-3">
          <h1 className="text-xl font-bold">Something went wrong</h1>

          <p className="text-sm text-muted-foreground">
            An unexpected error occurred while loading this page. Please try again.
          </p>

          <details className="text-left text-xs text-muted-foreground bg-muted/40 p-2 rounded-md">
            <summary className="cursor-pointer">Error details</summary>
            <pre className="whitespace-pre-wrap wrap-break-word mt-2">
              {String(error?.message ?? error)}
            </pre>
          </details>

          {/* actions */}
          <div className="flex flex-col gap-2 pt-4">
            <button
              onClick={() => router.invalidate()}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            {isRoot ? (
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition active:scale-95"
              >
                <Home className="w-4 h-4" />
                Back Home
              </Link>
            ) : (
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}