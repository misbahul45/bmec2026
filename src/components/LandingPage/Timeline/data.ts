import type { LucideIcon } from 'lucide-react'
import { Medal, FileText, Image } from 'lucide-react'

export interface TimelineEvent {
  date: string
  label: string
  phase: 'open' | 'submit' | 'select' | 'final'
}

export interface TimelineProcess {
  id: string
  processNum: number
  title: string
  shortTitle: string
  Icon: LucideIcon
  accent: 'primary' | 'secondary' | 'accent'
  events: TimelineEvent[]
}

export const processes: TimelineProcess[] = [
  {
    id: 'olimpiade',
    processNum: 1,
    title: 'Olimpiade',
    shortTitle: 'Olimpiade',
    Icon: Medal,
    accent: 'primary',
    events: [
      { date: '20 Feb 2026', label: 'Pendaftaran Batch 1', phase: 'open' },
      { date: '01 Mar 2026', label: 'Pendaftaran Batch 2', phase: 'open' },
      { date: '15 Mar 2026', label: 'Tryout 1', phase: 'select' },
      { date: '25 Mar 2026', label: 'Tryout 2', phase: 'select' },
      { date: '05 Apr 2026', label: 'Seleksi / Penyisihan', phase: 'final' },
    ],
  },
  {
    id: 'lkti',
    processNum: 2,
    title: 'LKTI',
    shortTitle: 'LKTI',
    Icon: FileText,
    accent: 'secondary',
    events: [
      { date: '10 Apr 2026', label: 'Pendaftaran LKTI', phase: 'open' },
      { date: '20 Mei 2026', label: 'Pengumpulan Karya', phase: 'submit' },
      { date: '10 Jun 2026', label: 'Penilaian Juri', phase: 'select' },
      { date: '18 Sep 2026', label: 'Semifinal (Offline)', phase: 'select' },
      { date: '02 Okt 2026', label: 'Final (Offline)', phase: 'final' },
    ],
  },
  {
    id: 'infografis',
    processNum: 3,
    title: 'Infografis',
    shortTitle: 'Infografis',
    Icon: Image,
    accent: 'accent',
    events: [
      { date: '15 Apr 2026', label: 'Pendaftaran', phase: 'open' },
      { date: '25 Mei 2026', label: 'Submit Karya', phase: 'submit' },
      { date: '15 Jun 2026', label: 'Kurasi', phase: 'select' },
      { date: '18 Sep 2026', label: 'Showcase', phase: 'select' },
      { date: '02 Okt 2026', label: 'Final & Awarding', phase: 'final' },
    ],
  },
]

export const phaseColors: Record<TimelineEvent['phase'], string> = {
  open: 'bg-primary/10 text-primary border-primary/20',
  submit: 'bg-secondary/50 text-secondary-foreground border-secondary',
  select: 'bg-accent/40 text-accent-foreground border-accent/40',
  final: 'bg-foreground/10 text-foreground border-foreground/20',
}

export const accentMap = {
  primary: {
    dot: 'bg-primary',
    border: 'border-primary/30',
    iconBg: 'bg-primary/10',
    iconText: 'text-primary',
    badge: 'bg-primary/10 text-primary border-primary/20',
    line: 'bg-primary/20',
  },
  secondary: {
    dot: 'bg-secondary-foreground',
    border: 'border-secondary',
    iconBg: 'bg-secondary/40',
    iconText: 'text-secondary-foreground',
    badge: 'bg-secondary/40 text-secondary-foreground border-secondary',
    line: 'bg-secondary/40',
  },
  accent: {
    dot: 'bg-accent-foreground',
    border: 'border-accent/50',
    iconBg: 'bg-accent/30',
    iconText: 'text-accent-foreground',
    badge: 'bg-accent/30 text-accent-foreground border-accent/40',
    line: 'bg-accent/30',
  },
}
