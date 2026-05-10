import React, { useEffect, useRef, useState, useCallback } from "react"
import "quill/dist/quill.snow.css"
import { uploadToImageKit } from "~/lib/api/uploads/service"

interface Props {
  content: string
  onChange: (value: string) => void
}


function createResizeManager(quill: any, triggerChange: () => void) {
  let overlay: HTMLDivElement | null = null
  let activeImg: HTMLImageElement | null = null

  const editorContainer = quill.root.parentElement as HTMLElement
  editorContainer.style.position = "relative"

  function getImgOffset(img: HTMLImageElement) {
    const editorRect = editorContainer.getBoundingClientRect()
    const imgRect    = img.getBoundingClientRect()
    return {
      top:    imgRect.top  - editorRect.top  + editorContainer.scrollTop,
      left:   imgRect.left - editorRect.left,
      width:  imgRect.width,
      height: imgRect.height,
    }
  }

  function updateOverlayPosition() {
    if (!overlay || !activeImg) return
    const { top, left, width, height } = getImgOffset(activeImg)
    overlay.style.top    = `${top}px`
    overlay.style.left   = `${left}px`
    overlay.style.width  = `${width}px`
    overlay.style.height = `${height}px`
  }

  function removeOverlay() {
    overlay?.remove()
    overlay = null
    if (activeImg) {
      activeImg.style.outline = ""
      activeImg = null
    }
  }

  function attachOverlay(img: HTMLImageElement) {
    removeOverlay()
    activeImg = img
    img.style.outline = "2px solid #6366f1"
    img.style.outlineOffset = "2px"

    overlay = document.createElement("div")
    overlay.style.cssText = `
      position: absolute;
      border: 2px solid #6366f1;
      border-radius: 3px;
      pointer-events: none;
      z-index: 50;
    `

    // 8 handles: corners + edges
    const positions = [
      { key: "nw", cursor: "nw-resize", top: "-5px",  left: "-5px",  transform: "" },
      { key: "n",  cursor: "n-resize",  top: "-5px",  left: "50%",   transform: "translateX(-50%)" },
      { key: "ne", cursor: "ne-resize", top: "-5px",  right: "-5px", transform: "" },
      { key: "e",  cursor: "e-resize",  top: "50%",   right: "-5px", transform: "translateY(-50%)" },
      { key: "se", cursor: "se-resize", bottom: "-5px", right: "-5px", transform: "" },
      { key: "s",  cursor: "s-resize",  bottom: "-5px", left: "50%",  transform: "translateX(-50%)" },
      { key: "sw", cursor: "sw-resize", bottom: "-5px", left: "-5px", transform: "" },
      { key: "w",  cursor: "w-resize",  top: "50%",   left: "-5px",  transform: "translateY(-50%)" },
    ]

    positions.forEach(({ key, cursor, top, left, right, bottom, transform }) => {
      const handle = document.createElement("div")
      handle.style.cssText = `
        position: absolute;
        width: 9px;
        height: 9px;
        background: white;
        border: 2px solid #6366f1;
        border-radius: 2px;
        pointer-events: all;
        cursor: ${cursor};
        z-index: 51;
        ${top    !== undefined ? `top: ${top};`       : ""}
        ${left   !== undefined ? `left: ${left};`     : ""}
        ${right  !== undefined ? `right: ${right};`   : ""}
        ${bottom !== undefined ? `bottom: ${bottom};` : ""}
        transform: ${transform};
      `

      handle.addEventListener("mousedown", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const startX  = e.clientX
        const startY  = e.clientY
        const startW  = img.offsetWidth
        const startH  = img.offsetHeight
        const ratio   = startW / startH
        const isCorner = ["nw","ne","se","sw"].includes(key)

        const onMove = (me: MouseEvent) => {
          const dx = me.clientX - startX
          const dy = me.clientY - startY
          let newW = startW
          let newH = startH

          if (key.includes("e"))  newW = Math.max(40, startW + dx)
          if (key.includes("w"))  newW = Math.max(40, startW - dx)
          if (key.includes("s"))  newH = Math.max(40, startH + dy)
          if (key.includes("n"))  newH = Math.max(40, startH - dy)

          if (isCorner) {
            // Lock aspect ratio for corners
            const dominantW = Math.abs(
              key.includes("e") ? dx : -dx
            ) > Math.abs(key.includes("s") ? dy : -dy)
            if (dominantW) newH = newW / ratio
            else           newW = newH * ratio
          }

          img.style.width  = `${Math.round(newW)}px`
          img.style.height = isCorner || ["n","s"].includes(key)
            ? `${Math.round(newH)}px`
            : "auto"

          updateOverlayPosition()
        }

        const onUp = () => {
          triggerChange()
          document.removeEventListener("mousemove", onMove)
          document.removeEventListener("mouseup",   onUp)
        }

        document.addEventListener("mousemove", onMove)
        document.addEventListener("mouseup",   onUp)
      })

      overlay!.appendChild(handle)
    })

    const { top, left, width, height } = getImgOffset(img)
    overlay.style.top    = `${top}px`
    overlay.style.left   = `${left}px`
    overlay.style.width  = `${width}px`
    overlay.style.height = `${height}px`

    editorContainer.appendChild(overlay)
  }

  quill.root.addEventListener("click", (e: MouseEvent) => {
    const el = e.target as HTMLElement
    if (el.tagName === "IMG") {
      attachOverlay(el as HTMLImageElement)
    } else if (!overlay?.contains(el)) {
      removeOverlay()
    }
  })

  document.addEventListener("mousedown", (e: MouseEvent) => {
    if (
      !quill.root.contains(e.target as Node) &&
      !overlay?.contains(e.target as Node)
    ) {
      removeOverlay()
    }
  })

  quill.root.addEventListener("scroll", updateOverlayPosition)
}

const LOADING_BLOT_CLASS = "ql-image-loading"

function registerLoadingBlot(Quill: any) {
  const BlockEmbed = Quill.import("blots/block/embed") as any

  class LoadingBlot extends BlockEmbed {
    static blotName = "imageLoading"
    static tagName  = "div"
    static className = LOADING_BLOT_CLASS

    static create(fileName: string) {
      const node = super.create() as HTMLElement
      node.setAttribute("contenteditable", "false")
      node.dataset.fileName = fileName
      node.innerHTML = `
        <div class="${LOADING_BLOT_CLASS}__inner">
          <div class="${LOADING_BLOT_CLASS}__ring">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="15" stroke="#e2e8f0" stroke-width="3"/>
              <circle cx="18" cy="18" r="15" stroke="#6366f1" stroke-width="3"
                stroke-dasharray="60 35" stroke-linecap="round"
                class="${LOADING_BLOT_CLASS}__arc"/>
            </svg>
          </div>
          <div class="${LOADING_BLOT_CLASS}__text">
            <span class="${LOADING_BLOT_CLASS}__label">Uploading</span>
            <span class="${LOADING_BLOT_CLASS}__filename">${fileName}</span>
          </div>
          <div class="${LOADING_BLOT_CLASS}__dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      `
      return node
    }

    static value(node: HTMLElement) {
      return node.dataset.fileName ?? ""
    }
  }

  Quill.register(LoadingBlot, true)
}

const RichTextEditorComments = ({ content, onChange }: Props) => {
  const editorRef  = useRef<HTMLDivElement | null>(null)
  const quillRef   = useRef<any>(null)
  const [mounted, setMounted] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || !editorRef.current || quillRef.current) return

    const init = async () => {
      try {
        const Quill = (await import("quill")).default
        registerLoadingBlot(Quill)

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
                  input.type   = "file"
                  input.accept = "image/*"
                  input.click()

                  input.onchange = async () => {
                    const file = input.files?.[0]
                    if (!file) return

                    const range   = quill.getSelection() ?? { index: quill.getLength() - 1 }
                    const insertAt = range.index

                    quill.insertEmbed(insertAt, "imageLoading", file.name, "user")
                    quill.setSelection(insertAt + 1, 0)
                    setUploading(true)

                    try {
                      const url = await uploadToImageKit(file)

                      quill.deleteText(insertAt, 1, "user")
                      quill.insertEmbed(insertAt, "image", url, "user")
                      quill.setSelection(insertAt + 1, 0)
                    } catch (err) {
                      quill.deleteText(insertAt, 1, "user")
                      console.error("Upload failed:", err)
                    } finally {
                      setUploading(false)
                    }
                  }
                },
              },
            },
          },
        })

        if (content) quill.root.innerHTML = content

        const triggerChange = () => onChange(quill.root.innerHTML)
        quill.on("text-change", triggerChange)

        createResizeManager(quill, triggerChange)

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

  if (!mounted) return (
    <div className="border rounded-md h-40 flex items-center justify-center text-sm text-gray-400">
      Loading editor…
    </div>
  )

  return (
    <>
      <style>{`
        /* ── Loading blot ─────────────────────────── */
        .${LOADING_BLOT_CLASS} {
          margin: 12px 0;
          border-radius: 10px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f0ff 0%, #f8f8ff 100%);
          border: 1.5px dashed #a5b4fc;
        }
        .${LOADING_BLOT_CLASS}__inner {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
        }
        .${LOADING_BLOT_CLASS}__ring {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
        }
        .${LOADING_BLOT_CLASS}__arc {
          animation: ql-spin 0.9s linear infinite;
          transform-origin: center;
        }
        @keyframes ql-spin {
          to { transform: rotate(360deg); }
        }
        .${LOADING_BLOT_CLASS}__text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          flex: 1;
        }
        .${LOADING_BLOT_CLASS}__label {
          font-size: 11px;
          font-weight: 600;
          color: #6366f1;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .${LOADING_BLOT_CLASS}__filename {
          font-size: 13px;
          color: #475569;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .${LOADING_BLOT_CLASS}__dots {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        .${LOADING_BLOT_CLASS}__dots span {
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #818cf8;
          animation: ql-bounce 1.2s ease-in-out infinite;
        }
        .${LOADING_BLOT_CLASS}__dots span:nth-child(2) { animation-delay: 0.2s; }
        .${LOADING_BLOT_CLASS}__dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ql-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }

        /* ── Shimmer sweep on the loading card ──────── */
        .${LOADING_BLOT_CLASS}::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.55) 50%,
            transparent 100%
          );
          animation: ql-shimmer 1.6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes ql-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%);  }
        }

        /* ── Images in editor ────────────────────────── */
        .ql-editor img:not(.${LOADING_BLOT_CLASS} img) {
          cursor: pointer;
          max-width: 100%;
          border-radius: 6px;
          transition: opacity 0.15s;
        }
        .ql-editor img:not(.${LOADING_BLOT_CLASS} img):hover {
          opacity: 0.92;
        }

        /* ── Upload badge (top-right of editor) ──────── */
        .rte-uploading-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: white;
          border: 1px solid #e0e7ff;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          color: #6366f1;
          box-shadow: 0 2px 8px rgba(99,102,241,0.12);
          z-index: 60;
          animation: rte-fadein 0.2s ease;
        }
        @keyframes rte-fadein {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .rte-uploading-badge__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6366f1;
          animation: rte-pulse 1s ease-in-out infinite;
        }
        @keyframes rte-pulse {
          0%, 100% { opacity: 1;   transform: scale(1);   }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        /* ── Resize hint tooltip ─────────────────────── */
        .rte-resize-tip {
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%);
          background: #1e1e2e;
          color: white;
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .image-resize-overlay:hover .rte-resize-tip {
          opacity: 1;
        }
      `}</style>

      {/* ── Editor wrapper ──────────────────────────────────────────────── */}
      <div className="border border-gray-200 rounded-lg overflow-visible shadow-sm relative">
        {/* Upload in-progress badge */}
        {uploading && (
          <div className="rte-uploading-badge">
            <div className="rte-uploading-badge__dot" />
            Uploading…
          </div>
        )}

        <div ref={editorRef} className="min-h-[150px]" />
      </div>
    </>
  )
}

export default RichTextEditorComments