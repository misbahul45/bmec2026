import { Badge } from '~/components/ui/badge'
import { SubmissionStatus } from '@prisma/client'

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  if (status === 'APPROVED') return <Badge variant="default">Approved</Badge>
  if (status === 'REJECTED') return <Badge variant="destructive">Rejected</Badge>
  return <Badge variant="outline">Pending</Badge>
}
