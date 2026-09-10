export type ExamErrorCode =
  | 'NOT_ASSIGNED_TO_SESSION'
  | 'SESSION_NOT_STARTED'
  | 'SESSION_ENDED'
  | 'EXAM_NOT_IN_WINDOW'
  | 'EXAM_ALREADY_FINISHED'
  | 'EXAM_NOT_FOUND'
  | 'ATTEMPT_NOT_FOUND'
  | 'ATTEMPT_ACCESS_DENIED'
  | 'MULTIPLE_DEVICE_DETECTED'
  | 'TIME_EXPIRED'
  | 'INTERNAL_ERROR'

export type ExamErrorInfo = {
  title: string
  description: string
  action?: {
    label: string
    to?: string
  }
  tone: 'info' | 'warning' | 'blocked'
}

const WIB_TZ = 'Asia/Jakarta'

function formatWibLong(iso: string | Date) {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return d.toLocaleString('id-ID', {
    timeZone: WIB_TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getExamErrorInfo(
  code: string | undefined,
  meta?: Record<string, unknown>,
): ExamErrorInfo {
  switch (code) {
    case 'NOT_ASSIGNED_TO_SESSION':
      return {
        title: 'Tim Belum Dijadwalkan ke Sesi',
        description:
          'Tim kamu belum di-assign ke salah satu sesi ujian olimpiade. Hubungi admin untuk penjadwalan sesi.',
        action: { label: 'Kembali ke Dashboard', to: '/dashboard/team' },
        tone: 'info',
      }
    case 'SESSION_NOT_STARTED':
      return {
        title: 'Sesi Ujian Belum Dimulai',
        description: meta?.sessionStart
          ? `Sesi kamu akan dimulai pada ${formatWibLong(String(meta.sessionStart))} WIB. Mohon tunggu dan refresh halaman ini saat sesi dimulai.`
          : 'Sesi kamu belum dimulai. Mohon tunggu hingga waktu sesi yang dijadwalkan.',
        action: { label: 'Refresh Halaman' },
        tone: 'info',
      }
    case 'SESSION_ENDED':
      return {
        title: 'Sesi Ujian Telah Berakhir',
        description: meta?.sessionEnd
          ? `Sesi kamu berakhir pada ${formatWibLong(String(meta.sessionEnd))} WIB. Kamu tidak dapat lagi memulai ujian untuk sesi ini.`
          : 'Sesi ujian yang dijadwalkan untuk tim kamu sudah berakhir.',
        action: { label: 'Kembali ke Dashboard', to: '/dashboard/team' },
        tone: 'blocked',
      }
    case 'EXAM_NOT_IN_WINDOW':
      return {
        title: 'Ujian Belum Berlangsung',
        description: meta?.startDate && meta?.endDate
          ? `Ujian berlangsung dari ${formatWibLong(String(meta.startDate))} hingga ${formatWibLong(String(meta.endDate))} WIB.`
          : 'Ujian belum masuk periode aktif. Periksa jadwal pada dashboard tim.',
        action: { label: 'Kembali ke Dashboard', to: '/dashboard/team' },
        tone: 'info',
      }
    case 'EXAM_ALREADY_FINISHED':
      return {
        title: 'Ujian Sudah Selesai',
        description: 'Kamu sudah pernah mengerjakan dan menyelesaikan ujian ini.',
        action: { label: 'Kembali ke Dashboard', to: '/dashboard/team' },
        tone: 'blocked',
      }
    case 'EXAM_NOT_FOUND':
      return {
        title: 'Ujian Tidak Ditemukan',
        description: 'Ujian ini tidak tersedia. Periksa link atau hubungi panitia.',
        action: { label: 'Kembali ke Dashboard', to: '/dashboard/team' },
        tone: 'blocked',
      }
    case 'ATTEMPT_NOT_FOUND':
      return {
        title: 'Sesi Ujian Belum Dimulai',
        description: 'Kamu belum memulai ujian ini. Buka dari halaman dashboard tim untuk memulai.',
        action: { label: 'Buka Dashboard Tim', to: '/dashboard/team' },
        tone: 'info',
      }
    case 'ATTEMPT_ACCESS_DENIED':
      return {
        title: 'Akses Ditolak',
        description: 'Akun ini tidak memiliki akses ke sesi ujian tersebut.',
        action: { label: 'Kembali ke Dashboard', to: '/dashboard/team' },
        tone: 'blocked',
      }
    case 'MULTIPLE_DEVICE_DETECTED':
      return {
        title: 'Perangkat Berbeda Terdeteksi',
        description:
          'Ujian ini sedang berjalan di perangkat lain. Jika ini bukan kamu, hubungi admin segera untuk reset perangkat.',
        action: { label: 'Kembali ke Dashboard', to: '/dashboard/team' },
        tone: 'blocked',
      }
    case 'TIME_EXPIRED':
      return {
        title: 'Waktu Ujian Habis',
        description: 'Waktu pengerjaan ujian telah habis. Ujian otomatis diselesaikan.',
        action: { label: 'Kembali ke Dashboard', to: '/dashboard/team' },
        tone: 'blocked',
      }
    default:
      return {
        title: 'Ujian Tidak Dapat Dibuka',
        description: 'Terjadi kesalahan saat membuka ujian. Silakan coba lagi atau hubungi panitia.',
        action: { label: 'Kembali ke Dashboard', to: '/dashboard/team' },
        tone: 'warning',
      }
  }
}
