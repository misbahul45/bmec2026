import { z } from 'zod'

export const createExamSessionSchema = z
  .object({
    examId: z.string().uuid(),
    name: z.string().min(1, 'Nama sesi wajib diisi').max(100),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  })
  .refine((d) => d.endTime > d.startTime, {
    message: 'Jam selesai harus setelah jam mulai',
    path: ['endTime'],
  })

export type CreateExamSessionData = z.output<typeof createExamSessionSchema>

export const updateExamSessionSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1).max(100).optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
  })
  .refine(
    (d) => !d.startTime || !d.endTime || d.endTime > d.startTime,
    {
      message: 'Jam selesai harus setelah jam mulai',
      path: ['endTime'],
    },
  )

export type UpdateExamSessionData = z.output<typeof updateExamSessionSchema>

export const examSessionIdSchema = z.object({ id: z.string().uuid() })

export const examSessionsQuerySchema = z.object({ examId: z.string().uuid() })

export const assignTeamsToSessionSchema = z
  .object({
    sessionId: z.string().uuid(),
    codeFrom: z.coerce.number().int().min(1).max(9999),
    codeTo: z.coerce.number().int().min(1).max(9999),
  })
  .refine((d) => d.codeTo >= d.codeFrom, {
    message: 'Range nomor tim tidak valid',
    path: ['codeTo'],
  })

export type AssignTeamsToSessionData = z.output<typeof assignTeamsToSessionSchema>

export const removeTeamFromSessionSchema = z.object({
  sessionId: z.string().uuid(),
  teamId: z.string().uuid(),
})

export const setTeamsByNamesSchema = z.object({
  examLookup: z.object({
    competition: z.string().min(1),
    stage: z.enum(['PENYISIHAN', 'SEMIFINAL', 'FINAL']),
    type: z.enum(['TRYOUT', 'OLYMPIAD']),
  }),
  assignments: z
    .array(
      z.object({
        teamName: z.string().min(1),
        schoolName: z.string().min(1),
        sessionName: z.string().min(1),
      }),
    )
    .min(1, 'Minimal satu assignment'),
})

export type SetTeamsByNamesData = z.output<typeof setTeamsByNamesSchema>
