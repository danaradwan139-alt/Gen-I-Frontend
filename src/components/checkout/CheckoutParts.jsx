import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/data/products'
import { assets as A } from '@/assets/assets'
import '@/pages/CheckoutPage.css'

// Building blocks shared by the consumer checkout (/checkout) and the business checkout (/business/checkout).

export function tomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export function prettyDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function Stepper({ steps, step }) {
  return (
    <ol className="co-steps" aria-label="Checkout progress">
      {steps.map((label, i) => {
        const n = i + 1
        const state = step > n ? 'done' : step === n ? 'current' : 'next'
        return (
          <li key={label} className={`co-step is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="co-step-dot">
              {state === 'done' ? <Icon src={A.tick} size={14} inset="23.96% 17.7%" /> : n}
            </span>
            <span className="co-step-label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

export function Field({ label, required = true, error, children, className = '' }) {
  return (
    <label className={`co-field ${error ? 'has-error' : ''} ${className}`}>
      <span className="co-label">
        {required && <span className="co-req" aria-hidden="true">*</span>}
        {label}
      </span>
      {children}
      {error && <span className="co-error" role="alert">{error}</span>}
    </label>
  )
}

export function Choice({ name, value, checked, onChange, children, type = 'radio' }) {
  return (
    <label className="co-choice">
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} />
      <span className="co-box" aria-hidden="true">
        <Icon src={A.tick} size={14} inset="23.96% 17.7%" />
      </span>
      <span>{children}</span>
    </label>
  )
}

export function Collapsed({ title }) {
  return <div className="co-collapsed" aria-disabled="true">{title}</div>
}

export function DoneCard({ title, onEdit, children }) {
  return (
    <section className="co-done">
      <div className="co-done-head">
        <h2>{title}</h2>
        <Button variant="text" size="xs" onClick={onEdit}>Edit</Button>
      </div>
      {children}
    </section>
  )
}

export function OrderSummary({ lines, total, vat, children, title = 'Order summary' }) {
  return (
    <aside className="co-summary" aria-label={title}>
      <h2>{title}</h2>
      <ul className="co-lines">
        {lines.map((line) => (
          <li key={`${line.productId}-${line.variantId}`}>
            <span className="co-thumb">{line.image ? <img src={line.image} alt="" /> : null}</span>
            <span className="co-line-info">
              <strong>{line.product.name}{line.quantity > 1 ? ` × ${line.quantity}` : ''}</strong>
              <small>{line.variant.label}</small>
            </span>
            <span className="co-line-price">{formatPrice(line.variant.price * line.quantity)}</span>
          </li>
        ))}
      </ul>
      <hr className="co-divider" />
      <dl className="co-totals">
        <div><dt>Subtotal</dt><dd>{formatPrice(total)}</dd></div>
        <div><dt>Delivery</dt><dd className="is-free">Free</dd></div>
        <div><dt>VAT included</dt><dd>{formatPrice(vat)}</dd></div>
        <div className="is-total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
      </dl>
      {children}
    </aside>
  )
}

export function validateCard(c) {
  const e = {}
  const digits = c.number.replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(digits)) e.number = 'Enter a valid card number'
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(c.expiry)
  if (!m) e.expiry = 'Use MM / YY'
  else {
    const month = Number(m[1])
    const year = 2000 + Number(m[2])
    const now = new Date()
    if (month < 1 || month > 12 || year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) e.expiry = 'Card has expired'
  }
  if (!/^\d{3,4}$/.test(c.cvv)) e.cvv = '3 or 4 digits'
  if (c.holder.trim().length < 3) e.holder = 'Name as written on card'
  return e
}

export const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')
export const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d
}

