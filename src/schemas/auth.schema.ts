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