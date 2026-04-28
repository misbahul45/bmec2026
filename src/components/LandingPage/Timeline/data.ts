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
      {
        date: '25 Mei - 4 Sep',
        label: 'Registration',
        phase: 'open',
      },
      {
        date: '1 Ags - 6 Sep',
        label: 'Tryout Period',
        phase: 'submit',
      },
      {
        date: '12 September',
        label: 'Babak Penyisihan',
        phase: 'select',
      },
      {
        date: '17 Oktober',
        label: 'Webinar & Pengumuman Semifinalis',
        phase: 'select',
      },
      {
        date: '24 Oktober',
        label: 'Technical Meeting',
        phase: 'select',
      },
      {
        date: '7 November',
        label: 'Semifinal',
        phase: 'final',
      },
      {
        date: '8 November',
        label: 'Grand Final',
        phase: 'final',
      },
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
      {
        date: '25 Mei - 24 Juli',
        label: 'Submit Abstract',
        phase: 'open',
      },
      {
        date: '15 Juli',
        label: 'Pengumuman Lolos Abstract',
        phase: 'select',
      },
      {
        date: '16 Juli - 4 Sep',
        label: 'Submit Full Paper',
        phase: 'submit',
      },
      {
        date: '17 Oktober',
        label: 'Webinar & Pengumuman',
        phase: 'select',
      },
      {
        date: '24 Oktober',
        label: 'Technical Meeting',
        phase: 'select',
      },
      {
        date: '7 November',
        label: 'Semifinal',
        phase: 'final',
      },
      {
        date: '8 November',
        label: 'Grand Final',
        phase: 'final',
      },
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
      {
        date: '25 Mei - 4 Sep',
        label: 'Registration',
        phase: 'open',
      },
      {
        date: '17 Oktober',
        label: 'Webinar & Pengumuman Finalis',
        phase: 'select',
      },
      {
        date: '19 Okt - 2 Nov',
        label: 'Upload Feed Finalis',
        phase: 'submit',
      },
      {
        date: '24 Oktober',
        label: 'Technical Meeting',
        phase: 'select',
      },
      {
        date: '7 November',
        label: 'Semifinal',
        phase: 'final',
      },
      {
        date: '8 November',
        label: 'Grand Final',
        phase: 'final',
      },
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
