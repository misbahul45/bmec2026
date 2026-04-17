import { z } from "zod"

export const examQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().min(1, "Question is required"),

  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  optionE: z.string().min(1),

  correctAnswer: z.enum(["A", "B", "C", "D", "E"], {
    message: "Correct answer must be one of A, B, C, D, or E",
  }),

  score: z.number().int().nonnegative(),

  examId: z.string().uuid(),

  createdAt: z.date().optional(),
})

export type ExamQuestionData = z.infer<typeof examQuestionSchema>