import { assets as A } from '@/assets/assets'
import { Avatar } from '@/components/ui/Avatar'
import './AssistantLauncher.css'

export default function AssistantLauncher() {
  return (
    <a id="assistant" href="/#assistant" className="launcher" aria-label="Ask GEN-I Assistant">
      <Avatar />
      <span>Ask <b>GEN-I Assistant</b></span>
    </a>
  )
}
