import { formatRupiah, formatDate, generateInvoiceNumber, generateParticipantNumber } from './invoice-helpers'
import { WA_GROUP_LINKS } from '~/contants'

type CompetitionType = 'OLIMPIADE' | 'LKTI' | 'INFOGRAFIS'

interface Member {
  name: string
  role: string
}

interface GenerateInvoiceOptions {
  teamId: string
  teamName: string
  competitionType: CompetitionType
  members: Member[]
  schoolOrUniversity: string
  price: number
  batchName?: string
  approvedAt?: Date | string
}

const COMPETITION_LABELS: Record<CompetitionType, string> = {
  OLIMPIADE: 'Olimpiade',
  LKTI: 'LKTI',
  INFOGRAFIS: 'Infografis',
}

const INSTITUTION_LABEL: Record<CompetitionType, string> = {
  OLIMPIADE: 'Asal Sekolah',
  LKTI: 'Perguruan Tinggi',
  INFOGRAFIS: 'Asal Sekolah',
}

const SUCCESS_MESSAGES: Record<CompetitionType, string> = {
  OLIMPIADE: `Selamat! Tim Anda Sudah Terdaftar Menjadi Peserta Olimpiade BMEC 2026. Untuk melakukan Ujian silahkan gunakan alamat email dan password saat mendaftar. Setiap anggota tim dipersilahkan join ke grup koordinasi (PESERTA OLIMPIADE BMEC 2026) berikut: ${WA_GROUP_LINKS.OLIMPIADE}`,
  LKTI: `Selamat! Tim Anda Sudah Terdaftar Menjadi Peserta LKTI BMEC 2026. Setiap anggota tim dipersilahkan join ke grup koordinasi (PESERTA LKTI BMEC 2026) berikut: ${WA_GROUP_LINKS.LKTI}`,
  INFOGRAFIS: `Selamat! Tim Anda Sudah Terdaftar Menjadi Peserta INFOGRAFIS BMEC 2026. Setiap anggota tim dipersilahkan join ke grup koordinasi (PESERTA INFOGRAFIS BMEC 2026) berikut: ${WA_GROUP_LINKS.INFOGRAFIS}`,
}

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 18
const CONTENT_W = PAGE_W - MARGIN * 2

function hex(color: string): [number, number, number] {
  const c = color.replace('#', '')
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]
}

function wrapText(doc: any, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth)
}

export async function downloadInvoiceHtml(options: GenerateInvoiceOptions): Promise<void> {
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

  const label = COMPETITION_LABELS[options.competitionType]
  const institutionLabel = INSTITUTION_LABEL[options.competitionType]
  const invoiceNo = generateInvoiceNumber(options.competitionType, options.teamId)
  const participantNo = generateParticipantNumber(options.teamId)
  const dateStr = formatDate(options.approvedAt ?? new Date())
  const message = SUCCESS_MESSAGES[options.competitionType]

  let y = MARGIN

  const drawRect = (x: number, ry: number, w: number, h: number, r: number, fillColor: string, strokeColor?: string) => {
    doc.setFillColor(...hex(fillColor))
    if (strokeColor) {
      doc.setDrawColor(...hex(strokeColor))
      doc.setLineWidth(0.3)
      doc.roundedRect(x, ry, w, h, r, r, 'FD')
    } else {
      doc.roundedRect(x, ry, w, h, r, r, 'F')
    }
  }

  const text = (str: string, x: number, ty: number, size: number, color: string, style: 'normal' | 'bold' = 'normal', align: 'left' | 'center' | 'right' = 'left') => {
    doc.setFontSize(size)
    doc.setTextColor(...hex(color))
    doc.setFont('helvetica', style)
    doc.text(str, x, ty, { align })
  }

  const label2 = (str: string, x: number, ty: number) => text(str, x, ty, 7, '#94a3b8', 'bold')
  const value = (str: string, x: number, ty: number) => text(str, x, ty, 9.5, '#111827', 'bold')

  drawRect(MARGIN, y, CONTENT_W, 22, 4, '#fafafa', '#e2e8f0')

  text('BMEC 2026', MARGIN + 8, y + 8, 13, '#111827', 'bold')
  text(`Invoice ${label}`, MARGIN + 8, y + 14, 8.5, '#6b7280')

  drawRect(PAGE_W - MARGIN - 28, y + 5, 26, 8, 4, '#f0fdf4', '#86efac')
  text('✓ LUNAS', PAGE_W - MARGIN - 15, y + 10.5, 7.5, '#16a34a', 'bold', 'center')

  y += 28

  text('INFORMASI INVOICE', MARGIN, y, 7, '#94a3b8', 'bold')
  y += 5

  const colW = CONTENT_W / 3
  const infoItems: [string, string][] = [
    ['No. Invoice', invoiceNo],
    ['No. Peserta', participantNo],
    ['Tanggal', dateStr],
    ['Nama Tim', options.teamName],
    [institutionLabel, options.schoolOrUniversity],
  ]

  const row1 = infoItems.slice(0, 3)
  const row2 = infoItems.slice(3)

  row1.forEach(([lbl, val], i) => {
    const x = MARGIN + i * colW
    label2(lbl, x, y)
    value(val, x, y + 5)
  })
  y += 13

  row2.forEach(([lbl, val], i) => {
    const x = MARGIN + i * colW * (i === 1 ? 1 : 0)
    label2(lbl, MARGIN + i * colW, y)
    const wrapped = wrapText(doc, val, i === 1 ? colW * 2 - 4 : colW - 4)
    doc.setFontSize(9.5)
    doc.setTextColor(...hex('#111827'))
    doc.setFont('helvetica', 'bold')
    doc.text(wrapped, MARGIN + i * colW, y + 5)
  })
  y += 14

  doc.setDrawColor(...hex('#f1f5f9'))
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 6

  text('ANGGOTA TIM', MARGIN, y, 7, '#94a3b8', 'bold')
  y += 5

  drawRect(MARGIN, y, CONTENT_W, 7, 2, '#f8fafc', '#e2e8f0')
  text('Nama', MARGIN + 4, y + 4.5, 7, '#94a3b8', 'bold')
  text('Peran', MARGIN + CONTENT_W - 4, y + 4.5, 7, '#94a3b8', 'bold', 'right')
  y += 7

  options.members.forEach((m, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#fafafa'
    drawRect(MARGIN, y, CONTENT_W, 7, 0, bg)
    doc.setDrawColor(...hex('#f1f5f9'))
    doc.setLineWidth(0.2)
    doc.line(MARGIN, y + 7, MARGIN + CONTENT_W, y + 7)
    text(m.name, MARGIN + 4, y + 4.8, 8.5, '#111827', 'bold')
    text(m.role.toLowerCase(), MARGIN + CONTENT_W - 4, y + 4.8, 8, '#6b7280', 'normal', 'right')
    y += 7
  })

  y += 4
  doc.setDrawColor(...hex('#f1f5f9'))
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 6

  drawRect(MARGIN, y, CONTENT_W, 16, 4, '#f0fdf4', '#86efac')
  text('Total Pembayaran', MARGIN + 5, y + 5.5, 7, '#6b7280')
  text(`HTM ${label} BMEC 2026`, MARGIN + 5, y + 11, 8.5, '#374151', 'normal')
  text(formatRupiah(options.price), MARGIN + CONTENT_W - 5, y + 9.5, 14, '#16a34a', 'bold', 'right')
  y += 22

  const msgLines = wrapText(doc, message, CONTENT_W - 10)
  const msgH = msgLines.length * 4.5 + 10
  drawRect(MARGIN, y, CONTENT_W, msgH, 4, '#f8fafc', '#e2e8f0')
  doc.setFontSize(8)
  doc.setTextColor(...hex('#475569'))
  doc.setFont('helvetica', 'normal')
  doc.text(msgLines, MARGIN + 5, y + 7)
  y += msgH + 6

  doc.setDrawColor(...hex('#f1f5f9'))
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 6

  text('BMEC 2026 — Biomedical Engineering Competition • Universitas Airlangga', PAGE_W / 2, y, 7, '#94a3b8', 'normal', 'center')

  const filename = `invoice-${options.competitionType.toLowerCase()}-${options.teamName.replace(/\s+/g, '-')}.pdf`
  doc.save(filename)
}
