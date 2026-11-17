import { assets as A } from '@/assets/assets'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { ScrollRow } from '@/components/ui/ScrollRow'
import './section.css'
import './MadeFor.css'

const pics = [
  [A.pics0, 'Capture Every Moment.', 'Your World, In Your Hands.'],
  [A.pics1, 'A Smarter Way to Clean.', 'Make Every Corner Shine.'],
  [A.pics2, 'Power Your Productivity.', 'Work Smarter, Go Further.'],
  [A.pics3, 'Bring Every Moment to Life.', 'Make Every Night Movie Night.'],
]

export default function MadeFor() {
  return (
    <section className="sec made">
      <div className="sec-head">
        <h2 className="t56">Made for <span className="teal">how you live.</span></h2>
        <Button variant="text" size="md" href="#">See what's new <Icon src={A.chevronTeal} inset="21.49% 33.66% 21.48% 33.68%" kind="chev" /></Button>
      </div>
      <ScrollRow className="bleed-right">
        <div className="pics">
          {pics.map(([s, t, d]) => (
            <a key={t} href="#" className="pic">
              <img src={s} alt="" />
              <span className="pic-shade" />
              <span className="pic-cap"><b>{t}</b><span>{d}</span></span>
            </a>
          ))}
        </div>
      </ScrollRow>
    </section>
  )
}
