import './Chip.css'

// Pill toggle used for filters and single-choice groups. Pair with role="group" and an aria-label.
export function Chip({ active = false, className = '', children, ...rest }) {
  return (
    <button type="button" className={`chip ${active ? 'is-active' : ''} ${className}`.trim()} aria-pressed={active} {...rest}>
      {children}
    </button>
  )
}
