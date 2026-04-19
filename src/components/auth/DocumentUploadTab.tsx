import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Upload, X, FileText, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { uploadToImageKit } from '~/lib/api/uploads/service'
import { cn } from '~/lib/utils'
import { updateTeam } from '~/server/team'

interface Props {
  teamId: string
  existingDocumentUrl?: string | null
  onSuccess?: () => void
}

export function DocumentUploadTab({ teamId, existingDocumentUrl, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: (url: string) => updateTeam({ data: { id:teamId, body:{ documentUrl: url } } }),
    onSuccess: () => {
      toast.success('Dokumen berhasil diunggah')
      onSuccess?.()
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal menyimpan dokumen'),
  })

  const handleSubmit = async () => {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadToImageKit(file)
      mutation.mutate(url)
    } catch {
      toast.error('Gagal mengunggah file')
    } finally {
      setUploading(false)
    }
  }

  const isPending = uploading || mutation.isPending

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-primary mb-1">Dokumen Kelengkapan Tim</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Upload satu file dokumen yang berisi semua bukti kelengkapan lomba (kartu pelajar, surat keterangan aktif, pas foto, dll).
          Gabungkan dalam satu file PDF atau gambar.
        </p>
      </div>

      {existingDocumentUrl && (
        <div className="flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 px-4 py-3">
          <CheckCircle2 size={14} className="text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-green-700">Dokumen sudah diunggah</p>
            <a href={existingDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-green-600 underline truncate block">
              Lihat dokumen
            </a>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      {file ? (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2.5">
          <FileText size={14} className="text-primary shrink-0" />
          <span className="text-xs text-foreground flex-1 truncate">{file.name}</span>
          <span className="text-[10px] text-muted-foreground shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
          <button
            type="button"
            onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = '' }}
            className="text-muted-foreground hover:text-destructive"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'w-full flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border',
            'py-8 text-muted-foreground hover:border-primary/40 hover:bg-muted/50 transition-colors'
          )}
        >
          <Upload size={20} className="text-muted-foreground/60" />
          <span className="text-xs font-medium">Klik untuk pilih file</span>
          <span className="text-[10px]">PDF, JPG, PNG — maks 10MB</span>
        </button>
      )}

      <Button
        type="button"
        className="w-full rounded-xl"
        disabled={isPending || !file}
        onClick={handleSubmit}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 size={13} className="animate-spin" />
            Mengunggah...
          </span>
        ) : (
          'Upload Dokumen'
        )}
      </Button>
    </div>
  )
}
