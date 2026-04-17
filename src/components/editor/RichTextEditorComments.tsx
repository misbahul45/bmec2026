"use client"

import React, { useEffect, useRef, useState } from "react"
import "quill/dist/quill.snow.css"
import { uploadToImageKit } from "~/lib/api/uploads/service"

interface Props {
  content: string
  onChange: (value: string) => void
}

const RichTextEditorComments = ({ content, onChange }: Props) => {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const quillRef = useRef<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!editorRef.current || quillRef.current) return

    const init = async () => {
      try {
        const Quill = (await import("quill")).default

        const quill = new Quill(editorRef.current!, {
          theme: "snow",
          modules: {
            toolbar: {
              container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["image"],
              ],
              handlers: {
                image: () => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = "image/*"
                  input.click()

                  input.onchange = async () => {
                    const file = input.files?.[0]
                    if (!file) return

                    const url = await uploadToImageKit(file)
                    const range = quill.getSelection()
                    quill.insertEmbed(range?.index ?? 0, "image", url)
                  }
                },
              },
            },
          },
        })

        if (content) {
          quill.root.innerHTML = content
        }

        quill.on("text-change", () => {
          onChange(quill.root.innerHTML)
        })

        quillRef.current = quill
      } catch (err) {
        console.error("QUILL INIT ERROR:", err)
      }
    }

    init()
  }, [mounted])

  useEffect(() => {
    if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = content
    }
  }, [content])

  if (!mounted) return <div>Loading editor...</div>

  return (
    <div className="border rounded-md">
      <div ref={editorRef} className="min-h-37.5" />
    </div>
  )
}

export default RichTextEditorComments