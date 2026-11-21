import { Avatar } from '@/components/ui/Avatar'
import './records.css'

// Pill with a 1px gradient stroke (the same --grad as the assistant avatar).
export default function AskAssistantButton({ children }) {
  return (
    <button type="button" className="ask">
      <span className="ask-inner">
        <Avatar />
        {children}
      </span>
    </button>
  )
}
