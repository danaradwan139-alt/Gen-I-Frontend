import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '@/data/products'
import { assets as A } from '@/assets/assets'
import { Icon, Arrow } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { useBagItems } from '@/hooks/useBagItems'
import { useSessionState } from '@/hooks/useSessionState'
import './CheckoutPage.css'

const STEPS = ['Delivery', 'Payment', 'Review']
const TIME_SLOTS = ['9 AM – 12 PM', '12 PM – 3 PM', '3 PM – 6 PM', '6 PM – 9 PM']
const CITIES = ['Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia', 'Dakahlia', 'Gharbia', 'Monufia', 'Ismailia', 'Port Said', 'Suez', 'Red Sea', 'South Sinai', 'Luxor', 'Aswan']
const DEFAULT_ADDRESS_KEY = 'geni-default-address'
const INSTALLMENT_MONTHS = 12

function tomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function prettyDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function loadDefaultAddress() {
  try {
    return JSON.parse(localStorage.getItem(DEFAULT_ADDRESS_KEY)) || {}
  } catch {
    return {}
  }
}

const emptyDelivery = () => ({
  method: 'home',
  date: tomorrow(),
  slot: TIME_SLOTS[0],
  name: '',
  phone: '',
  email: '',
  city: 'Cairo',
  street: '',
  area: '',
  building: '',
  floor: '',
  landmark: '',
  saveDefault: true,
  ...loadDefaultAddress(),
})

/* ---------- small building blocks ---------- */

function Stepper({ step }) {
  return (
    <ol className="co-steps" aria-label="Checkout progress">
      {STEPS.map((label, i) => {
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

function Field({ label, required = true, error, children, className = '' }) {
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

function Choice({ name, value, checked, onChange, children, type = 'radio' }) {
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

function Collapsed({ title }) {
  return <div className="co-collapsed" aria-disabled="true">{title}</div>
}

function DoneCard({ title, onEdit, children }) {
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

function OrderSummary({ lines, total, vat, children, title = 'Order summary' }) {
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

/* ---------- validation ---------- */

function validateDelivery(d) {
  const e = {}
  if (!d.date) e.date = 'Pick a date'
  else if (d.date < tomorrow()) e.date = 'Pick tomorrow or later'
  if (d.name.trim().length < 3) e.name = 'Enter your full name'
  if (!/^\+?[0-9\s-]{10,16}$/.test(d.phone.trim())) e.phone = 'Enter a valid phone number'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = 'Enter a valid email'
  if (d.method === 'home') {
    if (!d.street.trim()) e.street = 'Required'
    if (!d.area.trim()) e.area = 'Required'
    if (!d.building.trim()) e.building = 'Required'
    if (!d.floor.trim()) e.floor = 'Required'
  }
  return e
}

function validateCard(c) {
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

const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d
}

/* ---------- page ---------- */

export default function CheckoutPage() {
  const { lines, total, vat, clearBag } = useBagItems()
  const [step, setStep] = useSessionState('geni-checkout-step', 1)
  const [delivery, setDelivery] = useSessionState('geni-checkout-delivery', emptyDelivery())
  const [payMethod, setPayMethod] = useSessionState('geni-checkout-pay', 'card')
  // Card details are never stored, only kept in memory while the page is open.
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' })
  const [errors, setErrors] = useState({})
  const [order, setOrder] = useState(null)
  const topRef = useRef(null)

  const pickup = delivery.method === 'pickup'
  const store = lines[0]?.variant.store || 'Trivium Zayed Branch'
  const monthly = Math.ceil(total / INSTALLMENT_MONTHS)

  const payOptions = useMemo(
    () => [
      { id: 'card', title: 'Credit or debit card', sub: 'Visa, Mastercard, Meeza', icon: A.card },
      { id: 'installments', title: '0% installments', sub: `Up to ${INSTALLMENT_MONTHS} months with no interest · from ${formatPrice(monthly)}/month`, icon: A.invoice },
      pickup
        ? { id: 'store', title: 'Pay in store', sub: 'Reserve now, pay at pickup', icon: A.pin }
        : { id: 'cod', title: 'Cash on delivery', sub: 'Pay when your order arrives', icon: A.truck },
    ],
    [pickup, monthly]
  )

  // Switching delivery method can make the chosen payment unavailable
  useEffect(() => {
    if (!payOptions.some((o) => o.id === payMethod)) setPayMethod('card')
  }, [payOptions, payMethod, setPayMethod])

  // After a refresh card details are gone (never stored), so go back to the payment step
  useEffect(() => {
    if (step === 3 && payMethod === 'card' && !card.number) setStep(2)
  }, [step, payMethod, card.number, setStep])

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step, order])

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setDelivery((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }
  const setCardField = (key, format = (v) => v) => (event) => {
    setCard((c) => ({ ...c, [key]: format(event.target.value) }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function focusFirstError(errs) {
    const first = Object.keys(errs)[0]
    if (first) document.querySelector(`[name="${first}"]`)?.focus()
  }

  function submitDelivery(event) {
    event.preventDefault()
    const errs = validateDelivery(delivery)
    setErrors(errs)
    if (Object.keys(errs).length) return focusFirstError(errs)
    try {
      if (delivery.saveDefault) {
        const { name, phone, email, city, street, area, building, floor, landmark } = delivery
        localStorage.setItem(DEFAULT_ADDRESS_KEY, JSON.stringify({ name, phone, email, city, street, area, building, floor, landmark }))
      }
    } catch {
      /* ignore */
    }
    setStep(2)
  }

  function submitPayment(event) {
    event.preventDefault()
    if (payMethod === 'card') {
      const errs = validateCard(card)
      setErrors(errs)
      if (Object.keys(errs).length) return focusFirstError(errs)
    }
    setStep(3)
  }

  function placeOrder() {
    const number = `GN-${String(Date.now()).slice(-6)}`
    setOrder({ number, lines, total, vat, delivery, payMethod, placedAt: new Date() })
    clearBag()
    setCard({ number: '', expiry: '', cvv: '', holder: '' })
    setStep(1)
  }

  const deliveryLine = pickup
    ? `Store pickup · ${prettyDate(delivery.date)}, ${delivery.slot}`
    : `Home delivery · ${prettyDate(delivery.date)}, ${delivery.slot}`
  const addressLine = pickup
    ? store
    : [delivery.building && `${delivery.building} ${delivery.street}`.trim(), delivery.area, delivery.city].filter(Boolean).join(', ')
  const payLabel = payOptions.find((o) => o.id === payMethod)?.title
  const cardTail = card.number.replace(/\s/g, '').slice(-4)

  /* ----- 8.3 Confirmation ----- */
  if (order) {
    const first = order.delivery.name.trim().split(' ')[0] || 'there'
    const time = order.placedAt.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })
    const isPickup = order.delivery.method === 'pickup'
    const status = [
      { title: 'Order placed', sub: `Today, ${time}`, state: 'done' },
      { title: 'Preparing your order', sub: 'We’re checking and packing your items', state: 'current' },
      isPickup
        ? { title: 'Ready for pickup', sub: store, state: 'next' }
        : { title: 'Out for delivery', sub: `${prettyDate(order.delivery.date)} morning`, state: 'next' },
      { title: isPickup ? 'Picked up' : 'Delivered', sub: `${prettyDate(order.delivery.date)}, ${order.delivery.slot}`, state: 'next' },
    ]
    return (
      <div className="co-page" ref={topRef}>
        <section className="co-confirm">
          <span className="co-success" aria-hidden="true">
            <svg viewBox="0 0 44 44"><path d="M12 23l7 7 14-15" /></svg>
          </span>
          <h1 className="co-title">Thank you, {first}!</h1>
          <p className="co-confirm-sub">Your order #{order.number} is confirmed.</p>
        </section>

        <section className="co-body co-body-confirm">
          <div className="co-tracking">
            <h2>{isPickup ? 'Pickup status' : 'Delivery status'}</h2>
            <ol className="co-timeline">
              {status.map((s) => (
                <li key={s.title} className={`is-${s.state}`}>
                  <span className="co-dot" aria-hidden="true" />
                  <span><strong>{s.title}</strong><small>{s.sub}</small></span>
                </li>
              ))}
            </ol>
            <div className="co-actions">
              <Button className="block" to="/shop">Continue shopping <Arrow /></Button>
              <Button variant="outline-teal" className="block" to="/">Back to home</Button>
            </div>
          </div>
          <OrderSummary lines={order.lines} total={order.total} vat={order.vat} />
        </section>

        <section className="co-next">
          <h2>Get the most from your new iPhone</h2>
          <div className="co-next-grid">
            <Link to="/#assistant" className="why">
              <Icon src={A.sparkle} size={24} />
              <p className="t20 bold">Free one-on-one setup</p>
              <p className="body16 grey">Ask GEN-I to help you move your data and set up your iPhone.</p>
            </Link>
            <Link to="/#trade-in" className="why">
              <Icon src={A.reload} size={24} inset="9.38%" />
              <p className="t20 bold">Trade in your old phone</p>
              <p className="body16 grey">Get instant credit, even after you buy.</p>
            </Link>
            <Link to="/repair" className="why">
              <Icon src={A.shield} size={24} inset="10.94% 17.19%" imgInset="-4% -4.76%" />
              <p className="t20 bold">Protect it</p>
              <p className="body16 grey">Expert repairs with a free diagnosis whenever you need them.</p>
            </Link>
          </div>
        </section>
      </div>
    )
  }

  /* ----- Empty bag ----- */
  if (lines.length === 0) {
    return (
      <div className="co-page" ref={topRef}>
        <section className="co-header">
          <h1 className="co-title">Checkout</h1>
        </section>
        <section className="co-body">
          <div className="co-empty">
            <h2>Your bag is empty</h2>
            <p>Add something to your bag before checking out.</p>
            <Button to="/shop">Browse the store</Button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="co-page" ref={topRef}>
      <section className="co-header">
        <h1 className="co-title">Checkout</h1>
        <Stepper step={step} />
      </section>

      <section className="co-body">
        {/* ----- 8.1 Delivery ----- */}
        {step === 1 && (
          <>
            <form className="co-grid co-anim" onSubmit={submitDelivery} noValidate>
              <div className="co-panel">
                <fieldset className="co-section">
                  <legend>1. Delivery Information</legend>
                  <p className="co-sublabel">Delivery Method</p>
                  <div className="co-row">
                    <Choice name="method" value="home" checked={!pickup} onChange={set('method')}>Home Delivery</Choice>
                    <Choice name="method" value="pickup" checked={pickup} onChange={set('method')}>Store Pickup</Choice>
                  </div>
                  <p className="co-sublabel">Date &amp; Time</p>
                  <Field label="Date" error={errors.date} className="co-date">
                    <input type="date" name="date" min={tomorrow()} value={delivery.date} onChange={set('date')} />
                  </Field>
                  <div className="co-row co-slots" role="radiogroup" aria-label="Time slot">
                    {TIME_SLOTS.map((slot) => (
                      <Choice key={slot} name="slot" value={slot} checked={delivery.slot === slot} onChange={set('slot')}>{slot}</Choice>
                    ))}
                  </div>
                </fieldset>

                <hr className="co-rule" />

                <fieldset className="co-section">
                  <legend>2. Recipient Information</legend>
                  <div className="co-fields">
                    <Field label="Full Name" error={errors.name}>
                      <input name="name" autoComplete="name" placeholder="Mohamed Ahmed" value={delivery.name} onChange={set('name')} />
                    </Field>
                    <Field label="Phone Number" error={errors.phone}>
                      <input name="phone" type="tel" autoComplete="tel" placeholder="+20 100 000 0000" value={delivery.phone} onChange={set('phone')} />
                    </Field>
                    <Field label="Email Address" error={errors.email}>
                      <input name="email" type="email" autoComplete="email" placeholder="example@gmail.com" value={delivery.email} onChange={set('email')} />
                    </Field>
                  </div>
                </fieldset>

                <hr className="co-rule" />

                {pickup ? (
                  <fieldset className="co-section">
                    <legend>3. Pickup Store</legend>
                    <div className="co-store">
                      <Icon src={A.pin} size={24} inset="5.21% 9.38%" />
                      <span><strong>{store}</strong><small>Bring your ID and order number when you collect.</small></span>
                    </div>
                  </fieldset>
                ) : (
                  <fieldset className="co-section">
                    <legend>3. Delivery Address</legend>
                    <div className="co-fields">
                      <Field label="City">
                        <select name="city" autoComplete="address-level1" value={delivery.city} onChange={set('city')}>
                          {CITIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </Field>
                      <Field label="Street Name" error={errors.street}>
                        <input name="street" autoComplete="address-line1" placeholder="Street Name" value={delivery.street} onChange={set('street')} />
                      </Field>
                      <Field label="Area / District" error={errors.area}>
                        <input name="area" autoComplete="address-level2" placeholder="Area / District" value={delivery.area} onChange={set('area')} />
                      </Field>
                      <Field label="Building Number" error={errors.building}>
                        <input name="building" placeholder="Building Number" value={delivery.building} onChange={set('building')} />
                      </Field>
                      <Field label="Floor Number" error={errors.floor}>
                        <input name="floor" inputMode="numeric" placeholder="Floor Number" value={delivery.floor} onChange={set('floor')} />
                      </Field>
                      <Field label="Landmark" required={false}>
                        <input name="landmark" placeholder="Landmark" value={delivery.landmark} onChange={set('landmark')} />
                      </Field>
                    </div>
                  </fieldset>
                )}

                <Choice type="checkbox" name="saveDefault" checked={delivery.saveDefault} onChange={set('saveDefault')}>
                  Save my details for next time
                </Choice>
              </div>

              <aside className="co-summary co-sticky" aria-label="Delivery summary">
                <h2 className="co-summary-lg">Delivery summary</h2>
                <div className="co-recap">
                  <p>{deliveryLine}</p>
                  {delivery.name && <small>{delivery.name}</small>}
                  {addressLine && <small>{addressLine}</small>}
                  {delivery.phone && <small>{delivery.phone}</small>}
                </div>
                <Button type="submit" className="block co-cta">Continue to Payment <Arrow /></Button>
              </aside>
            </form>
            <Collapsed title="2. Payment" />
            <Collapsed title="3. Review & place order" />
          </>
        )}

        {/* ----- 8.2 Payment ----- */}
        {step === 2 && (
          <>
            <form className="co-grid co-anim" onSubmit={submitPayment} noValidate>
              <div className="co-stack">
                <DoneCard title="1. Delivery" onEdit={() => setStep(1)}>
                  <p className="co-done-main">{deliveryLine}</p>
                  <p className="co-done-sub">{[delivery.name, addressLine, delivery.phone].filter(Boolean).join(' · ')}</p>
                </DoneCard>

                <fieldset className="co-panel co-section">
                  <legend>2. Payment</legend>
                  <div className="co-pay-list">
                    {payOptions.map((o) => (
                      <div key={o.id} className={`co-pay ${payMethod === o.id ? 'is-selected' : ''}`}>
                        <label className="co-pay-head">
                          <input type="radio" name="pay" value={o.id} checked={payMethod === o.id} onChange={() => setPayMethod(o.id)} />
                          <span className="co-radio" aria-hidden="true" />
                          <Icon src={o.icon} size={20} />
                          <span><strong>{o.title}</strong><small>{o.sub}</small></span>
                        </label>
                        {o.id === 'card' && payMethod === 'card' && (
                          <div className="co-card-fields">
                            <Field label="Card number" error={errors.number} className="co-span-3">
                              <input name="number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={card.number} onChange={setCardField('number', formatCardNumber)} />
                            </Field>
                            <Field label="Expiry" error={errors.expiry}>
                              <input name="expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={card.expiry} onChange={setCardField('expiry', formatExpiry)} />
                            </Field>
                            <Field label="CVV" error={errors.cvv}>
                              <input name="cvv" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={card.cvv} onChange={setCardField('cvv', (v) => v.replace(/\D/g, ''))} />
                            </Field>
                            <Field label="Name on card" error={errors.holder}>
                              <input name="holder" autoComplete="cc-name" placeholder="As written on card" value={card.holder} onChange={setCardField('holder')} />
                            </Field>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>

              <OrderSummary lines={lines} total={total} vat={vat}>
                <Button type="submit" className="block co-cta">Continue to Review <Arrow /></Button>
                <p className="co-note">Demo checkout: no payment is taken.</p>
              </OrderSummary>
            </form>
            <Collapsed title="3. Review & place order" />
          </>
        )}

        {/* ----- Review ----- */}
        {step === 3 && (
          <div className="co-grid co-anim">
            <div className="co-stack">
              <DoneCard title="1. Delivery" onEdit={() => setStep(1)}>
                <p className="co-done-main">{deliveryLine}</p>
                <p className="co-done-sub">{[delivery.name, addressLine, delivery.phone, delivery.email].filter(Boolean).join(' · ')}</p>
              </DoneCard>
              <DoneCard title="2. Payment" onEdit={() => setStep(2)}>
                <p className="co-done-main">
                  {payLabel}{payMethod === 'card' && cardTail ? ` ending in ${cardTail}` : ''}
                </p>
                {payMethod === 'installments' && <p className="co-done-sub">{formatPrice(monthly)}/month for {INSTALLMENT_MONTHS} months</p>}
              </DoneCard>
              <section className="co-panel co-section">
                <h2 className="co-legend">3. Review &amp; place order</h2>
                <p className="co-review-text">
                  Check your items and details. By placing the order you agree to GEN-I’s terms of sale and 14-day return policy.
                </p>
                <Button className="block co-cta" onClick={placeOrder}>Place order · {formatPrice(total)}</Button>
              </section>
            </div>
            <OrderSummary lines={lines} total={total} vat={vat}>
              <Button variant="text" size="xs" to="/bag" className="co-edit-bag">Edit bag</Button>
            </OrderSummary>
          </div>
        )}
      </section>
    </div>
  )
}
