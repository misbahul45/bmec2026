import { FlaskConical, FileText, BarChart3 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ScoreRow {
  level: string
  correct: string
  wrong: string
  empty: string
}

export interface Competition {
  id: string
  index: number
  label: string
  title: string
  subtitle: string
  desc: string
  image: string
  accent: 'primary' | 'secondary' | 'accent'
  Icon: LucideIcon
  tags: string[]
  bullets: string[]
  scoreTable?: ScoreRow[]
  stages?: string[]
  subtopics?: string[]
  prize: string
  benefits: string[]
}

export const competitions: Competition[] = [
  {
    id: 'olimpiade',
    index: 0,
    label: 'Process 01',
    title: 'Olimpiade',
    subtitle: 'Multiple Choice · 100 Soal · Sistem Bobot',
    desc: 'Kompetisi berbasis MCQ yang menguji kemampuan sains dasar dan Teknik Biomedis. Soal eksklusif dari dosen UNAIR dengan variasi tipe dan tingkat kesulitan.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&q=80',
    accent: 'primary',
    Icon: FlaskConical,
    tags: ['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Teknik Biomedis'],
    bullets: [
      '100 soal MCQ dengan 3 tingkat kesulitan',
      'Durasi 120 menit · Sesi 08.00–13.00 WIB',
      '2× Tryout eksklusif sebelum penyisihan',
      'Modul pembelajaran Teknik Biomedis',
      'Soal variatif: MCQ, esai, sebab-akibat',
      'Sertifikat untuk SNBP',
    ],
    scoreTable: [
      { level: 'Mudah', correct: '+2', wrong: '-1', empty: '0' },
      { level: 'Sedang', correct: '+4', wrong: '-2', empty: '-1' },
      { level: 'Sulit', correct: '+6', wrong: '-3', empty: '-2' },
    ],
    prize: 'Rp 10.000.000',
    benefits: ['2× Tryout eksklusif', 'Modul biomedis', 'Soal dari dosen', 'Sertifikat SNBP'],
  },
  {
    id: 'lkti',
    index: 1,
    label: 'Process 02',
    title: 'LKTI',
    subtitle: 'Karya Tulis Ilmiah · Inovasi Biomedis',
    desc: 'Kompetisi karya tulis ilmiah yang mendorong peserta mengembangkan ide inovatif di bidang Teknik Biomedis. Dari penyisihan abstrak hingga presentasi final.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80',
    accent: 'secondary',
    Icon: FileText,
    tags: ['Inovasi Digital', 'Perangkat Medis', 'Biomaterial'],
    bullets: [
      'Tema: Transformasi Inovatif Teknik Biomedis Berbasis Keberlanjutan',
      'Tahapan: Abstrak → Full Paper → Semifinal → Final',
      'Webinar pengembangan ide & inovasi',
      'Bimbingan penulisan karya ilmiah',
      'Presentasi offline di final',
      'Sertifikat untuk SNBP',
    ],
    subtopics: [
      'Inovasi Digital Kesehatan',
      'Perangkat Medis (Hardware)',
      'Biomaterial & Rekayasa Material',
    ],
    stages: ['Abstrak', 'Full Paper', 'Semifinal', 'Final'],
    prize: 'Rp 8.000.000',
    benefits: ['Webinar pengembangan ide', 'Bimbingan karya ilmiah', 'Sertifikat SNBP'],
  },
  {
    id: 'infografis',
    index: 2,
    label: 'Process 03',
    title: 'Infografis',
    subtitle: 'Visualisasi Kreatif · Edukasi Biomedis',
    desc: 'Kompetisi visual untuk menyampaikan ide dan informasi Teknik Biomedis secara kreatif dan komunikatif. Ekspresikan inovasimu lewat desain yang berdampak.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
    accent: 'accent',
    Icon: BarChart3,
    tags: ['Desain Visual', 'Edukasi', 'Inovasi'],
    bullets: [
      'Tema sama dengan LKTI (konsistensi storytelling)',
      'Tahapan: Penyisihan → Showcase → Final & Awarding',
      'Webinar gratis untuk peserta',
      'Feedback desain dari juri profesional',
      'Showcase karya di event final',
      'Sertifikat untuk SNBP',
    ],
    stages: ['Penyisihan', 'Showcase', 'Final & Awarding'],
    prize: 'Rp 1.500.000',
    benefits: ['Webinar gratis', 'Feedback dari juri', 'Sertifikat SNBP'],
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
