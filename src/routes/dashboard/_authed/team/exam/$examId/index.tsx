import {
  createFileRoute,
  redirect,
  Link,
  useRouter,
} from '@tanstack/react-router'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useState } from 'react'

import { Skeleton } from '~/components/ui/skeleton'
import { Button } from '~/components/ui/button'

import { ExamShell } from '~/components/exam/ExamShell'
import { ExamStartDialog } from '~/components/exam/ExamStartDialog'

import {
  examPreviewQueryOptions,
} from '~/lib/api/exam-attempts/exam-attempt.query-options'

import { getExamPreview, startExamSession } from '~/server/exam-attempt'

import { getOrCreateDeviceId } from '~/lib/exam/device-id'

import { ExamType } from '@prisma/client'

import {
  AlertTriangle,
  Home,
} from 'lucide-react'

export const Route = createFileRoute(
  '/dashboard/_authed/team/exam/$examId/',
)({
  loader: async ({ context, params }) => {
    const teamId = context.user?.userId

    if (!teamId) {
      throw redirect({ to: '/auth/login' })
    }

    const preview = await getExamPreview({
      data: {
        teamId,
        examId: params.examId,
      },
    })

    context.queryClient.setQueryData(
      examPreviewQueryOptions(teamId, params.examId).queryKey,
      preview,
    )
  },

  component: RouteComponent,

  errorComponent: ({ error }) => {
    const message =
      error instanceof Error
        ? error.message
        : 'Terjadi kesalahan'

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md border rounded-2xl p-8 text-center space-y-5 bg-background">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="size-8 text-destructive" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold">
              Ujian Tidak Dapat Dibuka
            </h1>

            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link to="/dashboard/team">
                <Home className="size-4 mr-2" />
                Kembali ke Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  },
})

interface ExamSessionData {
  attemptId: string
  remainingSeconds: number
  effectiveDeadline: string
  answers: {
    questionId: string
    answer: string
  }[]

  exam: {
    id: string
    title: string
    endDate: string
    duration: number

    stage?: {
      name: string
    }

    questions: {
      id: string
      question: string
      optionA: string
      optionB: string
      optionC: string
      optionD: string
      optionE: string
    }[]

    type: ExamType
  }
}

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const { examId } = Route.useParams()

  const teamId = user?.userId!

  return (
    <Suspense fallback={<ExamLoadingSkeleton />}>
      <ExamPage
        teamId={teamId}
        examId={examId}
      />
    </Suspense>
  )
}

function ExamPage({
  teamId,
  examId,
}: {
  teamId: string
  examId: string
}) {
  const router = useRouter()
  const { data: previewRes } = useSuspenseQuery(
    examPreviewQueryOptions(teamId, examId),
  )

  const preview = previewRes.data as {
    examId: string
    examTitle: string
    stageName: string | null
    duration: number
    totalQuestions: number
  }

  const [session, setSession] = useState<ExamSessionData | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)

  const handleStart = async () => {
    setIsStarting(true)
    setStartError(null)
    try {
      const deviceId = getOrCreateDeviceId()
      const userAgent =
        typeof navigator !== 'undefined' ? navigator.userAgent : ''

      const sessionRes = await startExamSession({
        data: {
          teamId,
          examId,
          deviceId,
          ipAddress: '',
          userAgent,
        },
      })

      setSession(sessionRes.data as ExamSessionData)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Gagal memulai ujian. Silakan coba lagi.'
      setStartError(message)
    } finally {
      setIsStarting(false)
    }
  }

  const handleCancel = () => {
    router.navigate({ to: '/dashboard/team' })
  }

  if (!session) {
    return (
      <ExamStartDialog
        open
        examTitle={preview.examTitle}
        stageName={preview.stageName ?? undefined}
        duration={preview.duration}
        totalQuestions={preview.totalQuestions}
        isStarting={isStarting}
        errorMessage={startError}
        onStart={handleStart}
        onCancel={handleCancel}
      />
    )
  }

  const attempt = {
    id: session.attemptId,
    deviceId: null as string | null,
    answers: session.answers,
  }

  return (
    <ExamShell
      attempt={attempt}
      exam={session.exam}
      questions={session.exam.questions}
      teamId={teamId}
      examId={examId}
      effectiveDeadline={new Date(session.effectiveDeadline)}
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
              <Skeleton
                key={i}
                className="h-8 w-8 rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-4 w-32" />

          <Skeleton className="h-24 rounded-xl" />

          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-14 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
