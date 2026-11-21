import { useId } from 'react'
import { ChevronDownIcon } from '@/components/account/icons'
import './Input.css'

// Labelled native <select> that shares the Input look. `options` is a list of strings.
export function Select({ label, error, required = false, placeholder, options, className = '', ...rest }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`.trim()}>
      <label className="field-label" htmlFor={id}>
        {required && <span className="field-req" aria-hidden="true">*</span>}
        {label}
      </label>
      <div className="field-control">
        <select
          id={id}
          className="field-input field-select"
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDownIcon size={20} />
      </div>
      {error && <p id={errorId} className="field-error" role="alert">{error}</p>}
    </div>
  )
}
