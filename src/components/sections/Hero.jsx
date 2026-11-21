import { assets as A } from '@/assets/assets'
import { Icon, Arrow } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import './Hero.css'

export default function Hero() {
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
