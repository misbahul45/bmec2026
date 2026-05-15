import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  examQuestionSchema,
  ExamQuestionFormData,
  ExamQuestionData,
} from '~/schemas/exam'
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  useEffect,
  useRef,
} from 'react'
import gsap from 'gsap'
import RichTextEditorComments from '~/components/editor/RichTextEditorComments'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '~/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import { createExamQuestion } from '~/server/exam'

const ANSWER_OPTIONS = ['A', 'B', 'C', 'D', 'E'] as const

const DIFFICULTY_OPTIONS = [
  { value: 'EASY', label: 'Mudah', description: '+2 / -1 / 0' },
  { value: 'MEDIUM', label: 'Sedang', description: '+4 / -2 / -1' },
  { value: 'HARD', label: 'Sulit', description: '+6 / -3 / -2' },
] as const

interface Props {
  examId: string
  totalQuestion?: number
}

const FormAddQuestion = ({
  examId,
  totalQuestion = 0,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const nextOrder = totalQuestion + 1

  const form = useForm<
    ExamQuestionFormData,
    any,
    ExamQuestionData
  >({
    resolver: zodResolver(examQuestionSchema),
    mode:'onChange',
    defaultValues: {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      optionE: '',
      correctAnswer: undefined,
      difficulty: 'EASY',
      examId,
      order: nextOrder,
    },
  })

  useEffect(() => {
    form.setValue('order', totalQuestion + 1)
  }, [totalQuestion, form])

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
      return createExamQuestion({ data: formData })
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Something went wrong')
    },
    onSuccess: async () => {
      toast.success('Soal berhasil ditambahkan')
      await queryClient.invalidateQueries({
        queryKey: ['exam-questions', examId],
      })
      form.reset({
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        optionE: '',
        correctAnswer: undefined,
        difficulty: 'EASY',
        examId,
        order: totalQuestion + 2,
      })
    },
  })

  const onSubmit = (data: ExamQuestionData) => {
    mutation.mutate(data)
  }

  return (
    <div ref={containerRef} className="w-full mx-auto">
      <CardHeader className="mb-6 px-0 fade-up">
        <CardTitle className="text-center font-bold text-lg">
          Tambah Soal
        </CardTitle>
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                    <Field
                      data-invalid={fieldState.invalid}
                      className="input-anim"
                    >
                      <FieldLabel>Pilihan {option}</FieldLabel>
                      <RichTextEditorComments
                        content={field.value as string}
                        onChange={field.onChange}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
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
                    <Select
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="rounded-md text-xs h-9">
                        <SelectValue placeholder="Pilih jawaban..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ANSWER_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            Pilihan {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="difficulty"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="input-anim">
                    <FieldLabel>Tingkat Kesulitan</FieldLabel>
                    <Select
                      value={field.value ?? 'EASY'}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="rounded-md text-xs h-9">
                        <SelectValue placeholder="Pilih kesulitan..." />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <span>{opt.label}</span>
                            <span className="ml-2 text-muted-foreground">
                              {opt.description}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
          className="w-full rounded-md"
        >
          {mutation.isPending ? 'Menyimpan...' : 'Simpan Soal'}
        </Button>
      </CardFooter>
    </div>
  )
}

export default FormAddQuestion