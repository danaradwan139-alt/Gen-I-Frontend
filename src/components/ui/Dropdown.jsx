import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './Dropdown.css'

const Chevron = () => (
  <svg className="dd-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
)
const Tick = () => (
  <svg className="dd-tick" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

const normalise = (options) => options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }))

// Styled replacement for a native <select> (whose open list can't be styled).
// Drop-in API: value, onChange({ target: { name, value } }), onBlur, name, options (strings or
// { value, label }), placeholder. variant: field (form input look) | pill (teal sort control).
// Keyboard: ↑ ↓ Home End to move, Enter / Space to pick, Esc to close, type to jump.
export function Dropdown({
  id,
  name,
  value = '',
  onChange,
  onBlur,
  options,
  placeholder,
  variant = 'field',
  className = '',
  disabled = false,
  required,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
}) {
  const autoId = useId()
  const triggerId = id ?? `${autoId}-trigger`
  const listId = `${autoId}-list`
  const items = normalise(options)
  const selectedIndex = items.findIndex((item) => String(item.value) === String(value))
  const selected = items[selectedIndex]

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [pos, setPos] = useState(null)
  const [host, setHost] = useState(null)
  const triggerRef = useRef(null)
  const listRef = useRef(null)
  const typed = useRef({ text: '', timer: 0 })

  function openList(startAt = selectedIndex >= 0 ? selectedIndex : 0) {
    if (disabled) return
    setHost(triggerRef.current.closest('dialog') ?? document.body)
    setActive(items.length ? startAt : -1)
    setPos(null)
    setOpen(true)
  }

  function closeList({ refocus = true } = {}) {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
    onBlur?.({ target: { name, value } })
  }

  function choose(index) {
    const item = items[index]
    if (item && String(item.value) !== String(value)) onChange?.({ target: { name, value: item.value } })
    closeList()
  }

  // Place the menu under the trigger (or above it when there's no room), keep it on screen.
  useLayoutEffect(() => {
    if (!open) return undefined
    function place() {
      const trigger = triggerRef.current
      const list = listRef.current
      if (!trigger || !list) return
      const rect = trigger.getBoundingClientRect()
      const width = Math.max(rect.width, variant === 'pill' ? 200 : 0)
      const height = Math.min(list.scrollHeight, 288)
      const below = window.innerHeight - rect.bottom
      const up = below < height + 16 && rect.top > below
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))
      setPos({ left, width, up, top: up ? undefined : rect.bottom + 6, bottom: up ? window.innerHeight - rect.top + 6 : undefined })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true) }
  }, [open, variant])

  useEffect(() => { if (open && pos) listRef.current?.focus({ preventScroll: true }) }, [open, pos])

  useEffect(() => {
    if (!open || active < 0) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  // Close when clicking anywhere outside the trigger and the menu.
  useEffect(() => {
    if (!open) return undefined
    function onPointerDown(event) {
      if (triggerRef.current?.contains(event.target) || listRef.current?.contains(event.target)) return
      closeList({ refocus: false })
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  })

  function typeAhead(key) {
    const state = typed.current
    window.clearTimeout(state.timer)
    state.text += key.toLowerCase()
    state.timer = window.setTimeout(() => { state.text = '' }, 600)
    const from = open ? active : selectedIndex
    const order = [...items.keys()].map((i) => (i + from + (state.text.length === 1 ? 1 : 0)) % items.length)
    return order.find((i) => String(items[i].label).toLowerCase().startsWith(state.text)) ?? -1
  }

  function onTriggerKeyDown(event) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      openList(event.key === 'ArrowUp' && selectedIndex < 0 ? items.length - 1 : undefined)
    } else if (event.key.length === 1 && /\S/.test(event.key)) {
      const match = typeAhead(event.key)
      if (match >= 0) onChange?.({ target: { name, value: items[match].value } })
    }
  }

  function onListKeyDown(event) {
    const last = items.length - 1
    const keys = {
      ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => choose(active),
      ' ': () => choose(active),
      Escape: () => closeList(),
      Tab: () => closeList({ refocus: false }),
    }
    if (keys[event.key]) {
      if (event.key !== 'Tab') event.preventDefault()
      keys[event.key]()
    } else if (event.key.length === 1) {
      const match = typeAhead(event.key)
      if (match >= 0) setActive(match)
    }
  }

  const menu = open && host && createPortal(
    <ul
      ref={listRef}
      id={listId}
      role="listbox"
      tabIndex={-1}
      aria-labelledby={triggerId}
      aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
      className={`dd-menu dd-menu-${variant} ${pos?.up ? 'is-up' : ''}`}
      style={pos ? { left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom } : { visibility: 'hidden' }}
      onKeyDown={onListKeyDown}
    >
      {items.length === 0 && <li className="dd-empty" role="presentation">No options available</li>}
      {items.map((item, index) => (
        <li
          key={item.value}
          id={`${listId}-${index}`}
          role="option"
          aria-selected={index === selectedIndex}
          className={`dd-option ${index === active ? 'is-active' : ''} ${index === selectedIndex ? 'is-selected' : ''}`}
          onPointerMove={() => setActive(index)}
          onClick={() => choose(index)}
        >
          <span className="dd-option-label">{item.label}</span>
          {index === selectedIndex && <Tick />}
        </li>
      ))}
    </ul>,
    host
  )

  return (
    <>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={`dd dd-${variant} ${open ? 'is-open' : ''} ${selected ? '' : 'is-placeholder'} ${className}`.trim()}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-required={required || undefined}
        disabled={disabled}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="dd-value">{selected ? selected.label : (placeholder ?? 'Select')}</span>
        <Chevron />
      </button>
      {name && <input type="hidden" name={name} value={value} />}
      {menu}
    </>
  )
}
