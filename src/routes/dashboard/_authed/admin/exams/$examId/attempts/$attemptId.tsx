import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { attemptDetailQueryOptions } from '~/lib/api/exam-attempts/attempt.query-options'
import { CheatStatusBadge } from '~/components/dashboard/admin/exams/CheatStatusBadge'
import { EventTypeBadge } from '~/components/dashboard/admin/exams/EventTypeBadge'
import { Badge } from '~/components/ui/badge'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '~/lib/utils'

export const Route = createFileRoute(
  '/dashboard/_authed/admin/exams/$examId/attempts/$attemptId'
)({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(attemptDetailQueryOptions(params.attemptId))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { examId, attemptId } = Route.useParams()
  const { data: res } = useSuspenseQuery(attemptDetailQueryOptions(attemptId))
  const attempt = res?.data

  if (!attempt) return null

  const answerMap = new Map<string, { answer: string; isCorrect: boolean }>(
    attempt.answers.map((a: any) => [a.questionId, a])
  )

  return (
    <div className="space-y-8 w-full pt-20 min-h-screen pb-10 max-w-5xl mx-auto px-8">
      <div className="flex items-start gap-4">
        <a
          href={`/dashboard/admin/exams/${examId}/reviews`}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1"
        >
          <ArrowLeft size={13} />
          Kembali
        </a>
        <div>
          <h1 className="text-lg font-bold">Detail Pengerjaan</h1>
          <p className="text-xs text-muted-foreground">{attempt.exam.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Nama Tim', value: attempt.team.name },
          { label: 'Total Skor', value: attempt.totalScore },
          { label: 'Total Kecurangan', value: attempt.cheatCount },
          { label: 'Status', value: <CheatStatusBadge flagged={attempt.flagged} cheatCount={attempt.cheatCount} /> },
        ].map((item) => (
          <div key={item.label} className="border rounded-xl p-4 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.label}</p>
            <div className="text-sm font-semibold text-foreground">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold">Event Log Kecurangan</h2>
        {attempt.events.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center border rounded-xl">Tidak ada event mencurigakan</p>
        ) : (
          <div className="border rounded-xl overflow-hidden divide-y divide-border">
            {attempt.events.map((ev: any) => (
              <div key={ev.id} className="flex items-center justify-between px-4 py-2.5">
                <EventTypeBadge type={ev.type} />
                <span className="text-xs text-muted-foreground font-mono">
                  {new Date(ev.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Jawaban Peserta</h2>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="size-3 text-green-600" /> Benar: {attempt.answers.filter((a: any) => a.isCorrect).length}</span>
            <span className="flex items-center gap-1"><XCircle className="size-3 text-destructive" /> Salah: {attempt.answers.filter((a: any) => !a.isCorrect).length}</span>
          </div>
        </div>

        <div className="space-y-3">
          {attempt.exam.questions.map((q: any, idx: number) => {
            const ans = answerMap.get(q.id)
            const options = [
              { key: 'A', val: q.optionA },
              { key: 'B', val: q.optionB },
              { key: 'C', val: q.optionC },
              { key: 'D', val: q.optionD },
              { key: 'E', val: q.optionE },
            ]

            return (
              <div key={q.id} className="border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground font-medium">Soal {idx + 1}</span>
                    <div
                      className="text-sm text-foreground mt-0.5 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>
                  {ans ? (
                    ans.isCorrect
                      ? <CheckCircle2 className="size-4 text-green-600 shrink-0 mt-1" />
                      : <XCircle className="size-4 text-destructive shrink-0 mt-1" />
                  ) : (
                    <Badge variant="outline" className="text-[10px] shrink-0">Tidak dijawab</Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {options.map((opt) => {
                    const isChosen = ans?.answer === opt.key
                    const isCorrect = q.correctAnswer === opt.key
                    return (
                      <div
                        key={opt.key}
                        className={cn(
                          'flex items-start gap-2 rounded-lg border px-3 py-2 text-xs',
                          isCorrect && 'bg-green-50 border-green-300 text-green-800',
                          isChosen && !isCorrect && 'bg-red-50 border-red-300 text-red-800',
                          !isChosen && !isCorrect && 'border-border text-muted-foreground'
                        )}
                      >
                        <span className="font-bold shrink-0">{opt.key}.</span>
                        <span dangerouslySetInnerHTML={{ __html: opt.val }} />
                        {isChosen && !isCorrect && <span className="ml-auto shrink-0 font-semibold">Dipilih</span>}
                        {isCorrect && <span className="ml-auto shrink-0 font-semibold">Benar</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
