import { useState, useCallback } from 'react'

import { ExamQuestion } from '~/types/exam.type'

export function useExamNavigation(questions: ExamQuestion[]) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))
  }, [questions.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToIndex = useCallback((n: number) => {
    if (n >= 0 && n < questions.length) setCurrentIndex(n)
  }, [questions.length])

  return {
    currentIndex,
    currentQuestion: questions[currentIndex] ?? null,
    goToNext,
    goToPrev,
    goToIndex,
    isFirst: currentIndex === 0,
    isLast: currentIndex === questions.length - 1,
  }
}
