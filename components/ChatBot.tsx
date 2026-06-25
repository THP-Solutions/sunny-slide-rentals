'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Message = {
  id: number
  from: 'sunny' | 'user'
  text: string
  link?: { label: string; href: string }
}

// offered = yes/no buttons shown
// askName = waiting for name input
// askPhone = waiting for phone input
// done = submitted
type LeadStep = 'idle' | 'offered' | 'askName' | 'askPhone' | 'done'

const INITIAL: Message = {
  id: 0,
  from: 'sunny',
  text: "Hey! I'm Sunny 🌞 — quick question before you browse: what kind of event are you planning? Because I want to make sure you get the RIGHT setup, not just any setup.",
}

const QUICK_REPLIES = [
  { label: "🎂 Birthday Party", q: "birthday party" },
  { label: "🏫 School Event", q: "school event" },
  { label: "🏢 Corporate Event", q: "corporate event" },
  { label: "💰 What's the price?", q: "what are your prices" },
]

type QA = {
  patterns: string[]
  reply: () => string
  link?: { label: string; href: string }
  buyingIntent?: boolean
}

const QAs: QA[] = [
  {
    patterns: ['birthday', 'bday', 'kid', 'kids', 'child', 'children', 'son', 'daughter'],
    reply: () => "Birthday parties are what we LIVE for. 🎂 Here's the truth — the kids who have the biggest water slide at their party become the most talked-about kid in school. Our Tiki Tsunami is 27 feet tall. What age are the kids? That helps me match you to the right unit.",
    link: { label: 'See Birthday Setups →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['school', 'church', 'community', 'neighborhood', 'block party', 'nonprofit'],
    reply: () => "School events and community parties are our specialty — we've done hundreds. The key is getting enough capacity for the crowd. How many kids are you expecting? I want to make sure nobody's standing in line the whole time.",
    link: { label: 'View Large Event Options →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['corporate', 'company', 'work', 'office', 'team', 'employee', 'business'],
    reply: () => "Corporate events with water slides are a power move — your team will talk about it for YEARS. Nothing builds culture like shared fun. What's the headcount? We can package exactly what you need.",
    link: { label: 'View Party Packages →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['price', 'cost', 'how much', 'pricing', 'rates', 'cheap', 'expensive', 'fee', 'afford', 'budget'],
    reply: () => "Great question — and I'm going to be straight with you. Rentals start at $300 and go up to $725 for our biggest slide. But let me ask you this: what's the cost of a party that nobody talks about the next day? Zero memories, zero fun. Our parties get talked about for YEARS. A 25% deposit locks your date. What date are you thinking?",
    link: { label: 'See All Pricing →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['book', 'reserve', 'reservation', 'checkout', 'order', 'deposit', 'pay', 'schedule', 'want', 'ready', 'sign up'],
    reply: () => "YES. That's the right move — let's lock it in before someone else takes your date. Summer weekends in SW Florida book FAST. Takes 2 minutes online, 25% deposit holds your spot. What's your event date?",
    link: { label: 'Book Now — 2 Minutes →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['deliver', 'delivery', 'setup', 'set up', 'install', 'pick up', 'pickup', 'bring', 'transport'],
    reply: () => "We handle EVERYTHING — delivery, professional setup, safety check, and full teardown after your event. You don't lift a finger. It's all included in the price. That's what separates us from guys with a trailer and a slide. What's your event address?",
    buyingIntent: true,
  },
  {
    patterns: ['service area', 'where', 'location', 'serve', 'coverage', 'cape coral', 'lehigh', 'fort myers', 'florida', 'city', 'travel', 'far'],
    reply: () => "We cover all of SW Florida — Cape Coral, Lehigh Acres, Fort Myers, Estero, and surrounding areas. What city is your event in? I'll confirm we cover you and we can move forward.",
    link: { label: 'Check Service Area →', href: '/service-areas' },
    buyingIntent: true,
  },
  {
    patterns: ['how long', 'hours', 'duration', 'rental period', 'time', 'whole day', 'all day', 'when'],
    reply: () => "Full day rental — up to 8 hours. We set up before your guests arrive and pick up after they leave. You never have to worry about timing. What time does your event start? I want to make sure the setup is ready before your first guest pulls up.",
    buyingIntent: true,
  },
  {
    patterns: ['water slide', 'slide', 'tiki', 'tsunami', 'shark', 'biggest', 'tallest', 'large', 'huge', 'wow'],
    reply: () => "The Tiki Tsunami Mega Splash is our crown jewel — 63 feet long, 27 feet tall. When that thing shows up in your backyard, the entire neighborhood knows a LEGENDARY party is happening. The Shark Attack at 52 feet is a fan favorite for slightly younger groups. Which one fits your vibe?",
    link: { label: 'See the Slides →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['combo', 'bounce', 'bouncer', 'obstacle', 'combination', 'both'],
    reply: () => "The combo units are GENIUS for mixed age groups — bounce house AND slide in one. Younger kids bounce, older kids slide. Nobody's left out, nobody's bored. What ages are you working with?",
    link: { label: 'View Combo Units →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['party package', 'package', 'bundle', 'tables', 'chairs', 'tent', 'complete', 'everything'],
    reply: () => "The Party Package is the best decision you can make — slide, tables, chairs, AND a tent. One call, one delivery, everything handled. Most people who go this route tell us it's the easiest party they've ever thrown. Want me to walk you through what's included?",
    link: { label: 'See Party Packages →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['generator', 'power', 'electricity', 'outlet', 'plug'],
    reply: () => "Don't let power access be the reason you can't have the best party of the year. We offer generator rental — add it at checkout and you're covered. Problem solved. What else is holding you back?",
  },
  {
    patterns: ['safe', 'safety', 'weight', 'limit', 'adults', 'liability', 'insurance'],
    reply: () => "Safety is non-negotiable for us — every unit is inspected, cleaned, and safety-checked before every rental. We match you to the right unit for your age group. What ages are attending? I'll point you to the perfect fit.",
  },
  {
    patterns: ['weather', 'rain', 'storm', 'cancel', 'refund', 'reschedule'],
    reply: () => "Florida weather is unpredictable — we get it. That's why we have a Weather Guarantee: if severe weather cancels your event, we reschedule at NO charge. Zero risk for you. That objection is off the table. So what's the date?",
    buyingIntent: true,
  },
  {
    patterns: ['think', 'maybe', 'later', 'not sure', 'deciding', 'comparing', 'shopping', 'other companies'],
    reply: () => "I respect that — but let me be honest with you: the families that 'think about it' usually come back to us 2 weeks later and their date is gone. We're the top-rated rental company in SW Florida for a reason. What's the one thing that's stopping you from locking in right now?",
    link: { label: 'Check Availability →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    patterns: ['contact', 'phone', 'call', 'email', 'reach', 'talk', 'speak', 'human', 'person'],
    reply: () => "Text us right now for the fastest answer — (239) 220-4067. Real people, real fast replies. Or let me grab your info and have someone reach out to YOU. Which works better?",
    link: { label: 'Contact Page →', href: '/contact' },
    buyingIntent: true,
  },
  {
    patterns: ['hello', 'hi', 'hey', 'howdy', 'hola', 'sup', "what's up", 'yo'],
    reply: () => "Hey! 🌊 You caught me at the right time. What kind of event are you planning? Give me 60 seconds and I'll tell you exactly what you need.",
  },
  {
    patterns: ['thank', 'thanks', 'awesome', 'great', 'perfect', 'love', 'amazing', 'cool', 'nice'],
    reply: () => "You're making a great decision. 🎉 The only thing left is to lock in your date before it's gone. Summer moves FAST around here. What's the date?",
    link: { label: 'Book Now →', href: '/rentals' },
    buyingIntent: true,
  },
  {
    // Age patterns — use word-boundary matching in getBotReply to avoid phone number false matches
    patterns: ['year old', 'years old', 'age', ' yr', 'toddler', 'teen', 'adult',
               ' 1 ', ' 2 ', ' 3 ', ' 4 ', ' 5 ', ' 6 ', ' 7 ', ' 8 ', ' 9 ',
               ' 10 ', ' 11 ', ' 12 ', ' 13 ', ' 14 ', ' 15 ', ' 16 ', ' 17 ', ' 18 '],
    reply: () => "Perfect — that age group will absolutely love our water slides! Kids 6–15 go WILD on the Tiki Tsunami or Shark Attack. For the little ones under 6, our Combo units are ideal. Want me to show you the best match?",
    link: { label: 'Find the Right Rental →', href: '/rentals' },
    buyingIntent: true,
  },
]

function getBotReply(input: string): QA {
  // Pad with spaces so age patterns like ' 9 ' match at word boundaries
  const lower = ' ' + input.toLowerCase().trim() + ' '
  for (const qa of QAs) {
    if (qa.patterns.some((p) => lower.includes(p))) return qa
  }
  return {
    patterns: [],
    reply: () => "Great question — our team can answer that better than I can and they reply fast! Want me to have someone reach out to you directly?",
    link: { label: 'Or browse rentals →', href: '/rentals' },
    buyingIntent: true,
  }
}

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
  const [buyingIntentCount, setBuyingIntentCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (open) { inputRef.current?.focus(); setHasUnread(false) }
  }, [open, messages])

  useEffect(() => {
    const t = setTimeout(() => { if (!open) setHasUnread(true) }, 4000)
    return () => clearTimeout(t)
  }, [open])

  const addMessage = (msg: Omit<Message, 'id'>) =>
    setMessages((prev) => [...prev, { ...msg, id: nextId++ }])

  const offerLeadCapture = () => {
    setLeadStep('offered')
    addMessage({
      from: 'sunny',
      text: "I love the enthusiasm! 🔥 Want me to have someone from our team text you to lock in your date? They reply in minutes.",
    })
  }

  const submitLead = async (name: string, phone: string) => {
    try {
      await fetch('/api/chat-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, source: 'Sunny Chatbot' }),
      })
    } catch { /* silent */ }
  }

  // Returns true if input was consumed by the lead flow
  const handleLeadInput = (text: string): boolean => {
    const lower = text.toLowerCase()

    if (leadStep === 'offered') {
      if (lower.includes('no') || lower.includes('nah') || lower.includes('later') || lower.includes('nope')) {
        setLeadStep('idle')
        addMessage({ from: 'user', text })
        setTimeout(() => {
          addMessage({ from: 'sunny', text: "No problem — but seriously, don't sleep on your date. Summer fills up FAST. 👀", link: { label: 'Check Availability Now →', href: '/rentals' } })
          setTyping(false)
        }, 600)
        return true
      }
      // They said yes (or typed something) — ask for name
      setLeadStep('askName')
      addMessage({ from: 'user', text })
      setTyping(true)
      setTimeout(() => {
        addMessage({ from: 'sunny', text: "Awesome! 🙌 What's your name?" })
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
        addMessage({ from: 'sunny', text: `Nice to meet you, ${text.trim().split(' ')[0]}! 🤝 What's the best number to text you?` })
        setTyping(false)
      }, 500)
      return true
    }

    if (leadStep === 'askPhone') {
      setLeadStep('done')
      addMessage({ from: 'user', text })
      submitLead(leadName, text.trim())
      setTyping(true)
      setTimeout(() => {
        addMessage({
          from: 'sunny',
          text: `Done! 🔥 ${leadName.split(' ')[0]}, our team is going to text you shortly — they'll get your date locked in and answer anything. You're one step away from the best party your neighborhood has ever seen.`,
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

    // Lead capture flow consumes input
    if (leadStep === 'offered' || leadStep === 'askName' || leadStep === 'askPhone') {
      handleLeadInput(text)
      return
    }

    addMessage({ from: 'user', text })
    setTyping(true)

    setTimeout(() => {
      const qa = getBotReply(text)
      addMessage({ from: 'sunny', text: qa.reply(), link: qa.link })
      setTyping(false)

      if (qa.buyingIntent) {
        const count = buyingIntentCount + 1
        setBuyingIntentCount(count)
        if (count >= 3 && leadStep === 'idle') {
          setTimeout(offerLeadCapture, 1400)
        }
      }
    }, 600 + Math.random() * 350)
  }

  const placeholder =
    leadStep === 'askName' ? 'Your name...' :
    leadStep === 'askPhone' ? 'Your phone number...' :
    'Ask me anything...'

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with Sunny"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#f5a623] hover:bg-[#e09610] text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ boxShadow: '0 4px 24px rgba(245,166,35,0.55)' }}
      >
        {open
          ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          : <span className="text-2xl">💬</span>
        }
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
              <p className="text-white/65 text-xs">Sunny Slide Rentals • Typically replies instantly</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={'flex ' + (msg.from === 'user' ? 'justify-end' : 'items-end gap-2')}>
                {msg.from === 'sunny' && (
                  <div className="w-6 h-6 rounded-full bg-[#f5a623] flex items-center justify-center text-xs flex-shrink-0 mb-0.5">🌞</div>
                )}
                <div className="max-w-[78%]">
                  <div className={'px-3 py-2 text-sm leading-relaxed rounded-2xl ' + (
                    msg.from === 'user'
                      ? 'bg-[#1a6fa8] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  )}>
                    {msg.text}
                  </div>
                  {msg.link && (
                    <Link href={msg.link.href} className="mt-1 ml-1 text-xs text-[#1a6fa8] font-semibold hover:underline inline-flex items-center gap-0.5">
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
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: d + 'ms' }} />
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

          {/* Lead capture yes/no buttons — only shown during 'offered' step */}
          {leadStep === 'offered' && (
            <div className="px-3 py-2 flex gap-2 bg-white border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => {
                  addMessage({ from: 'user', text: "Let's do it!" })
                  setLeadStep('askName')
                  setTyping(true)
                  setTimeout(() => {
                    addMessage({ from: 'sunny', text: "Awesome! 🙌 What's your name?" })
                    setTyping(false)
                  }, 500)
                }}
                className="flex-1 text-sm font-bold bg-[#f5a623] hover:bg-[#e09610] text-white py-2 rounded-xl transition-colors"
              >
                🔥 Let&apos;s do it
              </button>
              <button
                onClick={() => {
                  addMessage({ from: 'user', text: 'No thanks' })
                  setLeadStep('idle')
                  setTimeout(() => {
                    addMessage({ from: 'sunny', text: "No problem — but seriously, don't sleep on your date. Summer fills up FAST. 👀", link: { label: 'Check Availability Now →', href: '/rentals' } })
                  }, 600)
                }}
                className="flex-1 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-xl transition-colors"
              >
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
              placeholder={placeholder}
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="w-9 h-9 rounded-full bg-[#1a6fa8] hover:bg-[#0d2340] disabled:bg-gray-200 text-white flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4 rotate-45" fill="currentColor" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
