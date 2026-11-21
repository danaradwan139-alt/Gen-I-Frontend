import { assets as A } from '@/assets/assets'
import './ui.css'

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
