import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_authed')({
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/auth/login",
      })
    }

    if (location.pathname.startsWith('/dashboard/admin')) {
      if (context.user?.role !== 'ADMIN') {
        throw redirect({
          to: '/dashboard/team'
        })
      }
    }
  }
})