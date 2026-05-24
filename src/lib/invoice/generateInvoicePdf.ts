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
  code: string
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

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function downloadInvoiceHtml(options: GenerateInvoiceOptions): Promise<void> {
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

  const label = COMPETITION_LABELS[options.competitionType]
  const institutionLabel = INSTITUTION_LABEL[options.competitionType]
  const invoiceNo = generateInvoiceNumber(options.code)
  const participantNo = generateParticipantNumber(options.teamId)
  const dateStr = formatDate(options.approvedAt ?? new Date())
  const message = SUCCESS_MESSAGES[options.competitionType]

  const logoBase64 = await loadImageAsBase64('https://www.bmec2026.com/logo.png')

  let y = MARGIN

  const drawRect = (
    x: number,
    ry: number,
    w: number,
    h: number,
    r: number,
    fillColor: string,
    strokeColor?: string,
  ) => {
    doc.setFillColor(...hex(fillColor))
    if (strokeColor) {
      doc.setDrawColor(...hex(strokeColor))
      doc.setLineWidth(0.3)
      doc.roundedRect(x, ry, w, h, r, r, 'FD')
    } else {
      doc.roundedRect(x, ry, w, h, r, r, 'F')
    }
  }

  const text = (
    str: string,
    x: number,
    ty: number,
    size: number,
    color: string,
    style: 'normal' | 'bold' = 'normal',
    align: 'left' | 'center' | 'right' = 'left',
  ) => {
    doc.setFontSize(size)
    doc.setTextColor(...hex(color))
    doc.setFont('helvetica', style)
    doc.text(str, x, ty, { align })
  }

  const sectionLabel = (str: string, x: number, ty: number) =>
    text(str, x, ty, 7, '#94a3b8', 'bold')

  const fieldLabel = (str: string, x: number, ty: number) =>
    text(str, x, ty, 6.5, '#94a3b8', 'bold')

  const fieldValue = (str: string, x: number, ty: number) =>
    text(str, x, ty, 9.5, '#111827', 'bold')

  const HEADER_H = 24
  drawRect(MARGIN, y, CONTENT_W, HEADER_H, 4, '#fafafa', '#e2e8f0')

  const LOGO_SIZE = 12
  const logoX = MARGIN + 6
  const logoY = y + (HEADER_H - LOGO_SIZE) / 2

  if (logoBase64) {
    const formatMatch = logoBase64.match(/^data:image\/(\w+);/)
    const imgFormat = formatMatch ? formatMatch[1].toUpperCase() : 'PNG'
    doc.addImage(logoBase64, imgFormat, logoX, logoY, LOGO_SIZE, LOGO_SIZE)
  } else {
    drawRect(logoX, logoY, LOGO_SIZE, LOGO_SIZE, 2, '#e2e8f0')
  }

  const textX = MARGIN + 6 + LOGO_SIZE + 5
  text('BMEC 2026', textX, y + 10, 13, '#111827', 'bold')
  text(`Invoice ${label}`, textX, y + 16, 8.5, '#6b7280')

  text('LUNAS', PAGE_W - MARGIN - 2, y + HEADER_H / 2 + 2.5, 7, '#16a34a', 'bold', 'right')

  y += HEADER_H + 8

  sectionLabel('INFORMASI INVOICE', MARGIN, y)
  y += 6

  const colW = CONTENT_W / 3
  const infoRow1: [string, string][] = [
    ['No. Invoice', invoiceNo],
    ['No. Peserta', participantNo],
    ['Tanggal', dateStr],
  ]
  const infoRow2: [string, string][] = [
    ['Nama Tim', options.teamName],
    [institutionLabel, options.schoolOrUniversity],
  ]

  infoRow1.forEach(([lbl, val], i) => {
    const x = MARGIN + i * colW
    fieldLabel(lbl, x, y)
    fieldValue(val, x, y + 5.5)
  })
  y += 14

  infoRow2.forEach(([lbl, val], i) => {
    const x = MARGIN + i * colW
    fieldLabel(lbl, x, y)
    const maxW = i === 1 ? colW * 2 - 4 : colW - 4
    const wrapped = wrapText(doc, val, maxW)
    doc.setFontSize(9.5)
    doc.setTextColor(...hex('#111827'))
    doc.setFont('helvetica', 'bold')
    doc.text(wrapped, x, y + 5.5)
  })
  y += 14

  doc.setDrawColor(...hex('#f1f5f9'))
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 7

  sectionLabel('ANGGOTA TIM', MARGIN, y)
  y += 5

  const ROW_H = 7
  drawRect(MARGIN, y, CONTENT_W, ROW_H, 2, '#f8fafc', '#e2e8f0')
  fieldLabel('NAMA', MARGIN + 4, y + 4.8)
  doc.setFontSize(6.5)
  doc.setTextColor(...hex('#94a3b8'))
  doc.setFont('helvetica', 'bold')
  doc.text('PERAN', MARGIN + CONTENT_W - 4, y + 4.8, { align: 'right' })
  y += ROW_H

  options.members.forEach((m, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#fafafa'
    drawRect(MARGIN, y, CONTENT_W, ROW_H, 0, bg)
    doc.setDrawColor(...hex('#f1f5f9'))
    doc.setLineWidth(0.2)
    doc.line(MARGIN, y + ROW_H, MARGIN + CONTENT_W, y + ROW_H)
    text(m.name, MARGIN + 4, y + 4.8, 8.5, '#111827', 'bold')
    text(m.role.toLowerCase(), MARGIN + CONTENT_W - 4, y + 4.8, 8, '#6b7280', 'normal', 'right')
    y += ROW_H
  })

  y += 5
  doc.setDrawColor(...hex('#f1f5f9'))
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 7

  drawRect(MARGIN, y, CONTENT_W, 18, 4, '#f0fdf4', '#86efac')
  text('Total Pembayaran', MARGIN + 6, y + 6, 7, '#6b7280')
  text(`HTM ${label} BMEC 2026`, MARGIN + 6, y + 12, 8.5, '#374151')
  text(formatRupiah(options.price), MARGIN + CONTENT_W - 6, y + 11, 14, '#16a34a', 'bold', 'right')
  y += 24

  const msgLines = wrapText(doc, message, CONTENT_W - 12)
  const msgH = msgLines.length * 4.8 + 12
  drawRect(MARGIN, y, CONTENT_W, msgH, 4, '#f8fafc', '#e2e8f0')
  doc.setFontSize(8)
  doc.setTextColor(...hex('#475569'))
  doc.setFont('helvetica', 'normal')
  doc.text(msgLines, MARGIN + 6, y + 8)
  y += msgH + 8

  doc.setDrawColor(...hex('#f1f5f9'))
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 6

  text(
    'BMEC 2026 — Biomedical Engineering Competition • Universitas Airlangga',
    PAGE_W / 2,
    y,
    7,
    '#94a3b8',
    'normal',
    'center',
  )

  const filename = `invoice-${options.competitionType.toLowerCase()}-${options.teamName.replace(/\s+/g, '-')}.pdf`
  doc.save(filename)
}