import { createServerFn } from "@tanstack/react-start"
import { withErrorHandling } from "~/lib/utils/server-wrapper"
import { successResponse, ApiSuccess } from "~/lib/utils/api-response"
import TeamService from "~/lib/api/teams/team.service"
import { z } from "zod"
import { registerSchema } from "~/schemas/auth.schema"
import { createMembersSchema, queryTeam } from "~/schemas/team.member.schema"
import { User } from "@prisma/client"
import { Uuid } from "~/schemas/general.schema"
import { SafeTeam, TeamsResponse } from "~/types/team.type"
import { updateTeamSchema } from "~/schemas/team,schema"


const teamService = new TeamService()



export const getTeams = createServerFn({ method: "GET" })
  .inputValidator(queryTeam)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<TeamsResponse>> => {
      const result = await teamService.findAll(data)
      return successResponse<TeamsResponse>(result.data, result.message)
    })
  )

export const getTeam = createServerFn({ method: "GET" })
  .inputValidator(Uuid)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<SafeTeam>> => {
      const result = await teamService.findOne(data)
      return successResponse<SafeTeam>(result.data, result.message)
    })
  )

export const createTeam = createServerFn({ method: "POST" })
  .inputValidator(registerSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<SafeTeam>> => {
      const result = await teamService.create(data)
      return successResponse<SafeTeam>(result.data, result.message)
    })
  )

export const updateTeam = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    id:Uuid,
    body:updateTeamSchema
  }))
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<SafeTeam>> => {
      const result = await teamService.update(data.id, data.body)
      return successResponse<SafeTeam>(result.data, result.message)
    })
  )

export const deleteTeam = createServerFn({ method: "POST" })
  .inputValidator(Uuid)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<null>> => {
      const result = await teamService.delete(data)
      return successResponse<null>(result.data, result.message)
    })
  )


  export const createTeamMember=createServerFn({ method:'POST' })
  .inputValidator(createMembersSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result=await teamService.createMember(data)
      return successResponse<any>(result.data, result.message)
    })
  )