import { useEffect, useId, useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import './ConfirmDialog.css'

// tone: danger (delete / remove) | warning (log out, turn something off) | save (keep changes)
const toneIcons = {
  danger: (
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  ),
  warning: (
    <><path d="M12 3l9.5 17h-19L12 3z" /><path d="M12 10v4.5M12 17.5v.01" /></>
  ),
  save: (
    <><path d="M5 3h11l3 3v15H5V3z" /><path d="M8 3v5h7V3M8 21v-7h8v7" /></>
  ),
  logout: (
    <><path d="M14 4h5v16h-5" /><path d="M10 8l-4 4 4 4M6 12h10" /></>
  ),
  shield: (
    <><path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z" /><path d="M12 8v5M12 16v.01" /></>
  ),
}

function ToneIcon({ icon }) {
  const glyph = (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {toneIcons[icon] ?? toneIcons.warning}
    </svg>
  )
  // The second copy is flipped and faded to read as a reflection on a glossy floor.
  return (
    <div className="cd-icon-wrap" aria-hidden="true">
      <div className="cd-icon">{glyph}</div>
      <div className="cd-icon cd-icon-mirror">{glyph}</div>
    </div>
  )
}

// Confirmation popup. Pass `secondStep` to make the user confirm twice; the dialog flips to a
// final "are you sure" face. `secondStep.requireText` makes them type a word before confirming.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  icon,
  secondStep,
  onConfirm,
  onClose,
}) {
  const [step, setStep] = useState(1)
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const inputId = useId()

  useEffect(() => {
    if (open) { setStep(1); setTyped(''); setBusy(false) }
  }, [open])

  const onFinal = !secondStep || step === 2
  const current = step === 2 ? { title, message, confirmLabel, ...secondStep } : { title, message, confirmLabel }
  const needsText = onFinal && secondStep?.requireText
  const textOk = !needsText || typed.trim().toUpperCase() === secondStep.requireText.toUpperCase()
  const totalSteps = secondStep ? 2 : 1

  async function handleConfirm() {
    if (!onFinal) { setStep(2); return }
    if (!textOk || busy) return
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={current.title} headless className={`modal-sm cd cd-${tone}`}>
      <div key={step} className={`cd-face ${step === 2 ? 'cd-face-final' : ''}`}>
        <ToneIcon icon={icon ?? (step === 2 && tone === 'danger' ? 'shield' : tone)} />

        {totalSteps > 1 && (
          <div className="cd-steps" aria-label={`Step ${step} of ${totalSteps}`}>
            {[1, 2].map((n) => <span key={n} className={`cd-step ${n <= step ? 'is-on' : ''}`} />)}
            <span className="cd-step-label">{step === 1 ? 'Step 1 of 2' : 'Final confirmation'}</span>
          </div>
        )}

        <h2 className="cd-title">{current.title}</h2>
        <p className="cd-text">{current.message}</p>

        {needsText && (
          <div className="cd-type">
            <label htmlFor={inputId}>Type <strong>{secondStep.requireText}</strong> to confirm</label>
            <input
              id={inputId}
              autoFocus
              autoComplete="off"
              spellCheck="false"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); handleConfirm() } }}
            />
          </div>
        )}

        <div className="cd-actions">
          <Button variant="outline-grey" size="md" className="cd-cancel" onClick={onClose}>{cancelLabel}</Button>
          <Button size="md" className="cd-confirm" disabled={!textOk} loading={busy} onClick={handleConfirm}>
            {onFinal ? current.confirmLabel : 'Continue'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
