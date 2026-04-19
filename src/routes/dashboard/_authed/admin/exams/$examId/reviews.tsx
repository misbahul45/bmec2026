import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import { examAttemptsQueryOptions } from '~/lib/api/exam-attempts/attempt.query-options'
import { examQueryOptions } from '~/lib/api/exams/exam.query-options'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { CheatStatusBadge } from '~/components/dashboard/admin/exams/CheatStatusBadge'
import Pagination from '~/components/ui/Pagination'
import CompetitionBadge from '~/components/ui/CompetitionBadge'
import { ArrowLeft, Eye } from 'lucide-react'

const SORT_OPTIONS = [
  { label: 'Skor Tertinggi', value: 'totalScore|desc' },
  { label: 'Skor Terendah', value: 'totalScore|asc' },
  { label: 'Kecurangan Terbanyak', value: 'cheatCount|desc' },
  { label: 'Terbaru', value: 'createdAt|desc' },
]

const FLAG_OPTIONS = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Flagged', value: 'true' },
  { label: 'Normal', value: 'false' },
]

const DEFAULT_FILTERS = { search: '', sort: 'totalScore|desc', flagged: 'ALL', limit: 20 }

export const Route = createFileRoute('/dashboard/_authed/admin/exams/$examId/reviews')({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(examQueryOptions(params.examId))
  },
  component: RouteComponent,
})

function AttemptsTable({ examId, filters, page, onPageChange }: {
  examId: string
  filters: typeof DEFAULT_FILTERS
  page: number
  onPageChange: (p: number) => void
}) {
  const [sortBy, sortOrder] = filters.sort.split('|') as [any, any]

  const query = {
    examId,
    search: filters.search || undefined,
    sortBy,
    sortOrder,
    flagged: filters.flagged === 'ALL' ? undefined : filters.flagged === 'true',
    limit: filters.limit,
    page,
  }

  const { data: res } = useSuspenseQuery(examAttemptsQueryOptions(query))
  const { attempts, meta } = res?.data ?? { attempts: [], meta: { page: 1, limit: 20, total: 0, totalPages: 1 } }

  return (
    <div className="space-y-4">
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12">No</TableHead>
              <TableHead>Tim</TableHead>
              <TableHead>Kompetisi</TableHead>
              <TableHead className="text-center">Skor</TableHead>
              <TableHead className="text-center">Kecurangan</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Selesai</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  Belum ada peserta
                </TableCell>
              </TableRow>
            )}
            {attempts.map((a: any, i: number) => (
              <TableRow key={a.id} className={a.flagged ? 'bg-destructive/5' : ''}>
                <TableCell className="text-center text-muted-foreground">
                  {(meta.page - 1) * meta.limit + i + 1}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{a.team.name}</span>
                    <span className="text-xs text-muted-foreground">{a.team.schoolName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <CompetitionBadge type={a.team.competitionType} />
                </TableCell>
                <TableCell className="text-center font-bold text-primary">{a.totalScore}</TableCell>
                <TableCell className="text-center">
                  <span className={`font-semibold text-sm ${a.cheatCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {a.cheatCount}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <CheatStatusBadge flagged={a.flagged} cheatCount={a.cheatCount} />
                </TableCell>
                <TableCell className="text-center">
                  {a.finished ? <Badge variant="default">Selesai</Badge> : <Badge variant="outline">Berlangsung</Badge>}
                </TableCell>
                <TableCell className="text-center">
                  <Button size="icon-sm" variant="ghost" asChild>
                    <a href={`/dashboard/admin/exams/${examId}/attempts/${a.id}`}>
                      <Eye className="size-3.5" />
                    </a>
                  </Button>
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

function RouteComponent() {
  const { examId } = Route.useParams()
  const { data: examRes } = useSuspenseQuery(examQueryOptions(examId))
  const exam = examRes?.data

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [applied, setApplied] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  return (
    <div className="space-y-6 w-full pt-20 min-h-screen pb-6 max-w-6xl mx-auto px-8">
      <div className="flex items-start gap-4">
        <Link to="/dashboard/admin/exams" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1">
          <ArrowLeft size={13} />
          Kembali
        </Link>
        <div>
          <h1 className="text-lg font-bold">{exam?.title ?? 'Hasil Ujian'}</h1>
          <p className="text-xs text-muted-foreground">{exam?.type} · {exam?.stage?.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col flex-1 gap-1 min-w-[180px]">
          <Label>Cari Tim</Label>
          <Input
            value={filters.search}
            placeholder="Nama tim atau sekolah..."
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && (setApplied(filters), setPage(1))}
          />
        </div>
        <div className="flex flex-col w-52 gap-1">
          <Label>Urutkan</Label>
          <Select value={filters.sort} onValueChange={(v) => setFilters({ ...filters, sort: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-40 gap-1">
          <Label>Status</Label>
          <Select value={filters.flagged} onValueChange={(v) => setFilters({ ...filters, flagged: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {FLAG_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { setApplied(filters); setPage(1) }}>Cari</Button>
        <Button variant="outline" onClick={() => { setFilters(DEFAULT_FILTERS); setApplied(DEFAULT_FILTERS); setPage(1) }}>Reset</Button>
      </div>

      <Suspense fallback={<div className="text-xs text-muted-foreground py-10 text-center">Memuat...</div>}>
        <AttemptsTable examId={examId} filters={applied} page={page} onPageChange={setPage} />
      </Suspense>
    </div>
  )
}
