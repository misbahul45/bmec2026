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
    id: 'innovation',
    step: 1,
    title: 'Innovation Platform',
    desc: 'BMEC menjadi wadah bagi pelajar dan mahasiswa di seluruh Indonesia untuk menuangkan ide, kreativitas, dan inovasi di bidang kesehatan melalui Teknik Biomedis.',
    badge: 'National Scale',
    Icon: BookOpen,
  },
  {
    id: 'competition',
    step: 2,
    title: '3 Competition Tracks',
    desc: 'Pilih jalur kompetisi sesuai minat dan kemampuanmu, mulai dari akademik, desain visual, hingga karya tulis ilmiah.',
    badge: '3 Cabang',
    Icon: Layers,
    compItems: [
      { Icon: ClipboardList, title: 'Olimpiade', desc: 'IPA + Dasar Biomedis' },
      { Icon: Star, title: 'Infografis', desc: 'Visual ide kesehatan' },
      { Icon: BookOpen, title: 'LKTI', desc: 'Karya tulis inovatif' },
    ],
  },
  {
    id: 'development',
    step: 3,
    title: 'Skill Development',
    desc: 'Asah kemampuan berpikir kritis, problem solving, komunikasi, kolaborasi tim, dan presentasi melalui proses kompetisi yang menantang.',
    badge: 'Future Skills',
    Icon: ClipboardList,
  },
  {
    id: 'experience',
    step: 4,
    title: 'National Experience',
    desc: 'Rasakan atmosfer kompetisi nasional melalui seleksi online, semifinal, final offline, webinar, serta networking dengan peserta dari seluruh Indonesia.',
    highlight: true,
    Icon: Star,
    highlightItems: [
      { Icon: ClipboardList, label: 'Seleksi Nasional', sub: 'Competitive' },
      { Icon: BookOpen, label: 'Webinar', sub: 'Insight' },
      { Icon: Star, label: 'Final Offline', sub: 'Experience' },
    ],
  },
  {
    id: 'achievement',
    step: 5,
    title: 'Achievement & Rewards',
    desc: 'Raih prestasi bergengsi dengan total hadiah puluhan juta rupiah, sertifikat nasional, medali, dan pengalaman berharga untuk masa depan akademikmu.',
    badge: 'Rp20jt+',
    Icon: Trophy,
  },
]