import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products, formatPrice } from '@/data/products'
import { getIphoneImage } from '@/data/iphoneImages'
import { assets as A } from '@/assets/assets'
import { Icon, Arrow } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { VAT_RATE } from '@/hooks/useBagItems'
import { useSessionState } from '@/hooks/useSessionState'
import {
  Stepper, Field, Collapsed, DoneCard, OrderSummary,
  validateCard, formatCardNumber, formatExpiry, tomorrow, prettyDate,
} from '@/components/checkout/CheckoutParts'
import './BusinessCheckoutPage.css'

// Business checkout (Figma section "Business - Checkout": 03.2 Items, 03.3 Delivery & deadline,
// 03.4 Payment, 03.5 Review / confirmation).

const STEPS = ['Items', 'Delivery & deadline', 'Payment', 'Review']
const MIN_UNITS = 10
const MAX_QTY = 9999
const LOCATIONS_KEY = 'geni-business-locations'

// Volume tiers from the "Save more as you scale" section (03.1)
const TIERS = [
  { min: 200, name: 'Enterprise & tenders', note: 'Custom contract pricing' },
  { min: 50, name: 'Business', note: 'Bigger savings' },
  { min: 10, name: 'Team', note: 'Business pricing' },
]
const tierFor = (units) => TIERS.find((t) => units >= t.min) || null

// Every product variant as a pickable option
const catalog = products.flatMap((product) =>
  product.variants.map((variant) => ({
    key: `${product.id}::${variant.id}`,
    label: `${product.name} · ${variant.label}`,
    product,
    variant,
  }))
)

function loadLocations() {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCATIONS_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function LineIcon() {
  return (
    <span className="bz-thumb" aria-hidden="true">
      <svg viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></svg>
    </span>
  )
}

function PinIcon() {
  return (
    <svg className="bz-pin" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

function Qty({ value, onChange, name }) {
  const [draft, setDraft] = useState(String(value))
  useEffect(() => setDraft(String(value)), [value])
  const commit = (raw) => {
    const n = Math.max(1, Math.min(MAX_QTY, Number(raw) || 1))
    onChange(n)
    setDraft(String(n))
  }
  return (
    <div className="qty-stepper bz-qty" role="group" aria-label={`${name} quantity`}>
      <button type="button" onClick={() => commit(value - 1)} disabled={value <= 1} aria-label={`Decrease ${name}`}>−</button>
      <input
        inputMode="numeric"
        aria-label={`${name} units`}
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 4))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), commit(e.currentTarget.value))}
      />
      <button type="button" onClick={() => commit(value + 1)} disabled={value >= MAX_QTY} aria-label={`Increase ${name}`}>+</button>
    </div>
  )
}

const emptyLocation = { name: '', address: '', phone: '' }

export default function BusinessCheckoutPage() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useSessionState('geni-biz-step', 1)
  const [items, setItems] = useSessionState('geni-biz-items', [])
  const [company, setCompany] = useSessionState('geni-biz-company', { company: '', contact: '', email: '', phone: '', taxId: '' })
  const [neededBy, setNeededBy] = useSessionState('geni-biz-date', '')
  const [selectedLocations, setSelectedLocations] = useSessionState('geni-biz-locations', [])
  const [payMethod, setPayMethod] = useSessionState('geni-biz-pay', 'card')
  const [locations, setLocations] = useState(loadLocations)
  const [newLocation, setNewLocation] = useState(emptyLocation)
  const [addingLocation, setAddingLocation] = useState(() => loadLocations().length === 0)
  const [pick, setPick] = useState('')
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' })
  const [errors, setErrors] = useState({})
  const [order, setOrder] = useState(null)
  const topRef = useRef(null)

  // ?product=<id> (e.g. from a product page) seeds the order with 10 units of that product
  useEffect(() => {
    const id = searchParams.get('product')
    const product = products.find((p) => p.id === id)
    if (product && !items.some((i) => i.productId === id)) {
      setItems((current) => [...current, { productId: id, variantId: product.variants[0].id, quantity: MIN_UNITS }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations))
    } catch {
      /* ignore */
    }
  }, [locations])

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step, order])

  // Card details are never stored: after a refresh on Review, go back to Payment
  useEffect(() => {
    if (step === 4 && payMethod === 'card' && !card.number) setStep(3)
  }, [step, payMethod, card.number, setStep])

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId)
          const variant = product?.variants.find((v) => v.id === item.variantId)
          if (!product || !variant) return null
          return { ...item, product, variant, image: getIphoneImage(product) || product.image }
        })
        .filter(Boolean),
    [items]
  )
  const units = lines.reduce((sum, l) => sum + l.quantity, 0)
  const total = lines.reduce((sum, l) => sum + l.variant.price * l.quantity, 0)
  const vat = Math.round(total - total / (1 + VAT_RATE))
  const tier = tierFor(units)
  const chosenLocations = locations.filter((l) => selectedLocations.includes(l.id))

  const payOptions = [
    { id: 'card', title: 'Credit or debit card', sub: 'Visa, Mastercard, Meeza', icon: A.card },
    { id: 'transfer', title: 'Bank transfer', sub: 'We send bank details with your official tax invoice', icon: A.invoice },
    ...(units >= 50 ? [{ id: 'po', title: 'Purchase order & credit terms', sub: 'Available from 50 units · confirmed by your account manager', icon: A.invoice }] : []),
  ]
  useEffect(() => {
    if (!payOptions.some((o) => o.id === payMethod)) setPayMethod('card')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units])

  const clearError = (key) => setErrors((e) => ({ ...e, [key]: undefined }))
  const setQty = (line, quantity) =>
    setItems((current) => current.map((i) => (i.productId === line.productId && i.variantId === line.variantId ? { ...i, quantity } : i)))
  const removeLine = (line) =>
    setItems((current) => current.filter((i) => !(i.productId === line.productId && i.variantId === line.variantId)))

  function addPicked() {
    const option = catalog.find((c) => c.key === pick)
    if (!option) return setErrors((e) => ({ ...e, pick: 'Choose a model first' }))
    const existing = items.find((i) => i.productId === option.product.id && i.variantId === option.variant.id)
    if (existing) setQty(existing, Math.min(MAX_QTY, existing.quantity + MIN_UNITS))
    else setItems((current) => [...current, { productId: option.product.id, variantId: option.variant.id, quantity: MIN_UNITS }])
    setPick('')
    clearError('pick')
  }

  function focusFirst(errs) {
    const first = Object.keys(errs)[0]
    if (first) document.querySelector(`[name="${first}"]`)?.focus()
  }

  function submitItems(event) {
    event.preventDefault()
    const errs = {}
    if (lines.length === 0) errs.pick = 'Add at least one product'
    else if (units < MIN_UNITS) errs.pick = `Business orders start at ${MIN_UNITS} units (you have ${units})`
    if (company.company.trim().length < 2) errs.company = 'Enter your company name'
    if (company.contact.trim().length < 3) errs.contact = 'Enter a contact name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email.trim())) errs.email = 'Enter a valid work email'
    if (!/^\+?[0-9\s-]{10,16}$/.test(company.phone.trim())) errs.phone = 'Enter a valid phone number'
    setErrors(errs)
    if (Object.keys(errs).length) return focusFirst(errs)
    setStep(2)
  }

  function saveLocation() {
    const errs = {}
    if (newLocation.name.trim().length < 2) errs.locName = 'Name this location'
    if (newLocation.address.trim().length < 5) errs.locAddress = 'Enter the address'
    if (!/^\+?[0-9\s-]{10,16}$/.test(newLocation.phone.trim())) errs.locPhone = 'Enter a valid phone number'
    setErrors((e) => ({ ...e, ...errs, locations: undefined }))
    if (Object.keys(errs).length) return focusFirst(errs)
    const location = { ...newLocation, id: `loc-${Date.now()}`, isDefault: locations.length === 0 }
    setLocations((current) => [...current, location])
    setSelectedLocations((current) => [...current, location.id])
    setNewLocation(emptyLocation)
    setAddingLocation(false)
  }

  function toggleLocation(id) {
    setSelectedLocations((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))
    clearError('locations')
  }

  function submitDelivery(event) {
    event.preventDefault()
    const errs = {}
    if (chosenLocations.length === 0) errs.locations = 'Choose at least one delivery location'
    if (!neededBy) errs.neededBy = 'Pick a date'
    else if (neededBy < tomorrow()) errs.neededBy = 'Pick tomorrow or later'
    setErrors(errs)
    if (Object.keys(errs).length) return focusFirst(errs)
    setStep(3)
  }

  function submitPayment(event) {
    event.preventDefault()
    if (payMethod === 'card') {
      const errs = validateCard(card)
      setErrors(errs)
      if (Object.keys(errs).length) return focusFirst(errs)
    }
    setStep(4)
  }

  function placeOrder() {
    setOrder({
      number: `GB-${String(Date.now()).slice(-6)}`,
      lines, total, vat, units, company: { ...company }, locations: chosenLocations, neededBy, payMethod,
      placedAt: new Date(),
    })
    setItems([])
    setCard({ number: '', expiry: '', cvv: '', holder: '' })
    setStep(1)
  }

  function newRequest() {
    setOrder(null)
    setSelectedLocations([])
    setNeededBy('')
  }

  const payLabel = payOptions.find((o) => o.id === payMethod)?.title
  const cardTail = card.number.replace(/\s/g, '').slice(-4)

  const summary = (children) => (
    <aside className="co-summary co-sticky bz-summary" aria-label="Request summary">
      <h2 className="co-summary-lg">Request summary</h2>
      {tier ? (
        <span className="bz-tier"><strong>{tier.name} tier</strong> · {tier.note}</span>
      ) : (
        <span className="bz-tier is-locked">Business pricing starts at {MIN_UNITS} units</span>
      )}
      <dl className="co-totals">
        {step >= 2 && company.company && <div><dt>Company</dt><dd>{company.company}</dd></div>}
        <div><dt>Units</dt><dd>{units}</dd></div>
        {step >= 2 && <div><dt>Locations</dt><dd>{chosenLocations.length}</dd></div>}
        {step >= 2 && neededBy && <div><dt>Needed by</dt><dd>{prettyDate(neededBy)}</dd></div>}
      </dl>
      {children}
    </aside>
  )

  /* ----- 03.5 Confirmation ----- */
  if (order) {
    const first = order.company.contact.trim().split(' ')[0] || 'there'
    const time = order.placedAt.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })
    const status = [
      { title: 'Order placed', sub: `Today, ${time}`, state: 'done' },
      { title: 'Preparing your order', sub: 'Your account manager is reviewing pricing and stock', state: 'current' },
      { title: 'Out for delivery', sub: `${order.locations.length} ${order.locations.length === 1 ? 'location' : 'locations'}`, state: 'next' },
      { title: 'Delivered', sub: `By ${prettyDate(order.neededBy)}`, state: 'next' },
    ]
    return (
      <div className="co-page" ref={topRef}>
        <section className="co-confirm">
          <span className="co-success" aria-hidden="true"><svg viewBox="0 0 44 44"><path d="M12 23l7 7 14-15" /></svg></span>
          <h1 className="co-title">Thank you, {first}!</h1>
          <p className="co-confirm-sub">Your order #{order.number} for {order.company.company} is confirmed.</p>
        </section>
        <section className="co-body co-body-confirm">
          <div className="co-tracking">
            <h2>Delivery status</h2>
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
              <Button variant="outline-teal" className="block" onClick={newRequest}>New request</Button>
            </div>
          </div>
          <OrderSummary lines={order.lines} total={order.total} vat={order.vat} title="Request summary" />
        </section>
      </div>
    )
  }

  return (
    <div className="co-page" ref={topRef}>
      <section className="co-header">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/" className="crumb-link">Home <Icon src={A.chevronTeal} inset="21.49% 33.66% 21.48% 33.68%" kind="chev" /></Link>
          <Link to="/#business" className="crumb-link">Business <Icon src={A.chevronTeal} inset="21.49% 33.66% 21.48% 33.68%" kind="chev" /></Link>
          <span aria-current="page">New quote request</span>
        </nav>
        <h1 className="co-title">Request a business quote</h1>
        <Stepper steps={STEPS} step={step} />
      </section>

      <section className="co-body">
        {/* ----- 03.2 Items ----- */}
        {step === 1 && (
          <>
            <form className="co-grid co-anim" onSubmit={submitItems} noValidate>
              <div className="co-stack">
                <fieldset className="co-panel co-section">
                  <legend>1. Items ({lines.length})</legend>
                  {lines.length > 0 && (
                    <ul className="bz-lines">
                      {lines.map((line) => (
                        <li key={`${line.productId}-${line.variantId}`} className="bz-line">
                          <LineIcon />
                          <span className="bz-line-info">
                            <strong>{line.product.name} · {line.variant.label}</strong>
                            <small>
                              Unit price: {formatPrice(line.variant.price)}
                              <span aria-hidden="true"> · </span>
                              <button type="button" className="bz-remove" onClick={() => removeLine(line)}>Remove</button>
                            </small>
                          </span>
                          <Qty name={line.product.name} value={line.quantity} onChange={(q) => setQty(line, q)} />
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="bz-add">
                    <Field label="Add a product" required={false} error={errors.pick}>
                      <select name="pick" value={pick} onChange={(e) => { setPick(e.target.value); clearError('pick') }}>
                        <option value="">Choose an exact model, e.g. “iPhone 16 · 256 GB”</option>
                        {catalog.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                      </select>
                    </Field>
                    <Button variant="outline-teal" size="md" onClick={addPicked}>Add</Button>
                  </div>
                </fieldset>

                <fieldset className="co-panel co-section bz-quiet">
                  <legend>Company &amp; contact</legend>
                  <div className="co-fields">
                    <Field label="Company name" error={errors.company}>
                      <input name="company" autoComplete="organization" placeholder="Nile Logistics" value={company.company} onChange={(e) => { setCompany((c) => ({ ...c, company: e.target.value })); clearError('company') }} />
                    </Field>
                    <Field label="Contact name" error={errors.contact}>
                      <input name="contact" autoComplete="name" placeholder="Mohamed Ahmed" value={company.contact} onChange={(e) => { setCompany((c) => ({ ...c, contact: e.target.value })); clearError('contact') }} />
                    </Field>
                    <Field label="Tax ID" required={false}>
                      <input name="taxId" placeholder="For your official tax invoice" value={company.taxId} onChange={(e) => setCompany((c) => ({ ...c, taxId: e.target.value }))} />
                    </Field>
                    <Field label="Work email" error={errors.email}>
                      <input name="email" type="email" autoComplete="email" placeholder="name@company.com" value={company.email} onChange={(e) => { setCompany((c) => ({ ...c, email: e.target.value })); clearError('email') }} />
                    </Field>
                    <Field label="Phone" error={errors.phone}>
                      <input name="phone" type="tel" autoComplete="tel" placeholder="+20 100 000 0000" value={company.phone} onChange={(e) => { setCompany((c) => ({ ...c, phone: e.target.value })); clearError('phone') }} />
                    </Field>
                  </div>
                </fieldset>
              </div>

              {summary(<Button type="submit" className="block co-cta">Continue to Delivery <Arrow /></Button>)}
            </form>
            <Collapsed title="2. Delivery & deadline" />
            <Collapsed title="3. Payment" />
            <Collapsed title="4. Review" />
          </>
        )}

        {/* ----- 03.3 Delivery & deadline ----- */}
        {step === 2 && (
          <>
            <form className="co-grid co-anim" onSubmit={submitDelivery} noValidate>
              <div className="co-stack">
                <DoneCard title={`1. Items (${lines.length})`} onEdit={() => setStep(1)}>
                  <dl className="bz-recap">
                    <div><dt>Company</dt><dd>{company.company}</dd></div>
                    <div><dt>Units</dt><dd>{units}</dd></div>
                  </dl>
                </DoneCard>

                <fieldset className="co-panel co-section">
                  <legend>2. Delivery &amp; deadline</legend>
                  {locations.length > 0 && (
                    <div className="bz-locations" role="group" aria-label="Delivery locations">
                      {locations.map((loc) => {
                        const on = selectedLocations.includes(loc.id)
                        return (
                          <button key={loc.id} type="button" className="bz-location" aria-pressed={on} onClick={() => toggleLocation(loc.id)}>
                            <span className="bz-location-head">
                              <PinIcon />
                              <strong>{loc.name}</strong>
                              {loc.isDefault && <span className="badge">Default</span>}
                            </span>
                            <small>{loc.address}</small>
                            <small>{loc.phone}</small>
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {errors.locations && <p className="co-error" role="alert">{errors.locations}</p>}

                  {addingLocation ? (
                    <div className="bz-new-location">
                      <div className="co-fields">
                        <Field label="Location name" error={errors.locName}>
                          <input name="locName" placeholder="Smart Village HQ" value={newLocation.name} onChange={(e) => { setNewLocation((l) => ({ ...l, name: e.target.value })); clearError('locName') }} />
                        </Field>
                        <Field label="Address" error={errors.locAddress}>
                          <input name="locAddress" autoComplete="street-address" placeholder="12 Nile St, Zamalek, Cairo" value={newLocation.address} onChange={(e) => { setNewLocation((l) => ({ ...l, address: e.target.value })); clearError('locAddress') }} />
                        </Field>
                        <Field label="Phone" error={errors.locPhone}>
                          <input name="locPhone" type="tel" placeholder="+20 100 000 0000" value={newLocation.phone} onChange={(e) => { setNewLocation((l) => ({ ...l, phone: e.target.value })); clearError('locPhone') }} />
                        </Field>
                      </div>
                      <div className="bz-row-actions">
                        <Button size="md" onClick={saveLocation}>Save location</Button>
                        {locations.length > 0 && <Button variant="text" size="md" onClick={() => setAddingLocation(false)}>Cancel</Button>}
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline-teal" size="md" className="bz-add-location" onClick={() => setAddingLocation(true)}>+ Add location</Button>
                  )}

                  <Field label="Needed by" error={errors.neededBy} className="co-date">
                    <input type="date" name="neededBy" min={tomorrow()} value={neededBy} onChange={(e) => { setNeededBy(e.target.value); clearError('neededBy') }} />
                  </Field>
                </fieldset>
              </div>
              {summary(<Button type="submit" className="block co-cta">Continue to Payment <Arrow /></Button>)}
            </form>
            <Collapsed title="3. Payment" />
            <Collapsed title="4. Review" />
          </>
        )}

        {/* ----- 03.4 Payment ----- */}
        {step === 3 && (
          <>
            <form className="co-grid co-anim" onSubmit={submitPayment} noValidate>
              <div className="co-stack">
                <DoneCard title={`1. Items (${lines.length})`} onEdit={() => setStep(1)}>
                  <dl className="bz-recap">
                    <div><dt>Company</dt><dd>{company.company}</dd></div>
                    <div><dt>Units</dt><dd>{units}</dd></div>
                  </dl>
                </DoneCard>
                <DoneCard title="2. Delivery & deadline" onEdit={() => setStep(2)}>
                  <dl className="bz-recap">
                    <div><dt>Locations</dt><dd>{chosenLocations.length}</dd></div>
                    <div><dt>Needed by</dt><dd>{prettyDate(neededBy)}</dd></div>
                  </dl>
                </DoneCard>

                <fieldset className="co-panel co-section">
                  <legend>3. Payment</legend>
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
                              <input name="number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={card.number} onChange={(e) => { setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) })); clearError('number') }} />
                            </Field>
                            <Field label="Expiry" error={errors.expiry}>
                              <input name="expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={card.expiry} onChange={(e) => { setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) })); clearError('expiry') }} />
                            </Field>
                            <Field label="CVV" error={errors.cvv}>
                              <input name="cvv" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={card.cvv} onChange={(e) => { setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '') })); clearError('cvv') }} />
                            </Field>
                            <Field label="Name on card" error={errors.holder}>
                              <input name="holder" autoComplete="cc-name" placeholder="As written on card" value={card.holder} onChange={(e) => { setCard((c) => ({ ...c, holder: e.target.value })); clearError('holder') }} />
                            </Field>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <OrderSummary lines={lines} total={total} vat={vat} title="Request summary">
                <Button type="submit" className="block co-cta">Continue to Review <Arrow /></Button>
                <p className="co-note">Demo checkout: no payment is taken. Volume pricing is confirmed by your account manager.</p>
              </OrderSummary>
            </form>
            <Collapsed title="4. Review" />
          </>
        )}

        {/* ----- Review ----- */}
        {step === 4 && (
          <div className="co-grid co-anim">
            <div className="co-stack">
              <DoneCard title={`1. Items (${lines.length})`} onEdit={() => setStep(1)}>
                <dl className="bz-recap">
                  <div><dt>Company</dt><dd>{company.company}</dd></div>
                  <div><dt>Contact</dt><dd>{company.contact} · {company.email}</dd></div>
                  <div><dt>Units</dt><dd>{units}</dd></div>
                </dl>
              </DoneCard>
              <DoneCard title="2. Delivery & deadline" onEdit={() => setStep(2)}>
                <dl className="bz-recap">
                  <div><dt>Locations</dt><dd>{chosenLocations.map((l) => l.name).join(', ')}</dd></div>
                  <div><dt>Needed by</dt><dd>{prettyDate(neededBy)}</dd></div>
                </dl>
              </DoneCard>
              <DoneCard title="3. Payment" onEdit={() => setStep(3)}>
                <p className="co-done-main">{payLabel}{payMethod === 'card' && cardTail ? ` ending in ${cardTail}` : ''}</p>
              </DoneCard>
              <section className="co-panel co-section">
                <h2 className="co-legend">4. Review</h2>
                <p className="co-review-text">
                  Check the items, locations and deadline. Your account manager confirms volume pricing and sends an official tax invoice before delivery.
                </p>
                <Button className="block co-cta" onClick={placeOrder}>Place order · {formatPrice(total)}</Button>
              </section>
            </div>
            <OrderSummary lines={lines} total={total} vat={vat} title="Request summary" />
          </div>
        )}
      </section>
    </div>
  )
}
