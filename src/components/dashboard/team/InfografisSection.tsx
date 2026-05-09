import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ImageIcon, CheckCircle2, Loader2, Upload } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { PaymentStatus } from '@prisma/client'
import { uploadToImageKit, uploadPdfToImageKit } from '~/lib/api/uploads/service'
import { upsertSubmission } from '~/server/submission'
import { toast } from 'sonner'
import { FileUploadField } from '~/components/ui/FileUploadField'

type Props = {
  registrationStatus?: PaymentStatus | null
  teamId: string
  stageId?: string | null
  existingSubmission?: { fileUrl?: string | null } | null
  queryKey: unknown[]
}

export function InfografisSection({ registrationStatus, teamId, stageId, existingSubmission, queryKey }: Props) {
  const notApproved = registrationStatus !== 'APPROVED'

  if (!stageId) {
    return (
      <div className="animated-border rounded-2xl p-6 text-center text-sm text-muted-foreground">
        Stage belum ditetapkan oleh panitia.
      </div>
    )
  }

  if (existingSubmission?.fileUrl) {
    return (
      <div className="rounded-2xl bg-background shadow border p-6 flex flex-col items-center gap-3 text-center">
        <CheckCircle2 size={32} className="text-green-500" />
        <p className="font-semibold text-base">Infografis Sudah Diunggah</p>
        <p className="text-xs text-muted-foreground">File sudah terkirim dan tidak dapat diubah untuk stage ini.</p>
        <a href={existingSubmission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
          Lihat file infografis
        </a>
      </div>
    )
  }

  return <InfografisUpload teamId={teamId} stageId={stageId} queryKey={queryKey} showPendingWarning={notApproved} />
}

function InfografisUpload({
  teamId,
  stageId,
  queryKey,
  showPendingWarning,
}: {
  teamId: string
  stageId: string
  queryKey: unknown[]
  showPendingWarning: boolean
}) {
  const [file, setFile] = useState<File | undefined>()
  const [orsinalitasFile, setOrsinalitasFile] = useState<File | undefined>()
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: { fileUrl: string; orsinalitasUrl?: string }) =>
      upsertSubmission({ data: { teamId, stageId, fileUrl: data.fileUrl, title: 'Infografis', orsinalitasUrl: data.orsinalitasUrl } }),
    onSuccess: () => {
      toast.success('Infografis berhasil diunggah')
      setFile(undefined)
      setOrsinalitasFile(undefined)
      queryClient.invalidateQueries({ queryKey: queryKey as any })
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal mengunggah'),
  })

  const handleSubmit = async () => {
    if (!file) return toast.error('Pilih file infografis terlebih dahulu')
    if (file.size > 10 * 1024 * 1024) return toast.error('Ukuran file maksimal 10MB')
    if (orsinalitasFile && orsinalitasFile.size > 10 * 1024 * 1024) return toast.error('Ukuran surat orisinalitas maksimal 10MB')
    setUploading(true)
    try {
      const [fileUrl, orsinalitasUrl] = await Promise.all([
        uploadToImageKit(file),
        orsinalitasFile ? uploadPdfToImageKit(orsinalitasFile) : Promise.resolve(undefined),
      ])
      mutation.mutate({ fileUrl, orsinalitasUrl: orsinalitasUrl ?? undefined })
    } catch {
      toast.error('Gagal mengunggah file')
    } finally {
      setUploading(false)
    }
  }

  const isSubmitting = uploading || mutation.isPending

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2 text-base">
        <ImageIcon size={16} className="text-primary" />
        Upload Infografis
      </h3>

      {showPendingWarning && (
        <div className="flex items-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800/40 px-4 py-2.5">
          <Badge variant="outline" className="text-yellow-700 border-yellow-300 text-[10px] shrink-0">Pending</Badge>
          <p className="text-xs text-yellow-700 dark:text-yellow-400">Submission akan diproses setelah pembayaran diverifikasi.</p>
        </div>
      )}

      <div className="rounded-2xl bg-background shadow border p-5 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold">File Infografis <span className="text-destructive">*</span></p>
          <p className="text-[11px] text-muted-foreground">Format PNG, JPG, atau PDF. Maksimal 10MB.</p>
          <FileUploadField value={file} onChange={setFile} label="Pilih file infografis (PNG / JPG / PDF)" accept="image/*,.pdf" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold">Surat Orisinalitas <span className="text-muted-foreground font-normal">(opsional)</span></p>
          <FileUploadField value={orsinalitasFile} onChange={setOrsinalitasFile} label="Upload surat orisinalitas (.pdf)" accept=".pdf" />
        </div>
        <Button className="w-full rounded-xl" disabled={isSubmitting || !file} onClick={handleSubmit}>
          {isSubmitting
            ? <span className="flex items-center gap-2"><Loader2 size={13} className="animate-spin" />Mengunggah...</span>
            : <span className="flex items-center gap-2"><Upload size={13} />Upload Infografis</span>
          }
        </Button>
      </div>
    </div>
  )
}
