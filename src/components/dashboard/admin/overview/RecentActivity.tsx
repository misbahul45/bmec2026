import { Badge } from '~/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

const STATUS_VARIANT: Record<string, any> = {
  PENDING: 'outline',
  APPROVED: 'default',
  REJECTED: 'destructive',
}

interface RegItem { id: string; team: { name: string }; competition: { name: string }; status: string; createdAt: string | Date }
interface SubItem { id: string; team: { name: string }; stage: { name: string }; status: string; createdAt: string | Date }
interface AttemptItem { id: string; team: { name: string }; exam: { title: string }; finished: boolean; createdAt: string | Date }

interface Props {
  registrations: RegItem[]
  submissions: SubItem[]
  attempts: AttemptItem[]
}

function fmt(d: string | Date) {
  return new Date(d).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
}

export function RecentActivity({ registrations, submissions, attempts }: Props) {
  const rows = [
    ...registrations.map((r) => ({ id: r.id, team: r.team.name, detail: r.competition.name, type: 'Registrasi', status: r.status, time: r.createdAt })),
    ...submissions.map((s) => ({ id: s.id, team: s.team.name, detail: s.stage.name, type: 'Submission', status: s.status, time: s.createdAt })),
    ...attempts.map((a) => ({ id: a.id, team: a.team.name, detail: a.exam.title, type: 'Exam', status: a.finished ? 'APPROVED' : 'PENDING', time: a.createdAt })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <div className="px-4 py-3 border-b">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Aktivitas Terbaru</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tim</TableHead>
            <TableHead>Detail</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Waktu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada aktivitas</TableCell>
            </TableRow>
          )}
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.team}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{r.detail}</TableCell>
              <TableCell><Badge variant="outline" className="text-[10px]">{r.type}</Badge></TableCell>
              <TableCell className="text-center"><Badge variant={STATUS_VARIANT[r.status] ?? 'outline'}>{r.status}</Badge></TableCell>
              <TableCell className="text-xs text-muted-foreground">{fmt(r.time)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
