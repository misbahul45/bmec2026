import { useEffect, useState } from 'react'
import { verifyDevice } from '~/server/exam-attempt'
import { getOrCreateDeviceId } from '~/lib/exam/device-id'

export type DeviceVerificationState = 'verifying' | 'allowed' | 'device_locked' | 'finished' | 'not_found'

export function useDeviceVerification(attemptId: string) {
  const [state, setState] = useState<DeviceVerificationState>('verifying')

  useEffect(() => {
    const deviceId = getOrCreateDeviceId()

    verifyDevice({
      data: {
        attemptId,
        deviceId,
        ipAddress: '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      },
    })
      .then((res) => {
        const result = res.data as { allowed: boolean; reason?: string }
        if (result.allowed) {
          setState('allowed')
        } else if (result.reason === 'DEVICE_LOCKED') {
          setState('device_locked')
        } else if (result.reason === 'FINISHED') {
          setState('finished')
        } else {
          setState('not_found')
        }
      })
      .catch(() => setState('not_found'))
  }, [attemptId])

  return state
}
