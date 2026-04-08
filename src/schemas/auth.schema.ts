import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email tidak boleh kosong',
      invalid_type_error: 'Email harus berupa teks'
    })
    .email('Masukkan email yang valid'),

  password: z
    .string({
      required_error: 'Password tidak boleh kosong'
    })
    .min(8, 'Password minimal 8 karakter')
})

export const competitionTypes = ['OLIMPIADE', 'LKTI', 'INFOGRAFIS'] as const
export type CompetitionType = typeof competitionTypes[number]

export const registerSchema = z.object({
  teamName: z.string().min(2, 'Nama tim minimal 2 karakter'),
  institution: z.string().min(3, 'Nama institusi minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(9, 'Nomor telepon tidak valid'),
  competitionType: z.enum(competitionTypes, { required_error: 'Pilih jenis lomba' }),
  address: z.string().min(5, 'Alamat wajib diisi'),
  proposal: z.instanceof(File).optional(),
  infographic: z.instanceof(File).optional(),
})


export type RegisterFormData = z.infer<typeof registerSchema>
