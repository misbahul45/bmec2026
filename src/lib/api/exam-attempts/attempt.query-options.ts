import { queryOptions } from '@tanstack/react-query'
import { getExamAttempts, getExamLeaderboard, getAttemptDetail } from '~/server/attempt'

export interface AttemptQueryParams {
  examId: string
  search?: string
  sortBy?: 'totalScore' | 'createdAt' | 'teamName' | 'cheatCount'
  sortOrder?: 'asc' | 'desc'
  finished?: boolean
  flagged?: boolean
  page?: number
  limit?: number
}

export const examAttemptsQueryOptions = (query: AttemptQueryParams) =>
  queryOptions({
    queryKey: ['exam-attempts', query],
    queryFn: () => getExamAttempts({ data: query }),
  })

export const attemptDetailQueryOptions = (attemptId: string) =>
  queryOptions({
    queryKey: ['attempt-detail', attemptId],
    queryFn: () => getAttemptDetail({ data: { attemptId } }),
  })

export const examLeaderboardQueryOptions = (examId: string) =>
  queryOptions({
    queryKey: ['exam-leaderboard', examId],
    queryFn: () => getExamLeaderboard({ data: { examId } }),
  })
