import { Image } from '@unpic/react'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import ToggleUser from './ToggleUser'
import { NAV_ITEMS } from '~/contants'
import { Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { cn } from '~/lib/utils'
import { Menu, X } from 'lucide-react'

// ─────────────────────────────────────────────
// Animated SVG Ribbon (floating background)
// ─────────────────────────────────────────────
const RibbonSVG = () => {
  const pathRef = useRef<SVGPathElement>(null)
  const path2Ref = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!pathRef.current || !path2Ref.current) return

    gsap.to(pathRef.current, {
      attr: {
        d: 'M0,40 Q200,0 400,35 T800,30 T1200,40 T1600,30 L1600,0 L0,0 Z',
      },
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    gsap.to(path2Ref.current, {
      attr: {
        d: 'M0,50 Q300,10 600,45 T1000,25 T1400,45 T1600,40 L1600,0 L0,0 Z',
      },
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

// ─────────────────────────────────────────────
// Animated Nav Indicator (sliding pill)
// ─────────────────────────────────────────────
const NavIndicator = ({
  activeIndex,
  navRefs,
}: {
  activeIndex: number
  navRefs: React.MutableRefObject<(HTMLAnchorElement | null)[]>
}) => {
  const indicatorRef = useRef<HTMLDivElement>(null)
  const prevIndex = useRef<number>(-1)

  useEffect(() => {
    const indicator = indicatorRef.current
    const activeEl = navRefs.current[activeIndex]
    if (!indicator || !activeEl) return

    const rect = activeEl.getBoundingClientRect()
    const parentRect = activeEl.offsetParent
      ? (activeEl.offsetParent as HTMLElement).getBoundingClientRect()
      : { left: 0 }

    const left = rect.left - parentRect.left
    const width = rect.width

    if (prevIndex.current === -1) {
      // First time: no animation, just snap
      gsap.set(indicator, { left, width, opacity: 1 })
    } else {
      gsap.to(indicator, {
        left,
        width,
        opacity: 1,
        duration: 0.35,
        ease: 'power3.out',
      })
    }
    prevIndex.current = activeIndex
  }, [activeIndex, navRefs])

  return (
    <div
      ref={indicatorRef}
      className="absolute top-0 h-full rounded-full pointer-events-none"
      style={{
        background:
          'linear-gradient(135deg, color-mix(in srgb, var(--primary) 15%, transparent), color-mix(in srgb, var(--primary) 8%, transparent))',
        boxShadow: '0 0 12px color-mix(in srgb, var(--primary) 20%, transparent)',
        opacity: 0,
      }}
    />
  )
}

// ─────────────────────────────────────────────
// Hamburger / X icon morph button
// ─────────────────────────────────────────────
const HamburgerButton = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) => {
  const btnRef = useRef<HTMLButtonElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!iconRef.current) return
    gsap.to(iconRef.current, {
      rotation: isOpen ? 90 : 0,
      scale: isOpen ? 1.1 : 1,
      duration: 0.3,
      ease: 'back.out(1.7)',
    })
  }, [isOpen])

  const handleClick = () => {
    if (!btnRef.current) return
    gsap.timeline()
      .to(btnRef.current, { scale: 0.88, duration: 0.1, ease: 'power2.in' })
      .to(btnRef.current, { scale: 1, duration: 0.2, ease: 'back.out(2)' })
    onClick()
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={cn(
        'md:hidden relative w-9 h-9 rounded-xl flex items-center justify-center',
        'transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        isOpen
          ? 'bg-primary/10 text-primary'
          : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/70'
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      style={{ willChange: 'transform' }}
    >
      <span ref={iconRef} className="flex items-center justify-center" style={{ willChange: 'transform' }}>
        {isOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
      </span>
    </button>
  )
}

// ─────────────────────────────────────────────
// Mobile Overlay Menu
// ─────────────────────────────────────────────
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
  const mounted = useRef(false)

  useEffect(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    const items = itemsRef.current.filter(Boolean)
    if (!overlay || !panel) return

    if (!mounted.current) {
      // Set initial state
      gsap.set(overlay, { opacity: 0, pointerEvents: 'none' })
      gsap.set(panel, { y: -24, opacity: 0, scale: 0.97 })
      gsap.set(items, { y: 16, opacity: 0 })
      mounted.current = true
      return
    }

    if (isOpen) {
      overlay.style.pointerEvents = 'auto'
      gsap.killTweensOf([overlay, panel, ...items])

      gsap.to(overlay, { opacity: 1, duration: 0.25, ease: 'power2.out' })
      gsap.to(panel, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'expo.out',
      })
      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power3.out',
        delay: 0.1,
      })
    } else {
      gsap.killTweensOf([overlay, panel, ...items])

      // Reverse stagger on close
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
      gsap.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in', delay: 0.05 })
    }
  }, [isOpen])

  // Force mount the effect after first render
  useEffect(() => {
    mounted.current = true
  }, [])

  return (
    <div
      ref={overlayRef}
      className="md:hidden fixed inset-0 z-40"
      style={{ pointerEvents: 'none' }}
    >
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
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
          backdropFilter: 'blur(24px)',
          willChange: 'transform, opacity',
        }}
      >
        {/* Subtle inner glow top */}
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
              item.href === '/'
                ? activeSection === ''
                : activeSection === item.href

            return (
              <Link
                key={item.title}
                to={item.href}
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

        {/* Divider */}
        <div className="mx-4 h-px bg-border/20" />

        {/* Auth section */}
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

        {/* Safe area */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Header
// ─────────────────────────────────────────────
const Header = () => {
  const isLogin = false

  const headerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isScroll, setIsScroll] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeNavIndex, setActiveNavIndex] = useState(0)
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const scrollVelocity = useRef(0)
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(Date.now())
  const isShrunk = useRef(false)
  const tween = useRef<gsap.core.Tween | null>(null)

  // ── Section observer ──
  useEffect(() => {
    const sections = document.querySelectorAll('section')

    const observer = new IntersectionObserver(
      (entries) => {
        let visibleSection = ''
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSection = `#${entry.target.id}`
        })
        if (visibleSection) setActiveSection(visibleSection)
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    )

    sections.forEach((s) => observer.observe(s))
    return () => sections.forEach((s) => observer.unobserve(s))
  }, [])

  // ── Sync active nav index ──
  useEffect(() => {
    const idx = NAV_ITEMS.findIndex((item) =>
      item.href === '/' ? activeSection === '' : activeSection === item.href
    )
    setActiveNavIndex(idx >= 0 ? idx : 0)
  }, [activeSection])

  // ── Scroll-based animation ──
  const handleScroll = useCallback(() => {
    const now = Date.now()
    const dt = now - lastScrollTime.current || 16
    scrollVelocity.current = Math.abs(window.scrollY - lastScrollY.current) / dt
    lastScrollY.current = window.scrollY
    lastScrollTime.current = now

    // velocity factor: faster scroll → snappier transition (capped)
    const speed = Math.min(scrollVelocity.current * 60, 1)
    const baseDuration = 0.45
    const duration = baseDuration - speed * 0.2 // 0.25–0.45s

    const el = headerRef.current
    if (!el) return

    if (window.scrollY > 20 && !isShrunk.current) {
      isShrunk.current = true
      setIsScroll(true)

      if (tween.current) tween.current.kill()
      tween.current = gsap.to(el, {
        maxWidth: '78%',
        height: '52px',
        borderRadius: '9999px',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        y: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(var(--background-rgb, 255,255,255), 0.72)',
        scale: 1,
        duration,
        ease: 'power3.out',
        overwrite: true,
      })
    } else if (window.scrollY <= 20 && isShrunk.current) {
      isShrunk.current = false
      setIsScroll(false)

      if (tween.current) tween.current.kill()
      tween.current = gsap.to(el, {
        maxWidth: '80rem',
        height: '64px',
        borderRadius: '0px',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        y: 0,
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        backdropFilter: 'blur(0px)',
        backgroundColor: 'rgba(0,0,0,0)',
        scale: 1,
        duration: duration + 0.1,
        ease: 'power3.out',
        overwrite: true,
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // ── Close menu on resize ──
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && isOpen) setIsOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isOpen])

  // ── Nav hover glow ──
  const handleNavHover = (el: HTMLAnchorElement | null, entering: boolean) => {
    if (!el) return
    gsap.to(el, {
      scale: entering ? 1.05 : 1,
      duration: 0.2,
      ease: entering ? 'back.out(2)' : 'power2.out',
      overwrite: true,
    })
  }

  return (
    <>
      {/* Full-width fixed header track */}
      <header
        ref={wrapperRef}
        className={cn(
          'w-full fixed top-0 left-0 z-50 flex justify-center',
        )}
        style={{ willChange: 'auto' }}
      >
        {/* Animated ribbon behind header */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <RibbonSVG />
        </div>

        {/* Scroll-based color wash */}
        <div
          className={cn(
            'absolute inset-0 pointer-events-none transition-opacity duration-700',
            isScroll ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--primary) 4%, transparent) 0%, transparent 100%)',
          }}
        />

        {/* Header pill / bar */}
        <div
          ref={headerRef}
          className={cn(
            'w-full max-w-7xl h-16 flex items-center justify-between px-6',
            'relative',
          )}
          style={{ willChange: 'transform, max-width, border-radius, box-shadow, backdrop-filter' }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            style={{ willChange: 'transform' }}
          >
            <span
              className={cn(
                'relative flex items-center justify-center w-7 h-7 rounded-full overflow-hidden',
                'ring-1 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300',
                'shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_0%,transparent)] group-hover:shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_25%,transparent)]'
              )}
            >
              <Image
                src="https://imgs.search.brave.com/f4DZCC5tTEnEpjTBtq61BTqSYeUFK8kpfTQNgsxA0hY/rs:fit:32:32:1:0/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvMjI2MGZjODVi/ODFhZmU0ZmU5MjRh/MjM3YmZlNjM5NmNm/MTRkZGIyNzE3OTk4/MzZmMzc1NGM2ZTc5/MTBhMjcxNy9taW1v/LnhpYW9taS5jb20v"
                alt="logo"
                width={28}
                height={28}
                className="rounded-full"
              />
            </span>
            <span
              className={cn(
                'font-semibold text-xs md:text-sm tracking-wide',
                'bg-clip-text text-transparent',
                'bg-linear-to-r from-foreground to-foreground/70',
                'group-hover:from-primary group-hover:to-primary/70 transition-all duration-300'
              )}
            >
              BMEC 2026
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 relative text-xs">
            {/* Sliding pill indicator */}
            <NavIndicator activeIndex={activeNavIndex} navRefs={navRefs} />

            {NAV_ITEMS.map((item, i) => {
              const isActive =
                item.href === '/'
                  ? activeSection === ''
                  : activeSection === item.href

              return (
                <Link
                  key={item.title}
                  to={item.href}
                  ref={(el) => { navRefs.current[i] = el }}
                  onMouseEnter={(e) => handleNavHover(e.currentTarget, true)}
                  onMouseLeave={(e) => handleNavHover(e.currentTarget, false)}
                  className={cn(
                    'relative px-3 py-1.5 rounded-full z-10 transition-colors duration-200',
                    'select-none',
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-foreground/55 hover:text-foreground/85'
                  )}
                  style={{ willChange: 'transform' }}
                >
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isLogin ? (
              <ToggleUser />
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-full font-medium',
                    'text-foreground/60 hover:text-foreground/90',
                    'transition-colors duration-200'
                  )}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className={cn(
                    'px-4 py-1.5 text-xs rounded-full font-semibold',
                    'bg-primary text-primary-foreground',
                    'hover:opacity-90 active:scale-95 transition-all duration-150',
                    'shadow-[0_2px_12px_color-mix(in_srgb,var(--primary)_35%,transparent)]',
                    'hover:shadow-[0_4px_16px_color-mix(in_srgb,var(--primary)_50%,transparent)]'
                  )}
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <HamburgerButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
        </div>
      </header>

      <MobileMenu
        isOpen={isOpen}
        navItems={NAV_ITEMS}
        activeSection={activeSection}
        isLogin={isLogin}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

export default Header