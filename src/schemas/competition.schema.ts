import z from "zod";

export const createCompetitionRegistrationSchema = z.object({
  teamId: z.string().uuid(),

  competitionId: z.string().uuid(),

  batchId: z.string().uuid(),

  paymentProof: z
    .instanceof(File)
    .nullable()
    .optional(),
})

export type CreateCompetitionRegistrationData = z.infer<typeof createCompetitionRegistrationSchema>


export const registrationCompetitionSchema = z.object({
  teamId: z.string().uuid(),
  competitionId: z.string().uuid(),
  batchId: z.string().uuid(),
  paymentProof: z.string().optional(),
})

export type RegistrationCompetitionData = z.infer<
  typeof registrationCompetitionSchema
>