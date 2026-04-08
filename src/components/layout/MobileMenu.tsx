import { Link, useLocation } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import { NAV_ITEMS } from "~/contants"
import { cn } from "~/lib/utils"
import ToggleUser from "./ToggleUser"
import gsap from "gsap"

const MobileMenu = ({
  isOpen,
  navItems,
  activeSection,
  isLogin,
  onClose,
}: {
  isOpen: boolean
  navItems: typeof NAV_ITEMS
  activeSection: string
  isLogin: boolean
  onClose: () => void
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLElement | null)[]>([])

  const pathName = useLocation().pathname

  const toggleHome = (href: string) => {
    return pathName === '/' ? href : '/' + href
  }

  useEffect(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    const items = itemsRef.current.filter(Boolean)
    if (!overlay || !panel) return

    gsap.killTweensOf([overlay, panel, ...items])

    if (isOpen) {
      overlay.style.pointerEvents = 'auto'

      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      )

      gsap.fromTo(
        panel,
        { y: -24, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' }
      )

      gsap.fromTo(
        items,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power3.out',
          delay: 0.1,
        }
      )
    } else {
      gsap.to([...items].reverse(), {
        y: 10,
        opacity: 0,
        duration: 0.2,
        stagger: 0.04,
        ease: 'power2.in',
      })

      gsap.to(panel, {
        y: -16,
        opacity: 0,
        scale: 0.97,
        duration: 0.3,
        ease: 'power3.in',
        delay: 0.05,
        onComplete: () => {
          overlay.style.pointerEvents = 'none'
        },
      })

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        delay: 0.05,
      })
    }
  }, [isOpen])

  return (
    <div
      ref={overlayRef}
      className="lg:hidden fixed inset-0 z-40 opacity-0 pointer-events-none"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={cn(
          'absolute top-18 left-3 right-3 rounded-2xl overflow-hidden',
          'border border-border/30',
          'shadow-[0_32px_64px_rgba(0,0,0,0.15)]',
        )}
        style={{
          background:
            'linear-gradient(145deg, color-mix(in srgb, var(--background) 92%, var(--primary)), var(--background))',
          backdropFilter: 'blur(10px)',
          willChange: 'transform, opacity',
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, color-mix(in srgb, var(--primary) 40%, transparent), transparent)',
          }}
        />

        <nav className="flex flex-col p-4 gap-1">
          {navItems.map((item, i) => {
            const isActive =
              item.href === '/' ? activeSection === '' : activeSection === item.href

            return (
              <Link
                key={item.title}
                to={toggleHome(item.href)}
                onClick={onClose}
                ref={(el) => { itemsRef.current[i] = el }}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium',
                  'transition-colors duration-150',
                  isActive
                    ? 'bg-primary/12 text-primary'
                    : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                )}
                style={{ willChange: 'transform, opacity' }}
              >
                <span>{item.title}</span>
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    style={{ boxShadow: '0 0 6px var(--primary)' }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mx-4 h-px bg-border/20" />

        <div
          className="p-4"
          ref={(el) => { itemsRef.current[navItems.length] = el }}
          style={{ willChange: 'transform, opacity' }}
        >
          {isLogin ? (
            <ToggleUser />
          ) : (
            <div className="flex gap-2">
              <Link
                to="/auth/login"
                onClick={onClose}
                className={cn(
                  'flex-1 text-center py-2.5 rounded-xl text-sm font-medium',
                  'border border-border/40 text-foreground/70',
                  'hover:border-primary/40 hover:text-primary transition-colors'
                )}
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                onClick={onClose}
                className={cn(
                  'flex-1 text-center py-2.5 rounded-xl text-sm font-semibold',
                  'bg-primary text-primary-foreground',
                  'hover:opacity-90 transition-opacity',
                  'shadow-[0_4px_12px_color-mix(in_srgb,var(--primary)_30%,transparent)]'
                )}
              >
                Daftar
              </Link>
            </div>
          )}
        </div>

        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  )
}

export default MobileMenu 