import type { LucideIcon } from 'lucide-react'
import { Medal, FileText, Image } from 'lucide-react'

export interface TimelineEvent {
  date: string
  label: string
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
        date: '25 Mei - 24 Juni',
        label: 'Batch 1 Registration',
      },
      {
        date: '1 Juli - 31 Juli',
        label: 'Batch 2 Registration',
      },
      {
        date: '3 Agustus - 4 September',
        label: 'Batch 3 Registration',
      },
      {
        date: '1 Agustus',
        label: 'Tryout 1',
      },
      {
        date: '6 September',
        label: 'Tryout 2',
      },
      {
        date: '12 September',
        label: 'Babak Penyisihan',
      },
      {
        date: '17 Oktober',
        label: 'Webinar & Pengumuman Semifinalis',
      },
      {
        date: '24 Oktober',
        label: 'Technical Meeting Semifinal',
      },
      {
        date: '7 November',
        label: 'Semifinal',
      },
      {
        date: '8 November',
        label: 'Grand Final',
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
        label: 'Open Submit Abstract',
      },
      {
        date: '15 Juli',
        label: 'Pengumuman Lolos Abstract',
      },
      {
        date: '16 Juli - 31 Juli',
        label: 'Submit Full Paper Batch 1',
      },
      {
        date: '3 Agustus - 4 September',
        label: 'Submit Full Paper Batch 2',
      },
      {
        date: '17 Oktober',
        label: 'Webinar & Pengumuman Finalis',
      },
      {
        date: '24 Oktober',
        label: 'Technical Meeting Semifinal',
      },
      {
        date: '7 November',
        label: 'Semifinal',
      },
      {
        date: '8 November',
        label: 'Grand Final',
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
        date: '25 Mei - 24 Juni',
        label: 'Batch 1 Registration',
      },
      {
        date: '1 Juli - 31 Juli',
        label: 'Batch 2 Registration',
      },
      {
        date: '3 Agustus - 4 September',
        label: 'Batch 3 Registration',
      },
      {
        date: '17 Oktober',
        label: 'Webinar & Pengumuman Finalis',
      },
      {
        date: '19 Oktober - 2 November',
        label: 'Upload Feed Finalis',
      },
      {
        date: '24 Oktober',
        label: 'Technical Meeting Semifinal',
      },
      {
        date: '7 November',
        label: 'Semifinal',
      },
      {
        date: '8 November',
        label: 'Grand Final',
      },
    ],
  },
]
export const phaseColors = {
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
