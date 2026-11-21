import { useEffect, useRef } from 'react'

export function useDragScroll() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let down = false, moved = false, startX = 0, startLeft = 0

    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft
    }
    const onMove = (e) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 5) { moved = true; el.classList.add('dragging') }
      if (moved) el.scrollLeft = startLeft - dx
    }
    const onUp = () => { down = false; el.classList.remove('dragging') }
    const onClick = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }
    const onDragStart = (e) => e.preventDefault()

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('click', onClick, true)
    el.addEventListener('dragstart', onDragStart)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('click', onClick, true)
      el.removeEventListener('dragstart', onDragStart)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return ref
}
