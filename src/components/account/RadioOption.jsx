import './records.css'

// Selectable card with a radio dot. `note` adds a second grey line (refund options).
export default function RadioOption({ name, value, checked, onChange, label, note, className = '' }) {
  return (
    <label className={`rf-option ${checked ? 'is-checked' : ''} ${className}`.trim()}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span className="rf-dot" aria-hidden="true" />
      <span className="rf-option-text">
        <span className="rf-option-label">{label}</span>
        {note && <span className="rf-option-note">{note}</span>}
      </span>
    </label>
  )
}
