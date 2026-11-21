// Simple stroke icons (cart, user) – they inherit the button's text colour.
const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const CartGlyph = () => (
  <svg {...base}>
    <path d="M2 3h2.2a1 1 0 0 1 .98.8L5.6 6m0 0 1.4 7.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.78L19.2 6.6a.5.5 0 0 0-.49-.6H5.6Z" />
    <circle cx="9" cy="19" r="1.4" /><circle cx="16.5" cy="19" r="1.4" />
  </svg>
)
export const UserGlyph = () => (
  <svg {...base}>
    <circle cx="12" cy="8" r="4" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
  </svg>
)
