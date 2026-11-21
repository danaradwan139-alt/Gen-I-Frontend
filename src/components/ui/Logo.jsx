import { Link } from 'react-router-dom'
import { assets as A } from '@/assets/assets'
import './Logo.css'

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`logo ${className}`.trim()} aria-label="GEN-I home">
      <span className="lg-a"><img src={A.logoA} alt="" /></span>
      <span className="lg-b"><img src={A.logoB} alt="" /></span>
    </Link>
  )
}
