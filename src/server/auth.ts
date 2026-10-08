import { createServerFn } from "@tanstack/react-start"
import { loginSchema } from "~/schemas/auth.schema"
import { withErrorHandling } from "~/lib/utils/server-wrapper"
import { ApiSuccess, successResponse } from "~/lib/utils/api-response"
import { AppError } from "~/lib/utils/app-error"
import TeamRepo from "~/lib/api/teams/team.repo"
import AdminRepo from "~/lib/api/admins/admin.repo"
import * as bcrypt from "bcrypt"
import { useAppSession } from "~/lib/utils/session"
import { assertNotRateLimited, recordFailure, resetRateLimit } from "~/lib/utils/rate-limit"
import { getRequestIP } from "@tanstack/react-start/server"

const teamRepo = new TeamRepo()
const adminRepo = new AdminRepo()

// Only failed attempts count (successful logins never lock anyone out).
//  - per email+IP: tight, so a remote attacker cannot lock the real owner out of their account;
//  - per email overall: looser, bounds guessing spread across many IPs;
//  - per IP: generous, so a shared campus/school NAT during the registration rush is not blocked.
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LIMIT_PER_EMAIL_AND_IP = { limit: 8, windowMs: LOGIN_WINDOW_MS }
const LIMIT_PER_EMAIL = { limit: 40, windowMs: LOGIN_WINDOW_MS }
const LIMIT_PER_IP = { limit: 100, windowMs: LOGIN_WINDOW_MS }

// Compared against when the email is unknown so response time does not reveal
// whether an account exists.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("not-a-real-password", 10)

const INVALID_CREDENTIALS = () =>
  new AppError("Email atau kata sandi salah. Periksa kembali data Anda.", 401, "INVALID_CREDENTIALS")

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator(loginSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const email = data.email.trim()
      const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown"
      const emailIpKey = `login:email-ip:${email.toLowerCase()}:${ip}`
      const emailKey = `login:email:${email.toLowerCase()}`
      const ipKey = `login:ip:${ip}`

      assertNotRateLimited(emailIpKey, LIMIT_PER_EMAIL_AND_IP)
      assertNotRateLimited(emailKey, LIMIT_PER_EMAIL)
      assertNotRateLimited(ipKey, LIMIT_PER_IP)

      const [team, admin] = await Promise.all([
        teamRepo.findByEmail(email),
        adminRepo.findByEmail(email),
      ])

      const user = admin ?? team
      const role = admin ? "ADMIN" : "TEAM"

      const isValidPassword = await bcrypt.compare(
        data.password,
        user?.password ?? DUMMY_PASSWORD_HASH
      )

      if (!user || !isValidPassword) {
        recordFailure(emailIpKey, LIMIT_PER_EMAIL_AND_IP)
        recordFailure(emailKey, LIMIT_PER_EMAIL)
        recordFailure(ipKey, LIMIT_PER_IP)
        throw INVALID_CREDENTIALS()
      }

      resetRateLimit(emailIpKey)

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
