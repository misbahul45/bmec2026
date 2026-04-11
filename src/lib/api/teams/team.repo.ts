import { MemberData } from "~/schemas/team.member.schema"
import { prisma } from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export default class TeamRepoSafe {

  countApprovedTeams() {
    return prisma.user.count({
      where: {
        registration: {
          status: "APPROVED",
        },
      },
    })
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  findByName(name: string) {
    return prisma.user.findUnique({
      where: { name },
    })
  }

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  }

  findAll(where: Prisma.UserWhereInput, skip: number, take: number) {
    return prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { members: true },
    })
  }

  count(where: Prisma.UserWhereInput) {
    return prisma.user.count({ where })
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { members: true },
    })
  }

  delete(id: string) {
    return prisma.user.delete({ where: { id } })
  }

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    })
  }

  createMember(data:MemberData[]){
    return prisma.member.createMany({
      data:data.map((t)=>({
        role:t.role,
        studentId:t.studentId,
        teamId:t.teamId!,
        name:t.name
      }))
    })
  }
}