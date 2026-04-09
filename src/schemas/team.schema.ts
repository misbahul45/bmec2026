import { z } from "zod"
import { createPaginationQuerySchema } from "./pagination.schema"

export const memberSchema = z.object({
  id: z.string().uuid().optional(),

  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama terlalu panjang"),

  nis: z
    .string()
    .min(3, "NIS wajib diisi")
    .max(50, "NIS terlalu panjang"),

  documentUrl: z
    .string()
    .url("Document harus berupa URL valid")
    .optional()
    .nullable(),

  teamId: z.string().uuid().optional(),
})

export const createMembersSchema = z.object({
  members: z
    .array(memberSchema.omit({ id: true }))
    .length(3, "Harus mengisi 3 member"),
})

export const updateMembersSchema = z.object({
  members: z
    .array(memberSchema)
    .length(3, "Harus mengupdate 3 member"),
})


export const queryTeam = createPaginationQuerySchema(
  z.object({
    competitionType: z
      .enum(["OLIMPIADE", "LKTI", "INFOGRAFIS"])
      .optional(),
  })
)

export type QueryTeam = z.infer<typeof queryTeam>