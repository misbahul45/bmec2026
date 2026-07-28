import { useEffect, useRef, useState } from 'react'

interface UseExamTimerOptions {
  effectiveDeadline: Date
  onExpire: () => void
}

export function useExamTimer({ effectiveDeadline, onExpire }: UseExamTimerOptions) {
  const deadlineMs = effectiveDeadline.getTime()
  const getRemainingSeconds = () =>
    Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000))

  const [remainingSeconds, setRemainingSeconds] = useState(getRemainingSeconds)
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    expiredRef.current = false

    const syncWithDeadline = () => {
      const next = Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000))
      setRemainingSeconds(next)

      if (next === 0 && !expiredRef.current) {
        expiredRef.current = true
        onExpireRef.current()
      }
    }

    syncWithDeadline()
    const interval = window.setInterval(syncWithDeadline, 1000)
    const timeout = window.setTimeout(syncWithDeadline, Math.max(0, deadlineMs - Date.now()))

    window.addEventListener('focus', syncWithDeadline)
    document.addEventListener('visibilitychange', syncWithDeadline)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
      window.removeEventListener('focus', syncWithDeadline)
      document.removeEventListener('visibilitychange', syncWithDeadline)
    }
  }, [deadlineMs])

  return { remainingSeconds }
}
