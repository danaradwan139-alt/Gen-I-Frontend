// Client-side PDF invoice (A4, Helvetica) for the sample invoices: branded header, seller / bill-to
// details, line items, VAT breakdown and payment info. No dependencies: it writes the PDF directly.
// Replace with `invoice.pdfUrl` from the API once invoices come from the backend.

/* ---------- Brand palette (from styles/tokens.css) ---------- */
const C = {
  shade2: [8, 62, 73],      // #083E49
  shade1: [16, 125, 147],   // #107D93
  primary: [24, 184, 217],  // #18B8D9
  tint2: [200, 241, 249],   // #C8F1F9
  tint3: [218, 245, 251],   // #DAF5FB
  black: [33, 33, 33],
  grey1: [102, 102, 102],
  grey2: [143, 143, 143],
  line: [228, 232, 234],
  zebra: [248, 251, 252],
  green: [23, 111, 53],
  greenTint: [230, 246, 236],
  white: [255, 255, 255],
}

const VAT_RATE = 0.14 // Egypt VAT; prices are shown VAT-inclusive

const SELLER = {
  name: 'GEN-I Tech Lifestyle Stores',
  lines: ['Trivium Zayed Branch, Sheikh Zayed City', 'Giza, Egypt', 'Tax Reg. No. 000-000-000 (sample)'],
}

/* ---------- Text helpers ---------- */
// Standard Helvetica / Helvetica-Bold glyph widths (1/1000 em) for ASCII 32-126, used to right-align text.
const W_REG = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584]
const W_BOLD = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584]

const clean = (text) => String(text ?? '')
  .replace(/[·•]/g, (ch) => (ch === '•' ? '*' : '-'))
  .replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/×/g, 'x')
  .replace(/[^\x20-\x7E]/g, '')

const escape = (text) => text.replace(/[\\()]/g, '\\$&')

function textWidth(text, size, bold) {
  const widths = bold ? W_BOLD : W_REG
  let total = 0
  for (const ch of clean(text)) total += widths[ch.charCodeAt(0) - 32] ?? 556
  return (total * size) / 1000
}

const rgb = ([r, g, b]) => `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)}`

const money = (value) => `${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EGP`

/* ---------- Tiny drawing API: collects PDF content-stream operators for one page ---------- */
function canvas() {
  const ops = []
  return {
    ops,
    rect(x, y, w, h, fill) { ops.push(`${rgb(fill)} rg ${x} ${y} ${w} ${h} re f`) },
    roundRect(x, y, w, h, r, fill) {
      const k = 0.5523 * r
      ops.push(`${rgb(fill)} rg ${x + r} ${y} m ${x + w - r} ${y} l ${x + w - r + k} ${y} ${x + w} ${y + r - k} ${x + w} ${y + r} c `
        + `${x + w} ${y + h - r} l ${x + w} ${y + h - r + k} ${x + w - r + k} ${y + h} ${x + w - r} ${y + h} c `
        + `${x + r} ${y + h} l ${x + r - k} ${y + h} ${x} ${y + h - r + k} ${x} ${y + h - r} c `
        + `${x} ${y + r} l ${x} ${y + r - k} ${x + r - k} ${y} ${x + r} ${y} c f`)
    },
    line(x1, y1, x2, y2, color = C.line, width = 0.75) { ops.push(`${rgb(color)} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`) },
    // align: left | right | center (x is the anchor)
    text(value, x, y, { size = 10, bold = false, color = C.black, align = 'left' } = {}) {
      const str = clean(value)
      const w = textWidth(str, size, bold)
      const left = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x
      ops.push(`${rgb(color)} rg BT /${bold ? 'F2' : 'F1'} ${size} Tf 1 0 0 1 ${left.toFixed(2)} ${y} Tm (${escape(str)}) Tj ET`)
    },
    // Shortens text with "..." so it fits in maxWidth
    fit(value, maxWidth, size, bold) {
      let str = clean(value)
      if (textWidth(str, size, bold) <= maxWidth) return str
      while (str.length > 1 && textWidth(`${str}...`, size, bold) > maxWidth) str = str.slice(0, -1)
      return `${str.trimEnd()}...`
    },
  }
}

/* ---------- One invoice page ---------- */
const PAGE_W = 595
const PAGE_H = 842
const M = 48 // side margin
const RIGHT = PAGE_W - M

function invoicePage(invoice, pageNo, pageCount) {
  const pdf = canvas()
  const items = invoice.items?.length
    ? invoice.items
    : [{ name: invoice.reference, spec: '', qty: 1, unitPrice: invoice.amount }]
  const total = invoice.amount
  const delivery = invoice.delivery ?? 0
  const net = total / (1 + VAT_RATE)
  const vat = total - net
  const isPaid = /paid/i.test(invoice.status)

  /* Header band */
  pdf.rect(0, 752, PAGE_W, 90, C.shade2)
  pdf.rect(0, 748, PAGE_W, 4, C.primary)
  pdf.text('GEN-', M, 788, { size: 30, bold: true, color: C.white })
  pdf.text('I', M + textWidth('GEN-', 30, true), 788, { size: 30, bold: true, color: C.primary })
  pdf.text('Tech Lifestyle Stores', M, 770, { size: 9.5, color: C.tint2 })
  pdf.text('TAX INVOICE', RIGHT, 792, { size: 20, bold: true, color: C.white, align: 'right' })
  pdf.text(invoice.id, RIGHT, 772, { size: 10, color: C.tint2, align: 'right' })

  /* From / Bill to / Invoice details */
  const top = 712
  const label = (text, x, y, align) => pdf.text(text, x, y, { size: 7.5, bold: true, color: C.grey2, align })

  label('FROM', M, top)
  pdf.text(SELLER.name, M, top - 16, { size: 10, bold: true })
  SELLER.lines.forEach((line, i) => pdf.text(line, M, top - 30 - i * 12, { size: 8.5, color: C.grey1 }))

  const billX = 222
  label('BILL TO', billX, top)
  const [billName, ...billLines] = invoice.billTo?.length ? invoice.billTo : ['GEN-I customer']
  pdf.text(pdf.fit(billName, 150, 10, true), billX, top - 16, { size: 10, bold: true })
  billLines.slice(0, 3).forEach((line, i) => pdf.text(pdf.fit(line, 150, 8.5), billX, top - 30 - i * 12, { size: 8.5, color: C.grey1 }))

  const metaX = 392
  const meta = [
    ['Invoice no.', invoice.id],
    ['Issue date', invoice.dateLabel],
    ['Reference', invoice.reference],
  ]
  meta.forEach(([k, v], i) => {
    const y = top - i * 16
    pdf.text(k, metaX, y, { size: 8.5, color: C.grey2 })
    pdf.text(pdf.fit(v, 100, 8.5, true), RIGHT, y, { size: 8.5, bold: true, align: 'right' })
  })
  // Status pill
  const status = clean(invoice.status).toUpperCase()
  const pillW = textWidth(status, 8, true) + 20
  pdf.text('Status', metaX, top - 52, { size: 8.5, color: C.grey2 })
  pdf.roundRect(RIGHT - pillW, top - 57, pillW, 16, 8, isPaid ? C.greenTint : C.tint3)
  pdf.text(status, RIGHT - pillW / 2, top - 52, { size: 8, bold: true, color: isPaid ? C.green : C.shade1, align: 'center' })

  /* Items table */
  const colQty = 340
  const colUnit = 438
  let y = 620
  pdf.roundRect(M, y - 8, RIGHT - M, 26, 4, C.tint3)
  const head = { size: 8, bold: true, color: C.shade2 }
  pdf.text('DESCRIPTION', M + 12, y + 1, head)
  pdf.text('QTY', colQty, y + 1, { ...head, align: 'right' })
  pdf.text('UNIT PRICE', colUnit, y + 1, { ...head, align: 'right' })
  pdf.text('AMOUNT', RIGHT - 12, y + 1, { ...head, align: 'right' })
  y -= 18

  items.forEach((item, i) => {
    const rowH = item.spec ? 40 : 30
    if (i % 2 === 1) pdf.rect(M, y - rowH, RIGHT - M, rowH, C.zebra)
    const textY = item.spec ? y - 17 : y - 19
    pdf.text(pdf.fit(item.name, 270, 10, true), M + 12, textY, { size: 10, bold: true })
    if (item.spec) pdf.text(pdf.fit(item.spec, 270, 8.5), M + 12, textY - 13, { size: 8.5, color: C.grey2 })
    pdf.text(String(item.qty), colQty, textY, { size: 10, align: 'right' })
    pdf.text(money(item.unitPrice), colUnit, textY, { size: 10, align: 'right', color: C.grey1 })
    pdf.text(money(item.unitPrice * item.qty), RIGHT - 12, textY, { size: 10, bold: true, align: 'right' })
    y -= rowH
    pdf.line(M, y, RIGHT, y)
  })

  /* Totals (right) */
  y -= 26
  const totalsX = 352
  const totals = [
    ['Subtotal (excl. VAT)', money(net)],
    [`VAT (${Math.round(VAT_RATE * 100)}%)`, money(vat)],
    ['Delivery', delivery ? money(delivery) : 'Free'],
  ]
  totals.forEach(([k, v], i) => {
    pdf.text(k, totalsX, y - i * 18, { size: 9.5, color: C.grey1 })
    pdf.text(v, RIGHT - 12, y - i * 18, { size: 9.5, align: 'right' })
  })
  const bandY = y - totals.length * 18 - 14
  pdf.roundRect(totalsX - 12, bandY - 10, RIGHT - totalsX + 12, 30, 6, C.shade2)
  pdf.text(isPaid ? 'TOTAL PAID' : 'TOTAL DUE', totalsX, bandY + 1, { size: 9.5, bold: true, color: C.tint2 })
  pdf.text(money(total), RIGHT - 12, bandY + 1, { size: 12, bold: true, color: C.white, align: 'right' })

  /* Payment & notes (left) */
  label('PAYMENT', M, y)
  pdf.text(pdf.fit(invoice.payment || 'Paid online', 250, 9.5), M, y - 15, { size: 9.5 })
  if (isPaid) pdf.text(`Paid on ${invoice.dateLabel}`, M, y - 29, { size: 8.5, color: C.grey2 })
  label('NOTES', M, y - 54)
  ;['All prices include 14% VAT.', 'Keep this invoice for warranty claims.', 'Returns accepted within 14 days of delivery.']
    .forEach((note, i) => pdf.text(note, M, y - 69 - i * 12, { size: 8.5, color: C.grey1 }))

  /* Footer */
  pdf.line(M, 92, RIGHT, 92)
  pdf.text('Thank you for shopping with GEN-I.', PAGE_W / 2, 72, { size: 11, bold: true, color: C.shade1, align: 'center' })
  pdf.text('Questions about this invoice? Visit any GEN-I store or reply through your account.', PAGE_W / 2, 57, { size: 8.5, color: C.grey1, align: 'center' })
  pdf.text('Sample invoice generated in your browser for demonstration purposes.', M, 30, { size: 7.5, color: C.grey2 })
  pdf.text(`Page ${pageNo} of ${pageCount}`, RIGHT, 30, { size: 7.5, color: C.grey2, align: 'right' })

  return pdf.ops.join('\n')
}

/* ---------- PDF file assembly ---------- */
function buildPdf(pageStreams, title) {
  const objects = []
  const add = (body) => objects.push(body)

  add('<< /Type /Catalog /Pages 2 0 R >>')
  add(`<< /Type /Pages /Kids [${pageStreams.map((_, i) => `${7 + i * 2} 0 R`).join(' ')}] /Count ${pageStreams.length} >>`)
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')
  add(`<< /Title (${escape(clean(title))}) /Author (GEN-I) /Creator (GEN-I web) >>`)

  pageStreams.forEach((content, index) => {
    add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
    add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6 + index * 2} 0 R >>`)
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
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

// invoices: [{ id, dateLabel, reference, amount, status, items?: [{ name, spec, qty, unitPrice }],
//              billTo?: [name, ...address lines], payment?, delivery? }]
export function buildInvoicesPdf(invoices, title = 'GEN-I invoice') {
  return buildPdf(invoices.map((invoice, i) => invoicePage(invoice, i + 1, invoices.length)), title)
}

export function downloadInvoices(invoices, filename) {
  const blob = buildInvoicesPdf(invoices, filename.replace(/\.pdf$/i, ''))
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
