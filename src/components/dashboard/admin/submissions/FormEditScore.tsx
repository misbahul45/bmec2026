import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { updateSubmissionScore } from '~/server/submission'

const schema = z.object({
  score: z.number({ invalid_type_error: 'Masukkan angka' }).min(0, 'Min 0'),
  feedback: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  submissionId: string
  adminId: string
  defaultScore?: number | null
  defaultFeedback?: string | null
  queryKey: unknown[]
  onSuccess?: () => void
}

export function FormEditScore({ submissionId, adminId, defaultScore, defaultFeedback, queryKey, onSuccess }: Props) {
  const qc = useQueryClient()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { score: defaultScore ?? 0, feedback: defaultFeedback ?? '' },
  })

  const mutation = useMutation({
    mutationFn: (d: FormData) =>
      updateSubmissionScore({ data: { id: submissionId, score: d.score, feedback: d.feedback ?? null, adminId } }),
    onSuccess: () => {
      toast.success('Nilai berhasil disimpan')
      qc.invalidateQueries({ queryKey })
      onSuccess?.()
    },
    onError: (e: any) => toast.error(e?.message ?? 'Error'),
  })

  return (
    <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="score">Nilai</Label>
        <Input
          id="score"
          type="number"
          min={0}
          className="rounded text-xs"
          {...form.register('score', { valueAsNumber: true })}
          aria-invalid={!!form.formState.errors.score}
        />
        {form.formState.errors.score && (
          <p className="text-xs text-destructive">{form.formState.errors.score.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="feedback">Feedback (opsional)</Label>
        <Input
          id="feedback"
          className="rounded text-xs"
          placeholder="Catatan untuk tim..."
          {...form.register('feedback')}
        />
      </div>

      <Button type="submit" size="sm" className="w-full rounded" disabled={mutation.isPending}>
        {mutation.isPending ? 'Menyimpan...' : 'Simpan Nilai'}
      </Button>
    </form>
  )
}
