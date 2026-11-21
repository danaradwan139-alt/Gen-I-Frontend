import './ui.css'

// Prototype "Icon" heart: outline → filled on click (Property 1=heart → Variant2).
// Red outline, filled red when saved. The colours are set right on the icon so it never falls back to
// a black fill, and ui.css (.heart-path) adds the fill animation on top.
export function HeartButton({ pressed, onToggle, label }) {
  return (
    <button type="button" className="heart-btn" aria-pressed={pressed} aria-label={label} title={label} onClick={onToggle}>
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path
          className="heart-path"
          fill={pressed ? '#fc3a3a' : 'none'}
          stroke="#fc3a3a"
          strokeWidth="1.5"
          strokeLinejoin="round"
          d="M20 33.33S5 24.17 5 14.17C5 9.58 8.58 6 13.17 6C16.08 6 18.67 7.5 20 9.75C21.33 7.5 23.92 6 26.83 6C31.42 6 35 9.58 35 14.17C35 24.17 20 33.33 20 33.33Z"
        />
      </svg>
    </button>
  )
}
