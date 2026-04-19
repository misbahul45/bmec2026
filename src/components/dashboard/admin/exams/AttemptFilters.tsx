import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

const SORT_OPTIONS = [
  { label: 'Skor Tertinggi', value: 'totalScore|desc' },
  { label: 'Skor Terendah', value: 'totalScore|asc' },
  { label: 'Terbaru', value: 'createdAt|desc' },
  { label: 'Terlama', value: 'createdAt|asc' },
]

const STATUS_OPTIONS = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Selesai', value: 'true' },
  { label: 'Berlangsung', value: 'false' },
]

interface Filters {
  search: string
  sort: string
  finished: string
  limit: number
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  onSearch: () => void
  onReset: () => void
}

export function AttemptFilters({ filters, onChange, onSearch, onReset }: Props) {
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

      <div className="flex flex-col w-48 gap-1">
        <Label>Urutkan</Label>
        <Select value={filters.sort} onValueChange={(v) => onChange({ ...filters, sort: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col w-40 gap-1">
        <Label>Status</Label>
        <Select value={filters.finished} onValueChange={(v) => onChange({ ...filters, finished: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onSearch}>Cari</Button>
      <Button variant="outline" onClick={onReset}>Reset</Button>
    </div>
  )
}
