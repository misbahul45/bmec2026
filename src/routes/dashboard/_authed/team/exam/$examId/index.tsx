import { createFileRoute, redirect } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Skeleton } from '~/components/ui/skeleton'
import { ExamShell } from '~/components/exam/ExamShell'
import { examSessionQueryOptions } from '~/lib/api/exam-attempts/exam-attempt.query-options'
import { startExam } from '~/server/exam-attempt'
import { ExamType } from '@prisma/client'

export const Route = createFileRoute('/dashboard/_authed/team/exam/$examId/')({
  loader: async ({ context, params }) => {
    const teamId = context.user?.userId
    if (!teamId) throw redirect({ to: '/auth/login' })

    await startExam({
      data: {
        teamId,
        examId: params.examId,
        deviceId: '',
        ipAddress: '',
        userAgent: '',
      },
    })

    await context.queryClient.ensureQueryData(
      examSessionQueryOptions(teamId, params.examId),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const { examId } = Route.useParams()
  const teamId = user?.userId!

  return (
    <Suspense fallback={<ExamLoadingSkeleton />}>
      <ExamPage teamId={teamId} examId={examId} />
    </Suspense>
  )
}

function ExamPage({ teamId, examId }: { teamId: string; examId: string }) {
  const { data: res } = useSuspenseQuery(examSessionQueryOptions(teamId, examId))
  const session = res.data as {
    attemptId: string
    remainingSeconds: number
    effectiveDeadline: string
    answers: { questionId: string; answer: string }[]
    exam: {
      id: string
      title: string
      endDate: string
      duration: number
      stage?: { name: string }
      questions: {
        id: string
        question: string
        optionA: string
        optionB: string
        optionC: string
        optionD: string
        optionE: string
        score: number
      }[]
      type:ExamType
    }
  }

  const attempt = {
    id: session.attemptId,
    startTime: new Date(new Date().getTime() - (session.exam.duration * 60 - session.remainingSeconds) * 1000),
    deviceId: null as string | null,
    answers: session.answers,
  }

  return (
    <ExamShell
      attempt={attempt}
      exam={session.exam}
      questions={session.exam.questions}
      teamId={teamId}
    />
  )
}

function ExamLoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-14 border-b bg-background flex items-center px-4 gap-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-16 ml-auto" />
      </div>
      <div className="flex flex-1">
        <div className="hidden lg:block w-64 border-r p-4 space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 rounded-xl" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
