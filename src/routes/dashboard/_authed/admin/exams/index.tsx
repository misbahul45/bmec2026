import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import ExamCard from '~/components/dashboard/admin/exams/ExamCard'
import { examsQueryOptions } from '~/lib/api/exams/exam.query-options'

export const Route = createFileRoute(
  '/dashboard/_authed/admin/exams/'
)({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      examsQueryOptions()
    )
  },
  component: RouteComponent,
})

function ExamsContent() {
  const { data: res } = useSuspenseQuery(
    examsQueryOptions()
  )

  const exams = Array.isArray(res) ? res : res?.data ?? []

  return (
    <div className="flex flex-col gap-3">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="space-y-4 w-full pt-20 min-h-screen pb-6 max-w-6xl mx-auto px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ExamsContent />
      </Suspense>
    </div>
  )
}