import { queryOptions } from '@tanstack/react-query'
import { getExamSession, getExamResult, getExamReview } from '~/server/exam-attempt'

export const examSessionQueryOptions = (teamId: string, examId: string) =>
  queryOptions({
    queryKey: ['exam-session', teamId, examId],
    queryFn: () => getExamSession({ data: { teamId, examId } }),
    staleTime: 0,
    retry: false,
  })

export const examResultQueryOptions = (attemptId: string) =>
  queryOptions({
    queryKey: ['exam-result', attemptId],
    queryFn: () => getExamResult({ data: { attemptId } }),
  })

export const examReviewQueryOptions = (examId: string, teamId: string) =>
  queryOptions({
    queryKey: ['exam-review', examId, teamId],
    queryFn: () => getExamReview({ data: { examId, teamId } }),
  })
