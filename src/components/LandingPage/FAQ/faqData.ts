export interface FAQItem {
  id: string
  question: string
  answer: string
}

export const faqData: FAQItem[] = [
  {
    id: 'who',
    question: 'Siapa yang bisa mengikuti BMEC 2026?',
    answer: 'BMEC 2026 terbuka untuk seluruh siswa SMA/SMK/MA sederajat di seluruh Indonesia. Tidak ada batasan wilayah — selama kamu masih berstatus pelajar aktif, kamu bisa mendaftar.',
  },
  {
    id: 'categories',
    question: 'Apa saja cabang lomba yang tersedia?',
    answer: 'BMEC 2026 memiliki tiga cabang lomba: Olimpiade (MCQ sains & Teknik Biomedis), LKTI (Lomba Karya Tulis Ilmiah), dan Infografis (visualisasi ide biomedis). Kamu bisa mendaftar lebih dari satu cabang.',
  },
  {
    id: 'batch',
    question: 'Bagaimana sistem pendaftaran batch?',
    answer: 'Pendaftaran dibuka dalam 3 batch dengan harga yang berbeda. Batch 1 (30 Mei–26 Juni), Batch 2 (4 Juli–7 Agustus), Batch 3 (8–28 Agustus). Daftar lebih awal untuk mendapatkan harga terbaik.',
  },
  {
    id: 'tryout',
    question: 'Apakah tryout wajib diikuti?',
    answer: 'Tryout tidak wajib, namun sangat direkomendasikan. Peserta Olimpiade mendapatkan akses 2x tryout eksklusif yang dirancang untuk mempersiapkan strategi dan mengenal pola soal penyisihan.',
  },
  {
    id: 'certificate',
    question: 'Apakah semua peserta mendapatkan sertifikat?',
    answer: 'Ya. Seluruh peserta yang terdaftar dan mengikuti kompetisi akan mendapatkan sertifikat resmi dari HMTB Universitas Airlangga. Sertifikat ini dapat digunakan sebagai nilai tambah untuk pendaftaran SNBP.',
  },
  {
    id: 'prize',
    question: 'Berapa total hadiah yang diperebutkan?',
    answer: 'Total hadiah BMEC 2026 mencapai belasan juta rupiah. Olimpiade: Rp 10.000.000, LKTI: Rp 8.000.000, Infografis: Rp 1.500.000. Selain uang tunai, pemenang juga mendapatkan trofi dan sertifikat juara.',
  },
  {
    id: 'team',
    question: 'Apakah kompetisi ini individu atau tim?',
    answer: 'Olimpiade bersifat individu. LKTI dapat diikuti secara tim (maksimal 3 orang). Infografis dapat individu maupun tim (maksimal 2 orang). Detail ketentuan tim tersedia di guidebook resmi.',
  },
  {
    id: 'submission',
    question: 'Bagaimana cara mengumpulkan karya untuk LKTI dan Infografis?',
    answer: 'Pengumpulan karya dilakukan secara online melalui platform resmi BMEC. Untuk LKTI, peserta mengumpulkan abstrak terlebih dahulu, kemudian full paper setelah dinyatakan lolos seleksi abstrak.',
  },
  {
    id: 'format',
    question: 'Apakah final dilaksanakan secara online atau offline?',
    answer: 'Penyisihan dilaksanakan secara online. Babak semifinal dan final (Olimpiade, LKTI, Infografis) dilaksanakan secara offline di Universitas Airlangga pada 15–16 November 2026.',
  },
  {
    id: 'module',
    question: 'Apakah ada materi belajar yang disediakan panitia?',
    answer: 'Ya. Peserta Olimpiade mendapatkan modul pembelajaran eksklusif yang mencakup materi Matematika, Fisika, Kimia, Biologi, dan Teknik Biomedis Dasar. Peserta LKTI dan Infografis mendapatkan akses webinar pengembangan ide.',
  },
]
