export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function generateInvoiceNumber(competitionType: string, teamId: string): string {
  return `INV-${competitionType}-${teamId.slice(0, 6).toUpperCase()}`
}

export function generateParticipantNumber(teamId: string): string {
  return `BMEC2026-${teamId.slice(0, 8).toUpperCase()}`
}
