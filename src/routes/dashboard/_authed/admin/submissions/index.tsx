import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import { submissionsQueryOptions } from '~/lib/api/submissions/submission.query-options'
import { TableSubmissions } from '~/components/dashboard/admin/submissions/TableSubmissions'
import { SubmissionFilters } from '~/components/dashboard/admin/submissions/SubmissionFilters'

const DEFAULT_FILTERS = { search: '', status: 'ALL', limit: 10 }

export const Route = createFileRoute('/dashboard/_authed/admin/submissions/')({
  loader: async ({ context }) => {
    const query = { status: 'ALL' as const, limit: 10, page: 1 }
    await context.queryClient.ensureQueryData(submissionsQueryOptions(query))
  },
  component: RouteComponent,
})

function SubmissionsContent({ filters, page, adminId }: { filters: typeof DEFAULT_FILTERS; page: number; adminId: string }) {
  const query = {
    search: filters.search || undefined,
    status: filters.status as any,
    limit: filters.limit,
    page,
  }

  const { data: res } = useSuspenseQuery(submissionsQueryOptions(query))
  const submissions = res?.data?.submissions ?? []
  const meta = res?.data?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 1 }

  return (
    <TableSubmissions
      submissions={submissions}
      meta={meta}
      adminId={adminId}
      queryKey={['submissions', query]}
      onPageChange={() => {}}
    />
  )
}

function RouteComponent() {
  const context = Route.useRouteContext()
  const adminId = (context as any)?.user?.userId ?? ''

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [applied, setApplied] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const handleSearch = () => {
    setApplied(filters)
    setPage(1)
  }

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    setApplied(DEFAULT_FILTERS)
    setPage(1)
  }

  return (
    <div className="space-y-6 w-full pt-20 min-h-screen pb-6 max-w-6xl mx-auto px-8">
      <div>
        <h1 className="text-lg font-bold">Submission</h1>
        <p className="text-xs text-muted-foreground">Kelola semua submission karya peserta</p>
      </div>

      <SubmissionFilters
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <Suspense fallback={<div className="text-xs text-muted-foreground py-10 text-center">Memuat data...</div>}>
        <SubmissionsContent filters={applied} page={page} adminId={adminId} />
      </Suspense>
    </div>
  )
}
