'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useCallback, useEffect } from 'react';
import type { Rental } from '@/lib/rentals';
import { ADDONS } from '@/lib/rentals';
import { calcAddonsTotal, calcTotal, calcDeposit, baseDeposit } from '@/lib/cart';

interface Props {
  rental: Rental;
  relatedRentals: Rental[];
}

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

interface NominatimResult {
  place_id: number;
  display_name: string;
}

// Minimum event date: tomorrow
function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function RentalDetail({ rental, relatedRentals }: Props) {
  const bookingRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Add-on quantities
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(ADDONS.map((a) => [a.id, 0])),
  );

  // Booking state
  const [eventDate, setEventDate] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [availability, setAvailability] = useState<AvailabilityStatus>('idle');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Address autocomplete state
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 5) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const url =
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&format=json&countrycodes=us&limit=5&addressdetails=0`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en-US,en' },
      });
      const data: NominatimResult[] = await res.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch {
      setSuggestions([]);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEventAddress(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
  };

  const selectSuggestion = (s: NominatimResult) => {
    setEventAddress(s.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const scrollToBooking = () =>
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' });

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const addon = ADDONS.find((a) => a.id === id)!;
      const next = Math.max(0, Math.min(addon.max, (prev[id] ?? 0) + delta));
      return { ...prev, [id]: next };
    });
  };

  const checkAvailability = useCallback(async (date: string) => {
    if (!date) return;
    setAvailability('checking');
    try {
      const res = await fetch(`/api/availability?rentalId=${rental.id}&date=${date}`);
      const data = await res.json();
      setAvailability(data.available ? 'available' : 'unavailable');
    } catch {
      setAvailability('error');
    }
  }, [rental.id]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventDate(e.target.value);
    setAvailability('idle');
    if (e.target.value) {
      checkAvailability(e.target.value);
    }
  };

  const selection = {
    rentalId: rental.id,
    rentalName: rental.name,
    price: rental.price,
    eventDate,
    addonTables: quantities.tables ?? 0,
    addonChairs: quantities.chairs ?? 0,
    addonTent: quantities.tent ?? 0,
    addonGenerator: quantities.generator ?? 0,
    eventAddress,
  };

  const addonsTotal = calcAddonsTotal(selection);
  const totalAmount = calcTotal(selection);
  const depositAmount = calcDeposit(selection);
  const staticDeposit = baseDeposit(rental.price);
  const isWet = rental.wetDry.toLowerCase().includes('wet');

  const canCheckout = eventDate && availability === 'available' && !isCheckingOut;

  const handleCheckout = async () => {
    if (!canCheckout) return;
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalId: rental.id,
          eventDate,
          addonTables: quantities.tables ?? 0,
          addonChairs: quantities.chairs ?? 0,
          addonTent: quantities.tent ?? 0,
          addonGenerator: quantities.generator ?? 0,
          eventAddress,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      alert(msg + (msg.includes('text') ? '' : ' Please text us at (239) 220-4067.'));
      setIsCheckingOut(false);
    }
  };

  const goodToKnow = [
    { icon: '⏰', label: 'Setup Time', value: '~30–45 minutes before your event' },
    { icon: '📦', label: "What's Included", value: 'Full delivery, professional setup, and tear-down' },
    { icon: '⚡', label: 'Power Required', value: 'Dedicated 15-amp outlet within 100ft of setup area' },
    ...(isWet ? [{ icon: '💧', label: 'Water Required', value: 'Garden hose reaching the setup area' }] : []),
  ];

  return (
    <main className="bg-gray-50 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-[#1a6fa8] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/rentals" className="hover:text-[#1a6fa8] transition-colors">Rentals</Link>
          <span>/</span>
          <span className="text-[#0d2340] font-medium truncate">{rental.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── STEP 1 of 3: Product Info ── */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Hero Image */}
            <div className="relative h-80 sm:h-[520px] lg:h-auto lg:min-h-[620px]">
              <Image
                src={rental.image}
                alt={rental.name}
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-[#f5a623] text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow">
                  {rental.wetDry}
                </span>
                <span className="bg-[#0d2340]/80 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {rental.category}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 sm:p-8 flex flex-col justify-center gap-5">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0d2340] mb-2 leading-tight">
                  {rental.name}
                </h1>
                <p className="text-3xl font-bold text-[#1a6fa8]">
                  ${rental.price}
                  <span className="text-base font-normal text-gray-400 ml-1">/ day</span>
                </p>
              </div>

              <div className="bg-[#f5a623]/10 border border-[#f5a623]/40 rounded-xl p-4">
                <p className="text-sm font-bold text-[#0d2340]">
                  🎯 Reserve with a 25% deposit —{' '}
                  <span className="text-[#f5a623] text-base">${staticDeposit} to book today</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1a6fa8] text-sm font-medium px-3 py-1.5 rounded-full border border-blue-100">
                  📐 {rental.dimensions}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-cyan-50 text-cyan-700 text-sm font-medium px-3 py-1.5 rounded-full border border-cyan-100">
                  💧 {rental.wetDry}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full border border-green-100">
                  ⏱ {rental.rentalHours}-Hour Rental
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed">{rental.description}</p>

              <button
                onClick={scrollToBooking}
                className="bg-[#f5a623] hover:bg-[#e09610] text-white font-bold py-3 px-7 rounded-xl transition-colors shadow-md text-center"
              >
                📅 Reserve Now → Pick Your Date
              </button>
            </div>
          </div>
        </section>

        {/* ── Main + Sidebar Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Steps B, C, D */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── Section B: Good to Know ── */}
            <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#0d2340] mb-5">Good to Know</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goodToKnow.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="font-bold text-[#0d2340] text-sm">{item.label}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── STEP 2 of 3: Add-ons ── */}
            <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-1">
                <span className="w-7 h-7 rounded-full bg-[#1a6fa8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                <h2 className="text-xl font-bold text-[#0d2340]">Upgrade Your Party 🎉</h2>
              </div>
              <p className="text-gray-400 text-sm mb-6 ml-10">Add tables, chairs, tent, or a generator.</p>
              <div className="space-y-3">
                {ADDONS.map((addon) => {
                  const qty = quantities[addon.id] ?? 0;
                  return (
                    <div
                      key={addon.id}
                      className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-100 bg-gray-50 hover:bg-blue-50/20 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0d2340] text-sm">{addon.name}</p>
                        <p className="text-[#1a6fa8] font-bold text-sm">
                          ${addon.price} / {addon.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {qty > 0 && (
                          <span className="text-xs font-bold text-gray-400 min-w-[36px] text-right">
                            +${addon.price * qty}
                          </span>
                        )}
                        <button
                          onClick={() => updateQty(addon.id, -1)}
                          disabled={qty === 0}
                          aria-label={`Remove ${addon.name}`}
                          className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-lg flex items-center justify-center transition select-none shadow-sm"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-bold text-[#0d2340] text-sm select-none">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQty(addon.id, 1)}
                          disabled={qty >= addon.max}
                          aria-label={`Add ${addon.name}`}
                          className="w-8 h-8 rounded-full bg-[#1a6fa8] hover:bg-[#155d8e] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-lg flex items-center justify-center transition select-none shadow-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {addonsTotal > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex justify-between items-center">
                  <span className="font-semibold text-[#0d2340] text-sm">Add-ons Total</span>
                  <span className="text-xl font-extrabold text-[#f5a623]">+${addonsTotal}</span>
                </div>
              )}
            </section>

            {/* ── STEP 3 of 3: Book & Pay Deposit ── */}
            <section
              id="booking"
              ref={bookingRef}
              className="bg-white rounded-2xl shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-[#f5a623] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                <h2 className="text-xl font-bold text-[#0d2340]">Pick Your Date &amp; Reserve</h2>
              </div>
              <p className="text-gray-500 text-sm mb-6 ml-10 leading-relaxed">
                25% non-refundable deposit holds your date — minimum $100. Remaining balance due day of event.
              </p>

              <div className="space-y-5">
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-bold text-[#0d2340] mb-2">
                    📅 Event Date <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="date"
                      min={getMinDate()}
                      value={eventDate}
                      onChange={handleDateChange}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-[#0d2340] font-medium focus:outline-none focus:ring-2 focus:ring-[#1a6fa8] focus:border-transparent transition w-full sm:w-auto"
                    />
                    {availability === 'checking' && (
                      <span className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 px-3 py-2 rounded-full">
                        <span className="animate-spin inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full" />
                        Checking availability…
                      </span>
                    )}
                    {availability === 'available' && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-full">
                        ✓ Available!
                      </span>
                    )}
                    {availability === 'unavailable' && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-full">
                        ✗ Already booked — choose another date.
                      </span>
                    )}
                    {availability === 'error' && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-2 rounded-full">
                        ⚠️ Could not check — try again.
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Address with Nominatim autocomplete */}
                <div className="relative" ref={suggestionsRef}>
                  <label className="block text-sm font-bold text-[#0d2340] mb-2">
                    📍 Event Address
                  </label>
                  <input
                    type="text"
                    value={eventAddress}
                    onChange={handleAddressChange}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Start typing your address…"
                    autoComplete="off"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#0d2340] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a6fa8] focus:border-transparent transition"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">We'll confirm delivery logistics before your event.</p>
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-30 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                      {suggestions.map((s) => (
                        <li key={s.place_id}>
                          <button
                            type="button"
                            onClick={() => selectSuggestion(s)}
                            className="w-full text-left px-4 py-3 text-sm text-[#0d2340] hover:bg-blue-50 border-b border-gray-50 last:border-0 transition-colors leading-snug"
                          >
                            📍 {s.display_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <p className="font-bold text-[#0d2340] text-sm">Order Summary</p>
                  </div>
                  <div className="px-5 py-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{rental.name}</span>
                      <span className="font-semibold text-[#0d2340]">${rental.price}</span>
                    </div>
                    {addonsTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Add-ons</span>
                        <span className="font-semibold text-[#0d2340]">+${addonsTotal}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 mt-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-[#0d2340]">Total</span>
                        <span className="text-[#0d2340]">${totalAmount}</span>
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-sm font-bold text-[#f5a623]">Deposit Due Today</span>
                        <span className="text-lg font-extrabold text-[#f5a623]">${depositAmount}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Remaining ${totalAmount - depositAmount} due day of event.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reserve Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!canCheckout}
                  className="w-full bg-[#f5a623] hover:bg-[#e09610] active:bg-[#c87d00] disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold py-4 px-6 rounded-xl text-lg transition-colors shadow-lg"
                >
                  {isCheckingOut
                    ? '⏳ Redirecting to secure payment…'
                    : !eventDate
                    ? 'Select a Date Above to Continue'
                    : availability === 'checking'
                    ? 'Checking availability…'
                    : availability !== 'available'
                    ? 'Date Unavailable — Choose Another'
                    : `🔒 Reserve Now — Pay $${depositAmount} Deposit`}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <span>🔒</span>
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
            </section>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-5">
            {/* Sticky Price Card */}
            <div className="bg-[#0d2340] rounded-2xl p-6 text-white sticky top-20">
              <p className="text-3xl font-extrabold">${rental.price}</p>
              <p className="text-white/50 text-sm mb-1">per day</p>
              {addonsTotal > 0 && (
                <p className="text-white/60 text-xs mb-1">+ ${addonsTotal} add-ons = ${totalAmount} total</p>
              )}
              <p className="text-[#f5a623] font-bold text-sm mb-5">
                ${depositAmount} deposit to reserve
              </p>
              <button
                onClick={scrollToBooking}
                className="w-full bg-[#f5a623] hover:bg-[#e09610] text-white font-bold py-3 rounded-xl transition-colors mb-3 text-sm"
              >
                📅 Pick Your Date →
              </button>
              <a
                href="sms:+12392204067"
                className="block w-full text-center border border-white/30 text-white/80 hover:bg-white/10 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                💬 Text Us Instead
              </a>
            </div>

            {/* Important Info */}
            <section className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-sm font-bold text-[#0d2340] mb-4 uppercase tracking-wide">
                Important Rental Info
              </h2>
              <div className="space-y-3">
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl">
                  <p className="font-bold text-red-800 text-xs mb-1">🦺 Safety First</p>
                  <p className="text-red-700 text-xs leading-relaxed">
                    Always supervise children. No flips or overcrowding. Follow all capacity and safety guidelines.
                  </p>
                </div>
                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="font-bold text-blue-800 text-xs mb-1">📏 Setup Space</p>
                  <p className="text-blue-700 text-xs leading-relaxed">
                    Clear, flat area matching unit dimensions + 5ft buffer on all sides. No sharp objects.
                  </p>
                </div>
                <div className="p-3.5 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <p className="font-bold text-yellow-800 text-xs mb-1">⚡ Power &amp; Water</p>
                  <p className="text-yellow-700 text-xs leading-relaxed">
                    {isWet
                      ? 'Dedicated 15-amp outlet within 100ft and a garden hose to the setup area required.'
                      : 'Dedicated 15-amp outlet within 100ft of setup area required.'}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ── Related Rentals ── */}
        {relatedRentals.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#0d2340] mb-6">Frequently Rented Together</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {relatedRentals.map((r) => (
                <div
                  key={r.id}
                  className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 transition-colors"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image src={r.image} alt={r.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-between min-w-0 py-0.5">
                    <div>
                      <p className="font-bold text-[#0d2340] text-sm leading-tight mb-1">{r.name}</p>
                      <p className="text-[#1a6fa8] font-bold">
                        ${r.price}
                        <span className="text-xs font-normal text-gray-400">/day</span>
                      </p>
                    </div>
                    <Link
                      href={`/rentals/${r.id}`}
                      className="text-xs font-bold text-[#1a6fa8] hover:text-[#0d2340] transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
