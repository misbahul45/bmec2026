import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import ImageDialog from '~/components/ui/ImageDialog'
import { approveRegistration, rejectRegistration } from '~/server/registration'

interface Props {
  teamId: string
  adminId: string
  teamName: string
  paymentProof?: string | null
  status: string
  queryKey: unknown[]
}

export function RegistrationActions({ teamId, adminId, teamName, paymentProof, status, queryKey }: Props) {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)

  const approveMutation = useMutation({
    mutationFn: () => approveRegistration({ data: { teamId, adminId, action: 'APPROVED' } }),
    onSuccess: () => {
      toast.success(`Registrasi ${teamName} disetujui`)
      qc.invalidateQueries({ queryKey })
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal menyetujui'),
  })

  const rejectMutation = useMutation({
    mutationFn: () => rejectRegistration({ data: { teamId, adminId, action: 'REJECTED' } }),
    onSuccess: () => {
      toast.success(`Registrasi ${teamName} ditolak`)
      qc.invalidateQueries({ queryKey })
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal menolak'),
  })

  const isPending = approveMutation.isPending || rejectMutation.isPending

  return (
    <div className="flex flex-col items-center gap-1.5">
      {paymentProof ? (
        <>
          <button
            onClick={() => setDialogOpen(true)}
            className="text-primary underline text-sm hover:opacity-80"
          >
            Lihat Bukti
          </button>

          {status === 'PENDING' && (
            <div className="flex gap-1">
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-green-600 hover:text-green-700"
                disabled={isPending}
                onClick={() => approveMutation.mutate()}
                title="Approve"
              >
                <CheckCircle className="size-3.5" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                disabled={isPending}
                onClick={() => rejectMutation.mutate()}
                title="Reject"
              >
                <XCircle className="size-3.5" />
              </Button>
            </div>
          )}

          {status === 'APPROVED' && (
            <Badge className="text-[10px] bg-green-500">Disetujui</Badge>
          )}

          {status === 'REJECTED' && (
            <Badge variant="destructive" className="text-[10px]">Ditolak</Badge>
          )}

          <ImageDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            url={paymentProof}
            title={`Bukti Pembayaran — ${teamName}`}
          />
        </>
      ) : (
        <Badge variant="outline" className="text-[10px]">Belum Upload</Badge>
      )}
    </div>
  )
}
