import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import Pagination from '~/components/ui/Pagination'
import CompetitionBadge from '~/components/ui/CompetitionBadge'
import { SubmissionStatusBadge } from './SubmissionStatusBadge'
import { SubmissionActions } from './SubmissionActions'

interface Submission {
  id: string
  title: string | null
  fileUrl: string | null
  score: number | null
  feedback: string | null
  status: string
  createdAt: string | Date
  team: { id: string; name: string; schoolName: string; competitionType: any }
  stage: { id: string; name: string; competition: { name: string } }
  admin: { name: string } | null
}

interface Props {
  submissions: Submission[]
  meta: MetaData
  adminId: string
  queryKey: unknown[]
  onPageChange: (page: number) => void
}

export function TableSubmissions({ submissions, meta, adminId, queryKey, onPageChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead>Tim</TableHead>
              <TableHead>Kompetisi</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>File</TableHead>
              <TableHead className="text-center">Skor</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-10 text-muted-foreground">
                  Tidak ada data submission
                </TableCell>
              </TableRow>
            )}

            {submissions.map((sub, i) => (
              <TableRow key={sub.id}>
                <TableCell className="text-center">
                  {(meta.page - 1) * meta.limit + i + 1}
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{sub.team.name}</span>
                    <span className="text-xs text-muted-foreground">{sub.team.schoolName}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <CompetitionBadge type={sub.team.competitionType} />
                </TableCell>

                <TableCell>
                  <span className="text-xs">{sub.stage.name}</span>
                </TableCell>

                <TableCell>
                  <span className="text-xs">{sub.title ?? '—'}</span>
                </TableCell>

                <TableCell>
                  {sub.fileUrl ? (
                    <a
                      href={sub.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline text-xs"
                    >
                      Lihat File
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <span className="text-xs font-medium">{sub.score ?? '—'}</span>
                </TableCell>

                <TableCell className="text-center">
                  <SubmissionStatusBadge status={sub.status as any} />
                </TableCell>

                <TableCell>
                  <span className="text-xs text-muted-foreground">{sub.admin?.name ?? '—'}</span>
                </TableCell>

                <TableCell>
                  <span className="text-xs">
                    {new Date(sub.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <SubmissionActions
                    submissionId={sub.id}
                    adminId={adminId}
                    status={sub.status}
                    score={sub.score}
                    feedback={sub.feedback}
                    queryKey={queryKey}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination page={meta.page} totalPages={meta.totalPages} setPage={onPageChange} />
    </div>
  )
}
