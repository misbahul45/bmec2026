import { CheckCircle2, Clock, BookOpen, ReceiptText, Download } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { PaymentStatus } from '@prisma/client'
import { WA_GROUP_LINKS } from '~/contants'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
    </svg>
  )
}

type Props = {
  status?: PaymentStatus | null
  batchName?: string
  competitionType: 'OLIMPIADE' | 'LKTI' | 'INFOGRAFIS'
  moduleUrl?: string | null
  invoiceUrl?: string | null
}

const invoiceTitle = {
  OLIMPIADE: 'Invoice Olimpiade',
  LKTI: 'Invoice LKTI',
  INFOGRAFIS: 'Invoice Infografis',
}

const competitionLabel = {
  OLIMPIADE: 'Olimpiade',
  LKTI: 'LKTI',
  INFOGRAFIS: 'Infografis',
}

export function RegistrationStatusCard({
  status,
  batchName,
  competitionType,
  moduleUrl,
  invoiceUrl,
}: Props) {
  const isApproved = status === 'APPROVED'
  const isPending = status === 'PENDING'

  return (
    <div
      className={`rounded-2xl border bg-background shadow-sm p-5 space-y-4 ${
        isApproved ? 'border-green-200' : 'border-border'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isApproved ? 'bg-green-100' : 'bg-yellow-100'
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="text-green-600" size={18} />
            ) : (
              <Clock className="text-yellow-600" size={18} />
            )}
          </div>

          <div>
            <p className="font-semibold text-sm">
              {isApproved
                ? 'Pembayaran Terverifikasi'
                : 'Menunggu Verifikasi Admin'}
            </p>

            <p className="text-xs text-muted-foreground">
              {invoiceTitle[competitionType]}
            </p>

            {batchName && (
              <p className="text-xs text-muted-foreground">{batchName}</p>
            )}
          </div>
        </div>

        {isApproved ? (
          <Badge className="bg-green-500 text-white gap-1 text-[10px]">
            <CheckCircle2 size={10} />
            Aktif
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-yellow-700 border-yellow-300 text-[10px]"
          >
            <Clock size={10} className="mr-1" />
            Pending
          </Badge>
        )}
      </div>

      {/* Success Message */}
      {isApproved && (
        <div className="rounded-xl border bg-muted/40 p-4 text-sm space-y-2">
          <div className="font-semibold flex items-center gap-2">
            <ReceiptText size={15} />
            BMEC 2026
          </div>

          <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
            Selamat! Tim Anda sudah terdaftar menjadi peserta{' '}
            <span className="font-medium">
              {competitionLabel[competitionType]} BMEC 2026
            </span>
            .
          </p>

          {competitionType === 'OLIMPIADE' && (
            <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
              Untuk melakukan ujian silakan gunakan email dan password saat
              mendaftar.
            </p>
          )}

          <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
            Setiap anggota tim dipersilakan bergabung ke grup koordinasi peserta.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {isApproved && invoiceUrl && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl gap-1.5 text-xs"
            asChild
          >
            <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
              <Download size={13} />
              Download Invoice
            </a>
          </Button>
        )}

        {isApproved && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl gap-1.5 text-xs text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/5"
            asChild
          >
            <a
              href={WA_GROUP_LINKS[competitionType]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              Grup WhatsApp
            </a>
          </Button>
        )}

        {isApproved &&
          competitionType === 'OLIMPIADE' &&
          moduleUrl && (
            <Button size="sm" className="rounded-xl gap-1.5 text-xs" asChild>
              <a href={moduleUrl} target="_blank" rel="noopener noreferrer">
                <BookOpen size={13} />
                Unduh Modul
              </a>
            </Button>
          )}
      </div>
    </div>
  )
}