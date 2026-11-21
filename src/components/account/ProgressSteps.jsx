import { CheckIcon } from './icons'
import './records.css'

// Four-step tracker for orders and repairs. Steps up to `current` are teal, finished steps show a tick.
// `complete` marks every step finished (a delivered order) and leaves no "current" step.
export default function ProgressSteps({ steps, current, label, complete = false }) {
  return (
    <ol className="track" aria-label={label} tabIndex={0}>
      {steps.map((step, index) => {
        const number = index + 1
        const reached = complete || number <= current
        const done = complete || number < current
        return (
          <li key={step.label} className="track-step" aria-current={!complete && number === current ? 'step' : undefined}>
            <div className="track-line">
              <span className={`track-dot ${reached ? 'is-reached' : ''}`}>
                {done ? <CheckIcon size={18} strokeWidth={2} /> : number}
              </span>
              <span className={`track-bar ${reached ? 'is-reached' : ''}`} aria-hidden="true" />
            </div>
            <div className="track-text">
              <p className="track-label">{done && <span className="sr-only">Completed: </span>}{step.label}</p>
              <p className="track-note">{step.note}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
