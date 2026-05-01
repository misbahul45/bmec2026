import React, { useEffect, useRef } from "react"
import TeamTree from "./TeamTree"
import {
  School,
  Mail,
  Phone,
  MapPin,
  Trophy,
  BookOpen,
  Info as InfoIcon,
  GraduationCap,
  Users,
} from "lucide-react"
import gsap from "gsap"
import { TeamWithRelations } from "~/types/team.type"

type Props = {
  data: TeamWithRelations & {
    mentor?: {
      name: string
      email: string
      phone: string
    } | null
  }
}

const competitionLabel: Record<string, string> = {
  OLIMPIADE: "Olimpiade",
  LKTI: "LKTI",
  INFOGRAFIS: "Infografis",
}

const competitionColor: Record<string, string> = {
  OLIMPIADE: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  LKTI: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  INFOGRAFIS: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
}

const ProfileTeam: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const mentorRef = useRef<HTMLDivElement>(null)
  const treeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const infoGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.from(cardRef.current, { opacity: 0, y: 40, scale: 0.97, duration: 0.7 })
        .from(headingRef.current, { opacity: 0, x: -24, duration: 0.45 }, "-=0.3")
        .from(infoGridRef.current?.children ?? [], { opacity: 0, y: 18, stagger: 0.08, duration: 0.4 }, "-=0.25")
        .from(mentorRef.current, { opacity: 0, y: 20, duration: 0.45 }, "-=0.15")
        .from(treeRef.current, { opacity: 0, y: 30, duration: 0.55 }, "-=0.1")

      containerRef.current?.querySelectorAll(".info-item").forEach((item) => {
        const el = item as HTMLElement
        el.addEventListener("mouseenter", () => gsap.to(el, { scale: 1.03, duration: 0.2, ease: "power2.out" }))
        el.addEventListener("mouseleave", () => gsap.to(el, { scale: 1, duration: 0.2, ease: "power2.in" }))
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const mentor = data.mentor ?? null

  return (
    <div ref={containerRef} className="space-y-5 sm:space-y-6 w-full">
      <div ref={cardRef} className="animated-border rounded-3xl overflow-hidden">
        <div className="p-5 sm:p-7 md:p-8 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border
                    ${competitionColor[data.competitionType] ?? "bg-muted text-muted-foreground border-border"}`}
                >
                  <Trophy size={11} />
                  {competitionLabel[data.competitionType] ?? data.competitionType}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-md border">
                  #{data.code}
                </span>
              </div>
              <h1 ref={headingRef} className="text-2xl sm:text-3xl font-bold leading-tight truncate">
                {data.name}
              </h1>
            </div>
          </div>

          <div ref={infoGridRef} className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3 text-sm">
            <InfoItem icon={School} label={data.schoolName} caption="Sekolah / Institusi" />
            <InfoItem icon={MapPin} label={data.schoolAddress} caption="Alamat" />
            <InfoItem icon={Mail} label={data.email} caption="Email Tim" />
            <InfoItem icon={Phone} label={data.phone} caption="WhatsApp Tim" />
            {data.sourceInfo && (
              <InfoItem icon={InfoIcon} label={data.sourceInfo} caption="Sumber Info" className="xs:col-span-2" />
            )}
          </div>
        </div>

        {mentor && (
          <div ref={mentorRef} className="border-t border-border/60 bg-muted/30 px-5 sm:px-7 md:px-8 py-4 sm:py-5">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={15} className="text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/80">
                Mentor Pembimbing
              </span>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-2.5 text-sm">
              <InfoItem icon={BookOpen} label={mentor.name} caption="Nama Mentor" />
              <InfoItem icon={Mail} label={mentor.email} caption="Email Mentor" />
              <InfoItem icon={Phone} label={mentor.phone} caption="WhatsApp Mentor" />
            </div>
          </div>
        )}
      </div>

      <div ref={treeRef} className="space-y-3">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-primary" />
          <h2 className="text-base sm:text-lg font-semibold">Struktur Tim</h2>
          <span className="ml-auto text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded border">
            {data.members.length} anggota
          </span>
        </div>
        <TeamTree team={data} />
      </div>
    </div>
  )
}

export default ProfileTeam

const InfoItem = ({
  icon: Icon,
  label,
  caption,
  className = "",
}: {
  icon: React.ElementType
  label: string
  caption: string
  className?: string
}) => (
  <div
    className={`info-item group flex items-center gap-3 p-3 sm:p-3.5 rounded-xl
      bg-card border border-border/60 cursor-default transition-colors
      hover:border-primary/40 overflow-hidden ${className}`}
  >
    <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
      <Icon size={15} className="text-primary" />
    </div>
    <div className="min-w-0 flex flex-col">
      <span className="text-[10px] text-muted-foreground font-medium leading-none mb-0.5">{caption}</span>
      <span className="truncate text-sm font-medium text-foreground leading-snug">{label}</span>
    </div>
  </div>
)