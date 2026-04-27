import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { teamDashboardQueryOptions } from '~/lib/api/teams/team.query-options'
import ProfileTeam from '~/components/ui/ProfileTeam'
import { EditTeamForm } from '~/components/dashboard/team/EditTeamForm'
import { OlimpiadeSection } from '~/components/dashboard/team/OlimpiadeSection'
import { InfografisSection } from '~/components/dashboard/team/InfografisSection'
import { LKTISection } from '~/components/dashboard/team/LKTISection'
import { RegistrationStatusCard } from '~/components/dashboard/team/RegistrationStatusCard'
import { Skeleton } from '~/components/ui/skeleton'
import { MapPin, ChevronRight } from 'lucide-react'
import { Badge } from '~/components/ui/badge'

export const Route = createFileRoute('/dashboard/_authed/team/')({
  loader: async ({ context }) => {
    const userId = context.user?.userId
    if (userId) {
      await context.queryClient.ensureQueryData(teamDashboardQueryOptions(userId))
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const teamId = user?.userId!

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-8 max-w-4xl mx-auto space-y-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <TeamDashboard teamId={teamId} />
      </Suspense>
    </div>
  )
}

function TeamDashboard({ teamId }: { teamId: string }) {
  const queryKey = teamDashboardQueryOptions(teamId).queryKey
  const { data: res } = useSuspenseQuery(teamDashboardQueryOptions(teamId))
  const team = res.data

  const registration = team.registration
  const registrationStatus = registration?.status ?? null
  const abstract = team.abstract
  const competitionType = team.competitionType
  const currentStage = team.currentStage
  const allStages = registration?.competition?.stages ?? []

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <ProfileTeam data={team} />
        <EditTeamForm team={team} queryKey={queryKey} />
      </div>

      {allStages.length > 0 && (
        <div className="animated-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin size={15} className="text-primary" />
            Stage Saat Ini
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {allStages
              .slice()
              .sort((a: any, b: any) => a.order - b.order)
              .map((stage: any, idx: number, arr: any[]) => {
                const isCurrent = stage.id === currentStage?.id
                const isPast = currentStage
                  ? stage.order < currentStage.order
                  : false
                return (
                  <div key={stage.id} className="flex items-center gap-1">
                    <Badge
                      variant={isCurrent ? 'default' : isPast ? 'secondary' : 'outline'}
                      className={isCurrent ? 'ring-2 ring-primary/40' : 'opacity-60'}
                    >
                      {stage.name}
                    </Badge>
                    {idx < arr.length - 1 && (
                      <ChevronRight size={13} className="text-muted-foreground shrink-0" />
                    )}
                  </div>
                )
              })}
          </div>
          {!currentStage && (
            <p className="text-xs text-muted-foreground">Belum ada stage yang ditetapkan</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          {competitionType === 'OLIMPIADE' && 'Olimpiade'}
          {competitionType === 'LKTI' && 'LKTI — Lomba Karya Tulis Ilmiah'}
          {competitionType === 'INFOGRAFIS' && 'Infografis'}
        </h2>

        {registration && (
          <RegistrationStatusCard
            status={registrationStatus}
            batchName={registration.batch?.name}
            competitionType={competitionType}
            moduleUrl={competitionType === 'OLIMPIADE' ? registration.batch?.module_bacth : null}
          />
        )}

        {competitionType === 'OLIMPIADE' && (
          <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
            <OlimpiadeSection
              registrationStatus={registrationStatus}
              teamId={teamId}
              batch={registration?.batch ? {
                name: registration.batch.name,
                price: Number(registration.batch.price),
                startDate: registration.batch.startDate,
                endDate: registration.batch.endDate,
                module_bacth: registration.batch.module_bacth,
              } : null}
            />
          </Suspense>
        )}

        {competitionType === 'INFOGRAFIS' && (
          <InfografisSection
            registrationStatus={registrationStatus}
            teamId={teamId}
            stageId={team.currentStageId ?? null}
            existingSubmission={team.submissions?.find((s: any) => s.stageId === team.currentStageId) ?? null}
            queryKey={queryKey}
          />
        )}

        {competitionType === 'LKTI' && (
          <LKTISection
            abstractStatus={abstract?.status ?? null}
            teamId={teamId}
            stageId={team.currentStageId ?? null}
            batchName={registration?.batch?.name}
            batchPrice={registration?.batch?.price ? Number(registration.batch.price) : undefined}
            existingSubmission={team.submissions?.find((s: any) => s.stageId === team.currentStageId) ?? null}
            queryKey={queryKey}
          />
        )}
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )
}
