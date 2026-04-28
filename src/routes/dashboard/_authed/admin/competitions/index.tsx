import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { competitionsWithBatchesQueryOptions } from '~/lib/api/competitions/competition.query-options'
import { CompetitionBatchCard } from '~/components/dashboard/admin/competitions/CompetitionBatchCard'
import { Skeleton } from '~/components/ui/skeleton'
import { Layers } from 'lucide-react'

export const Route = createFileRoute('/dashboard/_authed/admin/competitions/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(competitionsWithBatchesQueryOptions())
  },
  component: RouteComponent,
})

function CompetitionsContent() {
  const { data: res } = useSuspenseQuery(competitionsWithBatchesQueryOptions())
  const competitions: any[] = res.data ?? []
  const queryKey = competitionsWithBatchesQueryOptions().queryKey

  return (
    <div className="space-y-4">
      {competitions.map((comp) => (
        <CompetitionBatchCard
          key={comp.id}
          competition={{ id: comp.id, name: comp.name }}
          batches={comp.batches}
          queryKey={queryKey}
        />
      ))}
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="space-y-6 w-full pt-20 min-h-screen pb-6 max-w-3xl mx-auto px-8">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Layers size={16} className="text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Manajemen Batch</h1>
          <p className="text-xs text-muted-foreground">Kelola batch pendaftaran setiap kompetisi</p>
        </div>
      </div>

      <Suspense fallback={
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      }>
        <CompetitionsContent />
      </Suspense>
    </div>
  )
}
