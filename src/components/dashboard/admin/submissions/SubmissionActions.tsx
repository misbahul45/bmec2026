import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { approveSubmission, rejectSubmission } from '~/server/submission'
import { FormEditScore } from './FormEditScore'
import { CheckCircle, XCircle, ClipboardEdit } from 'lucide-react'

interface Props {
  submissionId: string
  adminId: string
  status: string
  score: number | null
  feedback: string | null
  queryKey: unknown[]
}

export function SubmissionActions({ submissionId, adminId, status, score, feedback, queryKey }: Props) {
  const qc = useQueryClient()
  const [scoreOpen, setScoreOpen] = useState(false)

  const approveMutation = useMutation({
    mutationFn: () => approveSubmission({ data: { id: submissionId, adminId } }),
    onSuccess: () => {
      toast.success('Submission approved')
      qc.invalidateQueries({ queryKey })
    },
    onError: (e: any) => toast.error(e?.message ?? 'Error'),
  })

  const rejectMutation = useMutation({
    mutationFn: () => rejectSubmission({ data: { id: submissionId, adminId } }),
    onSuccess: () => {
      toast.success('Submission rejected')
      qc.invalidateQueries({ queryKey })
    },
    onError: (e: any) => toast.error(e?.message ?? 'Error'),
  })

  if (status === 'PENDING') {
    return (
      <div className="flex gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          className="text-green-600 hover:text-green-700"
          disabled={approveMutation.isPending}
          onClick={() => approveMutation.mutate()}
          title="Approve"
        >
          <CheckCircle className="size-3.5" />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          disabled={rejectMutation.isPending}
          onClick={() => rejectMutation.mutate()}
          title="Reject"
        >
          <XCircle className="size-3.5" />
        </Button>
      </div>
    )
  }

  if (status === 'APPROVED') {
    if (score !== null && score !== undefined) {
      return (
        <Badge variant="secondary" className="text-[10px]">
          Sudah Dinilai
        </Badge>
      )
    }

    return (
      <>
        <Button
          size="icon-sm"
          variant="ghost"
          className="text-primary hover:text-primary"
          onClick={() => setScoreOpen(true)}
          title="Input Nilai"
        >
          <ClipboardEdit className="size-3.5" />
        </Button>

        <Dialog open={scoreOpen} onOpenChange={setScoreOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm">Input Nilai</DialogTitle>
            </DialogHeader>
            <FormEditScore
              submissionId={submissionId}
              adminId={adminId}
              defaultScore={score}
              defaultFeedback={feedback}
              queryKey={queryKey}
              onSuccess={() => setScoreOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return <span className="text-xs text-muted-foreground">—</span>
}
