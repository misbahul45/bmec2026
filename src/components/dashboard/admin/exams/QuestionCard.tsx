import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '~/components/ui/alert-dialog'
import { cn } from '~/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteExamQuestion } from '~/server/exam'
import FormEditQuestion from './FormEditQuestion'
import { ExamQuestionData } from '~/schemas/exam'
import { Pencil, Trash2 } from 'lucide-react'

interface Question {
  id: string
  examId: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string
  correctAnswer: string
  score: number
}

interface Props {
  data: Question
  number: number
}

const QuestionCard = ({ data, number }: Props) => {
  const [editOpen, setEditOpen] = useState(false)
  const queryClient = useQueryClient()

  const options = [
    { key: 'A', value: data.optionA },
    { key: 'B', value: data.optionB },
    { key: 'C', value: data.optionC },
    { key: 'D', value: data.optionD },
    { key: 'E', value: data.optionE },
  ]

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return deleteExamQuestion({ data: data.id })
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Something went wrong')
    },
    onSuccess: () => {
      toast.success('Soal berhasil dihapus')
      queryClient.invalidateQueries({ queryKey: ['exam-questions', data.examId] })
    },
  })

  const defaultValues: ExamQuestionData = {
    id: data.id,
    examId: data.examId,
    question: data.question,
    optionA: data.optionA,
    optionB: data.optionB,
    optionC: data.optionC,
    optionD: data.optionD,
    optionE: data.optionE,
    correctAnswer: data.correctAnswer as ExamQuestionData['correctAnswer'],
    score: data.score,
  }

  return (
    <>
      <Card className="rounded-lg border">
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <CardTitle className="prose max-w-none flex-1">
            <div dangerouslySetInnerHTML={{ __html: `<strong>${number}.</strong> ${data.question}` }} />
          </CardTitle>

          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
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
                  <AlertDialogTitle>Hapus soal ini?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate()}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {options.map((opt) => (
            <div
              key={opt.key}
              className={cn(
                'p-2 rounded-md border prose max-w-none',
                opt.key === data.correctAnswer && 'bg-green-100 border-green-400 text-green-700'
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: `<strong>${opt.key}.</strong> ${opt.value}` }} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Soal {number}</DialogTitle>
          </DialogHeader>
          <FormEditQuestion
            examId={data.examId}
            defaultValues={defaultValues}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default QuestionCard