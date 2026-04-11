import { z } from "zod"
import { CompetitionType } from "@prisma/client"

export const updateTeamSchema = z.object({
  name: z
    .string()
    .min(3, "Nama tim minimal 3 karakter")
    .optional(),

  code: z
    .string()
    .min(3, "Kode tim minimal 3 karakter")
    .optional(),

  email: z
    .string()
    .email("Format email tidak valid")
    .optional(),

  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .optional(),

  phone: z
    .string()
    .min(10, "Nomor HP tidak valid")
    .optional(),

  schoolName: z
    .string()
    .min(3, "Nama sekolah wajib diisi")
    .optional(),

  schoolAddress: z
    .string()
    .min(5, "Alamat sekolah wajib diisi")
    .optional(),

  documentUrl: z
    .string()
    .url("URL dokumen tidak valid")
    .nullable()
    .optional(),

  competitionType: z
    .nativeEnum(CompetitionType)
    .optional(),
})