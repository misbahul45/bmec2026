import { Image } from '@unpic/react'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import ToggleUser from './ToggleUser'
import { NAV_ITEMS } from '~/contants'
import { Link, useLocation } from '@tanstack/react-router'
import gsap from 'gsap'
import { cn } from '~/lib/utils'
import { Menu, X } from 'lucide-react'
import MobileMenu from './MobileMenu'
import RibbonSVG from '../ui/RibbonSVG'
import NavIndicator from './NavIndicator'

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
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isHidden = useRef(false)

  const pathName = useLocation().pathname

  const toggleHome = (href: string) => {
    return pathName === '/' ? href : '/' + href
  }

  useEffect(() => {
    const idToHref = new Map<string, string>()

    NAV_ITEMS.forEach((item) => {
      if (item.href !== '/') {
        const id = item.href.replace(/^#/, '')
        idToHref.set(id, item.href)
      }
    })

    const homeEl =
      document.querySelector<HTMLElement>('section#home') ??
      document.querySelector<HTMLElement>('section')
    if (homeEl?.id) {
      idToHref.set(homeEl.id, '')
    }

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('section')
    ).filter((s) => idToHref.has(s.id))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const href = idToHref.get(entry.target.id) ?? ''
            setActiveSection(href)
          }
          console.log(entry.target.id, entry.isIntersecting)
        })
      },
      { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' }
    )

    sections.forEach((s) => observer.observe(s))
    return () => sections.forEach((s) => observer.unobserve(s))
  }, [])

  useEffect(() => {
    const idx = NAV_ITEMS.findIndex((item) =>
      item.href === '/' ? activeSection === '' : activeSection === item.href
    )
    setActiveNavIndex(idx >= 0 ? idx : 0)
  }, [activeSection])

  const hideHeader = useCallback(() => {
    const el = headerRef.current
    if (!el || isHidden.current) return
    isHidden.current = true
    gsap.to(el, {
      y: -90,
      opacity: 0,
      scale: 0.96,
      duration: 0.55,
      ease: 'power3.inOut',
      overwrite: true,
    })
  }, [])

  const showHeader = useCallback(() => {
    const el = headerRef.current
    if (!el || !isHidden.current) return
    isHidden.current = false
    gsap.to(el, {
      y: isShrunk.current ? 14 : 0,
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'expo.out',
      overwrite: true,
    })
  }, [])

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    showHeader()
    if (window.scrollY > 20) {
      idleTimer.current = setTimeout(hideHeader, 2000)
    }
  }, [hideHeader, showHeader])

  const handleScroll = useCallback(() => {
    const now = Date.now()
    const dt = now - lastScrollTime.current || 16
    scrollVelocity.current = Math.abs(window.scrollY - lastScrollY.current) / dt
    lastScrollY.current = window.scrollY
    lastScrollTime.current = now

    const speed = Math.min(scrollVelocity.current * 60, 1)
    const duration = 0.45 - speed * 0.2

    const el = headerRef.current
    if (!el) return

    resetIdleTimer()

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
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [handleScroll, resetIdleTimer])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && isOpen) setIsOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isOpen])

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
      <header
        ref={wrapperRef}
        className="w-full fixed top-0 left-0 z-50 flex justify-center"
        style={{ willChange: 'auto' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <RibbonSVG />
        </div>

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

        <div
          ref={headerRef}
          className="w-full max-w-7xl h-16 flex items-center justify-between px-2 md:justify-around md:px-4 relative"
          style={{ willChange: 'transform, max-width, border-radius, box-shadow, backdrop-filter' }}
        >
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

          <nav className="hidden md:flex items-center gap-0.5 relative text-xs">
            <NavIndicator isScroll={isScroll} activeIndex={activeNavIndex} navRefs={navRefs} />

            {NAV_ITEMS.map((item, i) => {
              const isActive =
                item.href === '/' ? activeSection === '' : activeSection === item.href

              return (
                <Link
                  key={item.title}
                  to={toggleHome(item.href)}
                  ref={(el) => { navRefs.current[i] = el }}
                  onMouseEnter={(e) => handleNavHover(e.currentTarget, true)}
                  onMouseLeave={(e) => handleNavHover(e.currentTarget, false)}
                  className={cn(
                    'relative px-3 py-1.5 rounded-full z-10 transition-colors duration-200 select-none',
                    isActive
                      ? 'text-black font-medium'
                      : 'text-foreground/55 hover:text-foreground/85'
                  )}
                  style={{ willChange: 'transform' }}
                >
                  {item.title}
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {isLogin ? (
              <ToggleUser />
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-full font-medium',
                    'text-foreground/60 hover:text-foreground/90 transition-colors duration-200'
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