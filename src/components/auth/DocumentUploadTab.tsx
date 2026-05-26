import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Upload, X, FileText, CheckCircle2, Loader2, Link as LinkIcon } from 'lucide-react'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { uploadToImageKit } from '~/lib/api/uploads/service'
import { cn } from '~/lib/utils'
import { updateTeam } from '~/server/team'
import { Input } from '../ui/input'

interface Props {
  teamId: string
  existingDocumentUrl?: string | null
  onSuccess?: () => void
}

const schema = z.object({
  file: z
    .instanceof(File, { message: 'Dokumen wajib diunggah' })
    .refine((f) => f.size <= 10 * 1024 * 1024, 'Ukuran file maksimal 10MB')
    .refine(
      (f) => ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(f.type),
      'Format file harus PDF, JPG, atau PNG',
    ),
  linkTwibbon: z
    .string()
    .min(1, 'Link Drive wajib diisi')
    .url('Link Drive harus berupa URL yang valid')
    .refine((v) => v.includes('drive.google.com'), 'Link harus berasal dari Google Drive'),
})

type FormErrors = Partial<Record<keyof z.infer<typeof schema>, string>>

export function DocumentUploadTab({ teamId, existingDocumentUrl, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [linkTwibbon, setLinkTwibbon] = useState('')
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const inputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: ({ url, twibbon }: { url: string; twibbon: string }) =>
      updateTeam({ data: { id: teamId, body: { documentUrl: url, twibbonUrl: twibbon } } }),
    onSuccess: () => {
      toast.success('Dokumen dan link berhasil disimpan')
      onSuccess?.()
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal menyimpan data'),
  })

  const validate = (): boolean => {
    const result = schema.safeParse({ file, linkTwibbon })
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setUploading(true)
    try {
      const url = await uploadToImageKit(file!)
      mutation.mutate({ url, twibbon: linkTwibbon })
    } catch {
      toast.error('Gagal mengunggah file')
    } finally {
      setUploading(false)
    }
  }

  const isPending = uploading || mutation.isPending

  const uploadAreaClass = cn(
    'w-full flex flex-col items-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors',
    errors.file
      ? 'border-destructive/60 bg-destructive/5 hover:border-destructive/80'
      : 'border-border hover:border-primary/40 hover:bg-muted/50',
  )

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-primary mb-1">Dokumen Kelengkapan Tim</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Upload satu file berisi seluruh persyaratan lomba dalam format PDF atau gambar. Pastikan
          semua dokumen jelas terbaca dan tersusun rapi dalam satu file.
        </p>
      </div>

      {existingDocumentUrl && (
        <div className="flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 px-4 py-3">
          <CheckCircle2 size={14} className="text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-green-700">Dokumen sudah diunggah</p>
            
             <a href={existingDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-green-600 underline truncate block"
            >
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
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null)
          setErrors((prev: FormErrors) => ({ ...prev, file: undefined }))
        }}
      />

      <div className="space-y-1">
        {file ? (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2.5">
            <FileText size={14} className="text-primary shrink-0" />
            <span className="text-xs text-foreground flex-1 truncate">{file.name}</span>
            <span className="text-[10px] text-muted-foreground shrink-0">
              {(file.size / 1024).toFixed(0)} KB
            </span>
            <button
              type="button"
              onClick={() => {
                setFile(null)
                if (inputRef.current) inputRef.current.value = ''
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()} className={uploadAreaClass}>
            <Upload size={20} className="text-muted-foreground/60" />
            <span className="text-xs font-medium">Klik untuk memilih file</span>
            <span className="text-[10px]">PDF, JPG, PNG — maksimal 10MB</span>
          </button>
        )}
        {errors.file && <p className="text-[11px] text-destructive pl-1">{errors.file}</p>}
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <LinkIcon size={14} className="text-primary" />
          <p className="text-xs font-semibold text-primary">Link Drive Twibbon & Instastory</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Masukkan link Google Drive yang berisi twibbon tim dan instastory. Pastikan akses file
          sudah diatur ke publik (Anyone with the link can view) agar dapat diverifikasi oleh
          panitia.
        </p>
        <Input
          placeholder="https://drive.google.com/..."
          value={linkTwibbon}
          onChange={(e) => {
            setLinkTwibbon(e.target.value)
            setErrors((prev: FormErrors) => ({ ...prev, linkTwibbon: undefined }))
          }}
          className={cn(errors.linkTwibbon && 'border-destructive focus-visible:ring-destructive')}
        />
        {errors.linkTwibbon && (
          <p className="text-[11px] text-destructive">{errors.linkTwibbon}</p>
        )}
      </div>

      <Button type="button" className="w-full rounded-xl" disabled={isPending} onClick={handleSubmit}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 size={13} className="animate-spin" />
            Mengunggah...
          </span>
        ) : (
          'Upload Dokumen & Link'
        )}
      </Button>
    </div>
  )
}