import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { approveAbstract, rejectAbstract } from '~/server/abstract'

interface Props {
  abstractId: string
  abstractStatus: string
  fileUrl: string
  adminId: string
  teamName: string
  queryKey: unknown[]
}

export function AbstractActions({ abstractId, abstractStatus, fileUrl, adminId, teamName, queryKey }: Props) {
  const qc = useQueryClient()

  const approveMutation = useMutation({
    mutationFn: () => approveAbstract({ data: { id: abstractId, adminId } }),
    onSuccess: () => {
      toast.success(`Abstract ${teamName} disetujui`)
      qc.invalidateQueries({ queryKey })
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal menyetujui'),
  })

  const rejectMutation = useMutation({
    mutationFn: () => rejectAbstract({ data: { id: abstractId, adminId } }),
    onSuccess: () => {
      toast.success(`Abstract ${teamName} ditolak`)
      qc.invalidateQueries({ queryKey })
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal menolak'),
  })

  const isPending = approveMutation.isPending || rejectMutation.isPending

  return (
    <div className="flex flex-col items-center gap-1.5">
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">
        Lihat Abstract
      </a>

      {abstractStatus === 'PENDING' && (
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

      {abstractStatus === 'APPROVED' && (
        <Badge className="text-[10px] bg-green-500">Disetujui</Badge>
      )}

      {abstractStatus === 'REJECTED' && (
        <Badge variant="destructive" className="text-[10px]">Ditolak</Badge>
      )}
    </div>
  )
}
