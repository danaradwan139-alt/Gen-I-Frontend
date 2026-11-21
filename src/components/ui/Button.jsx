import { Link } from 'react-router-dom'
import './ui.css'

// variant: primary | text | outline-white | outline-teal | soft     size: lg | md | xs
// `to` navigates with the router, `href` renders a plain anchor, otherwise a <button>.
// `loading` disables the button and shows a spinner.
export function Button({ variant = 'primary', size = 'lg', href, to, loading = false, disabled, className = '', children, ...rest }) {
  const classes = `btn btn-${variant} btn-${size} ${className}`.trim()

  if (to) return <Link className={classes} to={to} {...rest}>{children}</Link>
  if (href) return <a className={classes} href={href} {...rest}>{children}</a>

  return (
    <button className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {children}
    </button>
  )
}
