import { FlaskConical, FileText, BarChart3 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ScoreRow {
  level: string
  correct: string
  wrong: string
  empty: string
}

export const competitions = [
  {
    id: 'olimpiade',
    title: 'Olimpiade',
    desc: 'Kompetisi nasional untuk siswa/siswi SMA sederajat yang menguji kemampuan IPA dan dasar Teknik Biomedis melalui tahapan tryout, penyisihan, semifinal, dan final.',
    image:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&q=80',
    accent: 'primary',
    Icon: FlaskConical,
    registerFees: [
      'Batch 1 · Rp90.000',
      'Batch 2 · Rp120.000',
      'Batch 3 · Rp150.000',
    ],
    prizes: [
      { rank: 1, amount: 'Rp3.000.000' },
      { rank: 2, amount: 'Rp2.000.000' },
      { rank: 3, amount: 'Rp1.500.000' },
    ],
    guideUrl: '#',
  },
  {
    id: 'lkti',
    title: 'LKTI',
    desc: 'Ajang karya tulis ilmiah bagi mahasiswa untuk menghadirkan gagasan solutif dan inovatif di bidang Teknik Biomedis melalui seleksi abstrak, full paper, semifinal, hingga final.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80',
    accent: 'secondary',
    Icon: FileText,
    registerFees: [
      'Batch 1 · Rp125.000',
      'Batch 2 · Rp150.000',
    ],
    prizes: [
      { rank: 1, amount: 'Rp4.000.000' },
      { rank: 2, amount: 'Rp3.000.000' },
      { rank: 3, amount: 'Rp2.000.000' },
    ],
    guideUrl: '#',
  },
  {
    id: 'infografis',
    title: 'Infografis',
    desc: 'Kompetisi kreatif bagi siswa/siswi SMA sederajat untuk menyampaikan ide inovasi Teknik Biomedis melalui visual yang menarik dan komunikatif.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
    accent: 'accent',
    Icon: BarChart3,
    registerFees: [
      'Batch 1 · Rp60.000',
      'Batch 2 · Rp75.000',
      'Batch 3 · Rp90.000',
    ],
    prizes: [
      { rank: 1, amount: 'Rp900.000' },
      { rank: 2, amount: 'Rp700.000' },
      { rank: 3, amount: 'Rp500.000' },
    ],
    guideUrl: '#',
  },
]

export const accentTokens = {
  primary: {
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    text: 'text-primary',
    badge: 'bg-primary/10 text-primary border-primary/20',
    bar: 'bg-primary',
    glow: 'var(--primary)',
  },
  secondary: {
    bg: 'bg-secondary/40',
    border: 'border-secondary',
    text: 'text-secondary-foreground',
    badge: 'bg-secondary/40 text-secondary-foreground border-secondary',
    bar: 'bg-secondary-foreground',
    glow: 'var(--secondary)',
  },
  accent: {
    bg: 'bg-accent/30',
    border: 'border-accent/50',
    text: 'text-accent-foreground',
    badge: 'bg-accent/30 text-accent-foreground border-accent/40',
    bar: 'bg-accent-foreground',
    glow: 'var(--accent)',
  },
}
