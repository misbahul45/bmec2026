import { AppError } from './app-error'
import { useAppSession } from './session'

export async function requireTeamSession(expectedTeamId?: string) {
  const session = await useAppSession()
  const teamId = session.data.userId

  if (!teamId || session.data.role !== 'TEAM') {
    throw new AppError('Sesi tim tidak valid', 401)
  }

  if (expectedTeamId && expectedTeamId !== teamId) {
    throw new AppError('Akses ujian ditolak', 403)
  }

  return teamId
}
