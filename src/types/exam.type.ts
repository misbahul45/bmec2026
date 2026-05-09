export interface ExamQuestion {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string
  score: number
}

import { Exam, Stage } from '@prisma/client'

export type ExamWithStage = Exam & { stage: Stage }
