import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { attemptDetailQueryOptions } from '~/lib/api/exam-attempts/attempt.query-options'
import { CheatStatusBadge } from '~/components/dashboard/admin/exams/CheatStatusBadge'
import { EventTypeBadge } from '~/components/dashboard/admin/exams/EventTypeBadge'
import { Badge } from '~/components/ui/badge'
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle } from 'lucide-react'
import { cn } from '~/lib/utils'

export const Route = createFileRoute(
  '/dashboard/_authed/admin/exams/$examId/attempts/$attemptId',
)({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      attemptDetailQueryOptions(params.attemptId),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { examId, attemptId } = Route.useParams()
  const { data: res } = useSuspenseQuery(attemptDetailQueryOptions(attemptId))
  const attempt = res?.data

  if (!attempt) return null

  const answerMap = new Map<string, { answer: string; isCorrect: boolean }>(
    attempt.answers.map((a: any) => [a.questionId, a]),
  )

  const correct = attempt.answers.filter(
    (a: any) => a.answer && a.answer.trim() !== '' && a.isCorrect,
  ).length
  const wrong = attempt.answers.filter(
    (a: any) => a.answer && a.answer.trim() !== '' && !a.isCorrect,
  ).length
  const empty = attempt.exam.questions.length - correct - wrong

  const maxScore = attempt.exam.questions.reduce(
    (sum: number, q: any) => sum + (q.correctScore ?? 0),
    0,
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
          {
            label: 'Total Skor',
            value: (
              <span>
                {attempt.totalScore}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  / {maxScore}
                </span>
              </span>
            ),
          },
          { label: 'Total Indikasi', value: attempt.cheatCount },
          {
            label: 'Status Integritas',
            value: (
              <CheatStatusBadge
                flagged={attempt.flagged}
                cheatCount={attempt.cheatCount}
              />
            ),
          },
        ].map((item) => (
          <div key={item.label} className="border rounded-xl p-4 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              {item.label}
            </p>
            <div className="text-sm font-semibold text-foreground">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-emerald-500/10 border-emerald-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{correct}</p>
          <p className="text-xs text-muted-foreground mt-1">Benar</p>
        </div>
        <div className="rounded-xl border bg-destructive/10 border-destructive/20 p-4 text-center">
          <p className="text-2xl font-bold text-destructive">{wrong}</p>
          <p className="text-xs text-muted-foreground mt-1">Salah</p>
        </div>
        <div className="rounded-xl border bg-muted p-4 text-center">
          <p className="text-2xl font-bold text-muted-foreground">{empty}</p>
          <p className="text-xs text-muted-foreground mt-1">Tidak Dijawab</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold">Event Log Aktivitas</h2>
        {attempt.events.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center border rounded-xl">
            Tidak ada event mencurigakan
          </p>
        ) : (
          <div className="border rounded-xl overflow-hidden divide-y divide-border">
            {attempt.events.map((ev: any) => (
              <div key={ev.id} className="flex items-center justify-between px-4 py-2.5">
                <EventTypeBadge type={ev.type} />
                <span className="text-xs text-muted-foreground font-mono">
                  {new Date(ev.createdAt).toLocaleString('id-ID', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
                  })}
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
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3 text-emerald-600" /> Benar: {correct}
            </span>
            <span className="flex items-center gap-1">
              <XCircle className="size-3 text-destructive" /> Salah: {wrong}
            </span>
            <span className="flex items-center gap-1">
              <MinusCircle className="size-3 text-muted-foreground" /> Kosong: {empty}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {attempt.exam.questions.map((q: any, idx: number) => {
            const ans = answerMap.get(q.id)
            const hasAnswer = ans?.answer && ans.answer.trim() !== ''
            const isCorrect = hasAnswer && ans?.isCorrect
            const isEmpty = !hasAnswer

            const earnedScore = isEmpty
              ? q.emptyScore ?? 0
              : isCorrect
                ? q.correctScore ?? 0
                : q.wrongScore ?? 0

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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-medium">
                        Soal {idx + 1}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {q.difficulty === 'EASY'
                          ? 'Mudah'
                          : q.difficulty === 'MEDIUM'
                            ? 'Sedang'
                            : 'Sulit'}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono ${earnedScore > 0 ? 'text-emerald-600 border-emerald-300' : earnedScore < 0 ? 'text-destructive border-destructive/30' : 'text-muted-foreground'}`}
                      >
                        {earnedScore > 0 ? '+' : ''}
                        {earnedScore} poin
                      </Badge>
                    </div>
                    <div
                      className="text-sm text-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>
                  {isEmpty ? (
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      <MinusCircle className="size-3 mr-1" />
                      Kosong
                    </Badge>
                  ) : isCorrect ? (
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-1" />
                  ) : (
                    <XCircle className="size-4 text-destructive shrink-0 mt-1" />
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {options.map((opt) => {
                    const isChosen = ans?.answer === opt.key
                    const isCorrectOpt = q.correctAnswer === opt.key
                    return (
                      <div
                        key={opt.key}
                        className={cn(
                          'flex items-start gap-2 rounded-lg border px-3 py-2 text-xs',
                          isCorrectOpt && 'bg-emerald-50 border-emerald-300 text-emerald-800',
                          isChosen &&
                            !isCorrectOpt &&
                            'bg-red-50 border-red-300 text-red-800',
                          !isChosen &&
                            !isCorrectOpt &&
                            'border-border text-muted-foreground',
                        )}
                      >
                        <span className="font-bold shrink-0">{opt.key}.</span>
                        <span dangerouslySetInnerHTML={{ __html: opt.val }} />
                        {isChosen && !isCorrectOpt && (
                          <span className="ml-auto shrink-0 font-semibold">Dipilih</span>
                        )}
                        {isCorrectOpt && (
                          <span className="ml-auto shrink-0 font-semibold">Benar</span>
                        )}
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
