export interface FAQItem {
  id: string
  question: string
  answer: string
}

export const faqData: FAQItem[] = [
  {
    id: "who",
    question: "Siapa yang bisa mengikuti BMEC 2026?",
    answer:
      "BMEC 2026 terbuka untuk seluruh siswa SMA/SMK/MA sederajat di seluruh Indonesia dan mahasiswa di seluruh Indonesia. Tidak ada batasan wilayah, selama kamu masih berstatus pelajar atau mahasiswa aktif, kamu bisa mendaftar.",
  },
  {
    id: "categories",
    question: "Apa saja cabang lomba yang tersedia?",
    answer:
      "BMEC 2026 memiliki tiga cabang lomba: Olimpiade (MCQ Sains & Teknik Biomedis) dan Infografis (visualisasi ide biomedis) untuk siswa SMA/SMK/MA sederajat, serta LKTI (Lomba Karya Tulis Ilmiah) untuk mahasiswa. Kamu juga diperbolehkan mendaftar lebih dari satu cabang lomba.",
  },
  {
    id: "fee",
    question: "Berapa biaya pendaftaran untuk setiap cabang lomba?",
    answer:
      "Biaya pendaftaran menyesuaikan periode batch. Untuk Olimpiade dan Infografis tersedia 3 batch pendaftaran:\n\nBatch 1 (25 Mei–24 Juni)\n• Olimpiade: Rp90.000\n• Infografis: Rp60.000\n\nBatch 2 (1 Juli–31 Juli)\n• Olimpiade: Rp120.000\n• Infografis: Rp75.000\n\nBatch 3 (3 Agustus–4 September)\n• Olimpiade: Rp150.000\n• Infografis: Rp90.000\n\nUntuk LKTI tersedia 2 batch:\n\nBatch 1 (16 Juli–31 Juli): Rp125.000\nBatch 2 (3 Agustus–4 September): Rp150.000\n\nDisarankan mendaftar lebih awal untuk mendapatkan harga terbaik.",
  },
  {
    id: "submission",
    question: "Bagaimana alur pengumpulan LKTI dan Infografis?",
    answer:
      "Untuk LKTI, peserta mengumpulkan abstrak terlebih dahulu secara gratis, kemudian full paper setelah dinyatakan lolos seleksi abstrak sesuai timeline LKTI. Untuk Infografis, karya langsung dikumpulkan saat pendaftaran melalui laman yang telah disediakan.",
  },
  {
    id: "team",
    question: "Apakah kompetisi ini individu atau tim?",
    answer:
      "Ketiga cabang lomba bersifat tim dengan maksimal 3 orang anggota dalam satu tim.",
  },
  {
    id: "module",
    question: "Apakah ada materi belajar yang disediakan panitia?",
    answer:
      "Ada. Modul pembelajaran akan disediakan oleh panitia dan dapat diakses melalui website resmi BMEC 2026.",
  },
  {
    id: "tryout",
    question: "Apakah tryout wajib diikuti?",
    answer:
      "Tidak wajib, tetapi sangat direkomendasikan agar peserta mengetahui gambaran soal yang akan diujikan nantinya.",
  },
  {
    id: "judging",
    question: "Bagaimana kriteria penilaian?",
    answer:
      "Kriteria penilaian dapat dilihat pada Guidebook resmi BMEC 2026. Penjurian dilakukan oleh dosen Universitas Airlangga serta pihak eksternal yang kompeten di bidangnya.",
  },
  {
    id: "final",
    question: "Apakah final dilaksanakan secara online atau offline?",
    answer:
      "Babak semifinal dan final untuk Olimpiade, LKTI, dan Infografis dilaksanakan secara offline di Universitas Airlangga.",
  },
  {
    id: "accommodation",
    question: "Apakah panitia menyediakan akomodasi untuk finalis?",
    answer:
      "Akomodasi ditanggung oleh para finalis. Panitia hanya membantu memberikan rekomendasi tempat menginap atau akomodasi yang tersedia.",
  },
]