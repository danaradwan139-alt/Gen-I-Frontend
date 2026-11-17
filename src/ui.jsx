import { assets as A } from './assets.js'

// Figma icon wrapper: `inset` positions the glyph inside its box, `kind` reproduces Figma's rotations/flips.
export function Icon({ src, size = 16, inset = '0', imgInset = '0', kind = 'plain' }) {
  return (
    <span className="ico" style={{ width: size, height: size }}>
      <span className="ico-box" style={{ inset }}>
        <span className={`ico-${kind}`} style={kind === 'plain' ? { inset: imgInset } : undefined}>
          <img src={src} alt="" />
        </span>
      </span>
    </span>
  )
}

export const Arrow = ({ src = A.arrowWhite }) => <Icon src={src} inset="26.04% 13.54%" kind="arrow" />

export function Button({ variant = 'primary', size = 'lg', href, className = '', children, ...rest }) {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag className={`btn btn-${variant} btn-${size} ${className}`} href={href} {...rest}>
      {children}
    </Tag>
  )
}

export const Avatar = () => (
  <span className="avatar"><Icon src={A.sparkle} size={24} /></span>
)

export const Badge = ({ children }) => <span className="badge">{children}</span>

export const Check = ({ src = A.tick }) => (
  <span className="check-dot"><Icon src={src} size={16} inset="23.96% 17.7%" /></span>
)
