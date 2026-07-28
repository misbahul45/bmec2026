import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { cn } from '~/lib/utils'

interface ExamRichTextProps {
  content: string
  className?: string
}

/**
 * Renders the HTML produced by the question editor without mounting another
 * editor instance. Questions can only be authored by authenticated admins.
 */
export function ExamRichText({ content, className }: ExamRichTextProps) {
  if (!content) return null

  return (
    <div
      className={cn(
        'exam-rich-text ql-snow min-w-0 text-sm text-foreground',
        '[&_.ql-editor]:!h-auto [&_.ql-editor]:!overflow-visible [&_.ql-editor]:!p-0',
        '[&_.ql-editor_img]:h-auto [&_.ql-editor_img]:max-w-full [&_.ql-editor_img]:rounded-lg',
        '[&_.ql-editor_table]:w-full [&_.ql-editor_table]:border-collapse',
        '[&_.ql-editor_td]:border [&_.ql-editor_td]:border-border [&_.ql-editor_td]:p-2',
        '[&_.ql-editor_th]:border [&_.ql-editor_th]:border-border [&_.ql-editor_th]:p-2',
        className,
      )}
    >
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}
