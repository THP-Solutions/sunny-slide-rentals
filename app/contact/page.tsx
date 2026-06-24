import Link from 'next/link'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Sunny Slide Rentals. Text, call, or send a message — we respond fast!',
}

export default function ContactPage() {
  return (
    <main className="bg-gray-50 min-h-[80vh]">
      {/* Hero */}
      <section className="bg-[#0d2340] py-14 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Get In Touch</h1>
        <p className="text-white/65 text-lg">Questions, quotes, or ready to book — we reply fast.</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left: contact methods */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#f5a623]/15 rounded-xl flex items-center justify-center text-2xl">📱</div>
              <div>
                <p className="font-bold text-[#0d2340]">Text Us — Fastest Reply</p>
                <p className="text-gray-400 text-sm">Usually within minutes</p>
              </div>
            </div>
            <a
              href="sms:+12392204067"
              className="block w-full text-center bg-[#f5a623] hover:bg-[#e09610] text-white font-bold py-3 rounded-xl transition-colors"
            >
              Text (239) 220-4067
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#1a6fa8]/10 rounded-xl flex items-center justify-center text-2xl">✉️</div>
              <div>
                <p className="font-bold text-[#0d2340]">Email Us</p>
                <p className="text-gray-400 text-sm">For detailed questions</p>
              </div>
            </div>
            <a
              href="mailto:booking@sunnysliderentals.com"
              className="block w-full text-center bg-[#1a6fa8] hover:bg-[#0d2340] text-white font-bold py-3 rounded-xl transition-colors"
            >
              booking@sunnysliderentals.com
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-[#1a6fa8]/10 rounded-xl flex items-center justify-center text-2xl">📅</div>
              <div>
                <p className="font-bold text-[#0d2340]">Book Online 24/7</p>
                <p className="text-gray-400 text-sm">Reserve with a 25% deposit</p>
              </div>
            </div>
            <Link
              href="/rentals"
              className="block w-full text-center bg-[#0d2340] hover:bg-[#1a6fa8] text-white font-bold py-3 rounded-xl transition-colors"
            >
              Browse &amp; Book Rentals →
            </Link>
          </div>

          {/* Hours & info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-[#0d2340] mb-3">Business Hours</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mon – Fri</span>
                <span className="font-semibold text-[#0d2340]">8:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sat – Sun</span>
                <span className="font-semibold text-[#0d2340]">7:00 AM – 7:00 PM</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Online booking available 24/7.</p>
          </div>

          <div className="bg-[#f5a623]/10 border border-[#f5a623]/30 rounded-2xl p-5">
            <p className="text-sm font-bold text-[#0d2340] mb-1">⛈️ Florida Weather Guarantee</p>
            <p className="text-sm text-gray-600">
              Severe weather preventing your event? We&apos;ll reschedule at no charge.
            </p>
          </div>
        </div>

        {/* Right: inquiry form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
