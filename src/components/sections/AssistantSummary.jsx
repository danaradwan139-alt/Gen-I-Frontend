import './AssistantSummary.css'

const defaultChips = ['Best camera', 'Longest battery', 'Under 70,000 EGP']

// Sparkle icon, vector boxes taken from the Figma export (24x24 box)
function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M11 3C11.6 7 14.4 9.8 18.4 10.4C14.4 11 11.6 13.8 11 17.8C10.4 13.8 7.6 11 3.6 10.4C7.6 9.8 10.4 7 11 3Z"
        fill="#FFFFFF"
      />
      <path
        d="M18.5 14.5C18.7 16 20 17.3 21.5 17.5C20 17.7 18.7 19 18.5 20.5C18.3 19 17 17.7 15.5 17.5C17 17.3 18.3 16 18.5 14.5Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

const askAssistant = (message) => window.dispatchEvent(new CustomEvent('open-assistant', { detail: { message } }))

/**
 * chips: array of strings or { label, onClick }. A chip without onClick sends its label to the GEN-I Assistant.
 */
export default function AssistantSummary({
  title = 'Not sure which iPhone to pick?',
  text = 'Tell GEN-I how you use your phone and get a personal recommendation.',
  chips = defaultChips,
}) {
  return (
    <section className="assistant-summary">
      <div className="assistant-title">
        <span className="assistant-avatar">
          <SparkleIcon />
        </span>
        <h2>{title}</h2>
      </div>

      <p>{text}</p>

      <div className="assistant-chips">
        {chips.map((chip) => {
          const { label, onClick } = typeof chip === 'string' ? { label: chip } : chip
          return (
            <button
              key={label}
              type="button"
              className="assistant-chip chip"
              onClick={onClick ?? (() => askAssistant(label))}
            >
              {label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
