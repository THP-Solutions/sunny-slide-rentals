'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Message = {
  id: number
  from: 'sunny' | 'user' | 'system'
  text: string
  link?: { label: string; href: string }
}

type LeadStep = 'idle' | 'offered' | 'askName' | 'askPhone' | 'done'

const INITIAL: Message = {
  id: 0, from: 'sunny',
  text: "Hey! I'm Sunny 🌞 — your Sunny Slide Rentals assistant! Ask me anything about pricing, booking, or our water slides. How can I help?",
}

const QUICK_REPLIES = [
  { label: '💰 Pricing', q: 'how much does it cost' },
  { label: '📅 How to Book', q: 'how do I book' },
  { label: '🚚 Delivery', q: 'do you deliver and set up' },
  { label: '📍 Service Areas', q: 'what areas do you serve' },
]

type QA = { patterns: string[]; text: string; link?: { label: string; href: string }; buyingIntent?: boolean }

const QAs: QA[] = [
  {
    patterns: ['price', 'cost', 'how much', 'pricing', 'rates', 'cheap', 'expensive', 'fee'],
    text: 'Rentals start at $300 and go up to $725 for our epic Tiki Tsunami Mega Splash! A 25% deposit reserves your date — the rest is due day-of. 💰',
    link: { label: 'Browse Rentals & Prices →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['book', 'reserve', 'reservation', 'checkout', 'order', 'deposit', 'pay', 'schedule'],
    text: 'Super easy! Browse rentals, add to cart, and check out with just a 25% deposit. We confirm within 24 hours. 🎉',
    link: { label: 'Book Now →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['deliver', 'delivery', 'setup', 'set up', 'install', 'pick up', 'pickup', 'bring'],
    text: 'Absolutely! We handle delivery, professional setup, AND teardown after your event — all included in the rental price. Zero stress! 🚚',
  },
  {
    patterns: ['service area', 'where', 'location', 'serve', 'coverage', 'cape coral', 'lehigh', 'fort myers', 'florida', 'city', 'travel'],
    text: 'We cover Cape Coral, Lehigh Acres, Fort Myers, North Fort Myers, Estero & all of SW Florida. Check the map to confirm your city! 📍',
    link: { label: 'View Service Area Map →', href: '/service-areas' },
    buyingIntent: true,
  },
  {
    patterns: ['how long', 'hours', 'duration', 'rental period', 'time', 'whole day', 'all day'],
    text: 'Standard rentals are for a full day (up to 8 hours). Need more time? Just reach out and we can work something out! ⏰',
  },
  {
    patterns: ['water slide', 'slide', 'tiki', 'tsunami', 'shark', 'biggest', 'tallest', 'large', 'huge'],
    text: 'Our star is the Tiki Tsunami Mega Splash — 63 ft long, 27 ft tall, pure Florida fun! The Shark Attack Splash at 52 ft is a fan favorite too. 🌊🦈',
    link: { label: 'See All Water Slides →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['combo', 'bounce', 'bouncer', 'obstacle', 'combination'],
    text: 'Combo units are the ultimate deal — bounce house + water slide or obstacle course in one! Great for all ages. 🎠',
    link: { label: 'View Combo Units →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['party package', 'package', 'bundle', 'tables', 'chairs', 'tent', 'complete'],
    text: 'Party Packages bundle a water slide + tables, chairs & tent for the full setup. One booking, one delivery — easy! 🎪',
    link: { label: 'See Party Packages →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['generator', 'power', 'electricity', 'outlet', 'plug'],
    text: 'Yes! We offer generator rental for locations without easy power access. Just add it at checkout. ⚡',
  },
  {
    patterns: ['safe', 'safety', 'age', 'weight', 'limit', 'kids', 'children', 'adults'],
    text: "Safety is #1! All equipment is cleaned and inspected before every rental. Ask us and we'll match you with the right unit for your group. ✅",
  },
  {
    patterns: ['weather', 'rain', 'storm', 'cancel', 'refund', 'reschedule'],
    text: "We have a Florida Weather Guarantee — if severe weather prevents your event, we'll reschedule at no charge. ⛈️✅",
  },
  {
    patterns: ['contact', 'phone', 'call', 'email', 'reach', 'talk', 'speak', 'number'],
    text: 'Text us for the fastest reply: (239) 231-4477 — or use our contact page! 📞',
    link: { label: 'Contact Us →', href: '/contact' },
  },
  {
    patterns: ['hello', 'hi', 'hey', 'howdy', 'hola', 'sup', "what's up"],
    text: "Hey hey! 👋 Great to meet you! I'm here to help plan your most epic water slide party. What do you need to know?",
  },
  {
    patterns: ['thank', 'thanks', 'awesome', 'great', 'perfect', 'love', 'amazing', 'cool'],
    text: "You're so welcome! 🌊 If you're ready to splash, just hit Book Now. Any other questions? I'm here!",
    link: { label: 'Book Now →', href: '/rentals' },
  },
]

function getBotReply(input: string): QA {
  const lower = input.toLowerCase()
  for (const qa of QAs) {
    if (qa.patterns.some((p) => lower.includes(p))) return qa
  }
  return {
    patterns: [],
    text: "Hmm, not 100% sure about that one! 🤔 Our team will know for sure — reach out and we'll get back to you fast!",
    link: { label: 'Contact Us →', href: '/contact' },
  }
}

const BUYING_INTENT_THRESHOLD = 1
let nextId = 1

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [hasUnread, setHasUnread] = useState(false)
  const [leadStep, setLeadStep] = useState<LeadStep>('idle')
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [buyingIntentCount, setBuyingIntentCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (open) { inputRef.current?.focus(); setHasUnread(false) }
  }, [open, messages])

  useEffect(() => {
    const t = setTimeout(() => { if (!open) setHasUnread(true) }, 6000)
    return () => clearTimeout(t)
  }, [open])

  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages((prev) => [...prev, { ...msg, id: nextId++ }])
  }

  const offerLeadCapture = () => {
    setLeadStep('offered')
    addMessage({
      from: 'sunny',
      text: "Want our team to reach out to you directly? Drop your name and phone number and we'll text you back within minutes! 📱",
    })
  }

  const submitLeadToGHL = async (name: string, phone: string) => {
    try {
      await fetch('/api/chat-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, source: 'Sunny Chatbot' }),
      })
    } catch (e) {
      // silent fail — lead still captured in UI
    }
  }

  const handleLeadInput = (text: string) => {
    const lower = text.toLowerCase()
    if (leadStep === 'offered') {
      if (lower.includes('no') || lower.includes('nah') || lower.includes('later') || lower.includes('nope')) {
        setLeadStep('idle')
        addMessage({ from: 'user', text })
        setTyping(true)
        setTimeout(() => {
          addMessage({ from: 'sunny', text: "No worries! I'm here if you need anything else. 😊" })
          setTyping(false)
        }, 600)
        return true
      }
      setLeadName('')
      setLeadPhone('')
      setLeadStep('askName')
      addMessage({ from: 'user', text })
      setTyping(true)
      setTimeout(() => {
        addMessage({ from: 'sunny', text: 'What\'s your name?' })
        setTyping(false)
      }, 500)
      return true
    }
    if (leadStep === 'askName') {
      setLeadName(text.trim())
      setLeadStep('askPhone')
      addMessage({ from: 'user', text })
      setTyping(true)
      setTimeout(() => {
        addMessage({ from: 'sunny', text: `Nice to meet you, ${text.trim().split(' ')[0]}! 👋 What's the best phone number to reach you?` })
        setTyping(false)
      }, 600)
      return true
    }
    if (leadStep === 'askPhone') {
      setLeadPhone(text.trim())
      setLeadStep('done')
      addMessage({ from: 'user', text })
      submitLeadToGHL(leadName, text.trim())
      setTyping(true)
      setTimeout(() => {
        addMessage({
          from: 'sunny',
          text: `Perfect! 🎉 I've sent your info to our team. Expect a text from us very soon, ${leadName.split(' ')[0]}! Ready to make some waves? 🌊`,
          link: { label: 'Browse Rentals While You Wait →', href: '/rentals' },
        })
        setTyping(false)
      }, 800)
      return true
    }
    return false
  }

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    setInput('')
    setShowQuickReplies(false)

    if (leadStep !== 'idle' && leadStep !== 'done') {
      handleLeadInput(text)
      return
    }

    addMessage({ from: 'user', text })
    setTyping(true)

    setTimeout(() => {
      const reply = getBotReply(text)
      addMessage({ from: 'sunny', text: reply.text, link: reply.link })
      setTyping(false)

      if (reply.buyingIntent) {
        const newCount = buyingIntentCount + 1
        setBuyingIntentCount(newCount)
        if (newCount >= BUYING_INTENT_THRESHOLD && leadStep === 'idle') {
          setTimeout(() => offerLeadCapture(), 1200)
        }
      }
    }, 700 + Math.random() * 400)
  }

  const inputPlaceholder = () => {
    if (leadStep === 'askName') return 'Your full name...'
    if (leadStep === 'askPhone') return 'Your phone number...'
    return 'Ask Sunny anything...'
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with Sunny"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#f5a623] hover:bg-[#e09610] text-white shadow-xl flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95"
        style={{ boxShadow: '0 4px 24px rgba(245,166,35,0.55)' }}
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">💬</span>
        )}
        {hasUnread && !open && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] font-bold flex items-center justify-center">1</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 flex flex-col bg-white rounded-2xl overflow-hidden"
          style={{ width: '340px', maxWidth: 'calc(100vw - 2.5rem)', height: '500px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
        >
          {/* Header */}
          <div className="bg-[#1a6fa8] px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#f5a623] flex items-center justify-center text-xl flex-shrink-0 shadow-sm">🌞</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Sunny</p>
              <p className="text-white/65 text-xs">Sunny Slide Rentals • Online</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0 shadow-sm" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={'flex ' + (msg.from === 'user' ? 'justify-end' : 'items-end gap-2')}>
                {msg.from === 'sunny' && (
                  <div className="w-6 h-6 rounded-full bg-[#f5a623] flex items-center justify-center text-xs flex-shrink-0 mb-0.5">🌞</div>
                )}
                <div className={'max-w-[78%]'}>
                  <div className={'px-3 py-2 text-sm leading-relaxed rounded-2xl ' + (
                    msg.from === 'user'
                      ? 'bg-[#1a6fa8] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  )}>
                    {msg.text}
                  </div>
                  {msg.link && (
                    <Link
                      href={msg.link.href}
                      className="mt-1 ml-1 text-xs text-[#1a6fa8] font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      {msg.link.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-[#f5a623] flex items-center justify-center text-xs flex-shrink-0">🌞</div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-3 py-2.5 flex gap-1 items-center">
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: delay + 'ms' }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {showQuickReplies && (
            <div className="px-3 py-2 flex flex-wrap gap-1.5 bg-white border-t border-gray-100 flex-shrink-0">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.q}
                  onClick={() => sendMessage(qr.q)}
                  className="text-xs bg-gray-50 border border-[#1a6fa8]/25 text-[#1a6fa8] font-semibold px-2.5 py-1.5 rounded-full hover:bg-[#1a6fa8] hover:text-white transition-colors"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          )}

          {/* Lead capture yes/no chips */}
          {leadStep === 'offered' && (
            <div className="px-3 py-2 flex gap-2 bg-white border-t border-gray-100 flex-shrink-0">
              <button onClick={() => sendMessage('yes please')} className="flex-1 text-sm font-bold bg-[#f5a623] hover:bg-[#e09610] text-white py-2 rounded-xl transition-colors">
                👍 Yes!
              </button>
              <button onClick={() => sendMessage('no thanks')} className="flex-1 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-xl transition-colors">
                Not now
              </button>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
            className="px-3 py-2.5 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholder()}
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="w-9 h-9 rounded-full bg-[#1a6fa8] hover:bg-[#0d2340] disabled:bg-gray-200 text-white flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4 rotate-45" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
