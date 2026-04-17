import { z } from "zod"

export const submissionStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
])


export const createAbstractSubmissionSchema = z.object({
  teamId: z.string().uuid(),

  abstractFile: z
    .instanceof(File),

  status: submissionStatusEnum
    .default("PENDING")
    .optional(),

  reviewedBy: z
    .string()
    .uuid()
    .nullable()
    .optional(),
})

export type CreateAbstractSubmissionData =
  z.infer<typeof createAbstractSubmissionSchema>



export const createAbstractSchema = z.object({
  teamId: z.string().uuid(),
  fileUrl: z.string().url(),
  status: submissionStatusEnum.optional(),
  reviewedBy: z.string().uuid().nullable().optional(),
})

export type CreateAbstractData =
  z.infer<typeof createAbstractSchema>

export const approveAbstractSchema = z.object({
  id: z.string().uuid(),
  adminId: z.string().uuid(),
})

export type ApproveAbstractData =
  z.infer<typeof approveAbstractSchema>

export const rejectAbstractSchema = z.object({
  id: z.string().uuid(),
  adminId: z.string().uuid(),
})

export type RejectAbstractData =
  z.infer<typeof rejectAbstractSchema>