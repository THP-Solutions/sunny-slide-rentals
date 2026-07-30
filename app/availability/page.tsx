'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RENTALS } from '@/lib/rentals';
import { getAvailable, availLabel, availColor, INVENTORY } from '@/lib/inventory';

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const visibleRentals = RENTALS.filter(r => !r.hidden);

export default function AvailabilityPage() {
  const today = new Date();
  today.setHours(0,0,0,0);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedRental, setSelectedRental] = useState(visibleRentals[0]?.id ?? '');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const rental = visibleRentals.find(r => r.id === selectedRental);
  const isPast = (day: number) => new Date(year, month, day) < today;
  const dayDate = (day: number) => new Date(year, month, day);
  const avail = (day: number) => isPast(day) ? 0 : getAvailable(selectedRental, dayDate(day));

  function cellStyle(a: number): string {
    if (a === 0) return 'bg-red-100 text-red-400 cursor-not-allowed';
    if (a === 1) return 'bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer';
    if (a === 2) return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 cursor-pointer';
    return 'bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer';
  }

  const selAvail = selectedDay ? avail(selectedDay) : null;

  return (
    <main className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-[#0d2340] text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-2">Real-Time Availability</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">Check Open Dates</h1>
          <p className="text-white/60 text-lg">We run {INVENTORY} units of each item. Dates fill fast — lock yours in early.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Rental selector */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm font-bold text-[#0d2340] mb-3 uppercase tracking-wide">Select Item to Check</p>
          <div className="flex flex-wrap gap-2">
            {visibleRentals.map(r => (
              <button
                key={r.id}
                onClick={() => { setSelectedRental(r.id); setSelectedDay(null); }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                  selectedRental === r.id
                    ? 'border-[#1a6fa8] bg-[#1a6fa8] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-[#1a6fa8] hover:text-[#1a6fa8]'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#f5a623] hover:text-white text-gray-600 font-bold flex items-center justify-center transition-colors">‹</button>
              <h2 className="text-xl font-black text-[#0d2340]">{MONTHS[month]} {year}</h2>
              <button onClick={nextMonth} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#f5a623] hover:text-white text-gray-600 font-bold flex items-center justify-center transition-colors">›</button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDow }).map((_, i) => <div key={"e"+i} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const past = isPast(day);
                const a = avail(day);
                const isSelected = selectedDay === day;
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                return (
                  <button
                    key={day}
                    disabled={a === 0 || past}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`relative flex flex-col items-center justify-center rounded-xl p-1 transition-all text-xs font-semibold min-h-[52px]
                      ${past ? 'text-gray-200 cursor-not-allowed' : cellStyle(a)}
                      ${isSelected ? 'ring-2 ring-[#1a6fa8] ring-offset-1 scale-105 shadow-md' : ''}
                      ${isToday && !isSelected ? 'ring-2 ring-[#f5a623]' : ''}
                    `}
                  >
                    <span className="font-black text-sm leading-none">{day}</span>
                    {!past && (
                      <span className={`text-[9px] mt-0.5 font-bold leading-none ${a===0?'text-red-300':a===1?'text-orange-600':a===2?'text-yellow-600':'text-green-600'}`}>
                        {availLabel(a)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-100">
              {[
                { color: 'bg-green-500', label: 'All 3 available' },
                { color: 'bg-yellow-400', label: '2 remaining' },
                { color: 'bg-orange-500', label: 'Last 1!' },
                { color: 'bg-red-400', label: 'Fully booked' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className={`w-3 h-3 rounded ${l.color}`} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {selectedDay && selAvail !== null && (
              <div className={`rounded-2xl p-5 border-2 ${selAvail===0?'border-red-200 bg-red-50':selAvail===1?'border-orange-300 bg-orange-50':'border-green-300 bg-green-50'}`}>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Selected Date</p>
                <p className="text-xl font-black text-[#0d2340]">{MONTHS[month]} {selectedDay}, {year}</p>
                <p className="font-bold text-sm mt-1 text-[#1a6fa8]">{rental?.name}</p>
                <div className={`mt-3 text-sm font-bold ${selAvail===0?'text-red-600':selAvail===1?'text-orange-700':'text-green-700'}`}>
                  {selAvail === 0 ? '✗ Fully booked — pick another date' :
                   selAvail === 1 ? '⚡ Last unit — book immediately!' :
                   selAvail === 2 ? '⚠ Only 2 units left' :
                   '✓ Available — 3 of 3 open'}
                </div>
                {selAvail > 0 && (
                  <Link href={`/rentals/${selectedRental}`} className="mt-4 block w-full bg-[#f5a623] hover:bg-[#e09610] text-white font-black text-center py-3 rounded-xl transition-colors">
                    Book {MONTHS[month]} {selectedDay} →
                  </Link>
                )}
              </div>
            )}
            {rental && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Viewing</p>
                <p className="font-black text-[#0d2340] text-lg leading-tight">{rental.name}</p>
                <p className="text-[#1a6fa8] font-bold text-xl mt-1">
                  {rental.priceLabel ?? `$${rental.price}`}
                  {!rental.priceLabel && <span className="text-xs font-normal text-gray-400"> /day</span>}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({length:INVENTORY}).map((_,i)=>(
                      <div key={i} className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-[9px] font-black">{i+1}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{INVENTORY} units in fleet</span>
                </div>
                <Link href={`/rentals/${rental.id}`} className="mt-4 block text-center border-2 border-[#0d2340] text-[#0d2340] hover:bg-[#0d2340] hover:text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                  View & Book →
                </Link>
              </div>
            )}
            <div className="bg-[#f5a623]/10 border border-[#f5a623]/30 rounded-2xl p-4">
              <p className="text-xs font-black text-[#0d2340] uppercase mb-1">💡 Pro Tip</p>
              <p className="text-xs text-gray-600 leading-relaxed">Weekends in June–August book out 3–4 weeks in advance. Lock your date with just a 25% deposit.</p>
            </div>
          </div>
        </div>

        {/* Fleet snapshot */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-black text-[#0d2340] mb-1">Fleet Snapshot — {MONTHS[month]} {year}</h2>
          <p className="text-gray-400 text-sm mb-5">Open weekends remaining for each item this month.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visibleRentals.map(r => {
              let openW = 0, totalW = 0;
              for (let d = 1; d <= daysInMonth; d++) {
                const dow = new Date(year, month, d).getDay();
                if (dow === 6) {
                  totalW++;
                  if (!isPast(d) && getAvailable(r.id, dayDate(d)) > 0) openW++;
                }
              }
              const pct = totalW > 0 ? openW / totalW : 1;
              const bar = pct > 0.6 ? 'bg-green-500' : pct > 0.3 ? 'bg-yellow-400' : 'bg-orange-500';
              return (
                <button key={r.id} onClick={() => { setSelectedRental(r.id); window.scrollTo({top:0,behavior:'smooth'}); }}
                  className="text-left p-4 rounded-xl border border-gray-100 hover:border-[#1a6fa8] hover:bg-blue-50/30 transition-all">
                  <p className="font-bold text-[#0d2340] text-sm leading-tight truncate">{r.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{openW}/{totalW} weekends open</p>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${bar} transition-all`} style={{width:`${pct*100}%`}} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
