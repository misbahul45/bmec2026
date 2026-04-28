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
      include: {
        members: true,
        registration: { include: { competition: { include: { stages: { orderBy: { order: 'asc' } } } } } },
        currentStage: true,
      },
    })
  }

  findSubmissionsByTeamId(teamId:string){
    return prisma.submission.findMany({
      where:{
        teamId
      },
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

  findDashboard(id: string) {
    return prisma.team.findUnique({
      where: { id },
      include: {
        members: true,
        currentStage: true,
        submissions: true,
        registration: {
          include: {
            batch: true,
            competition: {
              include: { stages: { orderBy: { order: 'asc' } } },
            },
          },
        },
      },
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

  updateStage(teamId: string, stageId: string) {
    return prisma.team.update({
      where: { id: teamId },
      data: { currentStageId: stageId },
    })
  }

  getStagesByCompetitionId(competitionId: string) {
    return prisma.stage.findMany({
      where: { competitionId },
      orderBy: { order: 'asc' },
      select: { id: true, name: true, order: true },
    })
  }

  getFirstStageByCompetitionId(competitionId: string) {
    return prisma.stage.findFirst({
      where: { competitionId },
      orderBy: { order: 'asc' },
      select: { id: true },
    })
  }

  findLatestCodeByType(prefix: string) {
    return prisma.team.findFirst({
      where: { code: { startsWith: prefix } },
      orderBy: { code: "desc" },
      select: { code: true },
    })
  }

  updateCode(teamId: string, code: string) {
    return prisma.team.update({ where: { id: teamId }, data: { code } })
  }
}