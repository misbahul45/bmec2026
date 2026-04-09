import { MapPin } from 'lucide-react'
import { Textarea } from '../ui/textarea'

interface Props {
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export function AddressField({ value, onChange, error }: Props) {
  return (
    <div className="relative">
      <MapPin
        size={14}
        className="absolute left-3 top-3 text-muted-foreground pointer-events-none"
      />

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Masukkan alamat sekolah lengkap..."
        aria-invalid={error}
        rows={3}
        className="pl-9 text-xs resize-none"
      />
    </div>
  )
}