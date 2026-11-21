import { assets as A } from './assets.js'
import { Icon, Arrow, Button, Avatar, Badge, Check } from './ui.jsx'

/* ---------- Hero ---------- */
export function Hero() {
  return (
    <section className="hero">
      <img className="hero-photo" src={A.heroPhoto} alt="" />
      <div className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow">PHONES · WATCHES · LAPTOPS · TV · HOME</p>
          <div className="hero-title">
            <h1 className="t72">Tech Lifestyle Stores</h1>
            <p className="t56">Know More. Choose Better</p>
          </div>
          <p className="body16 white">
            iPhone, Apple Watch, laptops, TVs and home appliances —<br />plus expert iPhone repair. Online or in store.
          </p>
          <Button href="#">Shop Now <Arrow /></Button>
        </div>
        <a className="prompt" href="#assistant">
          <Avatar />
          <p>Ask GEN-I — “Which iPhone is best for photos?”</p>
          <span className="send">
            <Icon src={A.sendUp} size={24} inset="13.54% 26.05% 13.54% 26.03%" kind="arrow" />
          </span>
        </a>
      </div>
    </section>
  )
}

/* ---------- Category strip ---------- */
const cats = [
  ['iPhone', A.smartphone, '5.21% 17.71%'],
  ['Apple Watch', A.smartphone, '5.21% 17.71%'],
  ['Laptops', A.smartphone, '5.21% 17.71%'],
  ['Home Appliances', A.smartphone, '5.21% 17.71%'],
  ['Audio', A.audio, '0'],
  ['Repairs', A.repair, '9.38%'],
]
export function Categories() {
  return (
    <section className="cats">
      {cats.map(([l, s, inset]) => (
        <a key={l} href="#" className="cat">
          <Icon src={s} size={48} inset={inset} />
          <span>{l}</span>
        </a>
      ))}
    </section>
  )
}

/* ---------- Made for how you live ---------- */
const pics = [
  [A.pics0, 'Capture Every Moment.', 'Your World, In Your Hands.'],
  [A.pics1, 'A Smarter Way to Clean.', 'Make Every Corner Shine.'],
  [A.pics2, 'Power Your Productivity.', 'Work Smarter, Go Further.'],
  [A.pics3, 'Bring Every Moment to Life.', 'Make Every Night Movie Night.'],
]
export function MadeFor() {
  return (
    <section className="sec made">
      <div className="sec-head">
        <h2 className="t56">Made for <span className="teal">how you live.</span></h2>
        <Button variant="text" size="md" href="#">See what's new <Icon src={A.chevronTeal} inset="21.49% 33.66% 21.48% 33.68%" kind="chev" /></Button>
      </div>
      <div className="pics">
        {pics.map(([s, t, d]) => (
          <a key={t} href="#" className="pic">
            <img src={s} alt="" />
            <span className="pic-shade" />
            <span className="pic-cap"><b>{t}</b><span>{d}</span></span>
          </a>
        ))}
      </div>
    </section>
  )
}

/* ---------- iPhone spotlight ---------- */
export function Spotlight() {
  return (
    <section className="spot">
      <div className="spot-img">
        <span className="spot-backdrop"><img src={A.maskBackdrop} alt="" /></span>
        <span className="spot-phone" style={{ maskImage: `url(${A.maskA}), url(${A.maskB})`, WebkitMaskImage: `url(${A.maskA}), url(${A.maskB})` }}>
          <img src={A.phoneCut} alt="" />
        </span>
      </div>
      <div className="spot-copy">
        <div className="stack16">
          <p className="eyebrow">MEET YOUR NEXT I PHONE</p>
          <h2 className="t80">A New Era.<br />In Your Hands.</h2>
          <p className="body16 white stack4"><span>Experience the iPhone 18.</span><span>Designed to inspire, built to impress</span></p>
        </div>
        <div className="row24">
          <Button href="#">Explore iPhone 18 <Arrow /></Button>
          <Button variant="outline-white" href="#">Shop all iPhones</Button>
        </div>
      </div>
    </section>
  )
}

/* ---------- Marquee strip ---------- */
const moves = ['Free two-day delivery', 'Trade in and save', 'One-on-one setup', 'Easy returns', 'Fast And Secure Delivery', 'Find Your Perfect iPhone']
export function Marquee() {
  return (
    <section className="move" aria-label="Highlights">
      <div className="move-row">
        {moves.map((m) => (
          <div key={m} className="move-item">
            <span className="move-label">{m}<i className="dot" /></span>
          </div>
        ))}
        <div className="move-item" /><div className="move-item" />
      </div>
    </section>
  )
}

/* ---------- Online or in store ---------- */
export function OnlineStore() {
  return (
    <section className="sec">
      <h2 className="t56">Online or in store. <span className="teal">Your call.</span></h2>
      <div className="two">
        <div className="panel dark">
          <p className="body16 white">SHOP ONLINE</p>
          <p className="t24 white"><span>Open 24/7.</span><span>Delivered tomorrow.</span></p>
          <p className="body16 light">Browse every model, compare side by side, and check out in seconds with installments, cash on delivery or card.</p>
          <Button size="md" href="#">Start shopping</Button>
        </div>
        <div className="panel grey">
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

/* ---------- Featured this week ---------- */
const featured = [
  ['iPhone 16', A.phone0, true],
  ['Samsung 55″ QLED 4K', A.phone1],
  ['Philips Hue starter kit', A.phone2],
  ['LG front-load washer', A.phone3],
]
export function Featured() {
  return (
    <section className="sec feat">
      <h2 className="t40">Featured this week</h2>
      <div className="products">
        {featured.map(([n, s, narrow]) => (
          <article key={n} className="product">
            <span className={`phone ${narrow ? 'narrow' : ''}`}><img src={s} alt="" /></span>
            <Badge>New</Badge>
            <h3 className="t20">{n}</h3>
            <p className="stock"><Icon src={A.ellipse} size={8} /> In stock at 2 branches</p>
            <p className="price">69000 EGP </p>
            <div className="btns">
              <Button className="block" href="#">Buy</Button>
              <Button variant="outline-teal" className="block" href="#">Reserve in store</Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------- iPhone repair ---------- */
const repairs = [
  ['Screen replacement', 'Same day'], ['Battery replacement', '~45 min'], ['Back glass repair', 'Same day'],
  ['Camera repair', 'Same day'], ['Charging port', 'Same day'], ['Water damage check', 'Free diagnosis'],
]
const steps = [
  ['1', 'Book or walk in', 'Reserve a slot online, or just drop by any store.', 'light'],
  ['2', 'Free diagnosis', 'We test your iPhone and confirm the price upfront.', 'light'],
  ['3', 'Fixed and tested', 'Collect it the same day, covered by our repair warranty.', 'dim'],
]
export function Repair() {
  return (
    <section className="repair">
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

/* ---------- Why buy from GEN-I ---------- */
const whys = [
  [A.shield, '10.94% 17.19%', '-4% -4.76%', 'Official warranty', 'Every device is genuine, factory‑sealed and fully covered.'],
  [A.card, '13.54% 5.21%', '0', '0% installments', 'Spread the cost over up to 12 months with no interest.'],
  [A.reload, '9.38%', '0', 'Trade in, trade up', 'Instant credit for your current phone toward a new one.'],
  [A.truck, '13.54% 5.21%', '0', 'Next‑day delivery', 'Free delivery to your door. Same‑day in select areas.'],
  [A.pin, '5.21% 9.38%', '0', 'Pick up in store', 'Order online and \ncollect it in under an hour.'],
]
export function Why() {
  return (
    <section className="sec">
      <h2 className="t56">Why buy from <span className="teal">GEN-I</span></h2>
      <div className="whys">
        {whys.map(([s, inset, imgInset, t, d]) => (
          <div key={t} className="why">
            <Icon src={s} size={24} inset={inset} imgInset={imgInset} />
            <p className="t20 bold">{t}</p>
            <p className="body16 grey pre">{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Power your business ---------- */
const checks = ['Volume pricing from 10 units', 'Official tax invoices', 'Pay by PO, transfer or credit terms', 'Dedicated account manager']
export function Business() {
  return (
    <section className="biz">
      <div className="biz-copy">
        <h2 className="t56 white">Power Your Business.</h2>
        <p className="body16 white">From 10 phones for a new branch to 1,000 laptops for a university — buy in bulk, pay the way your finance team prefers, and get every device delivered and ready to use.</p>
        <div className="checks">
          {checks.map((c, i) => (
            <div key={c} className={`chk ${i === 2 ? 'w278' : ''}`}><Check src={i === 0 ? A.tick : A.tickBiz} /><span>{c}</span></div>
          ))}
        </div>
        <div className="row16">
          <Button href="#">Explore business solutions <Arrow src={A.arrowBiz} /></Button>
          <Button variant="outline-white" href="#">Request a quote</Button>
        </div>
      </div>
      <div className="biz-visual">
        <img className="biz-photo" src={A.bizTeam} alt="" />
        <div className="quote q1">
          <span className="q-ico"><Icon src={A.invoice} size={24} inset="12.5% 25%" imgInset="-4.72% -7.08%" /></span>
          <div><p className="q-t">Quote #Q-2026-0142</p><p className="q-s">120 × iPhone · 40 × laptops</p></div>
          <span className="approved">Approved</span>
        </div>
        <div className="quote q2">
          <span className="q-ico"><Icon src={A.tag} size={24} inset="12.5% 16.67% 16.67% 12.5%" imgInset="-5%" /></span>
          <div><p className="q-t">Business price unlocked</p><p className="q-s">Order 50+ for the next tier</p></div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Trade in ---------- */
export function TradeIn() {
  return (
    <section className="trade">
      <h2 className="t72 center">Trade in your old phone.<br />Save on your <span className="teal">new iPhone.</span></h2>
      <p className="t24 center">Get an instant estimate online, then bring it in or have us collect it.</p>
      <Button href="#">Get your estimate</Button>
    </section>
  )
}

/* ---------- Floating assistant launcher ---------- */
export function Launcher() {
  return (
    <a id="assistant" href="#assistant" className="launcher">
      <Avatar />
      <span>Ask <b>GEN-I Assistant</b></span>
    </a>
  )
}
