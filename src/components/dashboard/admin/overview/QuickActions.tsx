import { Link } from '@tanstack/react-router'
import { ClipboardCheck, FileCheck, BookOpen, ShieldAlert } from 'lucide-react'

const ACTIONS = [
  { label: 'Approve Registrasi', icon: ClipboardCheck, to: '/dashboard/admin/teams' },
  { label: 'Review Submission', icon: FileCheck, to: '/dashboard/admin/submissions' },
  { label: 'Monitor Exam', icon: BookOpen, to: '/dashboard/admin/exams' },
  { label: 'Cek Kecurangan', icon: ShieldAlert, to: '/dashboard/admin/exams' },
] as const

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ACTIONS.map(({ label, icon: Icon, to }) => (
        <Link
          key={label}
          to={to}
          className="border rounded-xl p-4 bg-card flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-colors duration-200 text-center"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon size={16} className="text-primary" />
          </div>
          <span className="text-xs font-medium text-foreground">{label}</span>
        </Link>
      ))}
    </div>
  )
}
