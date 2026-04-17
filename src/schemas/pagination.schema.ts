import { z, ZodObject, ZodRawShape } from "zod"

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(1000).default(10),
  search: z.string().optional(),
})

export const createPaginationQuerySchema = <
  T extends ZodRawShape
>(
  schema: ZodObject<T>
) => {
  return paginationSchema.merge(schema)
}