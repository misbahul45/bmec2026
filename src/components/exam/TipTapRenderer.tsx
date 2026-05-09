import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Table as TableExtension } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'

interface TipTapRendererProps {
  content: string
}

export function TipTapRenderer({ content }: TipTapRendererProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TableExtension.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
    ],
    content,
    editable: false,
    immediatelyRender: false,
  })

  if (!content || !editor) return null

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert [&_.ProseMirror]:outline-none [&_.ProseMirror]:cursor-default">
      <EditorContent editor={editor} />
    </div>
  )
}
