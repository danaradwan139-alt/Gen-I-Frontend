import { useId } from 'react'
import './records.css'

// Numbered card of the "Start a return" form. A labelled group so assistive tech announces each question.
export default function FormSection({ title, children }) {
  const titleId = useId()
  return (
    <section className="rf" role="group" aria-labelledby={titleId}>
      <h3 id={titleId} className="rf-title">{title}</h3>
      {children}
    </section>
  )
}
