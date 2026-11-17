import { assets as A } from '@/assets/assets'
import { Icon } from './Icon'

export const Check = ({ src = A.tick }) => (
  <span className="check-dot"><Icon src={src} size={16} inset="23.96% 17.7%" /></span>
)
