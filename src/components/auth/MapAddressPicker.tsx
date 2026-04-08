import { useState, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'
import { Input } from '../ui/input'

const LIBRARIES: ('places')[] = ['places']
const DEFAULT_CENTER = { lat: -7.2575, lng: 112.7521 }
const MAP_STYLE = { width: '100%', height: '220px' }

export interface MapAddressValue {
  address: string
  lat: number
  lng: number
}

interface Props {
  value: MapAddressValue
  onChange: (val: MapAddressValue) => void
  error?: boolean
}

export function MapAddressPicker({ value, onChange, error }: Props) {
  const apiKey = import.meta.env.VITE_GMAP_API_KEY as string
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey, libraries: LIBRARIES })

  const [center, setCenter] = useState<google.maps.LatLngLiteral>(
    value.lat && value.lng ? { lat: value.lat, lng: value.lng } : DEFAULT_CENTER
  )
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setCenter({ lat, lng })

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        onChange({ address: results[0].formatted_address, lat, lng })
      } else {
        onChange({ address: value.address, lat, lng })
      }
    })
  }, [onChange, value.address])

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace()
    if (!place?.geometry?.location) return
    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()
    const address = place.formatted_address ?? place.name ?? ''
    setCenter({ lat, lng })
    onChange({ address, lat, lng })
  }, [onChange])

  if (!isLoaded) {
    return (
      <div className="h-[220px] rounded-lg bg-muted flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Memuat peta...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Autocomplete
        onLoad={(ac) => { autocompleteRef.current = ac }}
        onPlaceChanged={handlePlaceChanged}
        options={{ componentRestrictions: { country: 'id' } }}
      >
        <div className="relative">
          <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            defaultValue={value.address}
            placeholder="Cari alamat sekolah..."
            aria-invalid={error}
            className="rounded pl-8 text-xs"
          />
        </div>
      </Autocomplete>

      <div className="rounded-lg overflow-hidden border border-border">
        <GoogleMap
          mapContainerStyle={MAP_STYLE}
          center={center}
          zoom={15}
          onClick={handleMapClick}
          options={{ disableDefaultUI: true, zoomControl: true, clickableIcons: false }}
        >
          {value.lat !== 0 && value.lng !== 0 && (
            <Marker position={{ lat: value.lat, lng: value.lng }} />
          )}
        </GoogleMap>
      </div>

      {value.address && (
        <p className="text-[10px] text-muted-foreground leading-snug px-0.5">
          📍 {value.address}
        </p>
      )}
    </div>
  )
}
