import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { cn } from '~/lib/utils'
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteExamQuestion } from '~/server/exam'
import FormEditQuestion from './FormEditQuestion'
import {
  ExamQuestionFormData,
} from '~/schemas/exam'
import {
  Pencil,
  Trash2,
} from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { ExamRichText } from '~/components/exam/ExamRichText'
import {
  examOptionLabelClassName,
  examOptionSurfaceClassName,
  examQuestionSurfaceClassName,
} from '~/components/exam/exam-content.styles'

interface Question {
  id: string
  examId: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string
  correctAnswer:
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
  difficulty:
    | 'EASY'
    | 'MEDIUM'
    | 'HARD'
  correctScore: number
  wrongScore: number
  emptyScore: number
  order: number
}

interface Props {
  data: Question
  number: number
}

const difficultyLabel = {
  EASY: {
    label: 'Mudah',
  },
  MEDIUM: {
    label: 'Sedang',
  },
  HARD: {
    label: 'Sulit',
  },
}

const QuestionCard = ({
  data,
  number,
}: Props) => {
  const [
    editOpen,
    setEditOpen,
  ] = useState(false)

  const queryClient =
    useQueryClient()

  const options = [
    {
      key: 'A',
      value:
        data.optionA,
    },
    {
      key: 'B',
      value:
        data.optionB,
    },
    {
      key: 'C',
      value:
        data.optionC,
    },
    {
      key: 'D',
      value:
        data.optionD,
    },
    {
      key: 'E',
      value:
        data.optionE,
    },
  ] as const

  const deleteMutation =
    useMutation({
      mutationFn:
        async () => {
          return deleteExamQuestion(
            {
              data:
                data.id,
            }
          )
        },

      onError: (
        error: any
      ) => {
        toast.error(
          error?.message ??
            'Something went wrong'
        )
      },

      onSuccess:
        async () => {
          toast.success(
            'Soal berhasil dihapus'
          )

          await queryClient.invalidateQueries(
            {
              queryKey:
                [
                  'exam-questions',
                  data.examId,
                ],
            }
          )
        },
    })

  const defaultValues: ExamQuestionFormData =
    {
      id: data.id,
      examId:
        data.examId,
      question:
        data.question,

      optionA:
        data.optionA,
      optionB:
        data.optionB,
      optionC:
        data.optionC,
      optionD:
        data.optionD,
      optionE:
        data.optionE,

      correctAnswer:
        data.correctAnswer,

      difficulty:
        data.difficulty,

      order:
        data.order,
    }

  const difficultyInfo =
    difficultyLabel[
      data.difficulty
    ]

  return (
    <div className='w-full'>
      <Card className="rounded-lg border">
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Soal {number}</p>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <Badge variant={data.difficulty==='HARD'?'destructive':data.difficulty=='MEDIUM'?'secondary':'default'}>
                  {
                    difficultyInfo.label
                  }
                </Badge>
                <Badge variant={'outline'}>
                  {data.correctScore > 0 ? '+' : ''}{data.correctScore} / {data.wrongScore} / {data.emptyScore}
                </Badge>
            </div>
          </div>

          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                setEditOpen(
                  true
                )
              }
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger
                asChild
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Hapus soal
                    ini?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    Tindakan
                    ini tidak
                    dapat
                    dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Batal
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() =>
                      deleteMutation.mutate()
                    }
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {deleteMutation.isPending
                      ? 'Menghapus...'
                      : 'Hapus'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className={examQuestionSurfaceClassName}>
            <ExamRichText content={data.question} />
          </div>

          {options.map(
            (opt) => (
              <div
                key={
                  opt.key
                }
                className={cn(
                  examOptionSurfaceClassName,
                  'border-border bg-background',
                  opt.key ===
                    data.correctAnswer &&
                    'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                )}
              >
                <span
                  className={cn(
                    examOptionLabelClassName,
                    opt.key === data.correctAnswer
                      ? 'bg-emerald-500 text-white'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {opt.key}
                </span>

                <ExamRichText content={opt.value} className="min-w-0 flex-1 pt-0.5" />
              </div>
            )
          )}
        </CardContent>
      </Card>

      <Dialog
        open={editOpen}
        onOpenChange={
          setEditOpen
        }
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Soal{' '}
              {number}
            </DialogTitle>
          </DialogHeader>

          <FormEditQuestion
            examId={
              data.examId
            }
            defaultValues={
              defaultValues
            }
            onSuccess={() =>
              setEditOpen(
                false
              )
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuestionCard
