import { MonitorX } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Link } from '@tanstack/react-router'

export function ExamDeviceLockScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <MonitorX size={28} className="text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-lg font-bold">Akses Perangkat Ditolak</h1>
          <p className="text-sm text-muted-foreground">
            Ujian ini sudah dimulai dari perangkat lain. Setiap peserta hanya dapat mengerjakan dari satu perangkat.
          </p>
        </div>
        <div className="rounded-xl bg-destructive/5 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          Percobaan akses ini telah dicatat dan dilaporkan ke panitia.
        </div>
        <Button variant="outline" size="sm" className="rounded-xl" asChild>
          <Link to="/dashboard/team">Kembali ke Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
