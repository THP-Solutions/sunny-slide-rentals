'use client';

import Link from 'next/link';
import { useState } from 'react';

const FAQS = [
  {
    q: 'Do you deliver and set up?',
    a: "Yes! Full delivery, professional setup, and tear-down are included in every rental. You don't lift a finger — we handle everything so you can enjoy the party.",
  },
  {
    q: 'What surfaces can you set up on?',
    a: 'We set up on grass, concrete, asphalt, and pavers. We cannot set up on dirt, sand, rocks, or slopes greater than 5°. Please ensure the setup area is clear of debris and sharp objects before we arrive.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking 1–2 weeks in advance, especially for weekends and holidays. Last-minute bookings are sometimes available — text us to check availability!',
  },
  {
    q: 'What is your weather and cancellation policy?',
    a: 'We offer a Florida Weather Guarantee. If weather conditions are unsafe at the time of delivery (high winds, lightning, heavy rain), we will work with you to reschedule at no charge. Deposits are non-refundable but are fully transferable to a future date within 12 months.',
  },
  {
    q: 'Do I need to provide power?',
    a: 'Yes. A dedicated 15-amp electrical outlet within 100ft of the setup area is required for all inflatables. If a suitable outlet is not available, we offer a Generator Rental add-on.',
  },
  {
    q: 'How long is the rental period?',
    a: 'Our standard rental period is 9 hours. Need more time? Contact us about extended rental options.',
  },
  {
    q: 'Is a deposit required to book?',
    a: 'Yes. A 25% non-refundable deposit is required to hold your date. The remaining balance is due on the day of the event. Our minimum rental is $250.',
  },
  {
    q: 'Are your inflatables clean and safe?',
    a: 'Absolutely. Every inflatable is thoroughly cleaned, sanitized, and inspected after each rental. We are fully licensed and insured, and all of our equipment meets current safety standards.',
  },
  {
    q: 'What areas do you serve?',
    a: 'We serve Cape Coral, Lehigh Acres, Fort Myers, North Fort Myers, Buckingham, and Estero within our 20-mile delivery radius from our Buckingham/Fort Myers base. For Naples and other areas, contact us to confirm availability.',
  },
  {
    q: 'Do you charge a delivery fee?',
    a: 'Delivery fees may apply based on distance from our base location. The exact delivery fee will be confirmed when your booking is finalized. Local deliveries within Cape Coral and Fort Myers are often free or low-cost.',
  },
  {
    q: 'What if I need to cancel my booking?',
    a: 'Your deposit is non-refundable but can be transferred to a future booking within 12 months. Please give us as much notice as possible — cancellations made less than 48 hours before the event may affect rescheduling options.',
  },
  {
    q: 'How much space do I need for setup?',
    a: 'Each rental listing shows its exact dimensions. As a general rule, add at least 5 feet of clearance on all sides and overhead clearance for the full height of the unit. Make sure there are no overhead power lines, trees, or structures in the way.',
  },
];

export default function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <main className="bg-gray-50 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0d2340] to-[#1a6fa8] py-16 px-4 text-center text-white">
        <p className="text-[#f5a623] font-bold text-xs uppercase tracking-widest mb-3">
          Answers to Your Questions
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Frequently Asked Questions</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Everything you need to know about booking, delivery, and rental policies.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="font-bold text-[#0d2340] text-sm sm:text-base leading-snug">
                  {item.q}
                </span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all ${
                    openIndex === i ? 'bg-[#1a6fa8] rotate-45' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 border-t border-gray-50">
                  <p className="text-gray-600 text-sm leading-relaxed pt-4">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 bg-[#0d2340] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold mb-2">Still Have Questions?</h2>
          <p className="text-white/65 text-sm mb-6 leading-relaxed">
            We&apos;re happy to help. Text us or send an email and we&apos;ll get back to you quickly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="sms:+12392314477"
              className="bg-[#f5a623] hover:bg-[#e09610] text-white font-bold px-7 py-3 rounded-xl transition-colors"
            >
              📱 Text Us
            </a>
            <a
              href="mailto:booking@sunnysliderentals.com"
              className="border-2 border-white/40 text-white hover:bg-white/10 font-bold px-7 py-3 rounded-xl transition-colors"
            >
              ✉️ Email Us
            </a>
            <Link
              href="/rentals"
              className="border-2 border-white/20 text-white/80 hover:bg-white/10 font-bold px-7 py-3 rounded-xl transition-colors"
            >
              Browse Rentals
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
