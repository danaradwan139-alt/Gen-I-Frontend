
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './RepairPage.css'

const repairServices = [
  'Screen replacement',
  'Battery replacement',
  'Back glass repair',
  'Camera repair',
  'Charging port',
  'Water damage check',
]

const days = ['Today', 'Tomorrow', 'Fri', 'Sat']
const times = ['09:00', '10:00', '11:00', '12:00', '13:00']

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.8 2.8L12.7 9.2L19.1 11.1L12.7 13L10.8 19.4L8.9 13L2.5 11.1L8.9 9.2L10.8 2.8Z"
        fill="white"
      />
      <path
        d="M18.2 15.2L19.1 18.1L22 19L19.1 19.9L18.2 22.8L17.3 19.9L14.4 19L17.3 18.1L18.2 15.2Z"
        fill="white"
      />
    </svg>
  )
}

function AssistantAvatar() {
  return (
    <span className="repair-assistant-avatar">
      <SparkleIcon />
    </span>
  )
}

export default function RepairPage() {
  const [searchParams] = useSearchParams()

  const requestedService = searchParams.get('service')
  const initialService = repairServices.includes(requestedService)
    ? requestedService
    : 'Screen replacement'

  const [service, setService] = useState(initialService)
  const [selectedDay, setSelectedDay] = useState('Today')
  const [selectedTime, setSelectedTime] = useState('10:00')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="repair-page">
      <section className="repair-page-header">
        <nav className="repair-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M6 3.5L10.5 8L6 12.5" />
          </svg>
          <span>Repair</span>
        </nav>

        <button
          className="repair-assistant-prompt"
          type="button"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('open-assistant', {
                detail: { message: 'Help me book an iPhone repair.' },
              }),
            )
          }}
        >
          <AssistantAvatar />
          <span>Ask GEN-I assistant about your repair</span>
        </button>

        <h1>Book your repair.</h1>
      </section>

      <section className="repair-summary-wrap">
        <div className="repair-assistant-summary">
          <div className="repair-summary-title">
            <AssistantAvatar />
            <h2>Our take for you</h2>
          </div>

          <p>
            Book your repair online and bring your device to a GEN-I store.
            Our team will diagnose the issue and confirm the repair price
            before any work begins.
          </p>

          <div className="repair-followups">
            {[
              'How long will my repair take?',
              'What does the warranty cover?',
              'Can I get a free diagnosis?',
            ].map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open-assistant', {
                      detail: { message: question },
                    }),
                  )
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="repair-booking-body">
        <aside className="repair-order-summary">
          <h2>Your repair</h2>

          <div className="repair-summary-row">
            <span>Device</span>
            <strong>iPhone Pro</strong>
          </div>

          <div className="repair-summary-row">
            <span>Repair</span>
            <strong>{service}</strong>
          </div>

          <div className="repair-summary-row">
            <span>Ready</span>
            <strong>Same day*</strong>
          </div>

          <div className="repair-summary-row">
            <span>Warranty</span>
            <strong>Included*</strong>
          </div>

          <div className="repair-summary-row">
            <span>Price</span>
            <strong>After free diagnosis</strong>
          </div>

          <p className="repair-summary-note">
            *Repair time and warranty details are confirmed by the repair team
            after diagnosis.
          </p>

          <Link to="/shop" className="repair-back-to-shop">
            Continue shopping
          </Link>
        </aside>

        <form className="repair-booking-form" onSubmit={handleSubmit}>
          {submitted ? (
            <div className="repair-success" role="status">
              <AssistantAvatar />
              <h2>Request ready!</h2>
              <p>
                Your repair request has been prepared. Connect this form to
                your booking service to send it to the GEN-I team.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
              >
                Edit details
              </button>
            </div>
          ) : (
            <>
              <div className="repair-form-group">
                <h3>1. Pick a day</h3>
                <div className="repair-choice-list">
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={selectedDay === day ? 'selected' : ''}
                      aria-pressed={selectedDay === day}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="repair-form-group">
                <h3>2. Pick a time</h3>
                <div className="repair-choice-list">
                  {times.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={selectedTime === time ? 'selected' : ''}
                      aria-pressed={selectedTime === time}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="repair-form-group">
                <h3>3. Your details</h3>
                <div className="repair-input-row">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />

                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                </div>
              </div>

              <button className="repair-submit-button" type="submit">
                Request a repair booking
              </button>

              <p className="repair-form-footnote">
                No payment is taken now. The repair price is confirmed after
                diagnosis.
              </p>
            </>
          )}
        </form>
      </section>
    </main>
  )
}
