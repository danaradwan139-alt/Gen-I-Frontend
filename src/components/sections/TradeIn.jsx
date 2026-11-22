import { assets as A } from '@/assets/assets'
import { Button } from '@/components/ui/Button'
import { askAssistant } from '@/utils/assistant'
import './TradeIn.css'

export default function TradeIn() {
  return (
    <section className="trade" id="trade-in">
      <h2 className="t72 center">Trade in your old phone.<br />Save on your <span className="teal">new iPhone.</span></h2>
      <p className="t24 center">Get an instant estimate online, then bring it in or have us collect it.</p>
      <Button onClick={() => askAssistant('I want a trade-in estimate for my phone')}>Get your estimate</Button>
    </section>
  )
}
