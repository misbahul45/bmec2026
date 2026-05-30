import { useQueryStates } from 'nuqs'
import Pagination from '~/components/ui/Pagination'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { teamsSearchParams } from '~/schemas/team.schema'
import CompetitionBadge from '~/components/ui/CompetitionBadge'
import TeamActions from './TeamAction'
import { exportToExcel } from '~/lib/utils/export-excel'
import { Download, FileText, Link, AlertCircle } from 'lucide-react'
import { StageCell } from './StageCell'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '~/components/ui/table'

interface TeamRow {
  id: string
  name: string
  code: string
  email: string
  phone: string
  schoolName: string
  schoolAddress: string
  competitionType: string
  sourceInfo?: string | null
  twibbonUrl?: string | null
  documentUrl?: string | null
  currentStageId?: string | null
  createdAt: string | Date
  currentStage?: { name: string } | null
  mentor?: { name: string; email: string; phone: string } | null
  members: {
    id: string
    name: string
    email: string
    phone: string
    role: string
    major?: string | null
    faculty?: string | null
  }[]
  registration?: {
    status: string
    paymentProof?: string | null
    batch?: {
      name: string
      price: number | string
    } | null
    competition?: {
      stages: { id: string; name: string; order: number }[]
    } | null
    createdAt: string | Date
  } | null
}

type Props = {
  teams: TeamRow[]
  meta: MetaData
  queryKey: unknown[]
  adminId: string
}

const isLkti = (competitionType: string) => competitionType === 'LKTI'
const getMentorLabel = (competitionType: string) =>
  isLkti(competitionType) ? 'Pembina' : 'Pendamping'

const LinkCell = ({ href }: { href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
  >
    <Link className="size-3" />
    Lihat
  </a>
)

const BelumUpload = () => (
  <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
    Belum
  </span>
)

const BelumDaftar = () => (
  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-500 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">
    <AlertCircle className="size-2.5" />
    Belum Daftar
  </span>
)

const TableTeams = ({ teams, meta, queryKey }: Props) => {
  const [query, setQuery] = useQueryStates(teamsSearchParams)

  const handleExport = () => {
    exportToExcel(
      teams.map((team, i) => {
        const ketua = team.members?.find((m) => m.role === 'KETUA')
        const anggota = team.members?.filter((m) => m.role !== 'KETUA') ?? []
        const anggota1 = anggota[0]
        const anggota2 = anggota[1]
        const mentor = (team as any).mentor ?? null
        const registration = team.registration
        const batch = registration?.batch
        const lkti = isLkti(team.competitionType)
        const mentorLabel = getMentorLabel(team.competitionType)

        const memberBase = (m?: typeof ketua) =>
          m
            ? {
                name: m.name,
                email: m.email,
                phone: m.phone,
                ...(lkti ? { fakultas: m.faculty ?? '—', prodi: m.major ?? '—' } : {}),
              }
            : {
                name: '—',
                email: '—',
                phone: '—',
                ...(lkti ? { fakultas: '—', prodi: '—' } : {}),
              }

        const ketuaData = memberBase(ketua)
        const anggota1Data = memberBase(anggota1)
        const anggota2Data = memberBase(anggota2)

        const ketuaExport: Record<string, string> = {
          'Ketua - Nama': ketuaData.name,
          'Ketua - Email': ketuaData.email,
          'Ketua - No HP': ketuaData.phone,
          ...(lkti
            ? { 'Ketua - Fakultas': ketuaData.fakultas!, 'Ketua - Prodi': ketuaData.prodi! }
            : {}),
        }

        const anggota1Export: Record<string, string> = {
          'Anggota 1 - Nama': anggota1Data.name,
          'Anggota 1 - Email': anggota1Data.email,
          'Anggota 1 - No HP': anggota1Data.phone,
          ...(lkti
            ? {
                'Anggota 1 - Fakultas': anggota1Data.fakultas!,
                'Anggota 1 - Prodi': anggota1Data.prodi!,
              }
            : {}),
        }

        const anggota2Export: Record<string, string> = {
          'Anggota 2 - Nama': anggota2Data.name,
          'Anggota 2 - Email': anggota2Data.email,
          'Anggota 2 - No HP': anggota2Data.phone,
          ...(lkti
            ? {
                'Anggota 2 - Fakultas': anggota2Data.fakultas!,
                'Anggota 2 - Prodi': anggota2Data.prodi!,
              }
            : {}),
        }

        return {
          No: (meta.page - 1) * meta.limit + i + 1,
          'ID Tim': team.id,
          'Nama Tim': team.name,
          'Kode Tim': team.code,
          'Email Tim': team.email,
          'No HP Tim': team.phone,
          Kompetisi: team.competitionType,
          Batch: batch?.name ?? '—',
          'Asal Informasi': team.sourceInfo ?? '—',
          'Sekolah / Universitas': team.schoolName,
          'Alamat Sekolah / Universitas': team.schoolAddress,
          Stage: team.currentStage?.name ?? '—',
          'Status Registrasi': registration?.status ?? 'BELUM_DAFTAR',
          'Tanggal Pendaftaran': new Date(registration?.createdAt ?? team.createdAt).toLocaleString('id-ID'),
          'Twibbon URL': team.twibbonUrl ?? '—',
          'Dokumen URL': team.documentUrl ?? '—',
          'Bukti Pembayaran': registration?.paymentProof ?? '—',
          ...ketuaExport,
          ...anggota1Export,
          ...anggota2Export,
          [`${mentorLabel} - Nama`]: mentor?.name ?? '—',
          [`${mentorLabel} - Email`]: mentor?.email ?? '—',
          [`${mentorLabel} - No HP`]: mentor?.phone ?? '—',
        }
      }),
      `data-tim-${new Date().toISOString().slice(0, 10)}`,
      'Data Tim',
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="gap-1.5 rounded" onClick={handleExport}>
          <Download className="size-3" />
          Export Excel
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="text-xs min-w-[1400px]">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-center w-10 text-[11px] font-semibold">No</TableHead>
                <TableHead className="text-[11px] font-semibold min-w-[160px]">Tim</TableHead>
                <TableHead className="text-[11px] font-semibold min-w-[150px]">
                  Sekolah / Universitas
                </TableHead>
                <TableHead className="text-center text-[11px] font-semibold w-24">
                  Kompetisi
                </TableHead>
                <TableHead className="text-[11px] font-semibold min-w-[100px]">Batch</TableHead>
                <TableHead className="text-center text-[11px] font-semibold min-w-[100px]">
                  Stage
                </TableHead>
                <TableHead className="text-[11px] font-semibold min-w-[170px]">Member</TableHead>
                <TableHead className="text-[11px] font-semibold min-w-[150px]">
                  Pendamping / Pembina
                </TableHead>
                <TableHead className="text-center text-[11px] font-semibold w-24">
                  Bukti Bayar
                </TableHead>
                <TableHead className="text-center text-[11px] font-semibold w-20">
                  Dokumen
                </TableHead>
                <TableHead className="text-center text-[11px] font-semibold w-20">
                  Twibbon
                </TableHead>
                <TableHead className="text-center text-[11px] font-semibold w-24">
                  Tgl Daftar
                </TableHead>
                <TableHead className="text-center text-[11px] font-semibold w-16">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {teams.length === 0 && (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-16 text-muted-foreground text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="size-8 opacity-30" />
                      Tidak ada data tim
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {teams.map((team, index) => {
                const mentor = (team as any).mentor ?? null
                const mentorLabel = getMentorLabel(team.competitionType)
                const batch = team.registration?.batch ?? null
                const lkti = isLkti(team.competitionType)
                const ketua = team.members?.find((m) => m.role === 'KETUA')
                const anggota = team.members?.filter((m) => m.role !== 'KETUA') ?? []

                return (
                  <TableRow key={team.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-center text-muted-foreground tabular-nums">
                      {(meta.page - 1) * meta.limit + index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-[12px] leading-tight">{team.name}</span>
                        <span className="text-[10px] text-muted-foreground">{team.email}</span>
                        <span className="text-[10px] font-mono text-muted-foreground/70 tracking-tight">
                          #{team.code}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-0.5 max-w-[150px]">
                        <span className="font-medium text-[11px] leading-tight truncate">
                          {team.schoolName}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">
                          {team.schoolAddress}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <CompetitionBadge type={team.competitionType as any} />
                    </TableCell>

                    <TableCell>
                      {batch ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-[11px]">{batch.name}</span>
                          <span className="text-[10px] text-muted-foreground tabular-nums">
                            Rp {Number(batch.price).toLocaleString('id-ID')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <StageCell
                        teamId={team.id}
                        currentStageId={team.currentStageId ?? null}
                        stages={team.registration?.competition?.stages ?? []}
                        queryKey={queryKey}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        {ketua && (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm shrink-0">
                                Ketua
                              </span>
                              <span className="font-medium text-[11px] truncate max-w-[100px]">
                                {ketua.name}
                              </span>
                            </div>
                            {lkti && (ketua.faculty || ketua.major) && (
                              <div className="pl-1 text-[10px] text-muted-foreground leading-tight">
                                {ketua.faculty && (
                                  <span className="block truncate max-w-[130px]">{ketua.faculty}</span>
                                )}
                                {ketua.major && (
                                  <span className="block truncate max-w-[130px]">{ketua.major}</span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {anggota.map((m, i) => (
                          <div key={m.id} className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] border border-border px-1.5 py-0.5 rounded-sm text-muted-foreground shrink-0">
                                A{i + 1}
                              </span>
                              <span className="text-[11px] truncate max-w-[100px]">{m.name}</span>
                            </div>
                            {lkti && (m.faculty || m.major) && (
                              <div className="pl-1 text-[10px] text-muted-foreground leading-tight">
                                {m.faculty && (
                                  <span className="block truncate max-w-[130px]">{m.faculty}</span>
                                )}
                                {m.major && (
                                  <span className="block truncate max-w-[130px]">{m.major}</span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {!team.members?.length && (
                          <span className="text-[10px] text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {mentor ? (
                        <div className="flex flex-col gap-0.5 max-w-[150px]">
                          <span className="font-medium text-[11px] truncate">{mentor.name}</span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {mentor.email}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{mentor.phone}</span>
                          <span className="mt-0.5 text-[9px] border border-border px-1.5 py-0.5 rounded-sm w-fit text-muted-foreground">
                            {mentorLabel}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">Belum diisi</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {team.registration?.paymentProof ? (
                        <LinkCell href={team.registration.paymentProof} />
                      ) : team.registration ? (
                        <BelumUpload />
                      ) : (
                        <BelumDaftar />
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {team.documentUrl ? (
                        <LinkCell href={team.documentUrl} />
                      ) : (
                        <BelumUpload />
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {team.twibbonUrl ? (
                        <LinkCell href={team.twibbonUrl} />
                      ) : (
                        <BelumUpload />
                      )}
                    </TableCell>

                    <TableCell className="text-center tabular-nums text-muted-foreground text-[11px]">
                      {new Date(team.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </TableCell>

                    <TableCell className="text-right">
                      <TeamActions team={team} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        setPage={(page) => setQuery({ ...query, page })}
      />
    </div>
  )
}

export default TableTeams