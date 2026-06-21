import { createFileRoute, redirect } from '@tanstack/react-router'
import { fetchUser } from '~/server/auth'

export const Route = createFileRoute('/dashboard/_authed')({
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: '/auth/login',
      })
    }

    if (location.pathname.startsWith('/dashboard/admin')) {
      if (context.user.role !== 'ADMIN') {
        throw redirect({
          to: '/dashboard/team',
        })
      }

      return
    }

    if (location.pathname.startsWith('/dashboard/team')) {
      const userLogin = await fetchUser()

      if (!userLogin) {
        throw redirect({
          to: '/auth/login',
        })
      }

      if (userLogin.redirect !== '/dashboard/team') {
        throw redirect({
          href: userLogin.redirect,
        })
      }
    }
  },
})