import { useCallback } from 'react'
import { Download, X, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { toast } from 'sonner'
import { downloadInvoiceHtml } from '~/lib/invoice/generateInvoicePdf'
import {
  formatRupiah,
  formatDate,
  generateInvoiceNumber,
  generateParticipantNumber,
} from '~/lib/invoice/invoice-helpers'
import { WA_GROUP_LINKS } from '~/contants'

type CompetitionType = 'OLIMPIADE' | 'LKTI' | 'INFOGRAFIS'

interface Member {
  name: string
  role: string
}

interface InvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: string
  teamName: string
  competitionType: CompetitionType
  members: Member[]
  schoolOrUniversity: string
  price: number
  batchName?: string
  approvedAt?: Date | string
}

const COMPETITION_LABELS: Record<CompetitionType, string> = {
  OLIMPIADE: 'Olimpiade',
  LKTI: 'LKTI',
  INFOGRAFIS: 'Infografis',
}

const INSTITUTION_LABEL: Record<CompetitionType, string> = {
  OLIMPIADE: 'Asal Sekolah',
  LKTI: 'Perguruan Tinggi',
  INFOGRAFIS: 'Asal Sekolah',
}

export function InvoiceDialog({
  open,
  onOpenChange,
  teamId,
  teamName,
  competitionType,
  members,
  schoolOrUniversity,
  price,
  batchName,
  approvedAt,
}: InvoiceDialogProps) {
  const handleDownload = useCallback(() => {
    try {
      downloadInvoiceHtml({
        teamId,
        teamName,
        competitionType,
        members,
        schoolOrUniversity,
        price,
        batchName,
        approvedAt,
      })
      toast.success('Invoice berhasil diunduh')
    } catch {
      toast.error('Gagal mengunduh invoice')
    }
  }, [teamId, teamName, competitionType, members, schoolOrUniversity, price, batchName, approvedAt])

  const invoiceNo = generateInvoiceNumber(competitionType, teamId)
  const participantNo = generateParticipantNumber(teamId)
  const dateStr = formatDate(approvedAt ?? new Date())
  const label = COMPETITION_LABELS[competitionType]
  const institutionLabel = INSTITUTION_LABEL[competitionType]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full rounded-2xl p-0 gap-0 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="BMEC" className="w-8 h-8 object-contain" />
            <div>
              <DialogHeader>
                <DialogTitle className="text-sm font-bold leading-none">BMEC 2026</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground mt-0.5">Invoice {label}</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-green-500/10 text-green-600 border border-green-200 dark:border-green-800 text-[11px] font-semibold px-2.5 py-1 rounded-full">
            <CheckCircle2 size={11} />
            LUNAS
          </span>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1 min-h-0">
          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            <InfoCell label="No. Invoice" value={invoiceNo} />
            <InfoCell label="No. Peserta" value={participantNo} />
            <InfoCell label="Tanggal" value={dateStr} />
            <InfoCell label="Nama Tim" value={teamName} />
            <div className="col-span-2">
              <InfoCell label={institutionLabel} value={schoolOrUniversity} />
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Anggota Tim
              </span>
              <span className="text-[11px] text-muted-foreground">{members.length} orang</span>
            </div>
            <div className="divide-y">
              {members.map((m, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm font-medium">{m.name}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md capitalize">
                    {m.role.toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-950/20 px-5 py-3.5">
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5">Total Pembayaran</p>
              <p className="text-xs text-muted-foreground">HTM {label} BMEC 2026</p>
            </div>
            <span className="text-xl font-bold text-green-600 tabular-nums">{formatRupiah(price)}</span>
          </div>

          <div className="rounded-xl border bg-muted/20 px-4 py-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Selamat! Tim Anda sudah terdaftar menjadi peserta{' '}
              <span className="font-semibold text-foreground">{label} BMEC 2026</span>.
              Bergabunglah ke grup koordinasi peserta melalui{' '}
              <a
                href={WA_GROUP_LINKS[competitionType]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                link WhatsApp ini
              </a>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t bg-muted/20 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 text-xs"
            onClick={() => onOpenChange(false)}
          >
            <X size={13} />
            Tutup
          </Button>
          <Button
            size="sm"
            className="rounded-xl gap-1.5 text-xs ml-auto"
            onClick={handleDownload}
          >
            <Download size={13} />
            Download Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-semibold truncate">{value}</p>
    </div>
  )
}
