'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { RENTALS, CATEGORIES } from '@/lib/rentals';
import { baseDeposit } from '@/lib/cart';
import { useLanguage } from '@/contexts/LanguageContext';

const VISIBLE = RENTALS.filter((r) => !r.hidden);

const CATEGORY_ES: Record<string, string> = {
  'All': 'Todos',
  'Water Slides': 'Toboganes de Agua',
  'Combo Units': 'Unidades Combo',
  'Bounce Houses': 'Inflables',
  'Party Packages': 'Paquetes de Fiesta',
};

export default function RentalsClient() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { t } = useLanguage();

  const filtered =
    activeCategory === 'All'
      ? VISIBLE
      : VISIBLE.filter((r) => r.category === activeCategory);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0d2340] to-[#1a6fa8] py-16 px-4 text-center text-white">
        <p className="text-[#f5a623] font-bold text-xs uppercase tracking-widest mb-3">
          {t('Southwest Florida', 'Suroeste de Florida')}
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
          {t('Our Rental Inventory', 'Nuestro Inventario de Rentas')}
        </h1>
        <p className="text-white/75 text-lg max-w-2xl mx-auto">
          {t(
            'Browse our clean, exciting selection of water slides, bounce houses, and party equipment.',
            'Explora nuestra selección de toboganes, inflables y equipo para fiestas.'
          )}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CATEGORIES.map((cat) => {
            const count = cat === 'All' ? VISIBLE.length : VISIBLE.filter((r) => r.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#1a6fa8] text-white shadow'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a6fa8] hover:text-[#1a6fa8]'
                }`}
              >
                {t(cat, CATEGORY_ES[cat] ?? cat)}
                {cat !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-60">({count})</span>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-gray-400 text-sm mb-8">
          {t('Showing', 'Mostrando')} {filtered.length} {t(
            filtered.length !== 1 ? 'rentals' : 'rental',
            filtered.length !== 1 ? 'rentas' : 'renta'
          )}
          {activeCategory !== 'All' ? ` ${t('in', 'en')} ${t(activeCategory, CATEGORY_ES[activeCategory] ?? activeCategory)}` : ''}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rental) => {
            const dep = baseDeposit(rental.price);
            return (
              <div
                key={rental.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="relative h-52 bg-sky-50">
                  <Image
                    src={rental.image}
                    alt={rental.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300 p-1"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#f5a623] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase shadow">
                      {rental.wetDry === 'N/A' ? t(rental.category, CATEGORY_ES[rental.category] ?? rental.category) : rental.wetDry}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#0d2340]/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {t(rental.category, CATEGORY_ES[rental.category] ?? rental.category)}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-[#0d2340] mb-1 leading-tight">
                    {rental.name}
                  </h2>
                  <p className="text-gray-400 text-xs mb-3">{rental.dimensions}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-extrabold text-[#1a6fa8]">
                      ${rental.price}
                      <span className="text-xs font-normal text-gray-400 ml-1">/ {t('day', 'día')}</span>
                    </span>
                    <span className="text-xs text-gray-400 font-medium">${dep} {t('deposit', 'depósito')}</span>
                  </div>
                  <Link
                    href={`/rentals/${rental.id}`}
                    className="block text-center bg-[#1a6fa8] hover:bg-[#155d8e] text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    {t('View Details', 'Ver Detalles')} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tables & Chairs CTA */}
        <div className="mt-12 bg-[#0d2340] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest mb-1">
              {t('Add to any rental', 'Agrega a cualquier renta')}
            </p>
            <h3 className="text-white text-2xl font-extrabold mb-1">
              {t('Tables, Chairs & Tents', 'Mesas, Sillas y Carpas')}
            </h3>
            <p className="text-white/70 text-sm">
              {t(
                '8ft tables ($10 ea) · White chairs ($3 ea) · 10×20 tent ($59) · Generator ($75)',
                'Mesas de 8ft ($10 c/u) · Sillas blancas ($3 c/u) · Carpa 10×20 ($59) · Generador ($75)'
              )}
            </p>
          </div>
          <p className="text-white/60 text-sm text-center sm:text-right shrink-0">
            {t('Select add-ons during checkout', 'Selecciona extras al hacer tu reserva')}<br />
            {t('when booking any rental above.', 'al reservar cualquier artículo.')}
          </p>
        </div>
      </div>
    </main>
  );
}
