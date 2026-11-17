import { assets as A } from '@/assets/assets'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import './section.css'
import './OnlineStore.css'

export default function OnlineStore() {
  return (
    <section className="sec" id="stores">
      <h2 className="t56">Online or in store. <span className="teal">Your call.</span></h2>
      <div className="two">
        <div className="panel dark">
          <p className="body16 white">SHOP ONLINE</p>
          <p className="t24 white"><span>Open 24/7.</span><span>Delivered tomorrow.</span></p>
          <p className="body16 light">Browse every model, compare side by side, and check out in seconds with installments, cash on delivery or card.</p>
          <Button size="md" href="/shop">Start shopping</Button>
        </div>
        <div className="panel grey" id="setup-help">
          <p className="body16">VISIT A STORE</p>
          <p className="t24"><span>Try it in your hand.</span><span>Talk to an expert.</span></p>
          <div className="store">
            <div>
              <p className="store-name">Trivium Zayed Branch</p>
              <p className="store-sub">{' Trivium Zayed Branch  ·  Open today · 10 AM – 11 PM'}</p>
            </div>
            <Button variant="text" size="md" href="#">Directions <Icon src={A.chevronDir} inset="21.48% 33.67% 21.49% 33.68%" kind="chev" /></Button>
          </div>
        </div>
      </div>
    </section>
  )
}
