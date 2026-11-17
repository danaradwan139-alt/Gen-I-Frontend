import './ui.css'

// variant: primary | text | outline-white | outline-teal | soft     size: lg | md | xs
export function Button({ variant = 'primary', size = 'lg', href, className = '', children, ...rest }) {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag className={`btn btn-${variant} btn-${size} ${className}`} href={href} {...rest}>
      {children}
    </Tag>
  )
}
