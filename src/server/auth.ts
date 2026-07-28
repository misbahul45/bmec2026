import { createServerFn } from "@tanstack/react-start"
import { loginSchema } from "~/schemas/auth.schema"
import { withErrorHandling } from "~/lib/utils/server-wrapper"
import { ApiSuccess, successResponse } from "~/lib/utils/api-response"
import { AppError } from "~/lib/utils/app-error"
import TeamRepo from "~/lib/api/teams/team.repo"
import AdminRepo from "~/lib/api/admins/admin.repo"
import * as bcrypt from "bcrypt"
import { useAppSession } from "~/lib/utils/session"

const teamRepo = new TeamRepo()
const adminRepo = new AdminRepo()


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
        userId: session.data.userId,
        email: session.data.email,
        role: 'ADMIN' as const,
        redirect: "/dashboard/admin",
      }
    }

    if (session.data.role !== 'TEAM') return null

    const team = await teamRepo.findAuthState(session.data.userId)

    if (!team) return null

    const mentor = team.mentor
    const registration = team.registration
    const abstractTeam = team.submissions[0]?.abstractUrl

    let redirect: string

    if (!mentor) {
      redirect = `/auth/register/${team.id}/`
    } else if (team._count.members === 0) {
      redirect = `/auth/register/${team.id}/?tab=members`
    } else if (team.competitionType === 'LKTI') {
      if (!abstractTeam) {
        redirect = `/auth/register/${team.id}/?tab=dokumen`
      } else {
        redirect = "/dashboard/team"
      }
    }else if(!team.documentUrl || !team.twibbonUrl){
      redirect = `/auth/register/${team.id}/?tab=dokumen`
    } else if (!registration) {
      redirect = `/auth/register/${team.id}/completed`
    } else {
      redirect = "/dashboard/team"
    }

    return {
      userId: session.data.userId,
      email: session.data.email,
      role: 'TEAM' as const,
      redirect,
    }
  })
