import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import SearchTeam from '~/components/dashboard/admin/teams/SearchTeam'
import TableTeams from '~/components/dashboard/admin/teams/TableTeams'
import TableTeamsSkeleton from '~/components/dashboard/admin/teams/TableTeamsSkeleton'
import { teamsQueryOptions } from '~/lib/api/teams/team.query-options'
import { loadTeamsSearchParams, normalizeTeamQuery, queryTeam } from '~/schemas/team,schema'

export const Route = createFileRoute(
  "/dashboard/_authed/admin/teams/"
)({
  validateSearch:queryTeam,
  loader: async ({ context, location }) => {
    const raw = loadTeamsSearchParams(location.search)

    const query = normalizeTeamQuery(raw)

    await context.queryClient.ensureQueryData(
      teamsQueryOptions(query)
    )

    return { query }
  },

  component: RouteComponent,
})
function TeamsContent() {
  const query = Route.useSearch()

  const { data: res } = useSuspenseQuery(
    teamsQueryOptions(query)
  )

  return (
    <TableTeams
      teams={res.data?.teams!}
      meta={res.data?.meta!}
    />
  )
}

function RouteComponent() {
  return (
    <div className="space-y-4 w-full pt-20 min-h-screen pb-6 max-w-6xl mx-auto px-8">
      <SearchTeam />

      <Suspense fallback={<TableTeamsSkeleton />}>
        <TeamsContent />
      </Suspense>

    </div>
  )
}
