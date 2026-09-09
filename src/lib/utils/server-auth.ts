import { AppError } from './app-error'
import { useAppSession } from './session'

export async function requireTeamSession(expectedTeamId?: string) {
  const session = await useAppSession()
  const teamId = session.data.userId

  if (!teamId || session.data.role !== 'TEAM') {
    throw new AppError('Sesi tim tidak valid atau telah kedaluwarsa. Silakan login kembali sebagai tim.', 401, 'INVALID_TEAM_SESSION')
  }

  if (expectedTeamId && expectedTeamId !== teamId) {
    throw new AppError('Akses ditolak: Anda tidak memiliki izin untuk mengakses data tim lain.', 403, 'TEAM_ACCESS_DENIED')
  }

  return teamId
}

export async function requireAdminSession() {
  const session = await useAppSession()
  const adminId = session.data.userId

  if (!adminId || session.data.role !== 'ADMIN') {
    throw new AppError('Sesi admin tidak valid atau telah kedaluwarsa. Silakan login kembali sebagai admin.', 401, 'INVALID_ADMIN_SESSION')
  }

  return adminId
}
