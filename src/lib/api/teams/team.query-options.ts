import { queryOptions } from "@tanstack/react-query";
import { getTeam, getTeamDashboard, getTeams } from "../../../server/team";
import { QueryTeam } from "~/schemas/team.schema";


export const teamQueryOptions = (teamId: string) =>
  queryOptions({
    queryKey: ['teams', teamId],
    queryFn: () => getTeam({ data: teamId }),
  })

export const teamDashboardQueryOptions = (teamId: string) =>
  queryOptions({
    queryKey: ['teams', teamId, 'dashboard'],
    queryFn: () => getTeamDashboard({ data: teamId }),
    staleTime: 60_000,
  })

export const teamsQueryOptions = (query: QueryTeam) => {
  return queryOptions({
    queryKey: ['teams', query],
    queryFn: () =>
      getTeams({
        data: query,
      }),
  })
}
