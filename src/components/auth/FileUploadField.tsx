import { useRef } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { cn } from '~/lib/utils'

interface Props {
  value?: File
  onChange: (file: File | undefined) => void
  accept?: string
  label: string
  error?: boolean
}

export function FileUploadField({ value, onChange, accept = '.pdf,.doc,.docx', label, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

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
        <div className={cn(
          'flex items-center gap-2 rounded border border-border bg-muted px-3 py-2',
          error && 'border-destructive'
        )}>
          <FileText size={13} className="text-primary shrink-0" />
          <span className="text-xs text-foreground flex-1 truncate">{value.name}</span>
          <button
            type="button"
            onClick={() => { onChange(undefined); if (inputRef.current) inputRef.current.value = '' }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={12} />
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
          <Upload size={13} />
          {label}
        </button>
      )}
    </div>
  )
}
