import { MemberData } from "~/schemas/team.member.schema"
import { prisma } from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export default class TeamRepo {

  findByEmail(email: string) {
    return prisma.team.findUnique({
      where: { email },
      include: { members: true },
    })
  }

  findByName(name: string) {
    return prisma.team.findUnique({
      where: { name },
    })
  }

  create(data: Prisma.TeamCreateInput) {
    return prisma.team.create({ data })
  }

  findAll(where: Prisma.TeamWhereInput, skip: number, take: number) {
    return prisma.team.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { members: true },
    })
  }

  count(where: Prisma.TeamWhereInput) {
    return prisma.team.count({ where })
  }

  findById(id: string) {
    return prisma.team.findUnique({
      where: { id },
      include: { members: true },
    })
  }

  delete(id: string) {
    return prisma.team.delete({ where: { id } })
  }

  update(id: string, data: Prisma.TeamUpdateInput) {
    return prisma.team.update({
      where: { id },
      data,
    })
  }

  createMember(data: MemberData[]) {
    return prisma.member.createMany({
      data: data.map((t) => ({
        role: t.role,
        studentId: t.studentId,
        teamId: t.teamId!,
        name: t.name,
      })),
    })
  }

  findLatestCodeByType(prefix: string) {
    return prisma.team.findFirst({
      where: {
        code: {
          startsWith: prefix,
        },
      },
      orderBy: {
        code: "desc",
      },
      select: {
        code: true,
      },
    })
  }
}