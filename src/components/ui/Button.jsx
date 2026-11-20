import { Link } from 'react-router-dom'
import './ui.css'

// variant: primary | text | danger-text | soft | outline-teal | outline-grey | outline-white
// size:    lg (24px) | md (18px) | xs (12px)
// Pass `to` for an in-app route, `href` for anything else, neither for a <button>.
export function Button({ variant = 'primary', size = 'lg', href, to, className = '', children, ...rest }) {
  const cls = `btn btn-${variant} btn-${size} ${className}`.trim()
  if (to) return <Link className={cls} to={to} {...rest}>{children}</Link>
  if (href) return <a className={cls} href={href} {...rest}>{children}</a>
  return <button type="button" className={cls} {...rest}>{children}</button>
}
