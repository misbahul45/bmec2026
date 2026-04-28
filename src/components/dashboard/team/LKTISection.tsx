import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Lock,
  FileText,
  CheckCircle2,
  Loader2,
  Upload,
  CreditCard,
} from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { SubmissionStatus } from "@prisma/client"
import {
  uploadPdfToImageKit,
  uploadToImageKit,
} from "~/lib/api/uploads/service"
import { updateSubmissionFiles } from "~/server/submission"
import { toast } from "sonner"
import { FileUploadField } from "~/components/ui/FileUploadField"
import { formatMoney } from "~/lib/utils/format-money"
import UploadImage from "~/components/ui/UploadImage"
import { registrationCompetition } from "~/server/competition"

const MAX = 10 * 1024 * 1024

type Props = {
  abstractStatus?: SubmissionStatus | null
  teamId: string
  stageId?: string | null
  batchName?: string
  batchPrice?: number
  competitionId?: string
  batchId?: string
  existingSubmission?: {
    fileUrl?: string | null
  } | null
  queryKey: unknown[]
}

export function LKTISection({
  abstractStatus,
  teamId,
  stageId,
  batchName,
  batchPrice,
  competitionId,
  batchId,
  existingSubmission,
  queryKey,
}: Props) {
  if (!abstractStatus) {
    return (
      <div className="animated-border flex flex-col items-center gap-3 rounded-2xl p-6 text-center">
        <Lock size={32} className="text-muted-foreground/50" />
        <p className="text-base font-semibold">
          Abstrak Belum Dikirim
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Kamu belum mengirimkan abstrak. Silakan kembali ke halaman pendaftaran untuk mengirim abstrak.
        </p>
      </div>
    )
  }

  if (abstractStatus === "PENDING") {
    return (
      <div className="animated-border flex flex-col items-center gap-3 rounded-2xl p-6 text-center">
        <FileText size={32} className="text-yellow-500/70" />
        <p className="text-base font-semibold">
          Abstrak Sedang Direview
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Abstrak kamu sedang dalam proses review oleh panitia. Upload full paper akan tersedia setelah abstrak disetujui.
        </p>
        <Badge variant="outline" className="mt-1">
          Menunggu Review
        </Badge>
      </div>
    )
  }

  if (abstractStatus === "REJECTED") {
    return (
      <div className="animated-border flex flex-col items-center gap-3 rounded-2xl p-6 text-center">
        <FileText size={32} className="text-destructive/60" />
        <p className="text-base font-semibold">
          Abstrak Ditolak
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Abstrak kamu tidak lolos seleksi. Hubungi panitia untuk informasi lebih lanjut.
        </p>
        <Badge variant="destructive" className="mt-1">
          Ditolak
        </Badge>
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
      <div className="flex flex-col items-center gap-3 rounded-2xl border bg-background p-6 text-center shadow">
        <CheckCircle2 size={32} className="text-green-500" />
        <p className="text-base font-semibold">
          Full Paper Sudah Dikirim
        </p>
        <p className="text-xs text-muted-foreground">
          File sudah terkirim dan tidak dapat diubah untuk stage ini.
        </p>

        <a
          href={existingSubmission.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary underline"
        >
          Lihat full paper
        </a>

        <Badge className="mt-1 bg-green-500">
          Terkirim
        </Badge>
      </div>
    )
  }

  return (
    <FullPaperUpload
      teamId={teamId}
      stageId={stageId}
      batchName={batchName}
      batchPrice={batchPrice}
      competitionId={competitionId}
      batchId={batchId}
      queryKey={queryKey}
    />
  )
}

function FullPaperUpload({
  teamId,
  stageId,
  batchName,
  batchPrice,
  competitionId,
  batchId,
  queryKey,
}: Omit<Props, "abstractStatus" | "existingSubmission"> & {
  stageId: string
}) {
  const [paperFile, setPaperFile] = useState<File | undefined>()
  const [paymentFile, setPaymentFile] = useState<File | null>(null)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      if (!paperFile) {
        throw new Error("Upload full paper terlebih dahulu")
      }

      if (!paymentFile) {
        throw new Error("Upload bukti pembayaran terlebih dahulu")
      }

      if (paperFile.size > MAX) {
        throw new Error("Ukuran full paper maksimal 10MB")
      }

      if (paymentFile.size > MAX) {
        throw new Error("Ukuran bukti pembayaran maksimal 10MB")
      }

      const [fileUrl, paymentProof] = await Promise.all([
        uploadPdfToImageKit(paperFile),
        uploadToImageKit(paymentFile),
      ])

      if (competitionId && batchId) {
        await registrationCompetition({
          data: {
            teamId,
            competitionId,
            batchId,
            paymentProof,
          },
        })
      }

      console.log('data',
          {
            teamId,
            competitionId,
            batchId,
            paymentProof,
          },
         )

      await updateSubmissionFiles({
        data: {
          teamId,
          stageId,
          fileUrl,
        },
      })
    },

    onMutate: () => {
      toast.loading("Mengunggah...", {
        id: "upload-paper",
      })
    },

    onSuccess: () => {
      toast.success("Full paper berhasil dikirim", {
        id: "upload-paper",
      })

      setPaperFile(undefined)
      setPaymentFile(null)

      queryClient.invalidateQueries({
        queryKey: queryKey as any,
      })
    },

    onError: (e: any) => {
      toast.error(
        e?.message ?? "Gagal mengirim",
        {
          id: "upload-paper",
        }
      )
    },
  })

  const isPending = mutation.isPending

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle2
          size={16}
          className="text-green-500"
        />
        <span className="text-sm font-medium text-green-600">
          Abstrak Disetujui — Lanjutkan ke tahap berikutnya
        </span>
      </div>

      {batchName &&
        batchPrice !== undefined && (
          <div className="space-y-2 rounded-xl border bg-muted/40 p-4">
            <div className="flex items-center gap-2">
              <CreditCard
                size={14}
                className="text-primary"
              />
              <p className="text-xs font-semibold text-primary">
                Informasi Pembayaran
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  LKTI — {batchName}
                </p>

                <p className="text-xs text-muted-foreground">
                  Transfer ke: BCA • 091891981 (Nayla)
                </p>
              </div>

              <p className="text-lg font-bold">
                {formatMoney(batchPrice)}
              </p>
            </div>
          </div>
        )}

      <div className="space-y-4 rounded-2xl border bg-background p-5 shadow">
        <div className="space-y-2">
          <p className="text-xs font-semibold">
            Full Paper{" "}
            <span className="text-destructive">
              *
            </span>
          </p>

          <FileUploadField
            value={paperFile}
            onChange={setPaperFile}
            label="Upload full paper (.pdf)"
            accept=".pdf"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold">
            Bukti Pembayaran{" "}
            <span className="text-destructive">
              *
            </span>
          </p>

          <UploadImage
            value={paymentFile}
            onChange={setPaymentFile}
            disabled={isPending}
          />
        </div>

        <Button
          className="w-full rounded-xl"
          disabled={
            isPending ||
            !paperFile ||
            !paymentFile
          }
          onClick={() => mutation.mutate()}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2
                size={13}
                className="animate-spin"
              />
              Mengunggah...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Upload size={13} />
              Kirim Full Paper & Pembayaran
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}