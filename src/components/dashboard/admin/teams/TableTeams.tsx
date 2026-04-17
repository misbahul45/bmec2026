import React, { useState } from "react"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table"

import Pagination from "~/components/ui/Pagination"
import { TeamWithRelations } from "~/types/team.type"
import { Badge } from "~/components/ui/badge"
import { useQueryStates } from "nuqs"
import { teamsSearchParams } from "~/schemas/team,schema"
import CompetitionBadge from "~/components/ui/CompetitionBadge"
import TeamActions from "./TeamAction"
import ImageDialog from "~/components/ui/ImageDialog"

type Props = {
  teams: TeamWithRelations[]
  meta: MetaData
}

const TableTeams: React.FC<Props> = ({
  teams,
  meta,
}) => {
  const [query, setQuery] =
    useQueryStates(teamsSearchParams)

  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] =
    useState("")
  const [selectedTitle, setSelectedTitle] =
    useState("")

  return (
    <div className="space-y-4">
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">
                No
              </TableHead>

              <TableHead className="text-center">
                Team
              </TableHead>

              <TableHead className="text-center">
                Sekolah/Universitas
              </TableHead>

              <TableHead className="text-center">
                Kompetisi
              </TableHead>

              <TableHead className="text-center">
                Member
              </TableHead>

              <TableHead className="text-center">
                Registrasi
              </TableHead>

              <TableHead className="text-center">
                Document
              </TableHead>

              <TableHead className="text-center">
                Abstract
              </TableHead>

              <TableHead className="text-center">
                Created
              </TableHead>

              <TableHead className="text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teams.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-10 text-muted-foreground"
                >
                  Tidak ada data tim
                </TableCell>
              </TableRow>
            )}

            {teams.map((team, index) => (
              <TableRow key={team.id}>
                <TableCell>
                  {(meta.page - 1) * meta.limit +
                    index +
                    1}
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {team.name}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {team.email}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                      {team.schoolAddress.substring(0, 40)}
                      <br />
                      {team.schoolAddress.length > 40 &&
                        team.schoolAddress.substring(40, 80)}
                  </div>
                </TableCell>

                <TableCell>
                  <CompetitionBadge
                    type={team.competitionType}
                  />
                </TableCell>

                <TableCell>
                  {team.members?.length ?? 0} Orang
                </TableCell>

                <TableCell>
                  {team.registration ? (
                    <Badge
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedImage(
                          team.registration
                            ?.paymentProof || ""
                        )
                        setSelectedTitle(
                          `Bukti Pembayaran - ${team.name}`
                        )
                        setOpen(true)
                      }}
                    >
                      Lihat Bukti
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      Belum Mendaftar
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {team.documentUrl ? (
                    <a
                      href={team.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline text-sm"
                    >
                      Lihat Dokumen
                    </a>
                  ) : (
                    <Badge variant="destructive">
                      Belum Upload
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {team.abstract ? (
                    <a
                      href={team.abstract.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline text-sm"
                    >
                      Lihat Abstract
                    </a>
                  ) : team.competitionType ===
                    "LKTI" ? (
                    <Badge variant="destructive">
                      Belum Upload
                    </Badge>
                  ) : (
                    <Badge variant="ghost">
                      Tidak Perlu
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {new Date(
                    team.createdAt
                  ).toLocaleDateString(
                    "id-ID"
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <TeamActions
                      team={team}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        setPage={(page) =>
          setQuery({
            ...query,
            page,
          })
        }
      />

      <ImageDialog
        open={open}
        setOpen={setOpen}
        url={selectedImage}
        title={selectedTitle}
      />
    </div>
  )
}

export default TableTeams