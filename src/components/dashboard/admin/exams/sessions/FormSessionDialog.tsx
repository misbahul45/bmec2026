import { useState } from 'react'
import { useForm, useFormState } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Plus, Pencil, AlertTriangle } from 'lucide-react'
import {
  createExamSession,
  updateExamSession,
} from '~/server/exam-session'
import {
  createExamSessionSchema,
  updateExamSessionSchema,
} from '~/schemas/exam-session.schema'

type Props = {
  examId: string
  examStartDate?: string
  examEndDate?: string
  existing?: {
    id: string
    name: string
    startTime: string
    endTime: string
  }
}

function toLocalInputValue(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatWib(iso: string | Date | undefined) {
  if (!iso) return '-'
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return d.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function FormSessionDialog({
  examId,
  examStartDate,
  examEndDate,
  existing,
}: Props) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const schema = existing ? updateExamSessionSchema : createExamSessionSchema

  const form = useForm<any>({
    resolver: zodResolver(schema as any),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: existing
      ? {
          id: existing.id,
          examId,
          name: existing.name,
          startTime: toLocalInputValue(existing.startTime),
          endTime: toLocalInputValue(existing.endTime),
        }
      : { examId, name: '', startTime: '', endTime: '' },
  })

  const formState = useFormState({ control: form.control })

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const payload = {
        ...values,
        startTime: new Date(values.startTime),
        endTime: new Date(values.endTime),
      }
      return existing
        ? updateExamSession({ data: payload })
        : createExamSession({ data: { ...payload, examId } })
    },
    onError: (error: any) => {
      if (import.meta.env.DEV) {
        console.error('[FormSessionDialog] mutation error:', error)
      }
      const field = error?.field as string | undefined
      const message = (error?.message as string) ?? 'Terjadi kesalahan'
      toast.error(message)
      if (field && field in form.getValues()) {
        form.setError(field as any, { type: 'server', message })
      }
    },
    onSuccess: async () => {
      toast.success(existing ? 'Sesi diperbarui' : 'Sesi dibuat')
      setOpen(false)
      if (!existing) {
        form.reset({ name: '', startTime: '', endTime: '' })
      }
      await queryClient.invalidateQueries({ queryKey: ['exam-sessions', examId] })
    },
  })

  const startTimeValue = form.watch('startTime')
  const endTimeValue = form.watch('endTime')
  const showTimeError =
    startTimeValue && endTimeValue && new Date(endTimeValue) <= new Date(startTimeValue)
  const examStart = examStartDate ? toLocalInputValue(examStartDate) : undefined
  const examEnd = examEndDate ? toLocalInputValue(examEndDate) : undefined

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) form.reset() }}>
      <DialogTrigger asChild>
        {existing ? (
          <Button size="icon-sm" variant="ghost">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus size={14} className="mr-1" />
            Tambah Sesi
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{existing ? 'Edit Sesi' : 'Tambah Sesi'}</DialogTitle>
          <DialogDescription>
            Waktu input menggunakan zona waktu perangkat Anda (label WIB = UTC+7).
            Sistem menyimpan sebagai UTC.
          </DialogDescription>
        </DialogHeader>

        {examStartDate && examEndDate && (
          <div className="rounded-lg border border-dashed bg-muted/30 px-3 py-2 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-medium">
              <AlertTriangle size={13} className="text-amber-600" />
              Jendela ujian (WIB)
            </div>
            <div className="text-muted-foreground">
              {formatWib(examStartDate)} – {formatWib(examEndDate)}
            </div>
          </div>
        )}

        <form
          onSubmit={form.handleSubmit(
            (v) => mutation.mutate(v),
            (errors) => {
              if (import.meta.env.DEV) {
                console.warn('[FormSessionDialog] validation errors:', errors)
              }
              const firstError = Object.values(errors)[0]?.message as string | undefined
              if (firstError) toast.error(firstError)
            },
          )}
          className="space-y-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Nama Sesi</FieldLabel>
              <Input
                placeholder="Sesi 1"
                autoComplete="off"
                {...form.register('name')}
              />
              <FieldError>{form.formState.errors.name?.message as any}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Jam Mulai (WIB)</FieldLabel>
              <Input
                type="datetime-local"
                {...form.register('startTime')}
                min={existing ? undefined : examStart}
                max={existing ? undefined : examEnd}
              />
              <FieldError>{form.formState.errors.startTime?.message as any}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Jam Selesai (WIB)</FieldLabel>
              <Input
                type="datetime-local"
                {...form.register('endTime')}
                min={existing ? undefined : examStart}
                max={existing ? undefined : examEnd}
              />
              {showTimeError && !form.formState.errors.endTime && (
                <FieldDescription className="text-destructive">
                  Jam selesai harus setelah jam mulai.
                </FieldDescription>
              )}
              <FieldError>{form.formState.errors.endTime?.message as any}</FieldError>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !formState.isValid}
            >
              {mutation.isPending ? 'Menyimpan…' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
