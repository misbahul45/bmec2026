import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { examQuestionSchema, ExamQuestionFormData, ExamQuestionData } from '~/schemas/exam'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import RichTextEditorComments from '~/components/editor/RichTextEditorComments'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import { updateExamQuestion } from '~/server/exam'

const ANSWER_OPTIONS = ['A', 'B', 'C', 'D', 'E'] as const

const DIFFICULTY_OPTIONS = [
  { value: 'EASY', label: 'Mudah', description: '+2 / -1 / 0' },
  { value: 'MEDIUM', label: 'Sedang', description: '+4 / -2 / -1' },
  { value: 'HARD', label: 'Sulit', description: '+6 / -3 / -2' },
] as const

interface Props {
  examId: string
  defaultValues: ExamQuestionFormData
  onSuccess?: () => void
}

const FormEditQuestion = ({ examId, defaultValues, onSuccess }: Props) => {
  const queryClient = useQueryClient()

  const form = useForm<
    ExamQuestionFormData,
    any,
    ExamQuestionData
  >({
    resolver: zodResolver(
      examQuestionSchema
    ),
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: async (formData: ExamQuestionData) => {
      return updateExamQuestion({ data: formData })
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Something went wrong')
    },
    onSuccess: () => {
      toast.success('Soal berhasil diperbarui')
      queryClient.invalidateQueries({ queryKey: ['exam-questions', examId] })
      onSuccess?.()
    },
  })

  const onSubmit = (data: ExamQuestionData) => {
    mutation.mutate(data)
  }

  return (
    <form id="form-edit-question" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-5">
        <Controller
          name="question"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Pertanyaan</FieldLabel>
              <RichTextEditorComments content={field.value} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4">
          {ANSWER_OPTIONS.map((option) => (
            <Controller
              key={option}
              name={`option${option}` as keyof ExamQuestionFormData}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Pilihan {option}</FieldLabel>
                  <RichTextEditorComments content={field.value as string} onChange={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="correctAnswer"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Jawaban Benar</FieldLabel>
                <Select value={field.value ?? ''} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Pilih jawaban..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ANSWER_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt} className="text-xs">
                        Pilihan {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="difficulty"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Tingkat Kesulitan</FieldLabel>
                <Select value={field.value ?? 'EASY'} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Pilih kesulitan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        <span>{opt.label}</span>
                        <span className="ml-2 text-muted-foreground">{opt.description}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Button
          type="submit"
          form="form-edit-question"
          disabled={mutation.isPending}
          className="rounded-md active:scale-95 w-full hover:scale-[1.02] transition-all"
        >
          {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default FormEditQuestion