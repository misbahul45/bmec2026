import { z } from "zod"
import { CompetitionType } from "@prisma/client"
import {
  parseAsInteger,
  parseAsString,
  createLoader,
} from "nuqs/server"
import { createPaginationQuerySchema } from "./pagination.schema"

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
    .min(8, "Password minimal 8 karakter")
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
  twibbonUrl: z
    .string()
    .url("URL twibbon tidak valid")
    .nullable()
    .optional(),
  competitionType: z
    .nativeEnum(CompetitionType)
    .optional(),
})


export const teamsSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(""),
  competitionType: parseAsString.withDefault("ALL"),
  registrationStatus: parseAsString.withDefault("ALL"),
}
export const loadTeamsSearchParams = createLoader(teamsSearchParams)

export function normalizeTeamQuery(
  q: {
    page: number
    limit: number
    search: string
    competitionType: string | null
    registrationStatus: string | null
  }
): QueryTeam {
  return {
    page: q.page,
    limit: q.limit,
    search: q.search,
    competitionType:
      q.competitionType === null ? undefined : (q.competitionType as QueryTeam["competitionType"]),
    registrationStatus:
      q.registrationStatus === null ? undefined : (q.registrationStatus as QueryTeam["registrationStatus"]),
  }
}

export const queryTeam = createPaginationQuerySchema(
  z.object({
    competitionType: z.preprocess(
      (val) => {
        if (val === "ALL" || val === "" || val == null) return undefined
        return val
      },
      z.enum(["OLIMPIADE", "LKTI", "INFOGRAFIS"]).optional()
    ),
    registrationStatus: z.preprocess(
      (val) => {
        if (val === "ALL" || val === "" || val == null) return undefined
        return val
      },
      z.enum(["PENDING", "APPROVED", "REJECTED", "NONE"]).optional()
    ),
  })
)


export type QueryTeamInput = z.input<typeof queryTeam>
export type QueryTeam = z.output<typeof queryTeam>