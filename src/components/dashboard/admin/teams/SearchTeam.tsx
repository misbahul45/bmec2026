'use client'

import { useState } from "react"
import { useQueryStates } from "nuqs"
import { teamsSearchParams } from "~/schemas/team.schema"

import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select"

const competitionTypes = [
  { label: "Semua", value: "ALL" },
  { label: "Olimpiade", value: "OLIMPIADE" },
  { label: "LKTI", value: "LKTI" },
  { label: "Infografis", value: "INFOGRAFIS" },
]

const registrationStatuses = [
  { label: "Semua Status", value: "ALL" },
  { label: "Belum Mendaftar", value: "NONE" },
  { label: "Menunggu Verifikasi", value: "PENDING" },
  { label: "Terverifikasi", value: "APPROVED" },
  { label: "Ditolak", value: "REJECTED" },
]

const limits = [10, 50, 100, 1000]

export default function SearchTeam() {
  const [query, setQuery] = useQueryStates(
    teamsSearchParams,
    {
      history: "push"
    }
  )

  const [draft, setDraft] = useState(query)

  const submit = () => {
    setQuery({
      ...draft,
      page: 1,
    })
  }

  return (
    <div className="mx-auto">
      <div className="flex flex-wrap items-end gap-4">

        <div className="flex flex-col flex-1 gap-1">
          <Label>Search Team</Label>
          <Input
            value={draft.search}
            placeholder="Search..."
            onChange={(e) =>
              setDraft({
                ...draft,
                search: e.target.value,
              })
            }
          />
        </div>

        <div className="flex flex-col w-55 gap-1">
          <Label>Competition</Label>
          <Select
            value={draft.competitionType}
            onValueChange={(val) => setDraft({ ...draft, competitionType: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {competitionTypes.map((item) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col w-48 gap-1">
          <Label>Status Registrasi</Label>
          <Select
            value={draft.registrationStatus}
            onValueChange={(val) => setDraft({ ...draft, registrationStatus: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {registrationStatuses.map((item) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col w-40 gap-1">
          <Label>View</Label>

          <Select
            value={String(draft.limit)}
            onValueChange={(val) =>
              setDraft({
                ...draft,
                limit: Number(val),
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {limits.map((l) => (
                <SelectItem key={l} value={String(l)}>
                  {l} data
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={submit}>
          Search
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            setQuery({
              page: 1,
              limit: 10,
              search: "",
              competitionType: "ALL",
              registrationStatus: "ALL",
            })
          }
        >
          Reset
        </Button>

      </div>
    </div>
  )
}