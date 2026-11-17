import { useDragScroll } from '@/hooks/useDragScroll'
import './ui.css'

// Horizontally scrollable row: trackpad / shift+wheel / scrollbar, plus click-and-drag with a mouse.
export function ScrollRow({ className = '', children }) {
  const ref = useDragScroll()
  return <div ref={ref} className={`scroll-row ${className}`}>{children}</div>
}
