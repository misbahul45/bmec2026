import { useEffect, useRef, useState } from 'react'

interface UseExamTimerOptions {
  effectiveDeadline: Date
  onExpire: () => void
}

export function useExamTimer({ effectiveDeadline, onExpire }: UseExamTimerOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Math.max(0, Math.floor((effectiveDeadline.getTime() - Date.now()) / 1000)),
  )
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (remainingSeconds <= 0 && !expiredRef.current) {
      expiredRef.current = true
      onExpireRef.current()
      return
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = Math.max(0, prev - 1)
        if (next === 0 && !expiredRef.current) {
          expiredRef.current = true
          setTimeout(() => onExpireRef.current(), 0)
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return { remainingSeconds }
}
