import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_authed/team/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/team/"!</div>
}
