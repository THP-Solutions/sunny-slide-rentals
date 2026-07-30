'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { RENTALS } from '@/lib/rentals';
import { getAvailable } from '@/lib/inventory';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  onDateSelected?: (date: Date | null) => void;
}

export default function EventDateCapture({ onDateSelected }: Props) {
  const { t } = useLanguage();
  const [inputVal, setInputVal] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  const visibleRentals = RENTALS.filter(r => !r.hidden);

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputVal(val);
    if (val) {
      const d = new Date(val + 'T12:00:00');
      if (!isNaN(d.getTime())) {
        setEventDate(d);
        setRevealed(true);
        onDateSelected?.(d);
        setTimeout(() => revealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      }
    } else {
      setEventDate(null);
      setRevealed(false);
      onDateSelected?.(null);
    }
  }

  const today = new Date();
  today.setHours(0,0,0,0);
  const todayStr = today.toISOString().split('T')[0];
  
  const fmtDate = eventDate
    ? eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  const totalAvail = eventDate
    ? visibleRentals.filter(r => getAvailable(r.id, eventDate) > 0).length
    : 0;

  const urgentItems = eventDate
    ? visibleRentals.filter(r => getAvailable(r.id, eventDate) === 1)
    : [];

  return (
    <div className="bg-gradient-to-br from-[#0d2340] to-[#0d3060] border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-12">
        
        {/* Hook */}
        <div className="text-center mb-7">
          <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-2">
            {t('Real-Time Availability', 'Disponibilidad en Tiempo Real')}
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {t("When's your party?", '¿Cuándo es tu fiesta?')}
          </h2>
          <p className="text-white/50 text-sm mt-1">
            {t("Pick a date — see exactly what's open for you.", 'Elige una fecha — mira exactamente qué está disponible.')}
          </p>
        </div>

        {/* Date input */}
        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">📅</span>
            <input
              ref={inputRef}
              type="date"
              min={todayStr}
              value={inputVal}
              onChange={handleDateChange}
              className="w-full bg-white/10 border-2 border-white/20 focus:border-[#f5a623] outline-none rounded-2xl pl-12 pr-4 py-4 text-white font-bold text-base transition-colors placeholder:text-white/30 [color-scheme:dark]"
            />
          </div>
          {!eventDate && (
            <button
              onClick={() => inputRef.current?.showPicker?.()}
              className="bg-[#f5a623] hover:bg-[#e09610] text-white font-black px-8 py-4 rounded-2xl text-sm transition-all hover:scale-105 w-full sm:w-auto whitespace-nowrap"
            >
              {t('Check My Date →', 'Ver Mi Fecha →')}
            </button>
          )}
          {eventDate && (
            <button
              onClick={() => { setInputVal(''); setEventDate(null); setRevealed(false); onDateSelected?.(null); }}
              className="text-white/40 hover:text-white text-xs font-bold px-4 py-4 transition-colors whitespace-nowrap"
            >
              ✕ {t('Clear', 'Borrar')}
            </button>
          )}
        </div>

        {/* Payoff reveal */}
        {revealed && eventDate && (
          <div ref={revealRef} className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Date header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-[#f5a623]/20 border border-[#f5a623]/40 rounded-2xl px-5 py-3">
                <span className="text-[#f5a623] text-xl">🎉</span>
                <div className="text-left">
                  <p className="text-[#f5a623] font-black text-sm leading-tight">{fmtDate}</p>
                  <p className="text-white/70 text-xs">
                    {totalAvail === visibleRentals.length
                      ? t('All items available!', '¡Todos los artículos disponibles!')
                      : `${totalAvail} of ${visibleRentals.length} ${t('items open', 'artículos disponibles')}`
                    }
                  </p>
                </div>
              </div>
              {urgentItems.length > 0 && (
                <p className="text-orange-400 text-xs font-bold mt-2 animate-pulse">
                  ⚡ {urgentItems.length} {t('item(s) down to last unit — book now!', 'artículo(s) en última unidad — ¡reserva ya!')}
                </p>
              )}
            </div>

            {/* Availability grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {visibleRentals.map(r => {
                const avail = getAvailable(r.id, eventDate);
                const isOpen = avail > 0;
                return (
                  <Link
                    key={r.id}
                    href={`/rentals/${r.id}`}
                    className={`rounded-xl p-3 border transition-all hover:scale-105 ${
                      isOpen
                        ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                        : 'bg-red-900/20 border-red-500/20 opacity-60 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        avail === 0 ? 'bg-red-500' :
                        avail === 1 ? 'bg-orange-400 animate-pulse' :
                        avail === 2 ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                      <span className={`text-[10px] font-black ${
                        avail === 0 ? 'text-red-400' :
                        avail === 1 ? 'text-orange-400' :
                        avail === 2 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {avail === 0 ? t('BOOKED','RESERVADO') :
                         avail === 1 ? t('1 LEFT!','¡1 QUEDA!') :
                         avail === 2 ? t('2 LEFT','2 QUEDAN') : t('OPEN','LIBRE')}
                      </span>
                    </div>
                    <p className="text-white text-xs font-bold leading-tight line-clamp-2">{r.name}</p>
                    {isOpen && (
                      <p className="text-[#f5a623] text-[10px] font-black mt-1">
                        {r.priceLabel ?? `$${r.price}`}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/rentals"
                className="bg-[#f5a623] hover:bg-[#e09610] text-white font-black px-8 py-4 rounded-2xl text-base transition-all hover:scale-105 shadow-xl text-center"
              >
                {t('Book for', 'Reservar para')} {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →
              </Link>
              <Link
                href="/availability"
                className="border border-white/20 text-white/70 hover:text-white font-bold px-6 py-4 rounded-2xl text-sm transition-all text-center"
              >
                {t('Full Calendar View', 'Vista de Calendario Completo')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
