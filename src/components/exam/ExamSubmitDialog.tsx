import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'

interface ExamSubmitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: { saved: number; doubt: number; unanswered: number }
  isSubmitting: boolean
  onConfirm: () => void
}

export function ExamSubmitDialog({
  open,
  onOpenChange,
  summary,
  isSubmitting,
  onConfirm,
}: ExamSubmitDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Yakin ingin mengumpulkan ujian?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2">
                  <p className="text-lg font-bold text-emerald-600">{summary.saved}</p>
                  <p className="text-[11px] text-muted-foreground">Dijawab</p>
                </div>
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2">
                  <p className="text-lg font-bold text-amber-600">{summary.doubt}</p>
                  <p className="text-[11px] text-muted-foreground">Ragu-ragu</p>
                </div>
                <div className="rounded-xl bg-muted border p-2">
                  <p className="text-lg font-bold text-muted-foreground">{summary.unanswered}</p>
                  <p className="text-[11px] text-muted-foreground">Belum</p>
                </div>
              </div>

              {summary.doubt > 0 && (
                <p className="text-xs text-amber-600 bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20">
                  Jawaban ragu-ragu akan otomatis dikumpulkan.
                </p>
              )}
              {summary.unanswered > 0 && (
                <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 border">
                  {summary.unanswered} soal belum dijawab dan tidak akan mendapat nilai.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl" disabled={isSubmitting}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-xl bg-destructive hover:bg-destructive/90 gap-1.5"
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 size={13} className="animate-spin" />}
            Kumpulkan Ujian
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
