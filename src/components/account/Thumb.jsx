import './records.css'

// 56px product thumbnail. Decorative: the product name always sits next to it.
export default function Thumb({ src }) {
  return (
    <span className="acct-thumb">
      <img src={src} alt="" loading="lazy" />
    </span>
  )
}
