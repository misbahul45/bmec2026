import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Lock, FileText, CheckCircle2, Loader2, Upload, CreditCard } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { SubmissionStatus } from '@prisma/client'
import { uploadPdfToImageKit, uploadToImageKit } from '~/lib/api/uploads/service'
import { submitWithPayment } from '~/server/submission'
import { toast } from 'sonner'
import { FileUploadField } from '~/components/ui/FileUploadField'
import { formatMoney } from '~/lib/utils/format-money'
import UploadImage from '~/components/ui/UploadImage'

type Props = {
  abstractStatus?: SubmissionStatus | null
  teamId: string
  stageId?: string | null
  batchName?: string
  batchPrice?: number
  existingSubmission?: { fileUrl: string } | null
  queryKey: unknown[]
}

export function LKTISection({ abstractStatus, teamId, stageId, batchName, batchPrice, existingSubmission, queryKey }: Props) {
  if (!abstractStatus) {
    return (
      <div className="animated-border rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
        <Lock size={32} className="text-muted-foreground/50" />
        <p className="font-semibold text-base">Abstrak Belum Dikirim</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Kamu belum mengirimkan abstrak. Silakan kembali ke halaman pendaftaran untuk mengirim abstrak.
        </p>
      </div>
    )
  }

  if (abstractStatus === 'PENDING') {
    return (
      <div className="animated-border rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
        <FileText size={32} className="text-yellow-500/70" />
        <p className="font-semibold text-base">Abstrak Sedang Direview</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Abstrak kamu sedang dalam proses review oleh panitia. Upload full paper akan tersedia setelah abstrak disetujui.
        </p>
        <Badge variant="outline" className="mt-1">Menunggu Review</Badge>
      </div>
    )
  }

  if (abstractStatus === 'REJECTED') {
    return (
      <div className="animated-border rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
        <FileText size={32} className="text-destructive/60" />
        <p className="font-semibold text-base">Abstrak Ditolak</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Abstrak kamu tidak lolos seleksi. Hubungi panitia untuk informasi lebih lanjut.
        </p>
        <Badge variant="destructive" className="mt-1">Ditolak</Badge>
      </div>
    )
  }

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
        <p className="font-semibold text-base">Full Paper Sudah Dikirim</p>
        <p className="text-xs text-muted-foreground">File sudah terkirim dan tidak dapat diubah untuk stage ini.</p>
        <a href={existingSubmission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
          Lihat full paper
        </a>
        <Badge className="mt-1 bg-green-500">Terkirim</Badge>
      </div>
    )
  }

  return (
    <FullPaperUpload
      teamId={teamId}
      stageId={stageId}
      batchName={batchName}
      batchPrice={batchPrice}
      queryKey={queryKey}
    />
  )
}

function FullPaperUpload({
  teamId,
  stageId,
  batchName,
  batchPrice,
  queryKey,
}: Omit<Props, 'abstractStatus' | 'existingSubmission'> & { stageId: string }) {
  const [paperFile, setPaperFile] = useState<File | undefined>()
  const [paymentFile, setPaymentFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: { fileUrl: string; paymentProof: string }) =>
      submitWithPayment({ data: { teamId, stageId, fileUrl: data.fileUrl, paymentProof: data.paymentProof, title: 'Full Paper LKTI' } }),
    onSuccess: () => {
      toast.success('Full paper dan bukti pembayaran berhasil dikirim')
      setPaperFile(undefined)
      setPaymentFile(null)
      queryClient.invalidateQueries({ queryKey: queryKey as any })
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal mengirim'),
  })

  const handleSubmit = async () => {
    if (!paperFile) return toast.error('Upload full paper terlebih dahulu')
    if (!paymentFile) return toast.error('Upload bukti pembayaran terlebih dahulu')
    if (paperFile.size > 10 * 1024 * 1024) return toast.error('Ukuran full paper maksimal 10MB')
    if (paymentFile.size > 10 * 1024 * 1024) return toast.error('Ukuran bukti pembayaran maksimal 10MB')

    setUploading(true)
    try {
      const [fileUrl, paymentProof] = await Promise.all([
        uploadPdfToImageKit(paperFile),
        uploadToImageKit(paymentFile),
      ])
      mutation.mutate({ fileUrl, paymentProof })
    } catch (e: any) {
      toast.error(e?.message ?? 'Gagal mengunggah file')
    } finally {
      setUploading(false)
    }
  }

  const isPending = uploading || mutation.isPending

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-green-500" />
        <span className="text-sm font-medium text-green-600">Abstrak Disetujui — Lanjutkan ke tahap berikutnya</span>
      </div>

      {batchName && batchPrice !== undefined && (
        <div className="rounded-xl border bg-muted/40 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-primary" />
            <p className="text-xs font-semibold text-primary">Informasi Pembayaran</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">LKTI — {batchName}</p>
              <p className="text-xs text-muted-foreground">Transfer ke: BCA • 091891981 (Nayla)</p>
            </div>
            <p className="text-lg font-bold">{formatMoney(batchPrice)}</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-background shadow border p-5 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold">Upload Full Paper (.pdf)</p>
          <FileUploadField value={paperFile} onChange={setPaperFile} label="Pilih file full paper (.pdf)" accept=".pdf" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold">Upload Bukti Pembayaran</p>
          <UploadImage value={paymentFile} onChange={setPaymentFile} disabled={isPending} />
        </div>

        <Button className="w-full rounded-xl" disabled={isPending || !paperFile || !paymentFile} onClick={handleSubmit}>
          {isPending ? (
            <span className="flex items-center gap-2"><Loader2 size={13} className="animate-spin" />Mengunggah...</span>
          ) : (
            <span className="flex items-center gap-2"><Upload size={13} />Kirim Full Paper & Pembayaran</span>
          )}
        </Button>
      </div>
    </div>
  )
}
