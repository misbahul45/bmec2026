const STORAGE_KEY = 'exam_device_id'

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return ''

  const existing = localStorage.getItem(STORAGE_KEY)
  if (existing) return existing

  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  const id = Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  localStorage.setItem(STORAGE_KEY, id)
  return id
}

export function getDeviceId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY)
}
