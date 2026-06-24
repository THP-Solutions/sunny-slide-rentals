'use client'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactForm() {
  const { t } = useLanguage()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', eventDate: '', city: '', interest: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const INTERESTS = [
    { en: 'Water Slide',                              es: 'Tobogán de Agua' },
    { en: 'Combo Unit (Slide + Bounce)',               es: 'Unidad Combo (Tobogán + Inflable)' },
    { en: 'Party Package (Slide + Tables/Chairs/Tent)', es: 'Paquete de Fiesta (Tobogán + Mesas/Sillas/Carpa)' },
    { en: 'Generator Rental',                          es: 'Alquiler de Generador' },
    { en: 'Not sure yet',                              es: 'Aún no lo sé' },
  ]

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
        <h3 className="text-xl font-extrabold text-[#0d2340] mb-2">{t('Message Sent!', '¡Mensaje Enviado!')}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {t(
            'Thanks! Our team will reach out within a few hours — usually much faster. Watch for a text from',
            '¡Gracias! Nuestro equipo se comunicará en pocas horas — generalmente mucho antes. Espera un mensaje de'
          )}{' '}
          <span className="font-semibold text-[#1a6fa8]">(239) 220-4067</span>.
        </p>
        <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-[#1a6fa8] font-semibold hover:underline">
          {t('Send another message', 'Enviar otro mensaje')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-extrabold text-[#0d2340]">{t('Send Us a Message', 'Envíanos un Mensaje')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t('Full Name *', 'Nombre Completo *')}</label>
          <input
            name="name" value={form.name} onChange={handleChange} required
            placeholder={t('Jane Smith', 'María García')}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t('Phone *', 'Teléfono *')}</label>
          <input
            name="phone" type="tel" value={form.phone} onChange={handleChange} required
            placeholder="(239) 555-0100"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">{t('Email *', 'Correo Electrónico *')}</label>
        <input
          name="email" type="email" value={form.email} onChange={handleChange} required
          placeholder="jane@example.com"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t('Event Date', 'Fecha del Evento')}</label>
          <input
            name="eventDate" type="date" value={form.eventDate} onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t('City / Zip', 'Ciudad / Código Postal')}</label>
          <input
            name="city" value={form.city} onChange={handleChange}
            placeholder="Cape Coral, FL"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">
          {t('What are you interested in?', '¿Qué te interesa?')}
        </label>
        <select
          name="interest" value={form.interest} onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition bg-white"
        >
          <option value="">{t('Select a rental type...', 'Selecciona un tipo de renta...')}</option>
          {INTERESTS.map((i) => (
            <option key={i.en} value={i.en}>{t(i.en, i.es)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">{t('Message', 'Mensaje')}</label>
        <textarea
          name="message" value={form.message} onChange={handleChange} rows={3}
          placeholder={t('Tell us about your event, guest count, any questions...', 'Cuéntanos sobre tu evento, número de invitados, preguntas...')}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6fa8]/30 focus:border-[#1a6fa8] transition resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">
          {t('Something went wrong. Please try texting us at (239) 220-4067.', 'Algo salió mal. Por favor escríbenos al (239) 220-4067.')}
        </p>
      )}

      <button
        type="submit" disabled={status === 'loading'}
        className="w-full bg-[#1a6fa8] hover:bg-[#0d2340] disabled:bg-gray-300 text-white font-bold py-3 rounded-xl text-sm transition-colors"
      >
        {status === 'loading' ? t('Sending...', 'Enviando...') : t('Send Message 🌊', 'Enviar Mensaje 🌊')}
      </button>

      <p className="text-xs text-gray-400 text-center">
        {t('Prefer faster? Text us directly at', '¿Prefieres más rápido? Escríbenos directamente al')}{' '}
        <a href="sms:+12392204067" className="text-[#1a6fa8] font-semibold">(239) 220-4067</a>
      </p>
    </form>
  )
}
