import { Exam, QuestionDifficulty, Stage } from '@prisma/client'
export interface ExamQuestion {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string
  difficulty: QuestionDifficulty

  correctScore: number
  wrongScore: number
  emptyScore: number
}

export type ExamWithStage = Exam & { stage: Stage }
