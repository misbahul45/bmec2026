
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import Footer from '~/components/layout/Footer'
import Header from '~/components/layout/Header'
import appCss from '~/styles/app.css?url'
import { seo } from '~/lib/utils/seo'
import { Toaster } from "~/components/ui/sonner"
import { fetchUser } from '~/server/auth'
import { allowedRegisterPaths } from '~/contants'
import { SessionData } from '~/lib/utils/session'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient,
  user: SessionData | null
}>()({
  beforeLoad: async ({ location }) => {
    const user = await fetchUser()
    if (user) {
      const allowedPaths = [
        ...allowedRegisterPaths(user.userId!),
        '/dashboard',
      ]

      const isAllowed = allowedPaths.some((path) =>
        location.pathname.startsWith(path)
      )

      if (!isAllowed) {
        throw redirect({
          to: user.redirect,
        })
      }
    }

    return {
      user
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title:
          'BMEC 2026 - Biomedical Engineering Competition Universitas Airlangga',
        description:
          'Kompetisi nasional Teknik Biomedis dengan 3 cabang lomba: Olimpiade, LKTI, dan Infografis.',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      {
        src: '/customScript.js',
        type: 'text/javascript',
      },
    ],
  }),

  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),

  notFoundComponent: () => <NotFound />,

  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}


function RootDocument({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isAuthPage = location.pathname.startsWith('/auth')


  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background">
        {!isAuthPage && <Header />}

        {children}

        {!isAuthPage && <Footer />}
        {import.meta.env.DEV && (
          <>
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </>
        )}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            classNames: {
              toast: "border",
              success: "bg-green-500 text-white border-green-600",
              error: "bg-red-500 text-white border-red-600",
              warning: "bg-yellow-400 text-black border-yellow-500",
              info: "bg-blue-500 text-white border-blue-600",
            },
          }}
        />

        <Scripts />
      </body>
    </html>
  )
}