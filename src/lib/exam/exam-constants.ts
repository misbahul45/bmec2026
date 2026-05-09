import { ExamEventType } from '@prisma/client'

export const DOUBT_STORAGE_PREFIX = 'exam_doubt_'
export const DEVICE_ID_STORAGE_KEY = 'exam_device_id'
export const TIMER_WARNING_THRESHOLD = 300
export const TIMER_CRITICAL_THRESHOLD = 60

export const SUSPICIOUS_WEIGHTS: Record<ExamEventType, number> = {
  TAB_SWITCH: 20,
  WINDOW_BLUR: 10,
  WINDOW_FOCUS: 0,
  COPY: 15,
  PASTE: 15,
  FULLSCREEN_EXIT: 25,
  MULTIPLE_LOGIN: 50,
  NETWORK_CHANGE: 5,
  DEVTOOLS_OPEN: 40,
}
