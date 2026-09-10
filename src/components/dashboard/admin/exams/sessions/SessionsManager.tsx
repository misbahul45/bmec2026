import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { CalendarClock, Trash2, UserPlus, AlertTriangle } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  assignTeamsToSession,
  deleteExamSession,
  removeTeamFromSession,
} from '~/server/exam-session'
import { examSessionsQueryOptions } from '~/lib/api/exam-sessions/exam-session.query-options'
import { examQueryOptions } from '~/lib/api/exams/exam.query-options'
import { FormSessionDialog } from './FormSessionDialog'

export function SessionsManager({ examId }: { examId: string }) {
  const { data: res } = useSuspenseQuery(examSessionsQueryOptions(examId))
  const { data: examRes } = useSuspenseQuery(examQueryOptions(examId))
  const sessions: any[] = (res as any)?.data ?? []
  const exam: any = (examRes as any)?.data
  const isOlympiad = exam?.type === 'OLYMPIAD'
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['exam-sessions', examId] })

  const [ranges, setRanges] = useState<Record<string, { codeFrom: string; codeTo: string }>>({})

  const assignMutation = useMutation({
    mutationFn: (input: { sessionId: string; codeFrom: number; codeTo: number }) =>
      assignTeamsToSession({ data: input }),
    onSuccess: async (result: any) => {
      toast.success((result as any)?.message ?? 'Tim berhasil di-assign')
      await invalidate()
    },
    onError: (error: any) => toast.error(error?.message ?? 'Terjadi kesalahan'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExamSession({ data: { id } }),
    onSuccess: async () => {
      toast.success('Sesi dihapus')
      await invalidate()
    },
    onError: (error: any) => toast.error(error?.message ?? 'Terjadi kesalahan'),
  })

  const removeTeamMutation = useMutation({
    mutationFn: (input: { sessionId: string; teamId: string }) =>
      removeTeamFromSession({ data: input }),
    onSuccess: async () => {
      toast.success('Tim dikeluarkan dari sesi')
      await invalidate()
    },
    onError: (error: any) => toast.error(error?.message ?? 'Terjadi kesalahan'),
  })

  if (!isOlympiad) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-6 space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Sesi tidak tersedia untuk ujian tipe {exam?.type ?? 'ini'}.
            </p>
            <p className="text-xs text-muted-foreground">
              Fitur sesi hanya berlaku untuk ujian tipe <strong>OLYMPIAD</strong>.
              Ujian tipe TRYOUT tidak memerlukan sesi karena berlangsung dalam satu window waktu.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border p-8 text-center space-y-3">
        <CalendarClock className="mx-auto size-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Belum ada sesi. Exam akan mengikuti window tanggal ujian sampai sesi dibuat.
        </p>
        <div className="flex justify-center">
          <FormSessionDialog
            examId={examId}
            examStartDate={exam?.startDate}
            examEndDate={exam?.endDate}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Daftar Sesi</h2>
        <FormSessionDialog
          examId={examId}
          examStartDate={exam?.startDate}
          examEndDate={exam?.endDate}
        />
      </div>

      {sessions.map((session) => {
        const rangeState = ranges[session.id] ?? { codeFrom: '', codeTo: '' }
        const fmt = (iso: string) =>
          new Date(iso).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
          })

        return (
          <Card key={session.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {session.name}
                  <Badge variant="outline">
                    {(session.assignments ?? []).length} tim
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <FormSessionDialog
                    examId={examId}
                    examStartDate={exam?.startDate}
                    examEndDate={exam?.endDate}
                    existing={{
                      id: session.id,
                      name: session.name,
                      startTime: session.startTime,
                      endTime: session.endTime,
                    }}
                  />
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      if (window.confirm(`Hapus ${session.name}? Tim terkait akan kehilangan sesi.`)) {
                        deleteMutation.mutate(session.id)
                      }
                    }}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {fmt(session.startTime)} — {fmt(session.endTime)}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Assign by range */}
              <div className="border rounded-xl p-3 space-y-2 bg-muted/30">
                <Label className="flex items-center gap-1.5 text-xs">
                  <UserPlus size={13} />
                  Assign Tim (nomor kode, mis. 1–100 untuk OLM-001 … OLM-100)
                </Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    type="number" min={1} className="w-24"
                    placeholder="dari"
                    value={rangeState.codeFrom}
                    onChange={(e) =>
                      setRanges({ ...ranges, [session.id]: { ...rangeState, codeFrom: e.target.value } })
                    }
                  />
                  <span className="text-xs text-muted-foreground">s.d.</span>
                  <Input
                    type="number" min={1} className="w-24"
                    placeholder="sampai"
                    value={rangeState.codeTo}
                    onChange={(e) =>
                      setRanges({ ...ranges, [session.id]: { ...rangeState, codeTo: e.target.value } })
                    }
                  />
                  <Button
                    size="sm"
                    disabled={
                      assignMutation.isPending ||
                      !rangeState.codeFrom || !rangeState.codeTo
                    }
                    onClick={() =>
                      assignMutation.mutate({
                        sessionId: session.id,
                        codeFrom: Number(rangeState.codeFrom),
                        codeTo: Number(rangeState.codeTo),
                      })
                    }
                  >
                    Assign
                  </Button>
                </div>
              </div>

              {/* Daftar tim */}
              {(session.assignments ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground">Belum ada tim.</p>
              ) : (
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Kode</th>
                        <th className="px-3 py-2 text-left font-medium">Tim</th>
                        <th className="px-3 py-2 text-left font-medium">Asal</th>
                        <th className="px-3 py-2 text-center font-medium">Anggota</th>
                        <th className="px-3 py-2 text-center font-medium">Status</th>
                        <th className="px-3 py-2 text-center font-medium">Nilai</th>
                        <th className="px-3 py-2 text-right font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(session.assignments as any[]).map((a) => {
                        const t = a.team
                        const memberCount = (t.members ?? []).length
                        const kapten = (t.members ?? []).find((m: any) => m.role === 'KETUA')
                        const regStatus = t.registration?.status
                        const attempt = t.attempts?.[0]
                        const score = attempt?.totalScore
                        const finished = attempt?.finished
                        return (
                          <tr key={a.id} className="border-t hover:bg-muted/20">
                            <td className="px-3 py-2 font-mono text-xs">{t.code}</td>
                            <td className="px-3 py-2">
                              <div className="font-medium text-foreground">{t.name}</div>
                              {kapten && (
                                <div className="text-[10px] text-muted-foreground">
                                  Ketua: {kapten.name ?? '(tanpa nama)'}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2 text-xs text-muted-foreground">
                              <div>{t.schoolName}</div>
                              <div className="text-[10px]">{t.competitionType}</div>
                            </td>
                            <td className="px-3 py-2 text-center text-xs">
                              <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 font-mono">
                                {memberCount}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center">
                              {regStatus === 'APPROVED' ? (
                                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                                  Aktif
                                </Badge>
                              ) : regStatus === 'PENDING' ? (
                                <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">
                                  Pending
                                </Badge>
                              ) : regStatus === 'REJECTED' ? (
                                <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/30">
                                  Ditolak
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px]">—</Badge>
                              )}
                            </td>
                            <td className="px-3 py-2 text-center text-xs font-mono">
                              {finished
                                ? (score != null ? score : '0')
                                : attempt
                                ? <span className="text-muted-foreground">berjalan</span>
                                : <span className="text-muted-foreground">—</span>}
                            </td>
                            <td className="px-3 py-2 text-right">
                              <Button
                                size="icon-sm" variant="ghost"
                                disabled={removeTeamMutation.isPending}
                                onClick={() =>
                                  removeTeamMutation.mutate({
                                    sessionId: session.id,
                                    teamId: a.team.id,
                                  })
                                }
                                title={`Keluarkan ${t.name} dari sesi`}
                              >
                                <Trash2 className="size-3.5 text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
