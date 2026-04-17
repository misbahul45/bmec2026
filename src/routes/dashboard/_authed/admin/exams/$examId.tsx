import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { examQuestionsQueryOptions } from '~/lib/api/exams/exam.query-options'
import RichTextEditor from '~/components/editor/RichTextEditorComments'
import { useState } from 'react'
import QuestionCard from '~/components/dashboard/admin/exams/QuestionCard'

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

  const [content, setContent] = useState("")

  const questions = res.data

  console.log(questions)

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-20">
      <RichTextEditor content={content} onChange={setContent} />

      <div className="border rounded p-4">
        <h2 className="text-sm font-semibold mb-2">Preview</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <div className="border rounded p-4">
        <h2 className="text-sm font-semibold mb-2">Questions</h2>

        {questions?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Belum ada soal
          </p>
        )}
        <div className="space-y-2">
          {questions?.map((q, index) => (
            <QuestionCard
              key={q.id}
              data={q}
              number={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}