import { useState } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { EXAM_RULES } from './exam-rules'

interface ExamStartDialogProps {
  open: boolean
  examTitle: string
  stageName?: string
  duration: number
  totalQuestions: number
  isStarting: boolean
  errorMessage?: string | null
  onStart: () => void
  onCancel: () => void
}

export function ExamStartDialog({
  open,
  examTitle,
  stageName,
  duration,
  totalQuestions,
  isStarting,
  errorMessage,
  onStart,
  onCancel,
}: ExamStartDialogProps) {
  const [agreed, setAgreed] = useState(false)

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className="max-h-[90dvh] overflow-y-auto sm:max-w-lg p-5 sm:p-6"
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <DialogTitle className="text-base">Aturan Pengerjaan Ujian</DialogTitle>
          </div>
          <DialogDescription>
            Baca dan setujui aturan berikut sebelum memulai ujian. Timer akan
            berjalan begitu Anda menekan tombol Mulai.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-xl border bg-muted/20 p-3 text-xs">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold text-foreground">{examTitle}</span>
              {stageName && (
                <span className="text-muted-foreground">· {stageName}</span>
              )}
            </div>
            <div className="mt-1 text-muted-foreground">
              {duration} menit · {totalQuestions} soal
            </div>
          </div>

          <ol className="space-y-2.5 text-xs">
            {EXAM_RULES.map((rule) => (
              <li
                key={rule.number}
                className="rounded-xl border bg-background p-3 space-y-1.5"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    {rule.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground">
                      {rule.title}
                    </div>
                    <p className="mt-0.5 text-muted-foreground leading-relaxed">
                      {rule.description}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-destructive leading-relaxed">
                      {rule.consequence}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {errorMessage && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {errorMessage}
            </div>
          )}

          <label className="flex items-start gap-2 rounded-xl border bg-muted/30 p-3 cursor-pointer text-xs">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              disabled={isStarting}
              aria-label="Saya sudah membaca dan menyetujui semua aturan"
            />
            <span className="text-foreground leading-relaxed">
              Saya sudah membaca dan menyetujui semua aturan pengerjaan ujian
              di atas.
            </span>
          </label>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isStarting}
            className="rounded-xl"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onStart}
            disabled={!agreed || isStarting}
            className="rounded-xl gap-1.5"
          >
            {isStarting && <Loader2 className="size-3.5 animate-spin" />}
            Mulai Ujian
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
