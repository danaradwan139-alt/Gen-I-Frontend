import { Link } from 'react-router-dom'
import { ChevronRightIcon } from './icons'
import './records.css'

// "Orders > Order details & tracking": the parent is a link. The last crumb is plain text, or a link back
// to the order when `currentTo` is given (the Start a return page).
export default function Breadcrumb({ parent, current, currentTo }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      <Link to={parent.to} className="crumb-link">{parent.label}</Link>
      <ChevronRightIcon size={16} />
      {currentTo
        ? <Link to={currentTo} className="crumb-link crumb-last">{current}</Link>
        : <span className="crumb-current" aria-current="page">{current}</span>}
    </nav>
  )
}
