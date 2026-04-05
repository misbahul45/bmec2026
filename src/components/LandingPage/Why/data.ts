import { BookOpen, ClipboardList, Star, Trophy, Layers } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface HighlightItem {
  Icon: LucideIcon
  label: string
  sub: string
}

export interface CompItem {
  Icon: LucideIcon
  title: string
  desc: string
}

export interface WhyNode {
  id: string
  step: number
  title: string
  desc: string
  badge?: string
  highlight?: boolean
  Icon: LucideIcon
  highlightItems?: HighlightItem[]
  compItems?: CompItem[]
}

export const nodes: WhyNode[] = [
  {
    id: 'discovery',
    step: 1,
    title: 'Discovery',
    desc: 'Kenali dunia Teknik Biomedis melalui 100 soal yang mencakup Matematika, Kimia, Fisika, Biologi, dan dasar Teknik Biomedis.',
    badge: '100+ Soal',
    Icon: BookOpen,
  },
  {
    id: 'skill',
    step: 2,
    title: 'Skill Development',
    desc: 'Tingkatkan kemampuan problem solving dan strategi melalui sistem soal dengan tingkat kesulitan berbeda.',
    badge: '3 Level',
    Icon: ClipboardList,
  },
  {
    id: 'experience',
    step: 3,
    title: 'Real Experience',
    desc: 'Rasakan pengalaman kompetisi nyata melalui sistem seleksi, tryout, dan penilaian profesional seperti dunia akademik.',
    highlight: true,
    Icon: Star,
    highlightItems: [
      { Icon: ClipboardList, label: 'Tryout 2x', sub: 'Preparation' },
      { Icon: BookOpen, label: 'Modul Pembelajaran', sub: 'Learning' },
      { Icon: Star, label: 'Soal Eksklusif', sub: 'Challenge' },
    ],
  },
  {
    id: 'achievement',
    step: 4,
    title: 'Achievement',
    desc: 'Raih prestasi nasional dengan total hadiah belasan juta rupiah serta sertifikat untuk SNBP.',
    badge: 'Rp10jt+',
    Icon: Trophy,
  },
  {
    id: 'competition',
    step: 5,
    title: 'Competition Path',
    desc: 'BMEC menyediakan 3 jalur kompetisi utama yang dapat disesuaikan dengan minat dan kemampuanmu.',
    Icon: Layers,
    compItems: [
      { Icon: ClipboardList, title: 'Olimpiade', desc: 'Soal MCQ + strategi' },
      { Icon: BookOpen, title: 'LKTI', desc: 'Karya tulis inovatif' },
      { Icon: Star, title: 'Infografis', desc: 'Visualisasi ide kreatif' },
    ],
  },
]
