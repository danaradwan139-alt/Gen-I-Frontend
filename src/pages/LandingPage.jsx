import Hero from '@/components/sections/Hero'
import CategoryStrip from '@/components/sections/CategoryStrip'
import MadeFor from '@/components/sections/MadeFor'
import Spotlight from '@/components/sections/Spotlight'
import Marquee from '@/components/sections/Marquee'
import OnlineStore from '@/components/sections/OnlineStore'
import Featured from '@/components/sections/Featured'
import Repair from '@/components/sections/Repair'
import WhyBuy from '@/components/sections/WhyBuy'
import Business from '@/components/sections/Business'
import TradeIn from '@/components/sections/TradeIn'
import Reveal from '@/components/ui/Reveal'

export default function LandingPage() {
  return (
    <>
      {/* Hero is above the fold: left untouched so it paints instantly */}
      <Hero />

      <Reveal variant="up">
        <CategoryStrip />
      </Reveal>

      <Reveal variant="up">
        <MadeFor />
      </Reveal>

      <Reveal variant="zoom">
        <Spotlight />
      </Reveal>

      <Reveal variant="fade" threshold={0.05}>
        <Marquee />
      </Reveal>

      <Reveal variant="up">
        <OnlineStore />
      </Reveal>

      <Reveal variant="up">
        <Featured />
      </Reveal>

      <Reveal variant="up">
        <Repair />
      </Reveal>

      <Reveal variant="up">
        <WhyBuy />
      </Reveal>

      <Reveal variant="up">
        <Business />
      </Reveal>

      <Reveal variant="up">
        <TradeIn />
      </Reveal>
    </>
  )
}
