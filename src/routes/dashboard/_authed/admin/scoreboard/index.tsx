import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { examsQueryOptions } from '~/lib/api/exams/exam.query-options'
import { submissionLeaderboardQueryOptions } from '~/lib/api/submissions/submission.query-options'
import { examLeaderboardQueryOptions } from '~/lib/api/exam-attempts/attempt.query-options'
import { OlimpiadeLeaderboard } from '~/components/dashboard/admin/scoreboard/OlimpiadeLeaderboard'
import { SubmissionLeaderboard } from '~/components/dashboard/admin/scoreboard/SubmissionLeaderboard'
import { cn } from '~/lib/utils'

const TABS = [
  { key: 'OLIMPIADE', label: 'Olimpiade' },
  { key: 'LKTI', label: 'LKTI' },
  { key: 'INFOGRAFIS', label: 'Infografis' },
] as const

type TabKey = typeof TABS[number]['key']

export const Route = createFileRoute('/dashboard/_authed/admin/scoreboard/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(examsQueryOptions())
    await Promise.allSettled([
      context.queryClient.ensureQueryData(submissionLeaderboardQueryOptions('LKTI')),
      context.queryClient.ensureQueryData(submissionLeaderboardQueryOptions('INFOGRAFIS')),
    ])
  },
  component: RouteComponent,
})

function RouteComponent() {
  const context = Route.useRouteContext()
  const adminId = (context as any)?.user?.userId ?? ''
  const [activeTab, setActiveTab] = useState<TabKey>('OLIMPIADE')

  return (
    <div className="space-y-6 w-full pt-20 min-h-screen pb-6 max-w-6xl mx-auto px-8">
      <div>
        <h1 className="text-lg font-bold">Scoreboard</h1>
        <p className="text-xs text-muted-foreground">Leaderboard per cabang kompetisi</p>
      </div>

      <div className="flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Suspense fallback={<div className="text-xs text-muted-foreground py-10 text-center">Memuat data...</div>}>
        {activeTab === 'OLIMPIADE' && <OlimpiadeLeaderboard />}
        {activeTab === 'LKTI' && <SubmissionLeaderboard competitionType="LKTI" adminId={adminId} />}
        {activeTab === 'INFOGRAFIS' && <SubmissionLeaderboard competitionType="INFOGRAFIS" adminId={adminId} />}
      </Suspense>
    </div>
  )
}
