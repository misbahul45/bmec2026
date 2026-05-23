import { formatRupiah, formatDate, generateInvoiceNumber, generateParticipantNumber } from './invoice-helpers'
import { WA_GROUP_LINKS } from '~/contants'

type CompetitionType = 'OLIMPIADE' | 'LKTI' | 'INFOGRAFIS'

interface Member {
  name: string
  role: string
}

interface InvoiceData {
  teamId: string
  teamName: string
  competitionType: CompetitionType
  members: Member[]
  schoolOrUniversity: string
  price: number
  batchName?: string
  approvedAt?: Date | string
  code:string
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

export function generateInvoiceHtml(data: InvoiceData): string {
  const invoiceNo = generateInvoiceNumber(data.code)
  const participantNo = generateParticipantNumber(data.teamId)
  const dateStr = formatDate(data.approvedAt ?? new Date())
  const label = COMPETITION_LABELS[data.competitionType]
  const institutionLabel = INSTITUTION_LABEL[data.competitionType]
  const message = SUCCESS_MESSAGES[data.competitionType]

  const membersRows = data.members
    .map(
      (m, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'}">
        <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:500;">${m.name}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;font-size:12px;color:#6b7280;text-transform:capitalize;text-align:right;">
          <span style="background:#f3f4f6;padding:3px 10px;border-radius:999px;font-size:11px;">${m.role.toLowerCase()}</span>
        </td>
      </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Invoice ${label} BMEC 2026 - ${data.teamName}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    background: #f1f5f9;
    color: #111827;
    padding: 32px 16px;
    min-height: 100vh;
  }
  .print-bar {
    max-width: 720px;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .print-hint {
    font-size: 12px;
    color: #64748b;
  }
  .print-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #111827;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.2px;
  }
  .print-btn:hover { background: #1f2937; }
  .card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    overflow: hidden;
    max-width: 720px;
    margin: 0 auto;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 28px;
    border-bottom: 1px solid #f1f5f9;
    background: #fafafa;
  }
  .header-left { display: flex; align-items: center; gap: 14px; }
  .logo { width: 44px; height: 44px; object-fit: contain; }
  .org-name { font-size: 16px; font-weight: 700; color: #111827; line-height: 1.2; }
  .invoice-subtitle { font-size: 12.5px; color: #6b7280; margin-top: 3px; }
  .badge-lunas {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f0fdf4;
    color: #16a34a;
    border: 1.5px solid #86efac;
    font-size: 11.5px;
    font-weight: 700;
    padding: 5px 14px;
    border-radius: 999px;
    letter-spacing: 0.5px;
  }
  .body { padding: 26px 28px; }
  .section-label {
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 12px;
  }
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px 24px;
    margin-bottom: 24px;
  }
  .info-item label {
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    display: block;
    margin-bottom: 4px;
  }
  .info-item span {
    font-size: 13.5px;
    font-weight: 600;
    color: #111827;
  }
  .divider { height: 1px; background: #f1f5f9; margin: 20px 0; }
  .members-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .members-table thead tr { background: #f8fafc; }
  .members-table thead th {
    padding: 9px 16px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e2e8f0;
  }
  .members-table thead th:last-child { text-align: right; }
  .price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 20px;
  }
  .price-meta-label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .price-meta-desc { font-size: 12.5px; color: #374151; font-weight: 500; }
  .price-value { font-size: 24px; font-weight: 800; color: #16a34a; letter-spacing: -0.5px; }
  .message-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 16px 20px;
    font-size: 12.5px;
    color: #475569;
    line-height: 1.8;
  }
  .message-box a { color: #2563eb; }
  .footer {
    text-align: center;
    padding: 14px 28px;
    border-top: 1px solid #f1f5f9;
    font-size: 11px;
    color: #94a3b8;
    background: #fafafa;
  }
  @media print {
    body { background: #fff; padding: 0; }
    .print-bar { display: none; }
    .card { border: none; box-shadow: none; border-radius: 0; max-width: 100%; }
    .header { background: #fafafa !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .price-row { background: #f0fdf4 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .members-table thead tr { background: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { margin: 16mm; size: A4; }
  }
</style>
</head>
<body>
<div class="print-bar">
  <span class="print-hint">Buka file ini di browser, lalu klik tombol cetak atau tekan Ctrl+P untuk menyimpan sebagai PDF.</span>
  <button class="print-btn" onclick="window.print()">&#128438; Cetak / Simpan PDF</button>
</div>

<div class="card">
  <div class="header">
    <div class="header-left">
      <img src="https://www.bmec2026.com/logo.png" class="logo" alt="BMEC Logo" onerror="this.style.display='none'" />
      <div>
        <div class="org-name">BMEC 2026</div>
        <div class="invoice-subtitle">Invoice ${label}</div>
      </div>
    </div>
    <div class="badge-lunas">&#10003; LUNAS</div>
  </div>

  <div class="body">
    <div class="section-label">Informasi Invoice</div>
    <div class="info-grid">
      <div class="info-item">
        <label>No. Invoice</label>
        <span>${invoiceNo}</span>
      </div>
      <div class="info-item">
        <label>No. Peserta</label>
        <span>${participantNo}</span>
      </div>
      <div class="info-item">
        <label>Tanggal</label>
        <span>${dateStr}</span>
      </div>
      <div class="info-item">
        <label>Nama Tim</label>
        <span>${data.teamName}</span>
      </div>
      <div class="info-item" style="grid-column:2/-1">
        <label>${institutionLabel}</label>
        <span>${data.schoolOrUniversity}</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="section-label">Anggota Tim</div>
    <table class="members-table">
      <thead>
        <tr>
          <th>Nama</th>
          <th style="text-align:right">Peran</th>
        </tr>
      </thead>
      <tbody>
        ${membersRows}
      </tbody>
    </table>

    <div class="divider"></div>

    <div class="price-row">
      <div>
        <div class="price-meta-label">Total Pembayaran</div>
        <div class="price-meta-desc">HTM ${label} BMEC 2026</div>
      </div>c
      <div class="price-value">${formatRupiah(data.price)}</div>
    </div>

    <div class="message-box">${message}</div>
  </div>

  <div class="footer">
    BMEC 2026 &mdash; Biomedical Engineering Competition &bull; Universitas Airlangga
  </div>
</div>
</body>
</html>`
}
