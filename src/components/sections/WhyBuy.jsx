import { assets as A } from '@/assets/assets'
import { Icon } from '@/components/ui/Icon'
import { ScrollRow } from '@/components/ui/ScrollRow'
import './section.css'
import './WhyBuy.css'

const whys = [
  [null, A.shield, '10.94% 17.19%', '-4% -4.76%', 'Official warranty', 'Every device is genuine, factory‑sealed and fully covered.'],
  ['installments', A.card, '13.54% 5.21%', '0', '0% installments', 'Spread the cost over up to 12 months with no interest.'],
  [null, A.reload, '9.38%', '0', 'Trade in, trade up', 'Instant credit for your current phone toward a new one.'],
  ['delivery', A.truck, '13.54% 5.21%', '0', 'Next‑day delivery', 'Free delivery to your door. Same‑day in select areas.'],
  [null, A.pin, '5.21% 9.38%', '0', 'Pick up in store', 'Order online and \ncollect it in under an hour.'],
]

export default function WhyBuy() {
  return (
    <section className="sec" id="why-buy">
      <h2 className="t56">Why buy from <span className="teal">GEN-I</span></h2>
      <ScrollRow className="bleed-right">
        <div className="whys">
          {whys.map(([id, s, inset, imgInset, t, d]) => (
            <div key={t} id={id || undefined} className="why">
              <Icon src={s} size={24} inset={inset} imgInset={imgInset} />
              <p className="t20 bold">{t}</p>
              <p className="body16 grey pre">{d}</p>
            </div>
          ))}
        </div>
      </ScrollRow>
    </section>
  )
}
