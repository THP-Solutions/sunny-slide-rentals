'use client'
import { useState, useRef, useEffect } from 'react'
interface Msg {
  id: number
  from: 'bot' | 'user'
  text: string
}

interface HistoryMsg {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_REPLIES = ['🎂 Birthday Party', '🏫 School Event', '💰 Pricing', '📍 Service Area']
const LEAD_RE = /LEAD_CAPTURED:\s*(\{[^}]+\})/

export default function ChatBot() {
  const [open, setOpen]       = useState(false)
  const [msgs, setMsgs]       = useState<Msg[]>([{
    id: 0, from: 'bot',
    text: "Hey! I'm Sunny 🌞 What kind of event are you planning? I'll make sure you get the perfect setup.",
  }])
  const [history, setHistory] = useState<HistoryMsg[]>([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150) }, [open])

  const pushMsg = (m: Omit<Msg, 'id'>) =>
    setMsgs(prev => [...prev, { ...m, id: prev.length }])

  const send = async (override?: string) => {
    const text = (override ?? input).trim()
    if (!text || loading || done) return
    setInput('')
    pushMsg({ from: 'user', text })
    setLoading(true)

    const nextHistory: HistoryMsg[] = [...history, { role: 'user', content: text }]

    try {
      const res  = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextHistory }),
      })
      const data = await res.json()
      const raw: string = data.text ?? "I'm having a quick hiccup — text us at (239) 220-4067!"

      // Check for lead capture signal
      const match = LEAD_RE.exec(raw)
      if (match) {
        try {
          const lead = JSON.parse(match[1]) as { name?: string; phone?: string }
          const display = raw.replace(LEAD_RE, '').trim()
          pushMsg({ from: 'bot', text: display || `Done! 🔥 ${lead.name ?? 'Friend'}, our team will text you shortly!` })
          setDone(true)
          // Submit to GHL
          fetch('/api/chat-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: lead.name ?? '', phone: lead.phone ?? '', source: 'Sunny Chatbot (AI)' }),
          }).catch(() => {})
        } catch {
          pushMsg({ from: 'bot', text: raw.replace(LEAD_RE, '').trim() })
        }
      } else {
        pushMsg({ from: 'bot', text: raw })
      }

      setHistory([...nextHistory, { role: 'assistant', content: raw }])
    } catch {
      pushMsg({ from: 'bot', text: "Quick hiccup on my end — text us at (239) 220-4067 and we'll reply fast!" })
    } finally {
      setLoading(false)
    }
  }

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
        <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-lg shrink-0">🌞</div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">Sunny</p>
          <p className="text-blue-200 text-xs">Sunny Slide Rentals · Replies instantly</p>
        </div>
        <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white text-2xl leading-none ml-1" aria-label="Close">×</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ background: '#f8fafc', minHeight: 0 }}>
        {msgs.map(m => (
          <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                m.from === 'user' ? 'rounded-br-sm' : 'bg-white rounded-bl-sm shadow-sm border border-gray-100'
              }`}
              style={m.from === 'user' ? { background: '#1a6fa8', color: '#fff' } : { color: '#1f2937' }}
            >
              {m.text}
              {/* Quick replies only on opening message, before any user input */}
              {m.id === 0 && msgs.length === 1 && !done && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {QUICK_REPLIES.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
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

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100 flex gap-1 items-center">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder={done ? "✅ Our team will be in touch!" : loading ? "Sunny is typing…" : "Ask anything…"}
          disabled={done || loading}
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={() => send()}
          disabled={done || loading || !input.trim()}
          className="rounded-xl px-4 py-2 text-white font-bold text-sm disabled:opacity-40 transition-opacity hover:opacity-90"
          style={{ background: '#1a6fa8' }}
        >
          →
        </button>
      </div>
    </div>
  )
}
