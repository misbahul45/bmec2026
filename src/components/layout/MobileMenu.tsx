import { Link, useLocation, useRouter } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import { NAV_ITEMS } from "~/contants"
import { cn } from "~/lib/utils"
import gsap from "gsap"
import { LayoutDashboard, LogOut, Loader2, Users, ClipboardList, Trophy, FileText } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { logoutFn } from "~/server/auth"

const MobileUserSection = ({
  user,
  onClose,
}: {
  user: { email?: string; role?: string } | null
  onClose: () => void
}) => {
  const router = useRouter()

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => logoutFn(),
    onSuccess: () => {
      onClose()
      router.navigate({ to: '/auth/login' })
    },
  })

  const email = user?.email ?? ''
  const initial = email.charAt(0).toUpperCase() || 'U'
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-foreground/3">
        <span className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{email.split('@')[0]}</p>
          <p className="text-[10px] text-foreground/40 truncate">{email}</p>
        </div>
      </div>

      {isAdmin ? (
        <>
          <p className="px-3 pt-2 pb-0.5 text-[9px] font-semibold uppercase tracking-widest text-foreground/30">
            Management
          </p>

          <Link
            to="/dashboard/admin/teams"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors font-medium"
          >
            <Users size={15} strokeWidth={2} className="text-primary/70 shrink-0" />
            <span>Teams</span>
          </Link>

          <Link
            to="/dashboard/admin/exams"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors font-medium"
          >
            <ClipboardList size={15} strokeWidth={2} className="text-primary/70 shrink-0" />
            <span>Exams</span>
          </Link>

          <Link
            to="/dashboard/admin/submissions"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors font-medium"
          >
            <FileText size={15} strokeWidth={2} className="text-primary/70 shrink-0" />
            <span>Submissions</span>
          </Link>

          <Link
            to="/dashboard/admin/scoreboard"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors font-medium"
          >
            <Trophy size={15} strokeWidth={2} className="text-primary/70 shrink-0" />
            <span>Scoreboard</span>
          </Link>
        </>
      )  : (
        <Link
          to="/dashboard/team"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors font-medium"
        >
          <LayoutDashboard size={15} strokeWidth={2} className="text-primary/70 shrink-0" />
          <span>Dashboard</span>
        </Link>
      )}

      <div className="my-1 border-t border-foreground/6" />

      <button
        onClick={() => logout()}
        disabled={isPending}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/8 transition-colors disabled:opacity-50 w-full font-medium"
      >
        {isPending
          ? <Loader2 size={15} strokeWidth={2} className="animate-spin shrink-0" />
          : <LogOut size={15} strokeWidth={2} className="shrink-0" />
        }
        <span>{isPending ? 'Logging out…' : 'Logout'}</span>
      </button>
    </div>
  )
}

const MobileMenu = ({
  isOpen,
  navItems,
  activeSection,
  isLogin,
  user,
  onClose,
}: {
  isOpen: boolean
  navItems: typeof NAV_ITEMS
  activeSection: string
  isLogin: boolean
  user: { email?: string; role?: string } | null
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

      gsap.fromTo(overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      )

      gsap.fromTo(panel,
        { y: -24, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' }
      )

      gsap.fromTo(items,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.1 }
      )
    } else {
      gsap.to([...items].reverse(), {
        y: 10, opacity: 0, duration: 0.2, stagger: 0.04, ease: 'power2.in',
      })

      gsap.to(panel, {
        y: -16, opacity: 0, scale: 0.97, duration: 0.3, ease: 'power3.in', delay: 0.05,
        onComplete: () => { overlay.style.pointerEvents = 'none' },
      })

      gsap.to(overlay, {
        opacity: 0, duration: 0.3, ease: 'power2.in', delay: 0.05,
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
          background: 'linear-gradient(145deg, color-mix(in srgb, var(--background) 92%, var(--primary)), var(--background))',
          backdropFilter: 'blur(10px)',
          willChange: 'transform, opacity',
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--primary) 40%, transparent), transparent)',
          }}
        />

        {!isLogin && (
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map((item, i) => {
              const isActive = item.href === '/' ? activeSection === '' : activeSection === item.href
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
        )}

        {!isLogin && <div className="mx-4 h-px bg-border/20" />}

        <div
          className="p-4"
          ref={(el) => { itemsRef.current[isLogin ? 0 : navItems.length] = el }}
          style={{ willChange: 'transform, opacity' }}
        >
          {isLogin ? (
            <MobileUserSection user={user} onClose={onClose} />
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