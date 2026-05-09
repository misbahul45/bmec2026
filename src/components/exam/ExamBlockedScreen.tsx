import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Link } from '@tanstack/react-router'
import { DeviceVerificationState } from '~/hooks/exam/useDeviceVerification'

interface ExamBlockedScreenProps {
  state: DeviceVerificationState
}

export function ExamBlockedScreen({ state }: ExamBlockedScreenProps) {
  if (state === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Memverifikasi perangkat...</span>
      </div>
    )
  }

  if (state === 'finished') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
            <ShieldCheck size={28} className="text-emerald-600" />
          </div>
          <h1 className="text-lg font-bold">Ujian Sudah Selesai</h1>
          <p className="text-sm text-muted-foreground">Kamu sudah menyelesaikan ujian ini.</p>
          <Button variant="outline" size="sm" className="rounded-xl" asChild>
            <Link to="/dashboard/team">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
          <AlertTriangle size={28} className="text-amber-600" />
        </div>
        <h1 className="text-lg font-bold">Sesi Tidak Ditemukan</h1>
        <p className="text-sm text-muted-foreground">Sesi ujian tidak ditemukan. Pastikan kamu sudah memulai ujian dari halaman dashboard.</p>
        <Button variant="outline" size="sm" className="rounded-xl" asChild>
          <Link to="/dashboard/team">Kembali ke Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
