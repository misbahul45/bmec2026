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
  CalendarClock,
  Clock,
  Home,
  Info,
  RefreshCw,
  Users,
} from 'lucide-react'

import { getExamErrorInfo } from '~/lib/exam/exam-error-messages'

function extractErrorInfo(error: unknown): {
  code: string | undefined
  message: string
  meta?: Record<string, unknown>
} {
  if (error && typeof error === 'object') {
    const e = error as Record<string, any>
    return {
      code: e.code,
      message:
        typeof e.message === 'string'
          ? e.message
          : 'Terjadi kesalahan',
      meta: e.meta && typeof e.meta === 'object' ? e.meta : undefined,
    }
  }
  return { code: undefined, message: 'Terjadi kesalahan' }
}

function InfoBlock({ meta }: { meta?: Record<string, unknown> }) {
  if (!meta) return null
  const sessionName = typeof meta.sessionName === 'string' ? meta.sessionName : null
  const sessionStart = typeof meta.sessionStart === 'string' ? meta.sessionStart : null
  const sessionEnd = typeof meta.sessionEnd === 'string' ? meta.sessionEnd : null
  if (!sessionName && !sessionStart && !sessionEnd) return null
  return (
    <div className="rounded-xl border bg-muted/30 p-3 text-xs space-y-1 text-left">
      {sessionName && (
        <div className="flex items-center gap-2 font-medium">
          <Users size={13} />
          Sesi kamu: <span className="font-mono">{sessionName}</span>
        </div>
      )}
      {sessionStart && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={13} />
          Mulai:{' '}
          {new Date(sessionStart).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          WIB
        </div>
      )}
      {sessionEnd && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={13} />
          Selesai:{' '}
          {new Date(sessionEnd).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          WIB
        </div>
      )}
    </div>
  )
}

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
    const { code, message, meta } = extractErrorInfo(error)
    const info = getExamErrorInfo(code, meta)

    const toneClass = {
      info: 'bg-blue-500/10 text-blue-600',
      warning: 'bg-amber-500/10 text-amber-600',
      blocked: 'bg-destructive/10 text-destructive',
    }[info.tone]

    const Icon = info.tone === 'info' ? Info : AlertTriangle

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md border rounded-2xl p-8 text-center space-y-5 bg-background">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${toneClass}`}>
            <Icon className="size-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold">{info.title}</h1>
            <p className="text-sm text-muted-foreground">{info.description}</p>
            {message && message !== info.description && (
              <p className="text-[11px] text-muted-foreground/80 italic mt-2">
                Detail: {message}
              </p>
            )}
          </div>

          <InfoBlock meta={meta} />

          <div className="flex flex-col gap-3">
            {info.action?.label === 'Refresh Halaman' ? (
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="size-4 mr-2" />
                {info.action.label}
              </Button>
            ) : info.action?.to ? (
              <Button asChild>
                <Link to={info.action.to}>
                  <Home className="size-4 mr-2" />
                  {info.action.label}
                </Link>
              </Button>
            ) : null}
            {code && (
              <p className="text-[10px] text-muted-foreground/60 font-mono">
                Kode: {code}
              </p>
            )}
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
      const { code, message, meta } = extractErrorInfo(error)
      const info = getExamErrorInfo(code, meta)
      const fullMessage = info.title === 'Ujian Tidak Dapat Dibuka'
        ? message
        : `${info.title}. ${info.description}`
      setStartError(fullMessage)
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
