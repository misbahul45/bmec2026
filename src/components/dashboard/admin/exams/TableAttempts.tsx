import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import Pagination from '~/components/ui/Pagination'
import CompetitionBadge from '~/components/ui/CompetitionBadge'

interface Attempt {
  id: string
  totalScore: number
  finished: boolean
  startTime: string | Date
  endTime: string | Date | null
  team: { id: string; name: string; schoolName: string; competitionType: any }
  answers: { isCorrect: boolean }[]
}

interface Props {
  attempts: Attempt[]
  meta: MetaData
  onPageChange: (page: number) => void
}

export function TableAttempts({ attempts, meta, onPageChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Rank</TableHead>
              <TableHead>Tim</TableHead>
              <TableHead>Kompetisi</TableHead>
              <TableHead className="text-center">Benar</TableHead>
              <TableHead className="text-center">Salah</TableHead>
              <TableHead className="text-center">Total Soal</TableHead>
              <TableHead className="text-center">Skor</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Mulai</TableHead>
              <TableHead>Selesai</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {attempts.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                  Belum ada peserta yang mengerjakan
                </TableCell>
              </TableRow>
            )}

            {attempts.map((attempt, i) => {
              const correct = attempt.answers.filter((a) => a.isCorrect).length
              const wrong = attempt.answers.filter((a) => !a.isCorrect).length
              const total = attempt.answers.length
              const rank = (meta.page - 1) * meta.limit + i + 1

              return (
                <TableRow key={attempt.id}>
                  <TableCell className="text-center font-bold">
                    {rank <= 3 ? (
                      <span className={rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-slate-400' : 'text-amber-600'}>
                        #{rank}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">#{rank}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{attempt.team.name}</span>
                      <span className="text-xs text-muted-foreground">{attempt.team.schoolName}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <CompetitionBadge type={attempt.team.competitionType} />
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="text-xs font-medium text-green-600">{correct}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="text-xs font-medium text-destructive">{wrong}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="text-xs text-muted-foreground">{total}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="text-sm font-bold text-primary">{attempt.totalScore}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    {attempt.finished ? (
                      <Badge variant="default">Selesai</Badge>
                    ) : (
                      <Badge variant="outline">Berlangsung</Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="text-xs">
                      {new Date(attempt.startTime).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs">
                      {attempt.endTime
                        ? new Date(attempt.endTime).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
                        : '—'}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Pagination page={meta.page} totalPages={meta.totalPages} setPage={onPageChange} />
    </div>
  )
}
