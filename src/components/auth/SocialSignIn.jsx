import { useEffect, useRef, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { isLocalAuth } from '@/services/authService'
import { validateEmail, validateIdentifier } from '@/utils/validators'
import './SocialSignIn.css'

const resolve = (value, data) => (typeof value === 'function' ? value(data) : value)

function nameFrom(identifier) {
  const value = identifier.trim()
  if (!value.includes('@')) return 'GEN-I customer'
  const word = value.split('@')[0].split(/[._-]/)[0]
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function relayEmail(identifier) {
  let hash = 0
  for (const ch of identifier) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return `${hash.toString(36).padStart(8, 'x').slice(0, 10)}@privaterelay.appleid.com`
}

// Six single-digit boxes; typing advances, Backspace goes back, pasting fills all of them.
function CodeInput({ value, onChange, onComplete }) {
  const refs = useRef([])
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? '')

  useEffect(() => { refs.current[0]?.focus() }, [])

  function setAt(index, char) {
    const next = digits.slice()
    next[index] = char
    const joined = next.join('').slice(0, 6)
    onChange(joined)
    if (joined.length === 6 && !joined.includes('')) onComplete?.(joined)
  }

  return (
    <div className="ss-code" role="group" aria-label="6-digit code">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          value={digit}
          onChange={(event) => {
            const char = event.target.value.replace(/\D/g, '').slice(-1)
            if (!char) return
            setAt(i, char)
            refs.current[i + 1]?.focus()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace') {
              event.preventDefault()
              if (digit) setAt(i, '')
              else if (i > 0) { setAt(i - 1, ''); refs.current[i - 1]?.focus() }
            }
            if (event.key === 'ArrowLeft') refs.current[i - 1]?.focus()
            if (event.key === 'ArrowRight') refs.current[i + 1]?.focus()
          }}
          onPaste={(event) => {
            event.preventDefault()
            const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
            if (!pasted) return
            onChange(pasted)
            refs.current[Math.min(pasted.length, 5)]?.focus()
          }}
        />
      ))}
    </div>
  )
}

// Step-by-step sign-in for one social provider. Each provider has its own steps
// (Google: account → verify → allow; Facebook: log in → login code → permissions;
// Apple: Apple ID → two-factor → share or hide email). When a backend is configured
// the user is sent to the provider's real page instead.
export default function SocialSignIn({ provider, onClose, onDone }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [data, setData] = useState({ identifier: '', code: '', scopes: {}, shareEmail: true, name: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [finished, setFinished] = useState(false)
  const open = Boolean(provider)

  useEffect(() => {
    if (!open) return
    setStepIndex(0)
    setData({ identifier: '', code: '', scopes: { profile: true, email: true }, shareEmail: true, name: '' })
    setError('')
    setBusy(false)
    setFinished(false)
  }, [open, provider?.id])

  if (!provider) return <Modal open={false} onClose={onClose} title="" />

  const steps = provider.steps
  const step = steps[stepIndex]
  const view = { ...data, name: data.name || nameFrom(data.identifier) }
  const update = (patch) => { setData((current) => ({ ...current, ...patch })); setError('') }
  const wait = (ms) => new Promise((r) => window.setTimeout(r, ms))

  function validateStep() {
    if (step.kind === 'email') return validateEmail(data.identifier)
    if (step.kind === 'identifier') return validateIdentifier(data.identifier)
    if (step.kind === 'code') return /^\d{6}$/.test(data.code) ? '' : 'Enter the 6-digit code.'
    if (step.kind === 'apple-share') return view.name.trim() ? '' : 'Enter your name.'
    return ''
  }

  async function next(event) {
    event?.preventDefault()
    if (busy) return
    const problem = validateStep()
    if (problem) { setError(problem); return }

    setBusy(true)
    await wait(step.kind === 'code' ? 700 : 450)
    setBusy(false)

    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1)
      return
    }

    // Last step: build the profile the provider would hand back.
    const email = data.identifier.includes('@')
      ? (provider.id === 'apple' && !data.shareEmail ? relayEmail(data.identifier)
        : provider.id === 'facebook' && !data.scopes.email ? undefined
        : data.identifier.trim())
      : undefined
    setFinished(true)
    await wait(1100)
    onDone({ identifier: data.identifier, name: view.name.trim(), email })
  }

  function back() {
    setError('')
    if (stepIndex === 0) onClose()
    else setStepIndex(stepIndex - 1)
  }

  const style = { '--ss-color': provider.color, '--ss-deep': provider.colorDeep }

  // Real backend: hand over to the provider's own sign-in page.
  if (!isLocalAuth) {
    return (
      <Modal open={open} onClose={onClose} title={provider.label} headless className={`modal-sm ss ss-${provider.id}`}>
        <div className="ss-wrap" style={style}>
          <div className="ss-brand"><span className="ss-logo">{provider.icon}</span></div>
          <h2 className="ss-title">Continue with {provider.name}</h2>
          <p className="ss-sub">You’ll be taken to {provider.name} to sign in securely, then brought back to GEN-I.</p>
          <ol className="ss-preview">
            {steps.map((s) => <li key={s.id}>{s.short}</li>)}
          </ol>
          <Button size="md" className="ss-cta" onClick={() => onDone({})}>Go to {provider.name}</Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={onClose} title={resolve(step.title, view)} headless className={`modal-sm ss ss-${provider.id}`}>
      <div className="ss-wrap" style={style}>
        <div className="ss-brand">
          <span className="ss-logo">{provider.icon}</span>
          <span className="ss-link" aria-hidden="true"><i /><i /><i /></span>
          <span className="ss-logo ss-logo-app">G</span>
        </div>

        <ol className="ss-progress" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
          {steps.map((s, i) => (
            <li key={s.id} className={i < stepIndex || finished ? 'is-done' : i === stepIndex ? 'is-current' : ''}>
              <span className="ss-dot">{i < stepIndex || finished ? '✓' : i + 1}</span>
              <span className="ss-dot-label">{s.short}</span>
            </li>
          ))}
        </ol>

        {finished ? (
          <div className="ss-done" role="status">
            <span className="ss-done-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            </span>
            <h2 className="ss-title">Signed in with {provider.name}</h2>
            <p className="ss-sub">Welcome, {view.name}. Taking you to GEN-I…</p>
          </div>
        ) : (
          <form key={step.id} className="ss-step" onSubmit={next} noValidate>
            <h2 className="ss-title">{resolve(step.title, view)}</h2>
            <p className="ss-sub">{resolve(step.sub, view)}</p>

            {(step.kind === 'email' || step.kind === 'identifier') && (
              <label className="ss-field">
                <span>{step.label}</span>
                <input
                  autoFocus
                  type={step.kind === 'email' ? 'email' : 'text'}
                  autoComplete="username"
                  placeholder={step.placeholder}
                  value={data.identifier}
                  aria-invalid={Boolean(error)}
                  onChange={(event) => update({ identifier: event.target.value })}
                />
              </label>
            )}

            {step.kind === 'code' && (
              <>
                <CodeInput value={data.code} onChange={(code) => update({ code })} />
                <button type="button" className="ss-text-btn" onClick={() => { update({ code: '' }) }}>
                  Didn’t get it? Send a new code
                </button>
              </>
            )}

            {step.kind === 'consent' && (
              <ul className="ss-scopes">
                {step.scopes.map((scope) => (
                  <li key={scope.id}>
                    <label className="ss-scope">
                      <input
                        type="checkbox"
                        checked={scope.required || data.scopes[scope.id] !== false}
                        disabled={scope.required}
                        onChange={(event) => update({ scopes: { ...data.scopes, [scope.id]: event.target.checked } })}
                      />
                      <span className="ss-scope-box" aria-hidden="true" />
                      <span>{scope.label}{scope.required && <em> · required</em>}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}

            {step.kind === 'apple-share' && (
              <div className="ss-share">
                <label className="ss-field">
                  <span>Name</span>
                  <input autoFocus value={view.name} onChange={(event) => update({ name: event.target.value })} />
                </label>
                {data.identifier.includes('@') && (
                  <fieldset className="ss-radios">
                    <legend>Email</legend>
                    <label className={`ss-radio ${data.shareEmail ? 'is-on' : ''}`}>
                      <input type="radio" name="share" checked={data.shareEmail} onChange={() => update({ shareEmail: true })} />
                      <span><strong>Share My Email</strong>{data.identifier.trim()}</span>
                    </label>
                    <label className={`ss-radio ${!data.shareEmail ? 'is-on' : ''}`}>
                      <input type="radio" name="share" checked={!data.shareEmail} onChange={() => update({ shareEmail: false })} />
                      <span><strong>Hide My Email</strong>Forward to {relayEmail(data.identifier)}</span>
                    </label>
                  </fieldset>
                )}
              </div>
            )}

            {step.note && <p className="ss-note">{step.note}</p>}
            {error && <p className="ss-error" role="alert">{error}</p>}

            <div className="ss-actions">
              <Button variant="outline-grey" size="md" onClick={back}>{stepIndex === 0 ? 'Cancel' : 'Back'}</Button>
              <Button type="submit" size="md" className="ss-cta" loading={busy}>{resolve(step.cta, view)}</Button>
            </div>
          </form>
        )}

        <p className="ss-demo">Demo sign-in: any valid email or number and any 6-digit code work until the backend is connected.</p>
      </div>
    </Modal>
  )
}
