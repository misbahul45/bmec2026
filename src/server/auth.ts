import { createServerFn } from "@tanstack/react-start"
import { loginSchema } from "~/schemas/auth.schema"
import { withErrorHandling } from "~/lib/utils/server-wrapper"
import { ApiSuccess, successResponse } from "~/lib/utils/api-response"
import { AppError } from "~/lib/utils/app-error"
import TeamRepo from "~/lib/api/teams/team.repo"
import AdminRepo from "~/lib/api/admins/admin.repo"
import * as bcrypt from "bcrypt"
import { useAppSession } from "~/lib/utils/session"
import CompetitionRepo from "~/lib/api/competitions/competition.repo"

const teamRepo = new TeamRepo()
const adminRepo = new AdminRepo()
const competitionRepo = new CompetitionRepo()


export const loginFn = createServerFn({ method: "POST" })
  .inputValidator(loginSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const [team, admin] = await Promise.all([
        teamRepo.findByEmail(data.email),
        adminRepo.findByEmail(data.email),
      ])

      if (!team && !admin) {
        throw new AppError("Account not found")
      }

      const user = admin ?? team
      const role = admin ? "ADMIN" : "TEAM"

      if (!user) {
        throw new AppError("Account not found")
      }

      const isValidPassword = await bcrypt.compare(
        data.password,
        user.password
      )

      if (!isValidPassword) {
        throw new AppError("Incorrect password")
      }

      const session = await useAppSession()

     let registrationTeam;

     if(role === 'TEAM'){
      registrationTeam = await competitionRepo.findRegistrationByTeamid(user.id);
     }

      await session.update({
        userId: user.id,
        email: user.email,
        role,
      })

      return successResponse(
        {
          id: user.id,
          email: user.email,
          role,
        },
        "Login success"
      )
    })
  )

export const logoutFn = createServerFn({ method: "POST" }).handler(
  withErrorHandling(async () => {
    const session = await useAppSession()
    await session.clear()
    return successResponse(null, "Logout success")
  })
)



export const fetchUser = createServerFn({ method: "GET" })
  .handler(async () => {
    const session = await useAppSession()

    if (!session.data.userId) {
      return null
    }

    if (session.data.role === "ADMIN") {
      return {
        ...session.data,
        redirect: "/dashboard/admin",
      }
    }

    const team = await teamRepo.findById(session.data.userId)

    if (!team) return null

    const mentor = await teamRepo.findMentorByTeamId(team.id)
    const registration = await competitionRepo.findRegistrationByTeamid(team.id)
    const abstractTeam = (await teamRepo.findSubmissionsByTeamId(team.id))[0]?.abstractUrl

    let redirect: string

    if (!mentor) {
      redirect = `/auth/register/${team.id}/`
    } else if (!team.members || team.members.length === 0) {
      redirect = `/auth/register/${team.id}/?tab=members`
    } else if (team.competitionType === 'LKTI') {
      if (!abstractTeam) {
        redirect = `/auth/register/${team.id}/?tab=dokumen`
      } else {
        redirect = "/dashboard/team"
      }
    } else if (!registration) {
      redirect = `/auth/register/${team.id}/?tab=dokumen`
    } else {
      redirect = "/dashboard/team"
    }

    return {
      ...session.data,
      redirect,
    }
  })