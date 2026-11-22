import './ui.css'

// The one GEN-I heart. Every heart on the site uses this shape so they all match:
// product cards, compare, saved items, the account menu, the product page "Save" link and the shop "Saved" filter.
export const HEART_PATH = 'M20 33.33S5 24.17 5 14.17C5 9.58 8.58 6 13.17 6C16.08 6 18.67 7.5 20 9.75C21.33 7.5 23.92 6 26.83 6C31.42 6 35 9.58 35 14.17C35 24.17 20 33.33 20 33.33Z'

// Static heart icon. Outline by default; `filled` fills it. Takes the text colour unless `color` is given.
export function HeartIcon({ size = 20, filled = false, color = 'currentColor', strokeWidth = 2.6, className = '' }) {
  return (
    <svg className={`heart-icon ${className}`.trim()} viewBox="2 3 36 33" width={size} height={size} aria-hidden="true" focusable="false">
      <path d={HEART_PATH} fill={filled ? color : 'none'} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  )
}

// Prototype "Icon" heart: outline → filled on click (Property 1=heart → Variant2).
// Red outline, filled red when saved. The colours are set right on the icon so it never falls back to
// a black fill, and ui.css (.heart-path) adds the fill animation on top.
export function HeartButton({ pressed, onToggle, label, className = '' }) {
  return (
    <button type="button" className={`heart-btn ${className}`.trim()} aria-pressed={pressed} aria-label={label} title={label} onClick={onToggle}>
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path
          className="heart-path"
          fill={pressed ? '#fc3a3a' : 'none'}
          stroke="#fc3a3a"
          strokeWidth="1.5"
          strokeLinejoin="round"
          d={HEART_PATH}
        />
      </svg>
    </button>
  )
}
