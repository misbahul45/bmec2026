import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { dashboardQueryOptions } from '~/lib/api/dashboard/dashboard.query-options'
import { SummaryCards } from '~/components/dashboard/admin/overview/SummaryCards'
import { StatusCards } from '~/components/dashboard/admin/overview/StatusCards'
import { InsightCards } from '~/components/dashboard/admin/overview/InsightCards'
import { Charts } from '~/components/dashboard/admin/overview/Charts'
import { RecentActivity } from '~/components/dashboard/admin/overview/RecentActivity'
import { QuickActions } from '~/components/dashboard/admin/overview/QuickActions'

export const Route = createFileRoute('/dashboard/_authed/admin/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(dashboardQueryOptions())
  },
  component: RouteComponent,
})

function DashboardContent() {
  const { data: res } = useSuspenseQuery(dashboardQueryOptions())
  const d = res?.data ?? res

  if (!d) return null

  const statusGroups = [
    { label: 'Registrasi', data: d.registrationByStatus },
    { label: 'Submission', data: d.submissionByStatus },
  ]


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold">Dashboard</h1>
        <p className="text-xs text-muted-foreground">Ringkasan aktivitas sistem BMEC 2026</p>
      </div>

      <SummaryCards counts={d.counts} />
      <StatusCards groups={statusGroups} />
      <InsightCards insights={d.insights} avgExamScore={d.avgExamScore} />

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</p>
        <QuickActions />
      </div>

      <Charts
        registrationByCompetition={d.registrationByCompetition}
        registrationByStatus={d.registrationByStatus}
        submissionByStage={d.submissionByStage}
        attemptsByDate={d.attemptsByDate}
        cheat={d.cheat}
      />

      <RecentActivity
        registrations={d.recent.registrations}
        submissions={d.recent.submissions}
        attempts={d.recent.attempts}
      />
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="w-full pt-20 min-h-screen pb-10 max-w-6xl mx-auto px-8">
      <Suspense fallback={<div className="text-xs text-muted-foreground py-20 text-center">Memuat dashboard...</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
