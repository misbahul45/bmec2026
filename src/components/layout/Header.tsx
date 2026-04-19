import { Image } from '@unpic/react'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { NAV_ITEMS } from '~/contants'
import { Link, useLocation, useRouteContext, useRouter } from '@tanstack/react-router'
import gsap from 'gsap'
import { cn, toggleHome } from '~/lib/utils'
import { Menu, X, LayoutDashboard, LogOut, ChevronDown, Loader2, Users, ClipboardList, Trophy, FileText } from 'lucide-react'
import MobileMenu from './MobileMenu'
import RibbonSVG from '../ui/RibbonSVG'
import NavIndicator from './NavIndicator'
import { logoutFn } from '~/server/auth'
import { useMutation } from '@tanstack/react-query'

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
        'lg:hidden relative w-9 h-9 rounded-xl flex items-center justify-center',
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

const UserDropdown = ({
  user,
}: {
  user: { email?: string; role?: string } | null
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const chevronRef = useRef<SVGSVGElement>(null)
  const router = useRouter()

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => logoutFn(),
    onSuccess: () => {
      closeDropdown()
      router.navigate({ to: '/auth/login' })
    },
  })

  const openDropdown = useCallback(() => {
    if (!menuRef.current) return
    setIsOpen(true)
    gsap.set(menuRef.current, { display: 'block', opacity: 0, y: -8, scale: 0.96 })
    gsap.to(menuRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'back.out(1.4)' })
    gsap.to(chevronRef.current, { rotation: 180, duration: 0.25, ease: 'power2.out' })
    const items = menuRef.current.querySelectorAll('[data-menu-item]')
    gsap.fromTo(items,
      { opacity: 0, x: -6 },
      { opacity: 1, x: 0, duration: 0.2, stagger: 0.06, ease: 'power2.out', delay: 0.05 }
    )
  }, [])

  const closeDropdown = useCallback(() => {
    if (!menuRef.current) return
    gsap.to(menuRef.current, {
      opacity: 0, y: -6, scale: 0.96, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        if (menuRef.current) gsap.set(menuRef.current, { display: 'none' })
        setIsOpen(false)
      }
    })
    gsap.to(chevronRef.current, { rotation: 0, duration: 0.2, ease: 'power2.in' })
  }, [])

  const toggleDropdown = () => isOpen ? closeDropdown() : openDropdown()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        if (isOpen) closeDropdown()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, closeDropdown])

  const handleItemHover = (el: HTMLElement | null, entering: boolean) => {
    if (!el) return
    gsap.to(el, { x: entering ? 3 : 0, duration: 0.18, ease: entering ? 'power2.out' : 'power2.in' })
  }

  const handleLogout = () => {
    const btn = document.querySelector('[data-logout-btn]') as HTMLElement
    if (btn) {
      gsap.timeline()
        .to(btn, { scale: 0.95, duration: 0.1 })
        .to(btn, { scale: 1, duration: 0.15, ease: 'back.out(2)' })
    }
    logout()
  }

  const email = user?.email ?? ''
  const initial = email.charAt(0).toUpperCase() || 'U'

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggleDropdown}
        className={cn(
          'flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium',
          'transition-all duration-200 focus:outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary/50',
          isOpen
            ? 'bg-primary/10 text-primary'
            : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground'
        )}
        style={{ willChange: 'transform' }}
      >
        <span className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold',
          'bg-primary text-primary-foreground ring-2 ring-primary/30 transition-all duration-200',
        )}>
          {initial}
        </span>
        <span className="hidden xl:block max-w-20 truncate text-[11px]">
          {email.split('@')[0]}
        </span>
        <ChevronDown
          ref={chevronRef}
          size={12}
          strokeWidth={2.5}
          className="opacity-60"
          style={{ willChange: 'transform' }}
        />
      </button>

      <div
        ref={menuRef}
        className={cn(
          'absolute right-0 top-[calc(100%+8px)] w-52',
          'rounded-2xl border border-foreground/8 shadow-xl shadow-black/10',
          'bg-background/90 backdrop-blur-2xl overflow-hidden z-50',
        )}
        style={{ display: 'none', willChange: 'transform, opacity' }}
      >
        <div className="px-4 py-3 border-b border-foreground/6">
          <div className="flex items-center gap-2.5">
            <span className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
              'bg-linear-to-br from-primary to-primary/70 text-primary-foreground',
            )}>
              {initial}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-foreground truncate">
                {email.split('@')[0]}
              </p>
              <p className="text-[10px] text-foreground/40 truncate">{email}</p>
            </div>
          </div>
        </div>

        <div className="p-1.5 flex flex-col gap-0.5">
          {user?.role === 'ADMIN' ? (
            <>
              <p className="px-3 pt-1 pb-0.5 text-[9px] font-semibold uppercase tracking-widest text-foreground/30">
                Management
              </p>

              <Link
                to="/dashboard/admin"
                onClick={closeDropdown}
                data-menu-item
                onMouseEnter={(e) => handleItemHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleItemHover(e.currentTarget, false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs',
                  'text-foreground/70 hover:text-foreground',
                  'hover:bg-foreground/5 transition-colors duration-150',
                )}
              >
                <LayoutDashboard size={14} className="text-primary/70 shrink-0" />
                <span className="font-medium">Home</span>
              </Link>

              <Link
                to="/dashboard/admin/teams"
                onClick={closeDropdown}
                data-menu-item
                onMouseEnter={(e) => handleItemHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleItemHover(e.currentTarget, false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs',
                  'text-foreground/70 hover:text-foreground',
                  'hover:bg-foreground/5 transition-colors duration-150',
                )}
              >
                <Users size={14} className="text-primary/70 shrink-0" />
                <span className="font-medium">Teams</span>
              </Link>

              <Link
                to="/dashboard/admin/exams"
                onClick={closeDropdown}
                data-menu-item
                onMouseEnter={(e) => handleItemHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleItemHover(e.currentTarget, false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs',
                  'text-foreground/70 hover:text-foreground',
                  'hover:bg-foreground/5 transition-colors duration-150',
                )}
              >
                <ClipboardList size={14} className="text-primary/70 shrink-0" />
                <span className="font-medium">Exams</span>
              </Link>

              <Link
                to="/dashboard/admin/submissions"
                onClick={closeDropdown}
                data-menu-item
                onMouseEnter={(e) => handleItemHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleItemHover(e.currentTarget, false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs',
                  'text-foreground/70 hover:text-foreground',
                  'hover:bg-foreground/5 transition-colors duration-150',
                )}
              >
                <FileText size={14} className="text-primary/70 shrink-0" />
                <span className="font-medium">Submissions</span>
              </Link>

              <Link
                to="/dashboard/admin/scoreboard"
                onClick={closeDropdown}
                data-menu-item
                onMouseEnter={(e) => handleItemHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleItemHover(e.currentTarget, false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs',
                  'text-foreground/70 hover:text-foreground',
                  'hover:bg-foreground/5 transition-colors duration-150',
                )}
              >
                <Trophy size={14} className="text-primary/70 shrink-0" />
                <span className="font-medium">Scoreboard</span>
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard/team"
              onClick={closeDropdown}
              data-menu-item
              onMouseEnter={(e) => handleItemHover(e.currentTarget, true)}
              onMouseLeave={(e) => handleItemHover(e.currentTarget, false)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs',
                'text-foreground/70 hover:text-foreground',
                'hover:bg-foreground/5 transition-colors duration-150',
                'focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40',
              )}
              style={{ willChange: 'transform' }}
            >
              <LayoutDashboard size={14} strokeWidth={2} className="text-primary/70 shrink-0" />
              <span className="font-medium">Dashboard</span>
            </Link>
          )}

          <div className="my-1 border-t border-foreground/6" />

          <button
            data-menu-item
            data-logout-btn
            onClick={handleLogout}
            disabled={isPending}
            onMouseEnter={(e) => handleItemHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleItemHover(e.currentTarget, false)}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs w-full',
              'text-rose-500/80 hover:text-rose-500',
              'hover:bg-rose-500/8 transition-colors duration-150',
              'focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-400/40',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            style={{ willChange: 'transform' }}
          >
            {isPending ? (
              <Loader2 size={14} strokeWidth={2} className="animate-spin shrink-0" />
            ) : (
              <LogOut size={14} strokeWidth={2} className="shrink-0" />
            )}
            <span className="font-medium">
              {isPending ? 'Logging out…' : 'Logout'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

const Header = () => {
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
  const { user } = useRouteContext({ from: '__root__' })
  const isLoggedIn = !!user

  useEffect(() => {
    if (isLoggedIn) return

    const getSectionIds = () =>
      NAV_ITEMS.map((item) => item.href.replace(/^#/, '')).filter(Boolean)

    const getActiveId = () => {
      const offset = 100
      const ids = getSectionIds()
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= offset) current = id
      }
      return '#' + current
    }

    const onScroll = () => {
      const active = getActiveId()
      setActiveSection((prev) => (prev === active ? prev : active))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLoggedIn])

  useEffect(() => {
    if (isLoggedIn) return
    const idx = NAV_ITEMS.findIndex((item) => item.href === activeSection)
    setActiveNavIndex(idx >= 0 ? idx : 0)
  }, [activeSection, isLoggedIn])

  const hideHeader = useCallback(() => {
    if (isLoggedIn) return
    const el = headerRef.current
    if (!el || isHidden.current) return
    isHidden.current = true
    gsap.to(el, { y: -90, opacity: 0, scale: 0.96, duration: 0.55, ease: 'power3.inOut', overwrite: true })
  }, [isLoggedIn])

  const showHeader = useCallback(() => {
    const el = headerRef.current
    if (!el || !isHidden.current) return
    isHidden.current = false
    gsap.to(el, { y: isShrunk.current ? 14 : 0, opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out', overwrite: true })
  }, [])

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    showHeader()
    if (!isLoggedIn && window.scrollY > 20 && !isOpen) {
      idleTimer.current = setTimeout(hideHeader, 2000)
    }
  }, [hideHeader, showHeader, isOpen, isLoggedIn])

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
        maxWidth: '78%', height: '52px', borderRadius: '9999px',
        paddingLeft: '1rem', paddingRight: '1rem', y: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(var(--background-rgb, 255,255,255), 0.72)',
        scale: 1, duration, ease: 'power3.out', overwrite: true,
      })
    } else if (window.scrollY <= 20 && isShrunk.current) {
      isShrunk.current = false
      setIsScroll(false)
      if (tween.current) tween.current.kill()
      tween.current = gsap.to(el, {
        maxWidth: '80rem', height: '64px', borderRadius: '0px',
        paddingLeft: '1.5rem', paddingRight: '1.5rem', y: 0,
        boxShadow: '0 0 0 rgba(0,0,0,0)', backdropFilter: 'blur(0px)',
        backgroundColor: 'rgba(0,0,0,0)',
        scale: 1, duration: duration + 0.1, ease: 'power3.out', overwrite: true,
      })
    }
  }, [resetIdleTimer])

  useEffect(() => {
    if (isLoggedIn && isHidden.current) showHeader()
    if (isLoggedIn && idleTimer.current) {
      clearTimeout(idleTimer.current)
      idleTimer.current = null
    }
  }, [isLoggedIn, showHeader])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [handleScroll, resetIdleTimer])

  useEffect(() => {
    if (isOpen) {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      showHeader()
    } else {
      if (!isLoggedIn && window.scrollY > 20) {
        idleTimer.current = setTimeout(hideHeader, 2000)
      }
    }
  }, [isOpen, hideHeader, showHeader, isLoggedIn])

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
            background: 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 4%, transparent) 0%, transparent 100%)',
          }}
        />

        <div
          ref={headerRef}
          className="w-full max-w-7xl h-16 flex items-center justify-between px-2 md:px-4 relative"
          style={{ willChange: 'transform, max-width, border-radius, box-shadow, backdrop-filter' }}
        >
          <Link to="/" className="flex items-center gap-2 group" style={{ willChange: 'transform' }}>
            <span className={cn(
              'relative flex items-center justify-center w-7 h-7 rounded-full overflow-hidden',
              'ring-1 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300',
              'shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_0%,transparent)] group-hover:shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_25%,transparent)]'
            )}>
              <Image
                src="https://imgs.search.brave.com/f4DZCC5tTEnEpjTBtq61BTqSYeUFK8kpfTQNgsxA0hY/rs:fit:32:32:1:0/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvMjI2MGZjODVi/ODFhZmU0ZmU5MjRh/MjM3YmZlNjM5NmNm/MTRkZGIyNzE3OTk4/MzZmMzc1NGM2ZTc5/MTBhMjcxNy9taW1v/LnhpYW9taS5jb20v"
                alt="logo"
                width={28}
                height={28}
                className="rounded-full"
              />
            </span>
            <span className={cn(
              'font-semibold text-xs md:text-sm tracking-wide',
              'bg-clip-text text-transparent',
              'bg-linear-to-r from-foreground to-foreground/70',
              'group-hover:from-primary group-hover:to-primary/70 transition-all duration-300'
            )}>
              BMEC 2026
            </span>
          </Link>

          {!isLoggedIn && (
            <nav className="hidden lg:flex items-center gap-0.5 relative text-xs">
              <NavIndicator isScroll={isScroll} activeIndex={activeNavIndex} navRefs={navRefs} />
              {NAV_ITEMS.map((item, i) => {
                const isActive = activeSection === item.href
                return (
                  <Link
                    key={item.title}
                    to={toggleHome(pathName, item.href)}
                    ref={(el) => { navRefs.current[i] = el }}
                    onMouseEnter={(e) => handleNavHover(e.currentTarget, true)}
                    onMouseLeave={(e) => handleNavHover(e.currentTarget, false)}
                    className={cn(
                      'relative px-3 py-1.5 rounded-full z-10 transition-colors duration-200 select-none text-[10px]',
                      isActive ? 'text-black font-medium' : 'text-foreground/55 hover:text-foreground/85'
                    )}
                    style={{ willChange: 'transform' }}
                  >
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          )}

          <div className="hidden lg:flex items-center gap-2">
            {isLoggedIn ? (
              <UserDropdown user={user} />
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-full font-medium bg-background/20 border-2 backdrop-blur-sm',
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
        isLogin={isLoggedIn}
        user={user}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

export default Header