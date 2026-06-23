'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Rental } from '@/lib/rentals';
import { baseDeposit } from '@/lib/cart';

interface Props {
  title: string;
  emoji: string;
  rentals: Rental[];
}

export default function RentalRow({ title, emoji, rentals }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: direction === 'right' ? 400 : -400, behavior: 'smooth' });
    }
  };

  if (rentals.length === 0) return null;

  return (
    <div className="mb-14">
      {/* Row header */}
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 mb-5">
        <h3 className="text-2xl sm:text-3xl font-black text-[#0d2340] flex items-center gap-2">
          <span className="text-2xl">{emoji}</span> {title}
        </h3>
        <Link
          href="/rentals"
          className="text-sm font-bold text-[#1a6fa8] hover:text-[#0d2340] transition-colors flex items-center gap-1 group"
        >
          See All{' '}
          <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Link>
      </div>

      {/* Scrollable track */}
      <div className="relative group/row">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-2 top-1/2 -translate-y-[calc(50%+16px)] z-20 w-11 h-11 bg-white shadow-xl rounded-full flex items-center justify-center text-[#0d2340] font-black text-xl opacity-70 group-hover/row:opacity-100 transition-all hover:bg-[#f5a623] hover:text-white hover:scale-110"
        >
          ‹
        </button>

        {/* Cards */}
        <div
          ref={rowRef}
          className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-2 px-4 sm:px-8 lg:px-12"
        >
          {rentals.map((rental) => {
            const dep = baseDeposit(rental.price);
            // Height badge: only for slides that have L×W×H format
            const heightPart = rental.dimensions.includes('×')
              ? rental.dimensions.split('×')[2]?.trim().replace(' H', '')
              : null;

            return (
              <Link
                key={rental.id}
                href={`/rentals/${rental.id}`}
                className="flex-shrink-0 w-80 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 group/card"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-sky-50">
                  <Image
                    src={rental.image}
                    alt={rental.name}
                    fill
                    sizes="320px"
                    className="object-contain group-hover/card:scale-105 transition-transform duration-500 p-2"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Category / wet-dry badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#f5a623] text-white text-xs font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wide">
                      {rental.wetDry === 'N/A' ? rental.category : rental.wetDry}
                    </span>
                  </div>

                  {/* Height badge — slides only */}
                  {heightPart && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/50 backdrop-blur text-white text-xs font-semibold px-2 py-1 rounded-lg">
                        {heightPart} tall
                      </span>
                    </div>
                  )}

                  {/* Name on image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-black text-lg leading-tight drop-shadow-xl">
                      {rental.name}
                    </p>
                  </div>
                </div>

                {/* Card footer */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[#1a6fa8] font-black text-2xl leading-none">
                      ${rental.price}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">${dep} deposit · 9 hrs</p>
                  </div>
                  <span className="bg-[#0d2340] group-hover/card:bg-[#f5a623] text-white text-sm font-black px-4 py-2.5 rounded-xl transition-colors duration-200">
                    Book Now →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 -translate-y-[calc(50%+16px)] z-20 w-11 h-11 bg-white shadow-xl rounded-full flex items-center justify-center text-[#0d2340] font-black text-xl opacity-70 group-hover/row:opacity-100 transition-all hover:bg-[#f5a623] hover:text-white hover:scale-110"
        >
          ›
        </button>
      </div>
    </div>
  );
}
