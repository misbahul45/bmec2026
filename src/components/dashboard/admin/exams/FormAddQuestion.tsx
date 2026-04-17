import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { examQuestionSchema, ExamQuestionData } from '~/schemas/exam'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import RichTextEditorComments from '~/components/editor/RichTextEditorComments'
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { createExamQuestion } from '~/server/exam'

const ANSWER_OPTIONS = ['A', 'B', 'C', 'D', 'E'] as const

interface Props {
  examId: string
}

const FormAddQuestion = ({ examId, }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const form = useForm<ExamQuestionData>({
    resolver: zodResolver(examQuestionSchema),
    defaultValues: {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      optionE: '',
      correctAnswer: undefined,
      score: 5,
      examId,
    },
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
      })

      gsap.from('.input-anim', {
        y: 20,
        opacity: 0,
        scale: 0.98,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
        stagger: 0.08,
      })

      gsap.from('.button-anim', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.5,
        ease: 'power2.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const mutation = useMutation({
    mutationFn: async (formData: ExamQuestionData) => {
        return createExamQuestion({
            data:formData
        })
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Something went wrong')
    },
    onSuccess: () => {
      toast.success('Soal berhasil ditambahkan')
      form.reset()
    queryClient.invalidateQueries({ queryKey: ['exam-questions', examId] })
    },
  })

  const onSubmit = (data: ExamQuestionData) => {
    mutation.mutate(data)
  }

  return (
    <div ref={containerRef} className="w-full mx-auto">
      <CardHeader className="mb-6 px-0 fade-up">
        <CardTitle className="text-center font-bold text-lg">Tambah Soal</CardTitle>
        <CardDescription className="text-center text-xs">
          Isi pertanyaan, pilihan jawaban, dan jawaban yang benar
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 fade-up">
        <form id="form-question" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-5">
            <Controller
              name="question"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
                  <FieldLabel>Pertanyaan</FieldLabel>
                  <RichTextEditorComments
                    content={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              {ANSWER_OPTIONS.map((option) => (
                <Controller
                  key={option}
                  name={`option${option}` as keyof ExamQuestionData}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="input-anim">
                      <FieldLabel>Pilihan {option}</FieldLabel>
                      <RichTextEditorComments
                        content={field.value as string}
                        onChange={field.onChange}
                      />
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
                  <Field data-invalid={fieldState.invalid} className="input-anim">
                    <FieldLabel>Jawaban Benar</FieldLabel>
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all"
                        aria-invalid={fieldState.invalid}
                      >
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
                name="score"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="input-anim">
                    <FieldLabel>Skor</FieldLabel>
                    <Input
                      {...field}
                      id="score"
                      type="number"
                      min={0}
                      placeholder="5"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                      className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="px-0 flex-col gap-2 button-anim">
        <Button
          type="submit"
          form="form-question"
          disabled={mutation.isPending}
          className="rounded-md active:scale-95 w-full hover:scale-[1.02] transition-all"
        >
          {mutation.isPending ? 'Menyimpan...' : 'Simpan Soal'}
        </Button>
      </CardFooter>
    </div>
  )
}

export default FormAddQuestion