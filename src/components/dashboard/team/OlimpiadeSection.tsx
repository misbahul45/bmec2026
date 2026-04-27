import { useSuspenseQuery } from '@tanstack/react-query'
import { BookOpen, Clock, CheckCircle2, Lock, Trophy } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { examsByCompetitionTypeQueryOptions } from '~/lib/api/exams/exam.query-options'
import { PaymentStatus } from '@prisma/client'

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

export function OlimpiadeSection({ registrationStatus }: Props) {
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

  return <ExamList />
}

function ExamList() {
  const { data: res } = useSuspenseQuery(examsByCompetitionTypeQueryOptions('OLIMPIADE'))
  const exams: any[] = res.data ?? []
  const now = new Date()

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
          const start = new Date(exam.startDate)
          const end = new Date(exam.endDate)
          const isActive = now >= start && now <= end
          const isEnded = now > end
          const isUpcoming = now < start

          return (
            <div key={exam.id} className="rounded-2xl bg-background shadow border p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm">{exam.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{exam.stage?.name}</p>
                </div>
                {isActive && <Badge className="shrink-0">Aktif</Badge>}
                {isUpcoming && <Badge variant="outline" className="shrink-0">Segera</Badge>}
                {isEnded && <Badge variant="secondary" className="shrink-0">Selesai</Badge>}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} />
                  <span>Mulai: {start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} />
                  <span>Selesai: {end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {isActive ? (
                <Button size="sm" className="w-full rounded-xl" asChild>
                  <a href={`/dashboard/admin/exams/${exam.id}`}>
                    <BookOpen size={13} className="mr-1.5" />
                    Mulai Kerjakan
                  </a>
                </Button>
              ) : isUpcoming ? (
                <Button size="sm" variant="outline" className="w-full rounded-xl" disabled>
                  <Clock size={13} className="mr-1.5" />
                  Belum Dimulai
                </Button>
              ) : (
                <Button size="sm" variant="ghost" className="w-full rounded-xl" disabled>
                  <CheckCircle2 size={13} className="mr-1.5" />
                  Ujian Selesai
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
