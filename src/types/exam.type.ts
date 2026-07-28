import { Exam, Stage } from '@prisma/client'

export interface ExamQuestion {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string
}

export type ExamWithStage = Exam & { stage: Stage }
