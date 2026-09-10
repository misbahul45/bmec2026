import { useSuspenseQuery } from '@tanstack/react-query'
import { BookOpen, Clock, CheckCircle2, Hourglass, Lock, Trophy } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { examsByCompetitionTypeQueryOptions } from '~/lib/api/exams/exam.query-options'
import { PaymentStatus } from '@prisma/client'
import { useEffect, useState } from 'react'

function formatCountdown(target: Date, now: Date) {
  const ms = target.getTime() - now.getTime()
  if (ms <= 0) return null
  const totalMinutes = Math.floor(ms / 60000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) return `${days} hari ${hours} jam lagi`
  if (hours > 0) return `${hours} jam ${minutes} menit lagi`
  if (minutes > 0) return `${minutes} menit lagi`
  return 'kurang dari 1 menit lagi'
}

type Props = {
  registrationStatus?: PaymentStatus | null
  teamId: string
  batch?: {
    name: string
    price: number
    startDate: string | Date
    endDate: string | Date
    module_bacth: string
  } | null
}

export function OlimpiadeSection({ registrationStatus, teamId }: Props) {
  if (!registrationStatus) {
    return (
      <div className="rounded-2xl bg-background shadow border p-6 flex flex-col items-center gap-3 text-center">
        <Lock size={32} className="text-muted-foreground/50" />
        <p className="font-semibold text-base">Belum Mendaftar</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Kamu belum mendaftar ke kompetisi Olimpiade.
        </p>
      </div>
    )
  }

  if (registrationStatus === 'PENDING') {
    return (
      <div className="rounded-2xl bg-background shadow border p-6 flex flex-col items-center gap-3 text-center">
        <Lock size={32} className="text-muted-foreground/50" />
        <p className="font-semibold text-base">Registrasi Belum Diverifikasi</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Bukti pembayaran kamu sedang dalam proses verifikasi oleh panitia. Ujian akan tersedia setelah registrasi disetujui.
        </p>
        <Badge variant="outline" className="mt-1">Menunggu Verifikasi</Badge>
      </div>
    )
  }

  if (registrationStatus !== 'APPROVED') {
    return (
      <div className="rounded-2xl bg-background shadow border p-6 flex flex-col items-center gap-3 text-center">
        <Lock size={32} className="text-destructive/70" />
        <p className="font-semibold text-base">Registrasi Tidak Aktif</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Ujian hanya tersedia untuk tim dengan registrasi yang telah disetujui.
        </p>
      </div>
    )
  }

  return <ExamList teamId={teamId} />
}

function ExamList({ teamId }: { teamId: string }) {
  const { data: res } = useSuspenseQuery(examsByCompetitionTypeQueryOptions('OLIMPIADE', teamId))
  const exams: any[] = res.data ?? []
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(interval)
  }, [])

  if (exams.length === 0) {
    return (
      <div className="rounded-2xl bg-background shadow border p-6 text-center text-muted-foreground text-sm">
        Belum ada ujian yang tersedia saat ini.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2 text-base">
        <Trophy size={16} className="text-primary" />
        Ujian Tersedia
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {exams.map((exam) => {
          const attempt = exam.attempts?.[0]
          const isFinished = Boolean(attempt?.finished)
          const isStarted = Boolean(attempt && !attempt.finished)
          const hasSessions =
            exam.type === 'OLYMPIAD' && (exam.sessions?.length ?? 0) > 0
          const mySession = hasSessions
            ? (exam.sessions as any[]).find(
                (s: any) => (s.assignments?.length ?? 0) > 0,
              )
            : undefined

          // Status default: hitung dari window exam (TRYOUT + fallback OLYMPIAD tanpa sesi)
          let isActive = now >= new Date(exam.startDate) && now <= new Date(exam.endDate)
          let isUpcoming = now < new Date(exam.startDate)
          let isEnded = now > new Date(exam.endDate)
          let badgeText = isFinished ? null : isActive ? 'Aktif' : isUpcoming ? 'Segera' : 'Ditutup'
          let lockMessage: string | null = null
          let sessionInfo: { name: string; range: string } | null = null

          if (hasSessions) {
            if (!mySession) {
              isActive = false
              isUpcoming = false
              isEnded = false
              badgeText = 'Tidak Terjadwal'
              lockMessage = 'Tim kamu belum di-assign ke sesi ujian.'
            } else {
              const sStart = new Date(mySession.startTime)
              const sEnd = new Date(mySession.endTime)
              const fmtDayTime = (d: Date) =>
                d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) +
                ' · ' +
                d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              sessionInfo = {
                name: mySession.name,
                range: `${fmtDayTime(sStart)} – ${fmtDayTime(sEnd)}`,
              }

              if (isFinished) {
                isActive = false; isUpcoming = false; isEnded = false
              } else if (now > new Date(exam.endDate)) {
                // Hard-stop: exam endDate tercapai — tim mana pun, durasi berapa pun
                isActive = false; isUpcoming = false; isEnded = true
                badgeText = 'Waktu Habis'
                lockMessage = 'Waktu pengerjaan ujian telah berakhir.'
              } else if (isStarted) {
                // Sudah mulai → boleh lanjut walau sesi lewat (D3); deadline dijaga server
                isActive = true; isUpcoming = false; isEnded = false
                badgeText = 'Aktif'
              } else if (now < sStart) {
                isActive = false; isUpcoming = true; isEnded = false
                badgeText = 'Belum Dimulai'
                lockMessage = 'Sesi kamu belum dimulai.'
              } else if (now <= sEnd) {
                isActive = true; isUpcoming = false; isEnded = false
                badgeText = 'Aktif'
              } else {
                isActive = false; isUpcoming = false; isEnded = true
                badgeText = 'Waktu Habis'
                lockMessage = 'Sesi kamu telah berakhir.'
              }
            }
          }

          return (
            <div key={exam.id} className="rounded-2xl bg-background shadow border p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm">{exam.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{exam.stage?.name}</p>
                </div>
                {isFinished ? (
                  <Badge variant="secondary" className="shrink-0 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">Selesai</Badge>
                ) : (
                  <Badge variant={isActive ? 'default' : isEnded ? 'secondary' : 'outline'} className="shrink-0">{badgeText}</Badge>
                )}
              </div>

              <div className="space-y-1.5">
                {sessionInfo ? (
                  <>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {sessionInfo.name} · Mulai {sessionInfo.range.split('–')[0].split('·')[1]?.trim()}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>Mulai sesimu: {sessionInfo.range}</span>
                    </div>
                    {mySession && (() => {
                      const sStart = new Date(mySession.startTime)
                      const sEnd = new Date(mySession.endTime)
                      if (isFinished || isEnded) return null
                      if (now < sStart) {
                        const cd = formatCountdown(sStart, now)
                        if (!cd) return null
                        return (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                            <Hourglass size={12} />
                            Dimulai {cd}
                          </div>
                        )
                      }
                      if (now <= sEnd) {
                        const remaining = formatCountdown(sEnd, now)
                        if (!remaining) return null
                        return (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                            <Clock size={12} />
                            Sesi berakhir {remaining}
                          </div>
                        )
                      }
                      return null
                    })()}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>Mulai: {new Date(exam.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>Selesai: {new Date(exam.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {isUpcoming && !hasSessions && (() => {
                      const cd = formatCountdown(new Date(exam.startDate), now)
                      if (!cd) return null
                      return (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                          <Hourglass size={12} />
                          Dimulai {cd}
                        </div>
                      )
                    })()}
                  </>
                )}
              </div>

              {lockMessage ? (
                <Button size="sm" variant="outline" className="w-full rounded-xl" disabled>
                  <Lock size={13} className="mr-1.5" />
                  {lockMessage}
                </Button>
              ) : isFinished ? (
                exam.type === 'TRYOUT' ? (
                  <Button size="sm" variant="outline" className="w-full rounded-xl" asChild>
                    <a href={`/dashboard/team/exam/${exam.id}/review`}>
                      <BookOpen size={13} className="mr-1.5" />
                      Lihat Pembahasan
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" className="w-full rounded-xl" disabled>
                    <CheckCircle2 size={13} className="mr-1.5" />
                    Selesai Dikerjakan
                  </Button>
                )
              ) : isActive ? (
                <Button size="sm" className="w-full rounded-xl" asChild>
                  <a href={`/dashboard/team/exam/${exam.id}`}>
                    <BookOpen size={13} className="mr-1.5" />
                    {isStarted ? 'Lanjutkan Ujian' : 'Mulai Kerjakan'}
                  </a>
                </Button>
              ) : isUpcoming ? (
                <Button size="sm" variant="outline" className="w-full rounded-xl" disabled>
                  <Clock size={13} className="mr-1.5" />
                  Belum Dimulai
                </Button>
              ) : (
                <Button size="sm" variant="ghost" className="w-full rounded-xl" disabled>
                  <Clock size={13} className="mr-1.5" />
                  Waktu Habis
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
