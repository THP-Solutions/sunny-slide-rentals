'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RENTALS } from '@/lib/rentals';
import { getAvailable, INVENTORY } from '@/lib/inventory';
import { useLanguage } from '@/contexts/LanguageContext';

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAYS_SHORT = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const visibleRentals = RENTALS.filter(r => !r.hidden);

export default function AvailabilityCalendarEmbed() {
  const { t } = useLanguage();
  const today = new Date();
  today.setHours(0,0,0,0);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedRental, setSelectedRental] = useState(visibleRentals[0]?.id ?? '');
  const [selectedDay, setSelectedDay] = useState<number|null>(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow    = new Date(year, month, 1).getDay();

  const prevMonth = () => { if (month===0){setYear(y=>y-1);setMonth(11);}else setMonth(m=>m-1); setSelectedDay(null); };
  const nextMonth = () => { if (month===11){setYear(y=>y+1);setMonth(0);}else setMonth(m=>m+1); setSelectedDay(null); };

  const isPast = (d:number) => new Date(year,month,d) < today;
  const avail  = (d:number) => isPast(d) ? 0 : getAvailable(selectedRental, new Date(year,month,d));

  function cellBg(a:number, past:boolean) {
    if (past) return 'bg-transparent text-zinc-600 cursor-default';
    if (a===0) return 'bg-red-900/40 text-red-400 cursor-default';
    if (a===1) return 'bg-orange-800/40 text-orange-300 hover:bg-orange-700/50 cursor-pointer';
    if (a===2) return 'bg-yellow-800/30 text-yellow-300 hover:bg-yellow-700/40 cursor-pointer';
    return 'bg-zinc-700/40 text-zinc-200 hover:bg-zinc-600/50 cursor-pointer';
  }

  function dot(a:number) {
    if (a===0) return 'bg-red-500';
    if (a===1) return 'bg-orange-400';
    if (a===2) return 'bg-yellow-400';
    return 'bg-green-400';
  }

  const selAvail  = selectedDay ? avail(selectedDay) : null;
  const selRental = visibleRentals.find(r=>r.id===selectedRental);

  // open weekends this month
  const openWeekends = Array.from({length:daysInMonth},(_,i)=>i+1)
    .filter(d => new Date(year,month,d).getDay()===6 && !isPast(d) && avail(d)>0).length;
  const totalWeekends = Array.from({length:daysInMonth},(_,i)=>i+1)
    .filter(d => new Date(year,month,d).getDay()===6).length;

  return (
    <section className="py-16 px-4 bg-zinc-900">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-2">
              {t('Live Inventory', 'Inventario en Vivo')}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {t('Check Availability', 'Verificar Disponibilidad')}
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              {openWeekends}/{totalWeekends} {t('weekends open in', 'fines de semana abiertos en')} {MONTHS[month]}
            </p>
          </div>
          <Link href="/availability" className="text-sm font-bold text-[#f5a623] hover:text-white transition-colors flex items-center gap-1 group flex-shrink-0">
            {t('Full Calendar', 'Calendario Completo')}
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Calendar panel */}
          <div className="lg:col-span-2 bg-zinc-800 rounded-2xl p-5 border border-zinc-700">

            {/* Item picker */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {visibleRentals.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setSelectedRental(r.id); setSelectedDay(null); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    selectedRental===r.id
                      ? 'border-[#f5a623] bg-[#f5a623]/20 text-[#f5a623]'
                      : 'border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>

            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-zinc-700 hover:bg-[#f5a623] text-zinc-300 hover:text-white font-bold flex items-center justify-center text-lg transition-colors">‹</button>
              <span className="text-white font-black text-base">{MONTHS[month]} {year}</span>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-zinc-700 hover:bg-[#f5a623] text-zinc-300 hover:text-white font-bold flex items-center justify-center text-lg transition-colors">›</button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS_SHORT.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-zinc-500 py-1">{d}</div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({length:firstDow}).map((_,i)=><div key={'e'+i}/>)}
              {Array.from({length:daysInMonth}).map((_,i)=>{
                const day=i+1;
                const past=isPast(day);
                const a=avail(day);
                const sel=selectedDay===day;
                const isTod=day===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
                return (
                  <button
                    key={day}
                    disabled={a===0||past}
                    onClick={()=>setSelectedDay(sel?null:day)}
                    className={`relative flex flex-col items-center justify-center rounded-lg min-h-[44px] text-xs font-semibold transition-all
                      ${cellBg(a,past)}
                      ${sel?'ring-2 ring-[#f5a623] scale-105 shadow-lg shadow-[#f5a623]/20':''}
                      ${isTod&&!sel?'ring-1 ring-white/40':''}
                    `}
                  >
                    <span className="font-black text-sm leading-none">{day}</span>
                    {!past && (
                      <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dot(a)}`}/>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-zinc-700">
              {[
                {c:'bg-green-400', l:t('Open','Libre')},
                {c:'bg-yellow-400', l:t('2 left','2 quedan')},
                {c:'bg-orange-400', l:t('1 left','1 queda')},
                {c:'bg-red-500',    l:t('Booked','Reservado')},
              ].map(x=>(
                <div key={x.l} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <div className={`w-2.5 h-2.5 rounded-full ${x.c}`}/>
                  {x.l}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Selected day detail */}
            {selectedDay && selAvail!==null ? (
              <div className={`rounded-2xl p-5 border ${
                selAvail===0?'bg-red-900/20 border-red-500/30':
                selAvail===1?'bg-orange-900/20 border-orange-500/30':
                'bg-green-900/20 border-green-500/30'
              }`}>
                <p className="text-xs font-bold text-zinc-400 uppercase mb-1">{t('Selected','Seleccionado')}</p>
                <p className="text-white font-black text-xl">{MONTHS[month]} {selectedDay}</p>
                <p className="text-zinc-300 text-sm font-semibold mt-0.5">{selRental?.name}</p>
                <p className={`text-sm font-black mt-3 ${
                  selAvail===0?'text-red-400':selAvail===1?'text-orange-400':'text-green-400'
                }`}>
                  {selAvail===0 ? '✗ '+t('Fully booked','Completamente reservado') :
                   selAvail===1 ? '⚡ '+t('Last unit!','¡Última unidad!') :
                   selAvail===2 ? '⚠ '+t('2 units left','2 unidades') :
                   '✓ '+t('All 3 open','Las 3 disponibles')}
                </p>
                {selAvail>0 && (
                  <Link href={`/rentals/${selectedRental}`}
                    className="mt-4 block w-full bg-[#f5a623] hover:bg-[#e09610] text-white font-black text-center py-3 rounded-xl transition-colors text-sm">
                    {t('Book Now →','Reservar →')}
                  </Link>
                )}
              </div>
            ) : (
              <div className="rounded-2xl p-5 bg-zinc-800 border border-zinc-700">
                <p className="text-zinc-400 text-sm text-center">
                  {t('Tap any date to check availability','Toca una fecha para ver disponibilidad')}
                </p>
                {/* Fleet dots */}
                <div className="mt-4 space-y-2">
                  {[...Array(INVENTORY)].map((_,i)=>(
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                        <span className="text-green-400 text-[10px] font-black">{i+1}</span>
                      </div>
                      <span className="text-zinc-400 text-xs">{t('Unit','Unidad')} {i+1} — {t('available','disponible')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick stat */}
            <div className="rounded-2xl p-5 bg-zinc-800 border border-zinc-700">
              <p className="text-[#f5a623] font-black text-xs uppercase mb-3">{t('This Month','Este Mes')}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-xs">{t('Open weekends','Fines semana libres')}</span>
                  <span className="text-white font-black">{openWeekends}/{totalWeekends}</span>
                </div>
                <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${
                    openWeekends/Math.max(totalWeekends,1)>0.6?'bg-green-500':
                    openWeekends/Math.max(totalWeekends,1)>0.3?'bg-yellow-400':'bg-orange-500'
                  }`} style={{width:`${(openWeekends/Math.max(totalWeekends,1))*100}%`}}/>
                </div>
                <p className="text-zinc-500 text-[11px] pt-1">
                  {t('25% deposit locks your date','25% de depósito asegura tu fecha')}
                </p>
              </div>
            </div>

            <Link href="/availability"
              className="block w-full border border-zinc-600 hover:border-[#f5a623] text-zinc-300 hover:text-[#f5a623] font-bold py-3 rounded-xl text-center text-sm transition-all">
              {t('See All Items →','Ver Todos los Artículos →')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
