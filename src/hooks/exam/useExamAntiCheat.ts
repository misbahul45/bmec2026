import { useEffect, useRef } from 'react'
import { ExamEventType } from '@prisma/client'
import { toast } from 'sonner'
import { logExamEvent } from '~/server/exam-attempt'

interface UseExamAntiCheatOptions {
  attemptId: string
  isFinished: boolean
  enabled: boolean
}

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number,
): T {
  let timer: ReturnType<typeof setTimeout>

  return ((...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as T
}

export function useExamAntiCheat({
  attemptId,
  isFinished,
  enabled = true,
}: UseExamAntiCheatOptions) {
  const isFinishedRef = useRef(isFinished)
  isFinishedRef.current = isFinished

  const lastTabSwitchRef = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const showWarning = (message: string) => {
      toast.error('⚠️ Peringatan Ujian', {
        description: message,
        duration: 5000,
      })
    }

    const log = (
      type: ExamEventType,
      metadata?: Record<string, unknown>,
    ) => {
      if (isFinishedRef.current) return

      logExamEvent({
        data: {
          attemptId,
          type,
          metadata,
        },
      })

      switch (type) {
        case ExamEventType.TAB_SWITCH:
          showWarning(
            'Terdeteksi berpindah tab/browser. Aktivitas ini telah tercatat.',
          )
          break

        case ExamEventType.WINDOW_BLUR:
          showWarning(
            'Jendela ujian tidak aktif. Mohon tetap fokus pada halaman ujian.',
          )
          break

        case ExamEventType.WINDOW_FOCUS:
          toast.success('Anda kembali ke halaman ujian.', {
            duration: 3000,
          })
          break

        case ExamEventType.COPY:
          showWarning('Menyalin jawaban tidak diperbolehkan.')
          break

        case ExamEventType.PASTE:
          showWarning('Menempel jawaban tidak diperbolehkan.')
          break

        case ExamEventType.FULLSCREEN_EXIT:
          showWarning(
            'Anda keluar dari mode fullscreen. Mohon kembali ke mode ujian.',
          )
          break

        case ExamEventType.DEVTOOLS_OPEN:
          showWarning(
            'Developer tools terdeteksi. Aktivitas ini telah dicatat.',
          )
          break
      }
    }

    const debouncedBlur = debounce(
      () => log(ExamEventType.WINDOW_BLUR),
      2000,
    )

    const debouncedFocus = debounce(
      () => log(ExamEventType.WINDOW_FOCUS),
      2000,
    )

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const now = Date.now()

        if (now - lastTabSwitchRef.current > 5000) {
          lastTabSwitchRef.current = now

          log(ExamEventType.TAB_SWITCH, {
            url: window.location.href,
          })
        }
      } else {
        debouncedFocus()
      }
    }

    const handleBlur = () => {
      debouncedBlur()
    }

    const handleCopy = () => {
      log(ExamEventType.COPY)
    }

    const handlePaste = () => {
      log(ExamEventType.PASTE)
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        log(ExamEventType.FULLSCREEN_EXIT)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const isDevTools =
        e.key === 'F12' ||
        (e.ctrlKey &&
          e.shiftKey &&
          ['I', 'J', 'C'].includes(e.key.toUpperCase()))

      if (isDevTools) {
        e.preventDefault()
        log(ExamEventType.DEVTOOLS_OPEN)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('paste', handlePaste)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('paste', handlePaste)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [attemptId, enabled])
}