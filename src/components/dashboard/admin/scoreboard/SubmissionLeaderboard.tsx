import { useState } from 'react'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { submissionLeaderboardQueryOptions } from '~/lib/api/submissions/submission.query-options'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { exportToExcel } from '~/lib/utils/export-excel'
import { FormEditScore } from '../submissions/FormEditScore'
import { SubmissionStatusBadge } from '../submissions/SubmissionStatusBadge'
import { Download, Pencil } from 'lucide-react'

interface Props {
  competitionType: 'LKTI' | 'INFOGRAFIS'
  adminId: string
}

export function SubmissionLeaderboard({ competitionType, adminId }: Props) {
  const { data: res } = useSuspenseQuery(submissionLeaderboardQueryOptions(competitionType))
  const submissions: any[] = res?.data ?? []
  const [editTarget, setEditTarget] = useState<any | null>(null)

  const handleExport = () => {
    exportToExcel(
      submissions.map((s, i) => ({
        Rank: i + 1,
        'Nama Tim': s.team.name,
        Sekolah: s.team.schoolName,
        Stage: s.stage.name,
        Judul: s.title ?? '',
        Nilai: s.score ?? '',
        Feedback: s.feedback ?? '',
        Status: s.status,
        Reviewer: s.admin?.name ?? '',
      })),
      `leaderboard-${competitionType.toLowerCase()}`,
      'Leaderboard'
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{submissions.length} submission</p>
        <Button size="sm" variant="outline" className="gap-1.5 rounded" onClick={handleExport}>
          <Download className="size-3" />
          Export Excel
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12">Rank</TableHead>
              <TableHead>Tim</TableHead>
              <TableHead>Sekolah</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>File</TableHead>
              <TableHead className="text-center">Nilai</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Belum ada submission
                </TableCell>
              </TableRow>
            )}
            {submissions.map((s, i) => (
              <TableRow key={s.id}>
                <TableCell className="text-center font-bold">
                  <span className={i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'}>
                    #{i + 1}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{s.team.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{s.team.schoolName}</TableCell>
                <TableCell><Badge variant="outline">{s.stage.name}</Badge></TableCell>
                <TableCell className="text-xs max-w-[140px] truncate">{s.title ?? '—'}</TableCell>
                <TableCell>
                  {s.fileUrl ? (
                    <a href={s.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">
                      Lihat
                    </a>
                  ) : <span className="text-xs text-muted-foreground">—</span>}
                </TableCell>
                <TableCell className="text-center font-bold text-primary">
                  {s.score ?? <span className="text-muted-foreground text-xs">—</span>}
                </TableCell>
                <TableCell className="text-center">
                  <SubmissionStatusBadge status={s.status} />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setEditTarget(s)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">Edit Nilai — {editTarget?.team?.name}</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <FormEditScore
              submissionId={editTarget.id}
              adminId={adminId}
              defaultScore={editTarget.score}
              defaultFeedback={editTarget.feedback}
              queryKey={['submission-leaderboard', competitionType]}
              onSuccess={() => setEditTarget(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
