import { Avatar } from '@/components/ui/Avatar'
import { askAssistant } from '@/utils/assistant'
import './records.css'

// Pill with a 1px gradient stroke (the same --grad as the assistant avatar).
export default function AskAssistantButton({ children, message }) {
  return (
    <button type="button" className="ask" onClick={() => askAssistant(message ?? String(children))}>
      <span className="ask-inner">
        <Avatar />
        {children}
      </span>
    </button>
  )
}
