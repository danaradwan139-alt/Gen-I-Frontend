import { assets as A } from '@/assets/assets'
import { Arrow } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import './Repair.css'

const repairs = [
  ['Screen replacement', 'Same day'], ['Battery replacement', '~45 min'], ['Back glass repair', 'Same day'],
  ['Camera repair', 'Same day'], ['Charging port', 'Same day'], ['Water damage check', 'Free diagnosis'],
]
const steps = [
  ['1', 'Book or walk in', 'Reserve a slot online, or just drop by any store.', 'light'],
  ['2', 'Free diagnosis', 'We test your iPhone and confirm the price upfront.', 'light'],
  ['3', 'Fixed and tested', 'Collect it the same day, covered by our repair warranty.', 'dim'],
]
export default function Repair() {
  return (
    <section className="repair" id="repair">
      <div className="repair-head">
        <p className="kicker">GEN-I REPAIR</p>
        <h2 className="t56 white center">iPhone repair,<br />done right.</h2>
        <p className="t20 light center">Certified technicians, quality parts and a warranty on every fix.<br />Most repairs are done while you wait.</p>
        <div className="row16">
          <Button className="w188" href="#">Book a repair</Button>
          <Button variant="outline-white" className="w188" href="#">Get a free quote</Button>
        </div>
      </div>
      <div className="repair-content">
        <img className="tech" src={A.technician} alt="" />
        <div className="services">
          <h3 className="t32">Popular repairs</h3>
          <div className="svc-list">
            {repairs.map(([n, s], i) => (
              <div key={n} className="svc">
                <div><p className="t18b">{n}</p><p className="sub14">{s}</p></div>
                <Button variant="text" size="xs" href="#">Get price <Arrow src={[A.arrowTeal, A.arrowTeal2, A.arrowTeal2, A.arrowTeal3, A.arrowTeal3, A.arrowTeal3][i]} /></Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="steps">
        {steps.map(([n, t, d, tone]) => (
          <div key={n} className="step">
            <p className="num">{n}</p>
            <p className="t20 white bold">{t}</p>
            <p className={`body16 ${tone}`}>{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
