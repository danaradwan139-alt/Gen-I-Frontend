import { assets as A } from '@/assets/assets'
import { Arrow } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import './Spotlight.css'

// The 8 gradient states from the Figma "Mask group" variants, cross-faded in a loop.
const frames = [A.grad0, A.grad1, A.grad2, A.grad3, A.grad4, A.grad5, A.grad6, A.grad7]
const STEP = 1.5 // seconds between frames
const LOOP = frames.length * STEP

export default function Spotlight() {
  const mask = `url(${A.maskA}), url(${A.maskB})`
  return (
    <section className="spot">
      <div className="spot-img">
        <span className="spot-backdrop">
          {frames.map((src, i) => (
            <span key={i} className="spot-frame" style={{ animationDuration: `${LOOP}s`, animationDelay: `${i * STEP - LOOP}s` }}>
              <img src={src} alt="" />
            </span>
          ))}
        </span>
        <span className="spot-phone" style={{ maskImage: mask, WebkitMaskImage: mask }}>
          <img src={A.phoneCut} alt="" />
        </span>
      </div>
      <div className="spot-copy">
        <p className="eyebrow">MEET YOUR NEXT I PHONE</p>
        <h2 className="t80">A New Era.<br />In Your Hands.</h2>
        <p className="body16 stack4"><span>Experience the iPhone 18.</span><span>Designed to inspire, built to impress</span></p>
        <div className="row24">
          <Button to="/shop/iphone-18-pro">Explore iPhone 18 <Arrow /></Button>
          <Button variant="outline-white" to="/shop?category=iPhone">Shop all iPhones</Button>
        </div>
      </div>
    </section>
  )
}
