import { CompetitionType } from '@prisma/client'
import { queryOptions } from '@tanstack/react-query'
import { getAllCompetitionsWithBatches, getCompetition } from '~/server/competition'

export const competitionsWithBatchesQueryOptions = () =>
  queryOptions({
    queryKey: ['competitions', 'batches'],
    queryFn: () => getAllCompetitionsWithBatches(),
  })

export const competitionQueryOptions = (
  type: CompetitionType
) =>
  queryOptions({
    queryKey: ["competition", type] as const,
    queryFn: () =>
      getCompetition({
        data: type,
      }),
  })