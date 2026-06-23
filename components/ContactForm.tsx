'use client'
import { useState } from 'react'

const INTERESTS = [
  'Water Slide',
  'Combo Unit (Slide + Bounce)',
  'Party Package (Slide + Tables/Chairs/Tent)',
  'Generator Rental',
  'Not sure yet',
]

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', eventDate: '', city: '', interest: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Server error')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="text-5xl mb-4">🌊</div>
        <h3 className="text-xl font-extrabold text-[#0d2340] mb-2">Message Sent!</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          Thanks! Our team will reach out within a few hours — usually much faster. 
          Watch for a text from <span className="font-semibold text-[#1a6fa8]">(239) 231-4477</span>.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-[#1a6fa8] font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-extrabold text-[#0d2340]">Send Us a Message</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Jane Smith"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Phone *</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="(239) 555-0100"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Email *</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="jane@example.com"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Event Date</label>
          <input
            name="eventDate"
            type="date"
            value={form.eventDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">City / Zip</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Cape Coral, FL"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">What are you interested in?</label>
        <select
          name="interest"
          value={form.interest}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition bg-white"
        >
          <option value="">Select a rental type...</option>
          {INTERESTS.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          placeholder="Tell us about your event, guest count, any questions..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">Something went wrong. Please try texting us at (239) 231-4477.</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-[#1a6fa8] hover:bg-[#0d2340] disabled:bg-gray-300 text-white font-bold py-3 rounded-xl text-sm transition-colors"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message 🌊'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Prefer faster? Text us directly at{' '}
        <a href="sms:+12392314477" className="text-[#1a6fa8] font-semibold">(239) 231-4477</a>
      </p>
    </form>
  )
}
