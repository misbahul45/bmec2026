import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_authed/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='h-screen px-4 pt-16'>Hello "/dashboard/admin/"!</div>
}
