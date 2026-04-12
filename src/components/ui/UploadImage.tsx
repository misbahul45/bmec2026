import * as React from "react"
import { Upload, X, Eye } from "lucide-react"
import { Button } from "./button"

type Props = {
  value?: File | null
  onChange: (file: File | null) => void
  disabled?: boolean
}

const UploadImage: React.FC<Props> = ({
  value,
  onChange,
  disabled,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [preview, setPreview] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!value) {
      setPreview(null)
      return
    }

    const url = URL.createObjectURL(value)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [value])

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange(file)
  }

  const removeFile = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="w-full space-y-2">
      {!value && (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center cursor-pointer hover:bg-muted/40 transition"
        >
          <div className="rounded-full border p-3">
            <Upload className="size-6 text-muted-foreground" />
          </div>

          <p className="text-sm font-medium">
            Upload bukti pembayaran
          </p>

          <p className="text-xs text-muted-foreground">
            PNG / JPG maksimal 5MB
          </p>
        </div>
      )}

      {value && preview && (
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={preview}
              className="size-14 rounded object-cover"
            />

            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">
                {value.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => window.open(preview, "_blank")}
            >
              <Eye className="size-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeFile}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        disabled={disabled}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        hidden
        onChange={handleSelect}
      />
    </div>
  )
}

export default UploadImage