import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_authed/admin/exams/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/_authed/admin/olympiad/"!</div>
}
