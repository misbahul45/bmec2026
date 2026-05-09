import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { examResultQueryOptions } from '~/lib/api/exam-attempts/exam-attempt.query-options'

export const Route = createFileRoute('/dashboard/_authed/team/exam/result/$attemptId')({
  loader: async ({ context, params }) => {
    if (!context.user?.userId) throw redirect({ to: '/auth/login' })
    await context.queryClient.ensureQueryData(examResultQueryOptions(params.attemptId))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { attemptId } = Route.useParams()
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 max-w-2xl mx-auto">
      <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
        <ResultPage attemptId={attemptId} />
      </Suspense>
    </div>
  )
}

function ResultPage({ attemptId }: { attemptId: string }) {
  const { data: res } = useSuspenseQuery(examResultQueryOptions(attemptId))
  const result = res.data as {
    id: string
    totalScore: number
    finished: boolean
    startTime: string
    endTime: string | null
    cheatCount: number
    suspiciousScore: number
    flagged: boolean
    answers: { questionId: string; answer: string; isCorrect: boolean; question: { score: number } }[]
  }

  const correct = result.answers.filter((a) => a.isCorrect).length
  const wrong = result.answers.filter((a) => !a.isCorrect).length
  const maxScore = result.answers.reduce((sum, a) => sum + a.question.score, 0)
  const endTime = result.endTime
    ? new Date(result.endTime).toLocaleString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '-'

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-background shadow-sm p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Ujian Berhasil Dikumpulkan!</h1>
          <p className="text-sm text-muted-foreground mt-1">Selesai pada {endTime}</p>
        </div>
        <div>
          <p className="text-5xl font-bold tabular-nums">{result.totalScore}</p>
          <p className="text-sm text-muted-foreground mt-1">dari {maxScore} poin</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border bg-emerald-500/10 border-emerald-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{correct}</p>
          <p className="text-xs text-muted-foreground mt-1">Benar</p>
        </div>
        <div className="rounded-2xl border bg-destructive/10 border-destructive/20 p-4 text-center">
          <p className="text-2xl font-bold text-destructive">{wrong}</p>
          <p className="text-xs text-muted-foreground mt-1">Salah</p>
        </div>
        <div className="rounded-2xl border bg-muted p-4 text-center">
          <p className="text-2xl font-bold text-muted-foreground">
            {result.answers.length - correct - wrong}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Tidak Dijawab</p>
        </div>
      </div>

      <Button className="w-full rounded-xl" asChild>
        <Link to="/dashboard/team">Kembali ke Dashboard</Link>
      </Button>
    </div>
  )
}
