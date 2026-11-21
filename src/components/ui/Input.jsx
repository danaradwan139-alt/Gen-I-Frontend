import { useId, useState } from 'react'
import './Input.css'

const EyeIcon = ({ off }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
)

// Labelled text field with inline error and, for type="password", a show/hide toggle.
export function Input({ label, error, type = 'text', required = false, adornment, className = '', ...rest }) {
  const id = useId()
  const errorId = `${id}-error`
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`.trim()}>
      <label className="field-label" htmlFor={id}>
        {required && <span className="field-req" aria-hidden="true">*</span>}
        {label}
      </label>
      <div className="field-control">
        <input
          id={id}
          className="field-input"
          type={isPassword && visible ? 'text' : type}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        {adornment && <span className="field-adornment">{adornment}</span>}
        {isPassword && (
          <button
            type="button"
            className="field-toggle"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
          >
            <EyeIcon off={visible} />
          </button>
        )}
      </div>
      {error && <p id={errorId} className="field-error" role="alert">{error}</p>}
    </div>
  )
}
