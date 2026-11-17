import '@/components/sections/section.css'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <section className="sec" style={{ alignItems: 'flex-start' }}>
      <h1 className="t56">Page not found</h1>
      <p className="body16">We couldn't find that page.</p>
      <Button href="/">Back home</Button>
    </section>
  )
}
