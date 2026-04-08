import { useState, useRef, useEffect } from 'react'
import { MapPin, Search, X } from 'lucide-react'
import { Input } from '../ui/input'

interface Suggestion {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export function AddressField({ value, onChange, error }: Props) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Suggestion | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const search = (q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.length < 3) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&countrycodes=id`,
          { headers: { 'Accept-Language': 'id' } }
        )
        const data: Suggestion[] = await res.json()
        setSuggestions(data)
        setOpen(true)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setQuery(v)
    setSelected(null)
    onChange(v)
    search(v)
  }

  const handleSelect = (s: Suggestion) => {
    setSelected(s)
    setQuery(s.display_name)
    onChange(s.display_name)
    setSuggestions([])
    setOpen(false)
  }

  const handleClear = () => {
    setQuery('')
    setSelected(null)
    onChange('')
    setSuggestions([])
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={handleInput}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Cari alamat sekolah..."
          aria-invalid={error}
          className="rounded pl-8 pr-8 text-xs"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-muted transition-colors"
            >
              <MapPin size={11} className="text-primary mt-0.5 shrink-0" />
              <span className="text-xs text-foreground leading-snug line-clamp-2">{s.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <Search size={12} className="text-muted-foreground animate-pulse" />
        </div>
      )}

      {selected && (
        <div className="mt-1.5 rounded-lg overflow-hidden border border-border">
          <iframe
            title="map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(selected.lon) - 0.01},${parseFloat(selected.lat) - 0.01},${parseFloat(selected.lon) + 0.01},${parseFloat(selected.lat) + 0.01}&layer=mapnik&marker=${selected.lat},${selected.lon}`}
            className="w-full"
            style={{ height: '140px', border: 'none' }}
            loading="lazy"
          />
        </div>
      )}
    </div>
  )
}
