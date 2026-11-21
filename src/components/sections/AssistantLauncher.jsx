import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { formatPrice } from '@/data/products'
import { getIphoneImage } from '@/data/iphoneImages'
import { Avatar } from '@/components/ui/Avatar'
import { useSessionState } from '@/hooks/useSessionState'
import { getReply, WELCOME } from '@/components/assistant/assistantBrain'
import './AssistantLauncher.css'

// GEN-I Assistant (Figma "Assistant 2"): floating launcher, fixed bottom-right. Click opens the chat panel
// (spring scale 0.9 → 1 from bottom-right, 400ms). Chips send their label as a message.
// Opens from: the launcher, any link to #assistant (e.g. the hero prompt), or
// window.dispatchEvent(new CustomEvent('open-assistant', { detail: { message } })).

const fromPrice = (p) => Math.min(...p.variants.map((v) => v.price))
const imageOf = (p) => getIphoneImage(p) || p.image

function Sparkle({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M11 3C11.6 7 14.4 9.8 18.4 10.4C14.4 11 11.6 13.8 11 17.8C10.4 13.8 7.6 11 3.6 10.4C7.6 9.8 10.4 7 11 3Z" fill="#fff" />
      <path d="M18.5 14.5C18.7 16 20 17.3 21.5 17.5C20 17.7 18.7 19 18.5 20.5C18.3 19 17 17.7 15.5 17.5C17 17.3 18.3 16 18.5 14.5Z" fill="#fff" />
    </svg>
  )
}

function ProductTiles({ list, captions }) {
  return (
    <div className={`chat-tiles ${list.length === 1 ? 'is-single' : ''}`}>
      {list.map((p, i) => (
        <Link key={p.id} to={`/shop/${p.id}`} className="chat-tile">
          <span className="chat-tile-img">{imageOf(p) ? <img src={imageOf(p)} alt="" /> : <span>{p.category}</span>}</span>
          <strong>{p.name}</strong>
          <small>{captions?.[i] || `From ${formatPrice(fromPrice(p))}`}</small>
        </Link>
      ))}
    </div>
  )
}

function Message({ msg, onChip, onNavigate, isLast }) {
  if (msg.role === 'user') {
    return <div className="chat-row is-user"><p className="chat-bubble is-user">{msg.text}</p></div>
  }
  return (
    <div className="chat-row">
      <span className="chat-avatar"><Sparkle size={18} /></span>
      <div className="chat-content">
        <p className="chat-bubble">{msg.text}</p>

        {msg.compare && (
          <div className="chat-card">
            <ProductTiles list={msg.compare} captions={msg.compare.map((p) => `From ${formatPrice(fromPrice(p))}`)} />
            {msg.action && <Link className="btn btn-primary btn-md block" to={msg.action.to} onClick={onNavigate}>{msg.action.label}</Link>}
          </div>
        )}

        {msg.products && !msg.compare && (
          <div className="chat-card">
            <ProductTiles list={msg.products} />
            {msg.action && <Link className="btn btn-primary btn-md block" to={msg.action.to} onClick={onNavigate}>{msg.action.label}</Link>}
          </div>
        )}

        {msg.repair && (
          <div className="chat-card">
            <strong className="chat-card-title">{msg.repair.title}</strong>
            <ul className="chat-points">{msg.repair.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
            <Link className="btn btn-primary btn-md block" to={msg.repair.to} onClick={onNavigate}>Book a repair slot ↗</Link>
          </div>
        )}

        {msg.action && !msg.compare && !msg.products && (
          <Link className="btn btn-outline-teal btn-xs chat-action" to={msg.action.to} onClick={onNavigate}>{msg.action.label}</Link>
        )}

        {isLast && msg.chips?.length > 0 && (
          <div className="chat-chips">
            {msg.chips.map((c) => <button key={c} type="button" className="chip" onClick={() => onChip(c)}>{c}</button>)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AssistantLauncher() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useSessionState('geni-assistant-chat', [WELCOME])
  const [context, setContext] = useSessionState('geni-assistant-context', {})
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const timer = useRef(null)

  const contextRef = useRef(context)
  useEffect(() => {
    contextRef.current = context
  }, [context])

  const send = useCallback(
    (raw) => {
      const text = raw.trim()
      if (!text) return
      setMessages((m) => [...m, { role: 'user', text }])
      setDraft('')
      setTyping(true)
      clearTimeout(timer.current)
      // Short pause so the reply feels like a conversation
      timer.current = setTimeout(() => {
        const { context: nextContext, ...message } = getReply(text, contextRef.current)
        if (nextContext !== undefined) {
          contextRef.current = nextContext
          setContext(nextContext)
        }
        setMessages((m) => [...m, { role: 'assistant', ...message }])
        setTyping(false)
      }, 650)
    },
    [setMessages, setContext]
  )

  // Open from anywhere in the app
  useEffect(() => {
    const onOpen = (event) => {
      setOpen(true)
      const message = event.detail?.message
      if (message) send(message)
    }
    window.addEventListener('open-assistant', onOpen)
    return () => window.removeEventListener('open-assistant', onOpen)
  }, [send])

  useEffect(() => {
    if (location.hash === '#assistant') setOpen(true)
  }, [location.hash, location.key])

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (!open) return undefined
    inputRef.current?.focus({ preventScroll: true })
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, open])

  function restart() {
    setMessages([WELCOME])
    setContext({})
  }

  return (
    <>
      <button
        id="assistant"
        type="button"
        className={`launcher ${open ? 'is-hidden' : ''}`}
        aria-label="Ask GEN-I Assistant"
        aria-expanded={open}
        aria-controls="assistant-panel"
        onClick={() => setOpen(true)}
      >
        <Avatar />
        <span>Ask <b>GEN-I Assistant</b></span>
      </button>

      {open && (
        <section id="assistant-panel" className="chat-panel" role="dialog" aria-label="GEN-I Assistant">
          <header className="chat-head">
            <span className="chat-avatar is-lg"><Sparkle size={22} /></span>
            <div className="chat-title">
              <strong>GEN-I Assistant</strong>
              <span><i className="chat-dot" aria-hidden="true" />Shopping assistant · replies instantly</span>
            </div>
            <button type="button" className="chat-icon-btn" onClick={restart} aria-label="Start a new conversation" title="New conversation">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9M2.5 2.5v3h3" /></svg>
            </button>
            <button type="button" className="chat-icon-btn" onClick={() => setOpen(false)} aria-label="Close assistant">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
            </button>
          </header>

          <div className="chat-messages" ref={listRef} aria-live="polite">
            {messages.map((msg, i) => (
              <Message
                key={i}
                msg={msg}
                isLast={i === messages.length - 1 && !typing}
                onChip={send}
                onNavigate={() => window.innerWidth < 640 && setOpen(false)}
              />
            ))}
            {typing && (
              <div className="chat-row">
                <span className="chat-avatar"><Sparkle size={18} /></span>
                <p className="chat-bubble chat-typing" aria-label="GEN-I is typing"><i /><i /><i /></p>
              </div>
            )}
          </div>

          <form className="chat-composer" onSubmit={(e) => { e.preventDefault(); send(draft) }}>
            <div className="chat-input">
              <label className="sr-only" htmlFor="chat-input">Message GEN-I Assistant</label>
              <input
                id="chat-input"
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about products, prices or repairs…"
                autoComplete="off"
              />
              <button type="submit" className="chat-send" disabled={!draft.trim()} aria-label="Send">
                <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 12V2M2.5 6.5L7 2l4.5 4.5" /></svg>
              </button>
            </div>
            <p className="chat-disclaimer">Answers can be wrong — our team confirms prices and stock.</p>
          </form>
        </section>
      )}
    </>
  )
}
