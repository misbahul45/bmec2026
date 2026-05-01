import { z } from "zod"

const baseMemberSchema = z.object({
  id: z.string().uuid().optional(),

  name: z.string().min(3).max(100),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(9, "Nomor WhatsApp tidak valid"),

  studentId: z.string(),
  educationLevel: z.enum(["SMA", "MAHASISWA"]),

  teamId: z.string().uuid(),
  role: z.enum(["KETUA", "ANGGOTA"]),

  major: z.string().optional(),
  faculty: z.string().optional(),
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

  if (!/^08\d{8,13}$/.test(data.phone)) {
    ctx.addIssue({
      path: ["phone"],
      message: "Format WhatsApp tidak valid",
      code: z.ZodIssueCode.custom,
    })
  }
})

export const createMembersSchema = z
  .object({
    members: z.array(baseMemberSchema.omit({ id: true })).length(3),
  })
  .superRefine((data, ctx) => {
    const ketuaCount = data.members.filter((m) => m.role === "KETUA").length

    if (ketuaCount !== 1) {
      ctx.addIssue({
        path: ["members"],
        message: "Harus ada tepat 1 ketua",
        code: z.ZodIssueCode.custom,
      })
    }

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

      if (!/^08\d{8,13}$/.test(member.phone)) {
        ctx.addIssue({
          path: ["members", index, "phone"],
          message: "Format WhatsApp tidak valid",
          code: z.ZodIssueCode.custom,
        })
      }

      const duplicateEmail = data.members.findIndex(
        (m, i) => m.email === member.email && i !== index
      )

      if (duplicateEmail !== -1) {
        ctx.addIssue({
          path: ["members", index, "email"],
          message: "Email tidak boleh sama dalam satu tim",
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
export type UpdateMemberData = z.infer<typeof updateMembersSchema>