import { z } from 'zod'

export const createMentorSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama wajib diisi')
    .max(100, 'Nama terlalu panjang'),

  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),

  phone: z
    .string()
    .min(8, 'Nomor HP minimal 8 digit')
    .max(15, 'Nomor HP maksimal 15 digit')
    .regex(/^[0-9+]+$/, 'Nomor HP hanya boleh angka dan +'),

  teamId: z
    .string()
    .uuid('Team ID tidak valid'),
})

export type CreateMentorInput = z.infer<typeof createMentorSchema>

export const updateMentorSchema = createMentorSchema.partial()