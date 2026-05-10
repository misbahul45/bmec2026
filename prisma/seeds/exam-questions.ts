import { prisma } from '~/lib/utils/prisma'
import { StageType, ExamType } from '@prisma/client'

const questions = [
  {
    question: `
      <p>Perhatikan gambar berikut.</p>
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Pulse_oximetry.jpg/640px-Pulse_oximetry.jpg" 
        alt="Pulse Oximeter"
        style="max-width:100%;border-radius:12px;margin:12px 0;"
      />
      <p>
        Sensor yang paling umum digunakan untuk mengukur kadar oksigen dalam darah 
        (SpO₂) secara <strong>non-invasif</strong> pada alat di atas adalah...
      </p>
    `,
    optionA: '<p>Sensor ultrasonik</p>',
    optionB:
      '<p><strong>Pulse oximeter</strong> berbasis fotolistrik</p>',
    optionC: '<p>Sensor kapasitif</p>',
    optionD: '<p>Sensor piezoelektrik</p>',
    optionE: '<p>Sensor resistif</p>',
    correctAnswer: 'B',
    score: 5,
  },
  {
    question:
      '<p>Nilai normal tekanan darah sistolik pada orang dewasa sehat adalah...</p>',
    optionA: '<p>60–80 mmHg</p>',
    optionB: '<p>80–100 mmHg</p>',
    optionC:
      '<p><strong>100–120 mmHg</strong></p>',
    optionD: '<p>120–140 mmHg</p>',
    optionE: '<p>140–160 mmHg</p>',
    correctAnswer: 'C',
    score: 5,
  },
  {
    question:
      '<p>Prinsip kerja <strong>MRI</strong> (Magnetic Resonance Imaging) didasarkan pada...</p>',
    optionA:
      '<p>Hamburan sinar-X pada jaringan tubuh</p>',
    optionB:
      '<p><strong>Resonansi inti atom hidrogen</strong> dalam medan magnet kuat</p>',
    optionC:
      '<p>Pantulan gelombang ultrasonik</p>',
    optionD:
      '<p>Emisi positron dari isotop radioaktif</p>',
    optionE:
      '<p>Konduksi listrik pada jaringan biologis</p>',
    correctAnswer: 'B',
    score: 5,
  },
  {
    question:
      '<p>Frekuensi gelombang ultrasonik yang digunakan dalam <em>USG medis</em> umumnya berada pada rentang...</p>',
    optionA: '<p>20 Hz – 200 Hz</p>',
    optionB: '<p>200 Hz – 2 kHz</p>',
    optionC:
      '<p><strong>2 MHz – 20 MHz</strong></p>',
    optionD:
      '<p>20 MHz – 200 MHz</p>',
    optionE:
      '<p>200 MHz – 2 GHz</p>',
    correctAnswer: 'C',
    score: 5,
  },
  {
    question:
      '<p>Elektroda pada pemeriksaan <strong>EKG</strong> berfungsi untuk...</p>',
    optionA:
      '<p>Menghasilkan arus listrik ke jantung</p>',
    optionB:
      '<p>Mendeteksi aktivitas listrik jantung dari permukaan kulit</p>',
    optionC:
      '<p>Mengukur tekanan darah secara invasif</p>',
    optionD:
      '<p>Menstimulasi otot jantung secara langsung</p>',
    optionE:
      '<p>Mengukur kadar glukosa dalam darah</p>',
    correctAnswer: 'B',
    score: 5,
  },
]

export async function seedExamQuestions() {
  const stage =
    await prisma.stage.findFirst({
      where: {
        name:
          StageType.PENYISIHAN,
        competition: {
          name:
            'OLIMPIADE',
        },
      },
    })

  if (!stage) {
    console.log(
      '❌ Stage PENYISIHAN OLIMPIADE tidak ditemukan'
    )
    return
  }

  const exam =
    await prisma.exam.findFirst({
      where: {
        stageId:
          stage.id,
        type:
          ExamType.TRYOUT,
      },
      orderBy: {
        createdAt:
          'asc',
      },
    })

  if (!exam) {
    console.log(
      '❌ Exam Tryout tidak ditemukan'
    )
    return
  }

  const existing =
    await prisma.examQuestion.count(
      {
        where: {
          examId:
            exam.id,
        },
      }
    )

  if (existing > 0) {
    console.log(
      `⏭️ Soal sudah ada (${existing}) untuk: ${exam.title}`
    )
    return
  }

  await prisma.examQuestion.createMany({
    data: questions.map(
      (
        q,
        index
      ) => ({
        ...q,
        order:
          index + 1,
        examId:
          exam.id,
      })
    ),
  })

  console.log(
    `✅ ${questions.length} soal ditambahkan ke: ${exam.title}`
  )
}