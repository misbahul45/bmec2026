import { useState, useCallback } from 'react'
import {
  saveDoubt,
  removeDoubt,
  getAllDoubts,
  clearAllDoubts,
} from '~/lib/exam/exam-local-storage'

export type AnswerStatus = 'unanswered' | 'saved' | 'doubt'

export interface AnswerState {
  answer: string | null
  status: AnswerStatus
}

type AnswersMap = Record<string, AnswerState>

interface DBAnswer {
  questionId: string
  answer: string
}

interface UseExamAnswersOptions {
  attemptId: string
  questionIds: string[]
  dbAnswers: DBAnswer[]
}

export function useExamAnswers({ attemptId, questionIds, dbAnswers }: UseExamAnswersOptions) {
  const [answers, setAnswers] = useState<AnswersMap>(() => {
    const map: AnswersMap = {}
    questionIds.forEach((id) => {
      map[id] = { answer: null, status: 'unanswered' }
    })
    dbAnswers.forEach(({ questionId, answer }) => {
      map[questionId] = { answer, status: 'saved' }
    })
    const doubts = getAllDoubts(attemptId)
    doubts.forEach(({ questionId, answer }) => {
      map[questionId] = { answer, status: 'doubt' }
    })
    return map
  })

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const markAsSaved = useCallback((questionId: string, answer: string) => {
    removeDoubt(attemptId, questionId)
    setAnswers((prev) => ({ ...prev, [questionId]: { answer, status: 'saved' } }))
  }, [attemptId])

  const rollbackAnswer = useCallback((questionId: string, previous: AnswerState) => {
    setAnswers((prev) => ({ ...prev, [questionId]: previous }))
  }, [])

  const markAsDoubt = useCallback((questionId: string, answer: string) => {
    saveDoubt(attemptId, questionId, answer)
    setAnswers((prev) => ({ ...prev, [questionId]: { answer, status: 'doubt' } }))
  }, [attemptId])

  const getStatus = useCallback((questionId: string): AnswerStatus => {
    return answers[questionId]?.status ?? 'unanswered'
  }, [answers])

  const getSummary = useCallback(() => {
    let saved = 0
    let doubt = 0
    let unanswered = 0
    Object.values(answers).forEach(({ status }) => {
      if (status === 'saved') saved++
      else if (status === 'doubt') doubt++
      else unanswered++
    })
    return { saved, doubt, unanswered }
  }, [answers])

  const flushAndClear = useCallback(() => {
    clearAllDoubts(attemptId)
  }, [attemptId])

  return {
    answers,
    selectedAnswer,
    setSelectedAnswer,
    markAsSaved,
    rollbackAnswer,
    markAsDoubt,
    getStatus,
    getSummary,
    flushAndClear,
  }
}
