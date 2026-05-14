import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

const TARGET_DATE = new Date('2026-05-25T00:00:00')

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const diff = TARGET_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center size-18 rounded-xl bg-primary/5 border border-primary/20 font-mono text-2xl font-semibold tracking-tight text-gray-900">
        {pad(value)}
      </div>
      <span className="text-[9px] tracking-[0.14em] uppercase text-gray-900 font-semibold">
        {label}
      </span>
    </div>
  )
}

function Separator() {
  return (
    <span className="font-mono text-2xl font-semibold text-gray-900 mb-4.5 select-none">
      :
    </span>
  )
}

export default function CountdownWaiting() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.gsap-header', { y: 20, opacity: 0, duration: 0.6 })
        .from('.gsap-unit', { y: 25, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
        .from('.gsap-sep', { opacity: 0, duration: 0.4, stagger: 0.05 }, '-=0.4')
        .from('.gsap-countdown-sub', { opacity: 0, y: 10, duration: 0.4 }, '-=0.2')
        .from('.gsap-info-card', { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
        .from('.gsap-footer', { opacity: 0, duration: 0.3 }, '-=0.1')
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const isPast = TARGET_DATE.getTime() <= Date.now()

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen w-full px-8 py-12 relative overflow-hidden bg-secondary/5"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -top-32 -right-32 rounded-full w-100 h-100 bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 rounded-full w-96 h-96 bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-sm text-center">
        <div className="flex flex-col items-center gap-3 gsap-header">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 leading-tight">
            BMEC 2026
          </h1>
          <p className="text-sm text-gray-900 leading-relaxed max-w-[260px]">
            {isPast
              ? 'Platform pendaftaran sudah dibuka. Silakan masuk.'
              : 'Platform pendaftaran akan dibuka pada 25 Mei 2026.'}
          </p>
        </div>

        {!isPast && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-end gap-3 gsap-countdown">
              <div className="gsap-unit">
                <CountdownUnit value={timeLeft.days} label="Hari" />
              </div>
              <span className="gsap-sep"><Separator /></span>
              <div className="gsap-unit">
                <CountdownUnit value={timeLeft.hours} label="Jam" />
              </div>
              <span className="gsap-sep"><Separator /></span>
              <div className="gsap-unit">
                <CountdownUnit value={timeLeft.minutes} label="Menit" />
              </div>
              <span className="gsap-sep"><Separator /></span>
              <div className="gsap-unit">
                <CountdownUnit value={timeLeft.seconds} label="Detik" />
              </div>
            </div>
            <p className="text-[10px] tracking-[0.1em] uppercase text-gray-900 gsap-countdown-sub">
              Menuju 25 Mei 2026
            </p>
          </div>
        )}

        <div className="w-full rounded-xl p-5 flex flex-col gap-3 border border-primary/15 bg-secondary/90 gsap-info-card">
          {[
            ['3', 'Cabang Lomba'],
            ['Rp20jt', 'Total Hadiah'],
            ['25 Mei', 'Pendaftaran'],
          ].map(([val, lbl]) => (
            <div
              key={lbl}
              className="flex items-center justify-between border-b border-primary/10 pb-2.5"
            >
              <span className="text-xs text-gray-900 tracking-widest">
                {lbl}
              </span>
              <span className="font-mono text-sm font-bold text-gray-900">
                {val}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-900 tracking-widest">
              Penyelenggara
            </span>
            <span className="text-[11px] font-semibold text-gray-900 text-right">
              Univ. Airlangga · Surabaya
            </span>
          </div>
        </div>

        <p className="text-[10px]  text-gray-900 tracking-widest gsap-footer">
          Biomedical Engineering Competition
        </p>
      </div>
    </div>
  )
}