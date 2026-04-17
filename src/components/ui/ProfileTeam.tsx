import React, { useEffect, useRef } from "react"
import TeamTree from "./TeamTree"
import { School, Mail, Phone, Hash, Users } from "lucide-react"
import gsap from "gsap"
import { Badge } from "./badge"
import { TeamWithRelations } from "~/types/team.type"

type Props = {
  data: TeamWithRelations
}

const ProfileTeam: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const treeRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const infoGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.from(cardRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.97,
        duration: 0.7,
      })
        .from(
          badgeRef.current,
          {
            opacity: 0,
            x: 20,
            duration: 0.4,
          },
          "-=0.3"
        )
        .from(
          headingRef.current,
          {
            opacity: 0,
            x: -24,
            duration: 0.45,
          },
          "-=0.25"
        )
        .from(
          infoGridRef.current?.children ?? [],
          {
            opacity: 0,
            y: 18,
            stagger: 0.1,
            duration: 0.4,
          },
          "-=0.2"
        )
        .from(
          treeRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.55,
          },
          "-=0.1"
        )

      const infoItems = infoGridRef.current?.querySelectorAll(".info-item")
      infoItems?.forEach((item) => {
        const el = item as HTMLElement
        el.addEventListener("mouseenter", () => {
          gsap.to(el, { scale: 1.03, duration: 0.22, ease: "power2.out" })
        })
        el.addEventListener("mouseleave", () => {
          gsap.to(el, { scale: 1, duration: 0.22, ease: "power2.in" })
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-6 sm:space-y-8 w-full">
      <div ref={cardRef} className="animated-border p-5 sm:p-7 md:p-8 rounded-3xl relative">
        <div ref={badgeRef} className="absolute top-4 right-4">
          <Badge
            className="rounded-md shadow-2xl shadow-accent/50 text-xs sm:text-sm"
            variant="secondary"
          >
            {data.competitionType}
          </Badge>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 mt-6 sm:mt-0">
          <h1
            ref={headingRef}
            className="text-2xl sm:text-3xl font-bold pr-24 leading-tight"
          >
            {data.name}
          </h1>

          <div
            ref={infoGridRef}
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 text-sm"
          >
            <Info icon={School} label={data.schoolName} />
            <Info icon={Hash} label={data.code} />
            <Info icon={Mail} label={data.email} />
            <Info icon={Phone} label={data.phone} />
          </div>
        </div>
      </div>

      <div ref={treeRef} className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <Users size={18} />
          Team Structure
        </h2>

        <TeamTree team={data} />
      </div>
    </div>
  )
}

export default ProfileTeam

const Info = ({
  icon: Icon,
  label,
}: {
  icon: any
  label: string
}) => (
  <div className="info-item flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-card border cursor-default transition-colors hover:border-primary/40 overflow-hidden">
    <Icon className="text-primary shrink-0" size={18} />
    <span className="truncate">{label}</span>
  </div>
)