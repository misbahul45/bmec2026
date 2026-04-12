import { useRef, useMemo } from 'react'
import { Upload, X, FileText, Eye } from 'lucide-react'
import { cn } from '~/lib/utils'

interface Props {
  value?: File
  onChange: (file: File | undefined) => void
  accept?: string
  label: string
  error?: boolean
}

export function FileUploadField({
  value,
  onChange,
  accept = '.pdf,.doc,.docx',
  label,
  error,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  // ✅ create preview url
  const previewUrl = useMemo(() => {
    if (!value) return null
    return URL.createObjectURL(value)
  }, [value])

  const removeFile = () => {
    onChange(undefined)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0])}
      />

      {value ? (
        <div
          className={cn(
            'flex items-center gap-2 rounded border border-border bg-muted px-3 py-2',
            error && 'border-destructive'
          )}
        >
          <FileText size={14} className="text-primary shrink-0" />

          <span className="text-xs text-foreground flex-1 truncate">
            {value.name}
          </span>

          {/* ✅ VIEW BUTTON */}
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Eye size={14} />
            </a>
          )}

          {/* ✅ REMOVE BUTTON */}
          <button
            type="button"
            onClick={removeFile}
            className="text-muted-foreground hover:text-destructive"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex items-center gap-2 rounded border border-dashed border-border bg-background px-3 py-2.5',
            'hover:border-primary/40 hover:bg-muted transition-colors text-xs text-muted-foreground',
            error && 'border-destructive'
          )}
        >
          <Upload size={14} />
          {label}
        </button>
      )}
    </div>
  )
}