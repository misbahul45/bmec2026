export interface ExamRule {
  number: number
  title: string
  description: string
  consequence: string
}

/**
 * 5 aturan pengerjaan ujian yang ditampilkan sebelum peserta benar-benar
 * memulai ujian. Konstanta ini di-hardcode (bukan dari database) sesuai
 * keputusan eksplisit: peserta harus menyetujui aturan sebelum timer
 * ujian dimulai.
 */
export const EXAM_RULES: ReadonlyArray<ExamRule> = [
  {
    number: 1,
    title: 'Satu Perangkat Selama Ujian',
    description:
      'Peserta hanya dapat mengerjakan ujian menggunakan satu perangkat dari awal hingga selesai. Jika akun dibuka pada perangkat lain, sistem akan mendeteksinya.',
    consequence:
      'Otomatis ditandai sebagai indikasi kecurangan dan sesi dapat diblokir.',
  },
  {
    number: 2,
    title: 'Tidak Boleh Berpindah Halaman',
    description:
      'Selama ujian, peserta harus tetap berada di halaman ujian. Berpindah tab, membuka halaman lain, atau meninggalkan halaman ujian akan terdeteksi.',
    consequence: 'Otomatis ditandai sebagai indikasi kecurangan.',
  },
  {
    number: 3,
    title: 'Soal Tidak Dapat Disalin',
    description:
      'Peserta tidak dapat menyalin, memblok, atau menempelkan teks soal maupun jawaban selama ujian.',
    consequence: 'Aktivitas tersebut terdeteksi sebagai pelanggaran.',
  },
  {
    number: 4,
    title: 'Tampilan Ujian Harus Tetap Penuh',
    description:
      'Peserta harus mengerjakan dalam tampilan layar penuh/ukuran yang telah ditentukan. Mengecilkan atau mengubah ukuran tampilan ujian akan terdeteksi.',
    consequence: 'Otomatis ditandai sebagai indikasi kecurangan.',
  },
  {
    number: 5,
    title: 'Tidak Boleh Membuka Aplikasi atau Situs Lain',
    description:
      'Selama ujian, peserta hanya diperbolehkan menggunakan halaman ujian dan tidak membuka aplikasi, browser, atau situs lain untuk mencari jawaban.',
    consequence:
      'Aktivitas yang meninggalkan lingkungan ujian terdeteksi sebagai indikasi kecurangan.',
  },
] as const
