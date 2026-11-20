import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { assets as A } from '@/assets/assets'
import { Icon } from '@/components/ui/Icon'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import './RepairPage.css'

const repairServices = [
  'Screen replacement',
  'Battery replacement',
  'Back glass repair',
  'Camera repair',
  'Charging port',
  'Water damage check',
]

// Day and time slots from the "5.2 Repair" frame
const days = ['Today', 'Tomorrow', 'Saturday', 'Sunday']
const times = ['10:00', '13:00', '15:30', '17:00', '19:00']

const followups = ['How long will my repair take?', 'What does the warranty cover?', 'Can I get a free diagnosis?']

function askAssistant(message) {
  window.dispatchEvent(new CustomEvent('open-assistant', { detail: { message } }))
}

export default function RepairPage() {
  const [searchParams] = useSearchParams()
  const requested = searchParams.get('service')
  const service = repairServices.includes(requested) ? requested : 'Screen replacement'

  const [selectedDay, setSelectedDay] = useState('Today')
  const [selectedTime, setSelectedTime] = useState('10:00')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const nameRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  function editDetails() {
    setSubmitted(false)
    window.requestAnimationFrame(() => nameRef.current?.focus())
  }

  return (
    <div className="repair-page">
      <section className="repair-header">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/" className="crumb-link">
            Home <Icon src={A.chevronTeal} inset="21.49% 33.66% 21.48% 33.68%" kind="chev" />
          </Link>
          <span aria-current="page">Repairs</span>
        </nav>

        <button type="button" className="assistant-pill" onClick={() => askAssistant('Help me book an iPhone repair.')}>
          <Avatar />
          <span>Ask GEN-I assistant about your repair</span>
        </button>

        <h1 className="repair-title">Book your repair.</h1>
      </section>

      <section className="repair-summary-wrap">
        <div className="assistant-box">
          <div className="assistant-box-title">
            <Avatar />
            <h2>Our take for you</h2>
          </div>
          <p>
            Book your repair online and bring your device to a GEN-I store. Our team will diagnose the issue and
            confirm the repair price before any work begins.
          </p>
          <div className="assistant-box-chips">
            {followups.map((q) => (
              <button key={q} type="button" className="chip" onClick={() => askAssistant(q)}>{q}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="repair-body">
        <aside className="repair-card" aria-labelledby="repair-card-title">
          <h2 id="repair-card-title">Your repair</h2>
          <dl className="repair-rows">
            <div><dt>Device</dt><dd>iPhone Pro</dd></div>
            <div><dt>Repair</dt><dd>{service}</dd></div>
            <div><dt>Ready</dt><dd>Same day*</dd></div>
            <div><dt>Warranty</dt><dd>Included*</dd></div>
            <div><dt>Price</dt><dd>After free diagnosis</dd></div>
          </dl>
          <p className="repair-note">*Repair time and warranty details are confirmed by the repair team after diagnosis.</p>
          <Button variant="text" size="xs" className="tight" onClick={editDetails}>Edit details</Button>
        </aside>

        <form className="repair-form" onSubmit={handleSubmit}>
          {submitted ? (
            <div className="repair-success" role="status">
              <Avatar />
              <h2>Request ready!</h2>
              <p>
                Your repair request for {selectedDay.toLowerCase()} at {selectedTime} has been prepared. Connect this
                form to your booking service to send it to the GEN-I team.
              </p>
              <Button variant="outline-teal" size="md" onClick={editDetails}>Edit details</Button>
            </div>
          ) : (
            <>
              <fieldset className="repair-group">
                <legend>1. Pick a day</legend>
                <div className="repair-chips">
                  {days.map((day) => (
                    <button key={day} type="button" className="chip" aria-pressed={selectedDay === day} onClick={() => setSelectedDay(day)}>
                      {day}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="repair-group">
                <legend>2. Pick a time</legend>
                <div className="repair-chips">
                  {times.map((time) => (
                    <button key={time} type="button" className="chip" aria-pressed={selectedTime === time} onClick={() => setSelectedTime(time)}>
                      {time}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="repair-group">
                <legend>3. Your details</legend>
                <div className="repair-inputs">
                  <label>
                    <span className="sr-only">Full name</span>
                    <input ref={nameRef} type="text" placeholder="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </label>
                  <label>
                    <span className="sr-only">Mobile number</span>
                    <input type="tel" placeholder="Mobile number" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </label>
                </div>
              </fieldset>

              <Button type="submit" className="block">Confirm booking</Button>
              <p className="repair-footnote">No payment is taken now. The repair price is confirmed after diagnosis.</p>
            </>
          )}
        </form>
      </section>
    </div>
  )
}
