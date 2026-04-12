import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router'
import FormCompetition from '~/components/auth/FormCompetition';
import ProfileTeam from '~/components/ui/ProfileTeam';
import { TeamNotFound } from '~/components/errors/TeamNotFound';
import { teamQueryOptions } from '~/lib/api/teams/team.query-options';

export const Route = createFileRoute('/auth/register/$teamId/completed')({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/auth/login",
      })
    }
  },
  loader: async ({ params: { teamId }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      teamQueryOptions(teamId),
    )
    return data;
  },
  errorComponent:TeamNotFound,
  component: RouteComponent,
})

function RouteComponent() {
  const { teamId } = Route.useParams()
  const { data: res } = useSuspenseQuery(teamQueryOptions(teamId))

  return <div className='w-full min-h-screen py-10 px-8'>
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <ProfileTeam data={res.data! as any} />
      <FormCompetition type={res.data?.competitionType!} />
    </div>
  </div>
}
