import './Switch.css'

export function Switch({ label, className = '', ...rest }) {
  return (
    <label className={`switch ${className}`.trim()}>
      <input type="checkbox" role="switch" {...rest} />
      <span className="switch-track" aria-hidden="true"><span className="switch-knob" /></span>
      {label}
    </label>
  )
}
