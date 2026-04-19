import { queryOptions } from '@tanstack/react-query'
import { getSubmissions, getSubmissionLeaderboard } from '~/server/submission'

export interface SubmissionQueryParams {
  search?: string
  stageId?: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'
  page?: number
  limit?: number
}

export const submissionsQueryOptions = (query: SubmissionQueryParams) =>
  queryOptions({
    queryKey: ['submissions', query],
    queryFn: () => getSubmissions({ data: query }),
  })

export const submissionLeaderboardQueryOptions = (competitionType: string, stageType?: string) =>
  queryOptions({
    queryKey: ['submission-leaderboard', competitionType, stageType],
    queryFn: () => getSubmissionLeaderboard({ data: { competitionType, stageType } }),
  })
