'use client'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <main className="bg-gray-50 min-h-[80vh]">
      {/* Hero */}
      <section className="bg-[#0d2340] py-14 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">
          {t('Get In Touch', 'Contáctanos')}
        </h1>
        <p className="text-white/65 text-lg">
          {t('Questions, quotes, or ready to book — we reply fast.', 'Preguntas, cotizaciones o listo para reservar — respondemos rápido.')}
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left: contact methods */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#f5a623]/15 rounded-xl flex items-center justify-center text-2xl">📱</div>
              <div>
                <p className="font-bold text-[#0d2340]">{t('Text Us — Fastest Reply', 'Escríbenos — Respuesta Más Rápida')}</p>
                <p className="text-gray-400 text-sm">{t('Usually within minutes', 'Generalmente en minutos')}</p>
              </div>
            </div>
            <a href="sms:+12392204067" className="block w-full text-center bg-[#f5a623] hover:bg-[#e09610] text-white font-bold py-3 rounded-xl transition-colors">
              {t('Text (239) 220-4067', 'Mensaje al (239) 220-4067')}
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#1a6fa8]/10 rounded-xl flex items-center justify-center text-2xl">✉️</div>
              <div>
                <p className="font-bold text-[#0d2340]">{t('Email Us', 'Envíanos un Email')}</p>
                <p className="text-gray-400 text-sm">{t('For detailed questions', 'Para preguntas detalladas')}</p>
              </div>
            </div>
            <a href="mailto:booking@sunnysliderentals.com" className="block w-full text-center bg-[#1a6fa8] hover:bg-[#0d2340] text-white font-bold py-3 rounded-xl transition-colors">
              booking@sunnysliderentals.com
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-[#1a6fa8]/10 rounded-xl flex items-center justify-center text-2xl">📅</div>
              <div>
                <p className="font-bold text-[#0d2340]">{t('Book Online 24/7', 'Reservar en Línea 24/7')}</p>
                <p className="text-gray-400 text-sm">{t('Reserve with a 25% deposit', 'Reserva con un depósito del 25%')}</p>
              </div>
            </div>
            <Link href="/rentals" className="block w-full text-center bg-[#0d2340] hover:bg-[#1a6fa8] text-white font-bold py-3 rounded-xl transition-colors">
              {t('Browse & Book Rentals', 'Ver y Reservar Rentas')} →
            </Link>
          </div>

          {/* Hours */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-[#0d2340] mb-3">{t('Business Hours', 'Horario de Atención')}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t('Mon – Fri', 'Lun – Vie')}</span>
                <span className="font-semibold text-[#0d2340]">8:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('Sat – Sun', 'Sáb – Dom')}</span>
                <span className="font-semibold text-[#0d2340]">7:00 AM – 7:00 PM</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">{t('Online booking available 24/7.', 'Reservas en línea disponibles 24/7.')}</p>
          </div>

          <div className="bg-[#f5a623]/10 border border-[#f5a623]/30 rounded-2xl p-5">
            <p className="text-sm font-bold text-[#0d2340] mb-1">⛈️ {t('Florida Weather Guarantee', 'Garantía de Clima de Florida')}</p>
            <p className="text-sm text-gray-600">
              {t("Severe weather preventing your event? We'll reschedule at no charge.", '¿Clima severo que impide tu evento? Reprogramamos sin costo.')}
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
