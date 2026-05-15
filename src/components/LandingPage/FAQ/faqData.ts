export interface FAQItem {
  id: string
  question: string
  answer: string
}

export const faqData: FAQItem[] = [
  {
    id: 'who',
    question: 'Siapa yang bisa mengikuti BMEC 2026?',
    answer: `
      <p>
        <strong>BMEC 2026</strong> terbuka untuk seluruh
        <strong>siswa SMA/SMK/MA sederajat</strong> di seluruh Indonesia
        dan <strong>mahasiswa</strong> di seluruh Indonesia.
      </p>

      <p>
        Tidak ada batasan wilayah. Selama kamu masih berstatus
        <strong>pelajar atau mahasiswa aktif</strong>,
        kamu bisa mendaftar.
      </p>
    `,
  },

  {
    id: 'categories',
    question: 'Apa saja cabang lomba yang tersedia?',
    answer: `
      <p>
        <strong>BMEC 2026</strong> memiliki tiga cabang lomba:
      </p>

      <ul>
        <li>
          <strong>Olimpiade</strong> —
          MCQ Sains & Teknik Biomedis untuk siswa SMA/SMK/MA sederajat
        </li>

        <li>
          <strong>Infografis</strong> —
          visualisasi ide biomedis untuk siswa SMA/SMK/MA sederajat
        </li>

        <li>
          <strong>LKTI (Lomba Karya Tulis Ilmiah)</strong> —
          untuk mahasiswa
        </li>
      </ul>

      <p>
        Kamu juga diperbolehkan
        <strong> mendaftar lebih dari satu cabang lomba</strong>.
      </p>
    `,
  },

  {
    id: 'fee',
    question: 'Berapa biaya pendaftaran untuk setiap cabang lomba?',
    answer: `
      <p>
        Biaya pendaftaran menyesuaikan
        <strong> periode batch</strong>.
      </p>

      <h4>Olimpiade & Infografis</h4>

      <p><strong>Batch 1</strong> (25 Mei – 24 Juni)</p>
      <ul>
        <li>Olimpiade: <strong>Rp90.000</strong></li>
        <li>Infografis: <strong>Rp60.000</strong></li>
      </ul>

      <p><strong>Batch 2</strong> (1 Juli – 31 Juli)</p>
      <ul>
        <li>Olimpiade: <strong>Rp120.000</strong></li>
        <li>Infografis: <strong>Rp75.000</strong></li>
      </ul>

      <p><strong>Batch 3</strong> (3 Agustus – 4 September)</p>
      <ul>
        <li>Olimpiade: <strong>Rp150.000</strong></li>
        <li>Infografis: <strong>Rp90.000</strong></li>
      </ul>

      <h4>LKTI</h4>

      <p><strong>Batch 1</strong> (16 Juli – 31 Juli)</p>
      <ul>
        <li><strong>Rp125.000</strong></li>
      </ul>

      <p><strong>Batch 2</strong> (3 Agustus – 4 September)</p>
      <ul>
        <li><strong>Rp150.000</strong></li>
      </ul>

      <p>
        Disarankan mendaftar lebih awal untuk mendapatkan
        <strong> harga terbaik</strong>.
      </p>
    `,
  },

  {
    id: 'submission',
    question: 'Bagaimana alur pengumpulan LKTI dan Infografis?',
    answer: `
      <p><strong>LKTI</strong></p>

      <ul>
        <li>
          Peserta mengumpulkan
          <strong> abstrak terlebih dahulu secara gratis</strong>
        </li>
        <li>
          Full paper dikumpulkan setelah dinyatakan
          <strong> lolos seleksi abstrak</strong>
        </li>
        <li>
          Proses mengikuti timeline resmi LKTI
        </li>
      </ul>

      <p><strong>Infografis</strong></p>

      <ul>
        <li>
          Karya langsung dikumpulkan saat pendaftaran
        </li>
        <li>
          Pengumpulan dilakukan melalui laman
          yang telah disediakan panitia
        </li>
      </ul>
    `,
  },

  {
    id: 'team',
    question: 'Apakah kompetisi ini individu atau tim?',
    answer: `
      <p>
        Ketiga cabang lomba bersifat
        <strong> tim</strong> dengan maksimal
        <strong> 3 orang anggota</strong>
        dalam satu tim.
      </p>
    `,
  },

  {
    id: 'module',
    question: 'Apakah ada materi belajar yang disediakan panitia?',
    answer: `
      <p>
        <strong>Ada.</strong>
      </p>

      <p>
        Modul pembelajaran akan disediakan oleh panitia
        dan dapat diakses melalui
        <strong> website resmi BMEC 2026</strong>.
      </p>
    `,
  },

  {
    id: 'tryout',
    question: 'Apakah tryout wajib diikuti?',
    answer: `
      <p>
        <strong>Tidak wajib</strong>,
        tetapi sangat direkomendasikan agar peserta mengetahui
        gambaran soal yang akan diujikan nantinya.
      </p>
    `,
  },

  {
    id: 'judging',
    question: 'Bagaimana kriteria penilaian?',
    answer: `
      <p>
        Kriteria penilaian dapat dilihat pada
        <strong> Guidebook resmi BMEC 2026</strong>.
      </p>

      <p>
        Penjurian dilakukan oleh
        <strong> dosen Universitas Airlangga</strong>
        serta pihak eksternal yang kompeten
        di bidangnya.
      </p>
    `,
  },

  {
    id: 'final',
    question: 'Apakah final dilaksanakan secara online atau offline?',
    answer: `
      <p>
        Babak
        <strong> semifinal dan final</strong>
        untuk
        <strong> Olimpiade, LKTI, dan Infografis</strong>
        dilaksanakan secara
        <strong> offline</strong> di
        <strong> Universitas Airlangga</strong>.
      </p>
    `,
  },

  {
    id: 'accommodation',
    question: 'Apakah panitia menyediakan akomodasi untuk finalis?',
    answer: `
      <p>
        <strong>Akomodasi ditanggung oleh finalis.</strong>
      </p>

      <p>
        Panitia hanya membantu memberikan rekomendasi
        tempat menginap atau akomodasi yang tersedia.
      </p>
    `,
  },
]