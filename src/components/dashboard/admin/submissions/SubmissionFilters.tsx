import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

const STATUS_OPTIONS = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
]

const LIMIT_OPTIONS = [10, 25, 50, 100]

interface Filters {
  search: string
  status: string
  limit: number
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  onSearch: () => void
  onReset: () => void
}

export function SubmissionFilters({ filters, onChange, onSearch, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col flex-1 gap-1 min-w-[180px]">
        <Label>Cari Tim</Label>
        <Input
          value={filters.search}
          placeholder="Nama tim atau sekolah..."
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
      </div>

      <div className="flex flex-col w-44 gap-1">
        <Label>Status</Label>
        <Select value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col w-36 gap-1">
        <Label>Tampilkan</Label>
        <Select value={String(filters.limit)} onValueChange={(v) => onChange({ ...filters, limit: Number(v) })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((l) => (
              <SelectItem key={l} value={String(l)}>{l} data</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onSearch}>Cari</Button>
      <Button variant="outline" onClick={onReset}>Reset</Button>
    </div>
  )
}
