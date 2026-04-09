import { RegisterFormData } from "~/schemas/auth.schema"
import { AppError } from "../utils/app-error"
import { PaginationMeta } from "../types/pagination"
import { ServiceResponse } from "../types/service-response"
import { QueryTeam } from "~/schemas/team.schema"
import { prisma } from "../utils/prisma"
import { CompetitionType, Prisma } from "@prisma/client"

export default class TeamService {

  generateCodeTeam(competitionType:CompetitionType){
    return competitionType === 'OLIMPIADE'?'olm':competitionType === 'INFOGRAFIS'?'ifs':'lk'
  }

  async create(
    payload: RegisterFormData
  ): Promise<ServiceResponse<any>> {

    if (!payload.competitionType) {
      throw new AppError(
        "Competition type is required",
        400
      )
    }
    const countTeam=await prisma.user.count();
    const team = await prisma.user.create({
      data:{
        schoolAddress:payload.address,
        schoolName:payload.institution,
        password:payload.password,
        email:payload.email,
        competitionType:payload.competitionType,
        name:payload.teamName,
        phone:payload.phone,
        code:this.generateCodeTeam(payload.competitionType)+'-'+countTeam
      }
    })

    return {
      data: team,
      message: "Team created successfully"
    }
  }

  async findAll(
    query: QueryTeam
  ): Promise<ServiceResponse<{
    teams: any[]
    meta: PaginationMeta
  }>> {

    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const skip = (page - 1) * limit

    const where: Prisma.UserWhereInput = {}

    if (query.search) {
        where.OR = [
            {
            name: {
                contains: query.search,
                mode: Prisma.QueryMode.insensitive
            }
            },
            {
            schoolName: {
                contains: query.search,
                mode: Prisma.QueryMode.insensitive
            }
            }
        ]
    }

    if (query.competitionType) {
    where.competitionType = query.competitionType
    }
    const [teams, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          members: true
        }
      }),

      prisma.user.count({
        where
      })
    ])

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }

    return {
      data: {
        teams,
        meta
      }
    }
  }

  async findOne(
    id: string
  ): Promise<ServiceResponse<any>> {

    const team = await prisma.user.findUnique({
      where: { id },
      include: {
        members: true
      }
    })

    if (!team) {
      throw new AppError(
        "Team not found",
        404
      )
    }

    return {
      data: team
    }
  }

  async delete(
    id: string
  ): Promise<ServiceResponse<null>> {

    const team = await prisma.user.findUnique({
      where: { id }
    })

    if (!team) {
      throw new AppError(
        "Team not found",
        404
      )
    }

    await prisma.user.delete({
      where: { id }
    })

    return {
      data: null,
      message: "Team deleted successfully"
    }
  }

  async update(
    id: string,
    payload: Partial<RegisterFormData>
  ): Promise<ServiceResponse<any>> {

    const team = await prisma.user.findUnique({
      where: { id }
    })

    if (!team) {
      throw new AppError("Team not found", 404)
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(payload.teamName && {
          name: payload.teamName
        }),

        ...(payload.institution && {
          schoolName: payload.institution
        }),

        ...(payload.address && {
          schoolAddress: payload.address
        }),

        ...(payload.competitionType && {
          competitionType: payload.competitionType
        })
      }
    })

    return {
      data: updated,
      message: "Team updated successfully"
    }
  }

}