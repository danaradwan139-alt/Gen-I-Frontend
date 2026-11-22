import { useId } from 'react'
import { Dropdown } from './Dropdown'
import './Input.css'

// Labelled dropdown that shares the Input look. `options` is a list of strings.
export function Select({ label, error, required = false, placeholder, options, className = '', autoComplete, ...rest }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`.trim()}>
      <label className="field-label" htmlFor={id}>
        {required && <span className="field-req" aria-hidden="true">*</span>}
        {label}
      </label>
      <div className="field-control">
        <Dropdown
          id={id}
          options={options}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
      </div>
      {error && <p id={errorId} className="field-error" role="alert">{error}</p>}
    </div>
  )
}
