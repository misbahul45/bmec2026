import { useSuspenseQuery } from '@tanstack/react-query'
import { examsQueryOptions } from '~/lib/api/exams/exam.query-options'
import { examLeaderboardQueryOptions } from '~/lib/api/exam-attempts/attempt.query-options'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { exportToExcel } from '~/lib/utils/export-excel'
import { Download } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useState } from 'react'

function ExamLeaderboardTable({ examId, examTitle }: { examId: string; examTitle: string }) {
  const { data: res } = useSuspenseQuery(examLeaderboardQueryOptions(examId))
  const attempts: any[] = res?.data ?? []

  const handleExport = () => {
    exportToExcel(
      attempts.map((a, i) => ({
        Rank: i + 1,
        'Nama Tim': a.team.name,
        Sekolah: a.team.schoolName,
        'Total Skor': a.totalScore,
        Benar: a.answers.filter((x: any) => x.isCorrect).length,
        Salah: a.answers.filter((x: any) => !x.isCorrect).length,
        Status: a.finished ? 'Selesai' : 'Berlangsung',
      })),
      `leaderboard-olimpiade-${examTitle}`,
      'Leaderboard'
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{examTitle}</h3>
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
              <TableHead className="text-center">Benar</TableHead>
              <TableHead className="text-center">Salah</TableHead>
              <TableHead className="text-center">Skor</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Belum ada peserta
                </TableCell>
              </TableRow>
            )}
            {attempts.map((a, i) => {
              const correct = a.answers.filter((x: any) => x.isCorrect).length
              const wrong = a.answers.filter((x: any) => !x.isCorrect).length
              return (
                <TableRow key={a.id}>
                  <TableCell className="text-center font-bold">
                    <span className={i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'}>
                      #{i + 1}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{a.team.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.team.schoolName}</TableCell>
                  <TableCell className="text-center text-green-600 font-medium">{correct}</TableCell>
                  <TableCell className="text-center text-destructive font-medium">{wrong}</TableCell>
                  <TableCell className="text-center font-bold text-primary">{a.totalScore}</TableCell>
                  <TableCell className="text-center">
                    {a.finished ? <Badge variant="default">Selesai</Badge> : <Badge variant="outline">Berlangsung</Badge>}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function OlimpiadeLeaderboard() {
  const { data: res } = useSuspenseQuery(examsQueryOptions())
  const exams: any[] = Array.isArray(res) ? res : res?.data ?? []
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id ?? '')

  if (exams.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Belum ada ujian</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">Pilih Ujian:</span>
        <Select value={selectedExamId} onValueChange={setSelectedExamId}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {exams.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.title} — {e.type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedExamId && (
        <ExamLeaderboardTable
          examId={selectedExamId}
          examTitle={exams.find((e) => e.id === selectedExamId)?.title ?? ''}
        />
      )}
    </div>
  )
}
