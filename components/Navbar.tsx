'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const NAV_EN = [
  { href: '/rentals', en: 'Rentals', es: 'Rentas' },
  { href: '/gallery', en: 'Gallery', es: 'Galería' },
  { href: '/service-areas', en: 'Service Areas', es: 'Áreas de Servicio' },
  { href: '/reviews', en: 'Reviews', es: 'Reseñas' },
  { href: '/faq', en: 'FAQ', es: 'Preguntas' },
  { href: '/contact', en: 'Contact', es: 'Contacto' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggle } = useLanguage();
  const isEs = lang === 'es';

  return (
    <div>
      {/* Announcement Bar */}
      <div className="bg-[#0d2340] text-white text-xs sm:text-sm text-center py-2.5 px-4 font-medium leading-tight">
        {isEs
          ? 'Sirviendo Cape Coral, Lehigh Acres, Fort Myers y todo el SW de Florida '
          : 'Serving Cape Coral, Lehigh Acres, Fort Myers & All of Southwest Florida '}
        <span className="hidden sm:inline">| </span>
        <span className="block sm:inline text-[#f5a623] font-semibold">
          {isEs ? 'Reserve en línea 24/7' : 'Book Online 24/7'}
        </span>
      </div>

      {/* Main Nav */}
      <nav className="bg-[#1a6fa8] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-xl tracking-tight whitespace-nowrap flex-shrink-0"
          >
            <span className="text-2xl leading-none">🌞</span>
            <span className="hidden sm:inline">Sunny Slide Rentals</span>
            <span className="sm:hidden font-bold text-base">Sunny Slide</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-5 text-sm font-semibold flex-1 justify-center">
            {NAV_EN.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#f5a623] transition-colors whitespace-nowrap"
              >
                {isEs ? link.es : link.en}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <button
              onClick={toggle}
              className={`text-xs font-bold transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                isEs
                  ? 'bg-[#f5a623] border-[#f5a623] text-white'
                  : 'border-white/30 text-white/75 hover:text-[#f5a623] hover:border-[#f5a623]'
              }`}
            >
              🌐 {isEs ? 'English' : 'Español'}
            </button>
            <Link
              href="/rentals"
              className="bg-[#f5a623] hover:bg-[#e09610] active:bg-[#c87d00] text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors shadow whitespace-nowrap"
            >
              {isEs ? '📅 Reservar' : '📅 Book Online'}
            </Link>
          </div>

          {/* Mobile: compact book + hamburger */}
          <div className="md:hidden ml-auto flex items-center gap-2">
            <button
              onClick={toggle}
              className={`text-xs font-bold px-2 py-1 rounded-full border transition-all ${
                isEs ? 'bg-[#f5a623] border-[#f5a623] text-white' : 'border-white/40 text-white/70'
              }`}
            >
              {isEs ? 'EN' : 'ES'}
            </button>
            <Link
              href="/rentals"
              className="bg-[#f5a623] hover:bg-[#e09610] text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow"
            >
              {isEs ? '📅 Reservar' : '📅 Book'}
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 transition"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-[#155d8e] border-t border-white/10 px-4 py-3">
            {NAV_EN.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-semibold py-3 border-b border-white/10 last:border-0 hover:text-[#f5a623] transition-colors"
              >
                {isEs ? link.es : link.en}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
