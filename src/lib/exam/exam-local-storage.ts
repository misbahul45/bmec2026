import { DOUBT_STORAGE_PREFIX } from './exam-constants'

interface DoubtEntry {
  answer: string
  questionId: string
  attemptId: string
  savedAt: string
}

function doubtKey(attemptId: string, questionId: string): string {
  return `${DOUBT_STORAGE_PREFIX}${attemptId}_${questionId}`
}

export function saveDoubt(attemptId: string, questionId: string, answer: string): void {
  if (typeof window === 'undefined') return
  const entry: DoubtEntry = { answer, questionId, attemptId, savedAt: new Date().toISOString() }
  localStorage.setItem(doubtKey(attemptId, questionId), JSON.stringify(entry))
}

export function removeDoubt(attemptId: string, questionId: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(doubtKey(attemptId, questionId))
}

export function getDoubt(attemptId: string, questionId: string): string | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(doubtKey(attemptId, questionId))
  if (!raw) return null
  try {
    const entry: DoubtEntry = JSON.parse(raw)
    return entry.answer
  } catch {
    return null
  }
}

export function getAllDoubts(attemptId: string): { questionId: string; answer: string }[] {
  if (typeof window === 'undefined') return []
  const prefix = `${DOUBT_STORAGE_PREFIX}${attemptId}_`
  const results: { questionId: string; answer: string }[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(prefix)) continue
    const raw = localStorage.getItem(key)
    if (!raw) continue
    try {
      const entry: DoubtEntry = JSON.parse(raw)
      results.push({ questionId: entry.questionId, answer: entry.answer })
    } catch {
      continue
    }
  }
  return results
}

export function clearAllDoubts(attemptId: string): void {
  if (typeof window === 'undefined') return
  const prefix = `${DOUBT_STORAGE_PREFIX}${attemptId}_`
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(prefix)) keysToRemove.push(key)
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k))
}
