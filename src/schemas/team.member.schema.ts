import { z } from "zod"
import { createPaginationQuerySchema } from "./pagination.schema"

const baseMemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3).max(100),
  studentId: z.string(),
  educationLevel: z.enum(["SMA", "MAHASISWA"]),
  teamId: z.string().uuid(),
  role: z.enum(["KETUA", "ANGGOTA"]),
})

export const memberSchema = baseMemberSchema.superRefine((data, ctx) => {
  if (data.educationLevel === "SMA" && !/^\d{8,12}$/.test(data.studentId)) {
    ctx.addIssue({
      path: ["studentId"],
      message: "NIS harus berupa angka 8-12 digit",
      code: z.ZodIssueCode.custom,
    })
  }
  if (data.educationLevel === "MAHASISWA" && !/^\d{8,15}$/.test(data.studentId)) {
    ctx.addIssue({
      path: ["studentId"],
      message: "NIM harus berupa angka 8-15 digit",
      code: z.ZodIssueCode.custom,
    })
  }
})


export const createMembersSchema = z.object({
  members: z.array(baseMemberSchema.omit({ id: true })).length(3),
}).superRefine((data, ctx) => {
  data.members.forEach((member, index) => {
    if (member.educationLevel === "SMA" && !/^\d{8,12}$/.test(member.studentId)) {
      ctx.addIssue({
        path: ["members", index, "studentId"],
        message: "NIS harus berupa angka 8-12 digit",
        code: z.ZodIssueCode.custom,
      })
    }
    if (member.educationLevel === "MAHASISWA" && !/^\d{8,15}$/.test(member.studentId)) {
      ctx.addIssue({
        path: ["members", index, "studentId"],
        message: "NIM harus berupa angka 8-15 digit",
        code: z.ZodIssueCode.custom,
      })
    }
  })
})

export const updateMembersSchema = z.object({
  members: z.array(memberSchema).length(3),
})

export type MemberData = z.infer<typeof memberSchema>
export type CreateMemberData = z.infer<typeof createMembersSchema>
export type  UpdateMemberDara = z.infer<typeof updateMembersSchema>