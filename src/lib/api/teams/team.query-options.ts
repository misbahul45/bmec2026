import { queryOptions } from "@tanstack/react-query";
import { getTeam, getTeams } from "../../../server/team";
import { QueryTeam } from "~/schemas/team.schema";


export const teamQueryOptions = (teamId: string) =>
  queryOptions({
    queryKey: ['teams', teamId],
    queryFn: () => getTeam({ data: teamId }),
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