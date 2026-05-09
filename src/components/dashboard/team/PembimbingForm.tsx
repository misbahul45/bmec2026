import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GraduationCap, Pencil, Plus, Loader2, Check } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { toast } from 'sonner'
import { createMentor, updateMentor } from '~/server/team'

interface Pembimbing {
  name: string
  email: string
  phone: string
}

interface Props {
  teamId: string
  existing?: Pembimbing | null
  queryKey: unknown[]
}

export function PembimbingForm({ teamId, existing, queryKey }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(existing?.name ?? '')
  const [email, setEmail] = useState(existing?.email ?? '')
  const [phone, setPhone] = useState(existing?.phone ?? '')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      if (existing) {
        return updateMentor({ data: { teamId, name, email, phone } })
      }
      return createMentor({ data: { teamId, name, email, phone } })
    },
    onSuccess: () => {
      toast.success(existing ? 'Data pembimbing berhasil diperbarui' : 'Pembimbing berhasil ditambahkan')
      queryClient.invalidateQueries({ queryKey: queryKey as any })
      setOpen(false)
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal menyimpan data pembimbing'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim()) {
      return toast.error('Semua field wajib diisi')
    }
    mutation.mutate()
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl gap-1.5 text-xs"
        onClick={() => setOpen(true)}
      >
        {existing ? (
          <>
            <Pencil size={12} />
            Edit Pembimbing
          </>
        ) : (
          <>
            <Plus size={12} />
            Tambah Pembimbing
          </>
        )}
      </Button>
    )
  }

  return (
    <div className="rounded-2xl border bg-background shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap size={15} className="text-primary" />
        <span className="text-sm font-semibold">
          {existing ? 'Edit Pembimbing' : 'Tambah Pembimbing'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Nama Pembimbing</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              className="rounded-xl text-sm h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@sekolah.ac.id"
              className="rounded-xl text-sm h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">WhatsApp</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="rounded-xl text-sm h-9"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl text-xs"
            onClick={() => {
              setOpen(false)
              setName(existing?.name ?? '')
              setEmail(existing?.email ?? '')
              setPhone(existing?.phone ?? '')
            }}
          >
            Batal
          </Button>
          <Button
            type="submit"
            size="sm"
            className="rounded-xl gap-1.5 text-xs"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Check size={12} />
                Simpan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
