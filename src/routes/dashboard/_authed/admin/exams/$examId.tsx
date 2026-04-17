import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { examQuestionsQueryOptions } from '~/lib/api/exams/exam.query-options'
import QuestionCard from '~/components/dashboard/admin/exams/QuestionCard'
import FormAddQuestion from '~/components/dashboard/admin/exams/FormAddQuestion'

export const Route = createFileRoute('/dashboard/_authed/admin/exams/$examId')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    return context.queryClient.ensureQueryData(
      examQuestionsQueryOptions(params.examId)
    )
  },
})

function RouteComponent() {
  const { examId } = Route.useParams()

  const { data: res } = useSuspenseQuery(
    examQuestionsQueryOptions(examId)
  )

  const questions = res.data

  return (
    <div className="mx-auto space-y-6 pt-20 w-full max-w-6xl px-8">
      <FormAddQuestion examId={examId} />

      <div className="border rounded p-4">
        <h2 className="text-sm font-semibold mb-2">Questions</h2>

        {questions?.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada soal</p>
        )}

        <div className="space-y-2">
          {questions?.map((q, index) => (
            <QuestionCard key={q.id} data={q} number={index + 1} />
          ))}
        </div>
      </div>
    </div>
  )
}