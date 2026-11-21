// Minimal client-side PDF writer (text only, A4, Helvetica) used for the sample invoices.
// Replace with `invoice.pdfUrl` from the API once invoices come from the backend.
const ascii = (text) => String(text).replace(/[^\x20-\x7E]/g, '-').replace(/[\\()]/g, '\\$&')

function buildPdf(pages) {
  const objects = []
  const add = (body) => objects.push(body)

  add('<< /Type /Catalog /Pages 2 0 R >>')
  add(`<< /Type /Pages /Kids [${pages.map((_, i) => `${6 + i * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`)
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')

  pages.forEach((lines, index) => {
    const content = lines
      .map(({ text, x = 56, y, size = 12, bold = false }) => `BT /${bold ? 'F2' : 'F1'} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${ascii(text)}) Tj ET`)
      .join('\n')
    add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
    add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${5 + index * 2} 0 R >>`)
  })

  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((body, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n` })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

function invoicePage(invoice) {
  const rows = [
    ['Invoice', invoice.id],
    ['Date', invoice.dateLabel],
    ['For', invoice.reference],
    ['Amount', invoice.amountLabel],
    ['Status', invoice.status],
  ]
  return [
    { text: 'GEN-I', size: 28, bold: true, y: 770 },
    { text: 'Tax invoice', size: 14, y: 745 },
    ...rows.flatMap(([label, value], i) => [
      { text: label, bold: true, y: 680 - i * 28 },
      { text: value, x: 180, y: 680 - i * 28 },
    ]),
    { text: 'Sample invoice generated in your browser.', size: 9, y: 60 },
  ]
}

export function downloadInvoices(invoices, filename) {
  const blob = buildPdf(invoices.map(invoicePage))
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
