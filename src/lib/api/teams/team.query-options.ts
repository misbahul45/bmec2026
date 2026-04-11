import { queryOptions } from "@tanstack/react-query";
import { getTeam } from "../../../server/team";


export const teamQueryOptions = (teamId: string) =>
  queryOptions({
    queryKey: ['post', teamId],
    queryFn: () => getTeam({ data: teamId }),
  })