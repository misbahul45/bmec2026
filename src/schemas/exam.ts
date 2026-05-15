import { z } from "zod"

export const examQuestionSchema = z
  .object({
    id: z.string().uuid().optional(),

    question: z.string().min(1, 'Question is required'),

    optionA: z.string().min(1),
    optionB: z.string().min(1),
    optionC: z.string().min(1),
    optionD: z.string().min(1),
    optionE: z.string().min(1),

    correctAnswer: z.enum(['A', 'B', 'C', 'D', 'E']),

    difficulty: z
      .enum(['EASY', 'MEDIUM', 'HARD'])
      .default('EASY'),

    examId: z.string().uuid(),

    createdAt: z.date().optional(),

    order: z.number().int(),
  })
  .transform((data) => {
    const scoringMap = {
      EASY: {
        correctScore: 2,
        wrongScore: -1,
        emptyScore: 0,
      },
      MEDIUM: {
        correctScore: 4,
        wrongScore: -2,
        emptyScore: -1,
      },
      HARD: {
        correctScore: 6,
        wrongScore: -3,
        emptyScore: -2,
      },
    }

    return {
      ...data,
      ...scoringMap[data.difficulty],
    }
  })

// INPUT FORM TYPE
export type ExamQuestionFormData =
  z.input<typeof examQuestionSchema>

// OUTPUT TYPE (hasil transform)
export type ExamQuestionData =
  z.output<typeof examQuestionSchema>