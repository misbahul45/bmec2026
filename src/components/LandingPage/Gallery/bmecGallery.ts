export interface GalleryItem {
  id: string
  title: string
  category: string
  description: string
  image: string
}

export const bmecGallery: GalleryItem[] = [
  {
    id: 'opening',
    title: 'Opening Ceremony',
    category: 'Event',
    description: 'Pembukaan resmi BMEC 2025 oleh Ketua HMTB dan jajaran dosen Teknik Biomedis UNAIR.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=85',
  },
  {
    id: 'olimpiade',
    title: 'Olimpiade Competition',
    category: 'Olimpiade',
    description: 'Peserta mengerjakan 100 soal MCQ sains dan Teknik Biomedis dalam sesi penyisihan.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1400&q=85',
  },
  {
    id: 'lkti',
    title: 'LKTI Presentation',
    category: 'LKTI',
    description: 'Finalis LKTI mempresentasikan karya ilmiah inovatif di hadapan dewan juri.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&q=85',
  },
  {
    id: 'infografis',
    title: 'Infographic Design',
    category: 'Infografis',
    description: 'Karya infografis peserta dipamerkan dan dinilai oleh juri desain dan biomedis.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
  },
  {
    id: 'webinar',
    title: 'Webinar Session',
    category: 'Edukasi',
    description: 'Sesi webinar interaktif bersama narasumber dari akademik dan industri kesehatan.',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1400&q=85',
  },
  {
    id: 'tryout',
    title: 'Tryout Event',
    category: 'Olimpiade',
    description: 'Dua sesi tryout eksklusif untuk mempersiapkan peserta menghadapi penyisihan.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1400&q=85',
  },
  {
    id: 'final',
    title: 'Final Stage',
    category: 'Final',
    description: 'Babak final BMEC 2025 — momen puncak kompetisi tingkat nasional.',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1400&q=85',
  },
  {
    id: 'awarding',
    title: 'Awarding Night',
    category: 'Event',
    description: 'Malam penghargaan para pemenang BMEC 2025 dengan total hadiah belasan juta rupiah.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1400&q=85',
  },
]
