import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  redirect,
  Link,
} from '@tanstack/react-router'
import { CheckCircle2, XCircle, MinusCircle, ArrowLeft } from 'lucide-react'
import { examReviewQueryOptions } from '~/lib/api/exam-attempts/exam-attempt.query-options'
import { Route as RootRoute } from '~/routes/__root'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Badge } from '~/components/ui/badge'
import { TipTapRenderer } from '~/components/exam/TipTapRenderer'

export const Route = createFileRoute(
  '/dashboard/_authed/team/exam/$examId/review',
)({
  loader: async ({ context, params }) => {
    const teamId = context.user?.userId

    if (!teamId) {
      throw redirect({
        to: '/auth/login',
      })
    }

    await context.queryClient.ensureQueryData(
      examReviewQueryOptions(params.examId, teamId),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { examId } = Route.useParams()

  return (
    <div className="min-h-screen max-w-4xl mx-auto space-y-6 px-4 pt-20 pb-12">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-full"
        >
          <Link to="/dashboard/team">
            <ArrowLeft size={20} />
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">
            Pembahasan Tryout
          </h1>
          <p className="text-sm text-muted-foreground">
            Review jawaban dan pembahasan soal
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <Skeleton className="h-125 w-full rounded-2xl" />
        }
      >
        <ReviewPage examId={examId} />
      </Suspense>
    </div>
  )
}

function ReviewPage({ examId }: { examId: string }) {
  const { user } = RootRoute.useRouteContext()
  const teamId = user?.userId

  if (!teamId) {
    throw new Error('Unauthorized')
  }

  const { data: res } = useSuspenseQuery(
    examReviewQueryOptions(examId, teamId),
  )

  const attempt = res.data
  const exam = attempt.exam
  const questions = exam.questions
  const userAnswers = attempt.answers

  const correct = userAnswers.filter(
    (a: any) => a.answer && a.answer.trim() !== '' && a.isCorrect,
  ).length
  const wrong = userAnswers.filter(
    (a: any) => a.answer && a.answer.trim() !== '' && !a.isCorrect,
  ).length

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {questions.map((question: any, index: number) => {
          const userAnswerObj = userAnswers.find(
            (a: any) => a.questionId === question.id,
          )

          const userAnswer =
            userAnswerObj?.answer && userAnswerObj.answer.trim() !== ''
              ? userAnswerObj.answer
              : undefined

          const isCorrect = userAnswerObj?.isCorrect ?? false
          const hasAnswered = !!userAnswer

          const earnedScore = !hasAnswered
            ? question.emptyScore
            : isCorrect
              ? question.correctScore
              : question.wrongScore

          const options = [
            { label: 'A', text: question.optionA },
            { label: 'B', text: question.optionB },
            { label: 'C', text: question.optionC },
            { label: 'D', text: question.optionD },
            { label: 'E', text: question.optionE },
          ]

          return (
            <div
              key={question.id}
              className="space-y-5 rounded-2xl border bg-background p-6 shadow-sm"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-semibold">Soal {index + 1}</h3>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {question.difficulty === 'EASY'
                      ? 'Mudah'
                      : question.difficulty === 'MEDIUM'
                        ? 'Sedang'
                        : 'Sulit'}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs font-mono ${earnedScore > 0 ? 'text-emerald-600 border-emerald-300' : earnedScore < 0 ? 'text-destructive border-destructive/30' : 'text-muted-foreground'}`}
                  >
                    {earnedScore > 0 ? '+' : ''}
                    {earnedScore} poin
                  </Badge>

                  {hasAnswered ? (
                    isCorrect ? (
                      <Badge className="gap-1 bg-emerald-500 hover:bg-emerald-600">
                        <CheckCircle2 size={12} />
                        Benar
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle size={12} />
                        Salah
                      </Badge>
                    )
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <MinusCircle size={12} />
                      Kosong
                    </Badge>
                  )}
                </div>
              </div>

              <div className="prose prose-sm max-w-none dark:prose-invert">
                <TipTapRenderer content={question.question} />
              </div>

              <div className="grid grid-cols-1 gap-2 pt-2">
                {options.map((opt) => {
                  const isUserAnswer = userAnswer === opt.label
                  const isCorrectAnswer = question.correctAnswer === opt.label

                  let borderClass = 'border-border bg-card hover:bg-accent'
                  let badge = null

                  if (isCorrectAnswer) {
                    borderClass = 'border-emerald-500 bg-emerald-500/10'
                    badge = (
                      <Badge className="ml-auto shrink-0 bg-emerald-500">
                        Kunci Jawaban
                      </Badge>
                    )
                  }

                  if (isUserAnswer && !isCorrectAnswer) {
                    borderClass = 'border-destructive bg-destructive/10'
                    badge = (
                      <Badge variant="destructive" className="ml-auto shrink-0">
                        Jawaban Kamu
                      </Badge>
                    )
                  }

                  if (isUserAnswer && isCorrectAnswer) {
                    badge = (
                      <Badge className="ml-auto shrink-0 bg-emerald-500">
                        Jawaban Kamu & Benar
                      </Badge>
                    )
                  }

                  return (
                    <div
                      key={opt.label}
                      className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${borderClass}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background text-sm font-medium">
                          {opt.label}
                        </div>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <TipTapRenderer content={opt.text} />
                        </div>
                      </div>
                      {badge}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
