import { createFileRoute } from '@tanstack/react-router'
import RichTextEditor from '~/components/editor/RichTextEditorComments'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/_authed/admin/exams/$examId')({
  component: RouteComponent,
})

function RouteComponent() {
  const [content, setContent] = useState("")

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-10">
      <RichTextEditor content={content} onChange={setContent} />

      <div className="border rounded p-4">
        <h2 className="text-sm font-semibold mb-2">Preview</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}