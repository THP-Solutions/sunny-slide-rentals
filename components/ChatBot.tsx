'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Mode = 'chat' | 'askName' | 'askPhone' | 'done'

interface Msg {
  id: number
  from: 'bot' | 'user'
  text: string
  link?: { label: string; href: string }
  showCta?: boolean
}

const QUICK_REPLIES = ['🎂 Birthday Party', '🏫 School Event', '💰 Pricing', '📍 Service Area']

const YES_WORDS = ['yes', 'yep', 'yeah', 'yup', 'sure', 'ok', 'okay', 'please',
  "let's", 'lets', 'do it', 'sounds good', 'absolutely', 'definitely',
  'of course', 'for sure', 'go ahead', 'sure thing', 'totally']

const CONTACT_WORDS = ['my number', 'call me', 'text me', 'reach out',
  'contact me', 'just ask', 'have someone', 'send someone', 'get back to me']

const isYes = (s: string) => YES_WORDS.some(w => s.toLowerCase().includes(w))
const wantsContact = (s: string) => CONTACT_WORDS.some(w => s.toLowerCase().includes(w))

function getAnswer(input: string): {
  text: string
  link?: { label: string; href: string }
  cta: boolean
} {
  const t = input.toLowerCase()

  if (/price|cost|how much|pricing|rates?|fee|afford|budget/.test(t))
    return {
      text: 'Rentals start at $300 and go up to $725 for our biggest slide. A 25% deposit locks your date — balance due day-of. Want me to have someone text you a quote?',
      link: { label: 'See all pricing →', href: '/rentals' },
      cta: true,
    }

  if (/labelle|la belle|naples|bonita|estero|lehigh|service area|do you (serve|service|cover)|what (area|cities)|how far|where (are|do)/.test(t))
    return {
      text: 'Yes! We cover all of SW Florida — Cape Coral, Fort Myers, Lehigh Acres, LaBelle, Estero, Naples, and more. Trips over 20 miles have a small fuel charge. What city is your event in?',
      link: { label: 'See service area →', href: '/service-areas' },
      cta: true,
    }

  if (/available|avail|this (sun|mon|tue|wed|thu|fri|sat)|june|july|aug|sept|open|calendar|weekend|what date|what day/.test(t))
    return {
      text: 'Summer weekends book fast! Pick your slide and the calendar shows real-time availability. What date are you planning for?',
      link: { label: 'Check availability →', href: '/rentals' },
      cta: true,
    }

  if (/birthday|bday/.test(t))
    return {
      text: 'Birthday parties are our specialty 🎂 The Tiki Tsunami (27 ft tall) and Shark Attack are crowd favorites for ages 5+. How old are the birthday kids? I’ll match you to the right slide.',
      link: { label: 'Browse birthday setups →', href: '/rentals' },
      cta: true,
    }

  if (/school|church|communit|block party|neighbor|nonprofit|grad/.test(t))
    return {
      text: "School and community events are our jam — we've done hundreds. The key is matching capacity to your crowd. How many kids are you expecting?",
      link: { label: 'View large event options →', href: '/rentals' },
      cta: true,
    }

  if (/corporate|company|work|office|team|employ|business/.test(t))
    return {
      text: 'A water slide at a corporate event is a power move 💪 Your team will talk about it for years. What’s the headcount? We’ll package exactly what you need.',
      link: { label: 'View party packages →', href: '/rentals' },
      cta: true,
    }

  if (/setup|set.?up|install|deliver|pickup|pick.?up|tear.?down|bring|transport|includ/.test(t))
    return {
      text: 'We handle everything — delivery, professional setup, safety check, and full teardown after your event. You don’t lift a finger. All included in the price.',
      cta: true,
    }

  if (/how long|hours?|duration|all day|whole day|rental period/.test(t))
    return {
      text: 'Up to 8 hours — we set up before your guests arrive and pick up after they leave. What time does your event start?',
      cta: true,
    }

  if (/tiki|tsunami|shark|yeti|riptide|biggest|tallest|largest|combo|bounce/.test(t))
    return {
      text: 'The Tiki Tsunami (63 ft long, 27 ft tall) is our flagship. The Shark Attack at 52 ft is a fan favorite. Want someone to walk you through the best fit for your event?',
      link: { label: 'See all slides →', href: '/rentals' },
      cta: true,
    }

  if (/package|bundle|table|chair|tent|generator|add.?on|everything/.test(t))
    return {
      text: "Party Packages bundle the slide with tables, chairs, and a tent — one delivery, everything handled. Most customers say it’s the easiest party they’ve ever thrown. Want details?",
      link: { label: 'See party packages →', href: '/rentals' },
      cta: true,
    }

  if (/waiver|liabilit|safety|insur/.test(t))
    return {
      text: 'Safety is our #1 priority. Every unit is professionally inspected and we carry full liability insurance. Digital waiver is quick and easy.',
      link: { label: 'View waiver →', href: '/waiver' },
      cta: false,
    }

  if (/deposit|refund|cancel|payment/.test(t))
    return {
      text: '25% deposit holds your date — minimum $100. Balance is due day-of. Life happens, we work with you if you need to reschedule.',
      cta: true,
    }

  // Catch-all — useful, never loops back to greeting
  return {
    text: 'Great question! Our team can answer that faster than I can and they reply quick. Want me to have someone text you directly?',
    link: { label: 'Or browse rentals →', href: '/rentals' },
    cta: true,
  }
}

// ── Component ───────────────────────────────────────────────────────────────────────────────

export default function ChatBot() {
  const [open, setOpen]           = useState(false)
  const [mode, setMode]           = useState<Mode>('chat')
  const [msgs, setMsgs]           = useState<Msg[]>([{
    id: 0, from: 'bot',
    text: "Hey! I’m Sunny 🌞 What kind of event are you planning? Tell me a bit and I’ll make sure you get the perfect setup.",
  }])
  const [input, setInput]         = useState('')
  const [leadName, setLeadName]   = useState('')
  const [offerShown, setOfferShown] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150) }, [open])

  const push = (m: Omit<Msg, 'id'>) =>
    setMsgs(prev => [...prev, { ...m, id: prev.length }])

  const handleSend = (override?: string) => {
    const text = (override ?? input).trim()
    if (!text) return
    setInput('')
    push({ from: 'user', text })

    // ─ Lead flow ────────────────────────────────────────────────────────────────
    if (mode === 'askName') {
      setLeadName(text)
      setMode('askPhone')
      setTimeout(() =>
        push({ from: 'bot', text: `Nice to meet you, ${text}! 🤝 What’s the best number to text you?` }),
        400)
      return
    }

    if (mode === 'askPhone') {
      const name = leadName
      setMode('done')
      setTimeout(() =>
        push({
          from: 'bot',
          text: `Done! 🔥 ${name}, our team will text you shortly. Browse while you wait!`,
          link: { label: 'Browse rentals →', href: '/rentals' },
        }),
        400)
      fetch('/api/chat-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: text, source: 'Sunny Chatbot' }),
      }).catch(() => {})
      return
    }

    // ─ Chat mode ────────────────────────────────────────────────────────────
    // Direct contact request
    if (wantsContact(text)) {
      setMode('askName')
      setTimeout(() => push({ from: 'bot', text: "Of course! What’s your name?" }), 400)
      return
    }

    // "Yes" after offer was shown
    if (offerShown && isYes(text)) {
      setMode('askName')
      setTimeout(() => push({ from: 'bot', text: "Awesome! 🙌 What’s your name?" }), 400)
      return
    }

    // Normal Q&A
    const resp     = getAnswer(text)
    const showCta  = resp.cta && !offerShown
    if (showCta) setOfferShown(true)

    setTimeout(() =>
      push({ from: 'bot', text: resp.text, link: resp.link, showCta }),
      500)
  }

  const acceptLead = () => {
    setMode('askName')
    push({ from: 'bot', text: "Awesome! 🙌 What’s your name?" })
  }

  // ─ Closed bubble ───────────────────────────────────────────────────────────────
  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Chat with Sunny"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform"
      style={{ background: 'linear-gradient(135deg, #f5a623, #e8940f)' }}
    >
      🌞
    </button>
  )

  // ─ Chat window ──────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-white"
      style={{ width: 'min(384px, calc(100vw - 24px))', maxHeight: 'min(520px, calc(100vh - 96px))' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ background: 'linear-gradient(135deg, #1a6fa8, #0d2340)' }}
      >
        <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-lg shrink-0">
          🌞
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">Sunny</p>
          <p className="text-blue-200 text-xs">Sunny Slide Rentals • Replies instantly</p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-white/70 hover:text-white text-2xl leading-none ml-1"
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ background: '#f8fafc', minHeight: 0 }}>
        {msgs.map(m => (
          <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                m.from === 'user'
                  ? 'rounded-br-sm'
                  : 'bg-white rounded-bl-sm shadow-sm border border-gray-100'
              }`}
              style={m.from === 'user' ? { background: '#1a6fa8', color: '#fff' } : { color: '#1f2937' }}
            >
              {m.text}

              {m.link && (
                <Link
                  href={m.link.href}
                  className="block mt-1 text-xs font-semibold underline"
                  style={{ color: m.from === 'user' ? '#bfe0ff' : '#1a6fa8' }}
                >
                  {m.link.label}
                </Link>
              )}

              {/* CTA button — only on first offer, only while still in chat mode */}
              {m.showCta && mode === 'chat' && (
                <button
                  onClick={acceptLead}
                  className="mt-2 w-full text-xs font-bold py-2 px-3 rounded-lg text-white transition-opacity hover:opacity-90"
                  style={{ background: '#f5a623' }}
                >
                  📱 Yes, text me!
                </button>
              )}

              {/* Quick reply chips on the opening message only */}
              {m.id === 0 && mode === 'chat' && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {QUICK_REPLIES.map(q => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-xs px-2 py-1 rounded-full border text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                      style={{ borderColor: '#bfdbfe' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder={
            mode === 'askName'  ? 'Your first name…' :
            mode === 'askPhone' ? 'Your phone number…' :
            mode === 'done'     ? "✅ We’ll be in touch!" :
            'Ask anything…'
          }
          disabled={mode === 'done'}
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={mode === 'done' || !input.trim()}
          className="rounded-xl px-4 py-2 text-white font-bold text-sm disabled:opacity-40 transition-opacity hover:opacity-90"
          style={{ background: '#1a6fa8' }}
        >
          →
        </button>
      </div>
    </div>
  )
}
