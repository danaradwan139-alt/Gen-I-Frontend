import { Link } from 'react-router-dom'
import './ui.css'

// variant: primary | text | danger-text | soft | outline-teal | outline-grey | outline-white
// size:    lg (24px) | md (18px) | xs (12px)
// Pass `to` for an in-app route, `href` for anything else, neither for a <button>.
// `loading` disables the button and shows a spinner.
export function Button({
  variant = 'primary',
  size = 'lg',
  href,
  to,
  loading = false,
  disabled,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const cls = `btn btn-${variant} btn-${size} ${className}`.trim()

  if (to) return <Link className={cls} to={to} {...rest}>{children}</Link>
  if (href) return <a className={cls} href={href} {...rest}>{children}</a>

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {children}
    </button>
  )
}
