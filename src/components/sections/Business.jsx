import { assets as A } from '@/assets/assets'
import { askAssistant } from '@/utils/assistant'
import { Icon, Arrow } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Check } from '@/components/ui/Check'
import './Business.css'

const checks = ['Volume pricing from 10 units', 'Official tax invoices', 'Pay by PO, transfer or credit terms', 'Dedicated account manager']
export default function Business() {
  return (
    <section className="biz" id="business">
      <div className="biz-copy">
        <h2 className="t56 white">Power Your Business.</h2>
        <p className="body16 white">From 10 phones for a new branch to 1,000 laptops for a university — buy in bulk, pay the way your finance team prefers, and get every device delivered and ready to use.</p>
        <div className="checks">
          {checks.map((c, i) => (
            <div key={c} className={`chk ${i === 2 ? 'w278' : ''}`}><Check src={i === 0 ? A.tick : A.tickBiz} /><span>{c}</span></div>
          ))}
        </div>
        <div className="row16">
          <Button onClick={() => askAssistant('Tell me about GEN-I business solutions')}>Explore business solutions <Arrow src={A.arrowBiz} /></Button>
          <Button variant="outline-white" to="/business/checkout">Request a quote</Button>
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
