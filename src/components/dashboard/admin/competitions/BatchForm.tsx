import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Check, Loader2, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Field, FieldGroup, FieldLabel, FieldError } from '~/components/ui/field'
import { updateBatch, createBatch } from '~/server/competition'

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
  price: z.coerce.number().min(0, 'Harga tidak valid'),
  module_bacth: z.string().min(1, 'Link modul wajib diisi'),
})

type FormData = z.infer<typeof schema>

type Props = {
  mode: 'create' | 'edit'
  competitionId: string
  batch?: {
    id: string
    name: string
    startDate: string | Date
    endDate: string | Date
    price: number
    module_bacth: string
  }
  queryKey: unknown[]
  onClose: () => void
}

const toDateInput = (d: string | Date) => new Date(d).toISOString().slice(0, 10)

export function BatchForm({ mode, competitionId, batch, queryKey, onClose }: Props) {
  const qc = useQueryClient()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: batch?.name ?? '',
      startDate: batch ? toDateInput(batch.startDate) : '',
      endDate: batch ? toDateInput(batch.endDate) : '',
      price: batch?.price ?? 0,
      module_bacth: batch?.module_bacth ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      mode === 'edit'
        ? updateBatch({ data: { id: batch!.id, ...data } })
        : createBatch({ data: { competitionId, ...data } }),
    onSuccess: () => {
      toast.success(mode === 'edit' ? 'Batch diperbarui' : 'Batch ditambahkan')
      qc.invalidateQueries({ queryKey: queryKey as any })
      onClose()
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal menyimpan'),
  })

  return (
    <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))}>
      <FieldGroup className="gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel>Nama Batch</FieldLabel>
            <Input {...form.register('name')} className="h-9 text-xs rounded-lg" placeholder="Batch 1" />
            {form.formState.errors.name && <FieldError errors={[form.formState.errors.name]} />}
          </Field>
          <Field data-invalid={!!form.formState.errors.price}>
            <FieldLabel>Harga (Rp)</FieldLabel>
            <Input {...form.register('price')} type="number" className="h-9 text-xs rounded-lg" placeholder="150000" />
            {form.formState.errors.price && <FieldError errors={[form.formState.errors.price]} />}
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field data-invalid={!!form.formState.errors.startDate}>
            <FieldLabel>Tanggal Mulai</FieldLabel>
            <Input {...form.register('startDate')} type="date" className="h-9 text-xs rounded-lg" />
            {form.formState.errors.startDate && <FieldError errors={[form.formState.errors.startDate]} />}
          </Field>
          <Field data-invalid={!!form.formState.errors.endDate}>
            <FieldLabel>Tanggal Selesai</FieldLabel>
            <Input {...form.register('endDate')} type="date" className="h-9 text-xs rounded-lg" />
            {form.formState.errors.endDate && <FieldError errors={[form.formState.errors.endDate]} />}
          </Field>
        </div>

        <Field data-invalid={!!form.formState.errors.module_bacth}>
          <FieldLabel>Link Modul</FieldLabel>
          <Input {...form.register('module_bacth')} className="h-9 text-xs rounded-lg" placeholder="https://drive.google.com/..." />
          {form.formState.errors.module_bacth && <FieldError errors={[form.formState.errors.module_bacth]} />}
        </Field>

        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={onClose}>
            <X size={13} className="mr-1" />Batal
          </Button>
          <Button type="submit" size="sm" className="rounded-xl gap-1.5" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
            {mode === 'edit' ? 'Simpan' : 'Tambah'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
