'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useCallback, useEffect } from 'react';
import type { Rental } from '@/lib/rentals';
import { ADDONS, PARTY_PACKAGES } from '@/lib/rentals';
import { calcAddonsTotal, calcTotal, baseDeposit } from '@/lib/cart';

interface Props {
  rental: Rental;
  relatedRentals: Rental[];
}

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Business base location — Cape Coral, FL
const BUSINESS_LAT = 26.5629;
const BUSINESS_LNG = -81.9495;
const FUEL_CHARGE_MILES = 20;

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

  // Party bundle
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

  // Payment options
  const [paymentType, setPaymentType] = useState<'deposit' | 'full'>('deposit');
  const [addonFuelCharge, setAddonFuelCharge] = useState(false);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const [fuelAutoApplied, setFuelAutoApplied] = useState(false);
  const [waiverSigned, setWaiverSigned] = useState(false);

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
        `q=${encodeURIComponent(query)}&format=json&countrycodes=us&limit=5&addressdetails=0&extratags=0`;
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
    // Reset distance if user edits the address
    if (distanceMiles !== null) {
      setDistanceMiles(null);
      setFuelAutoApplied(false);
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
  };

  const selectSuggestion = (s: NominatimResult) => {
    setEventAddress(s.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    // Auto-apply fuel charge if >20 miles from business
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      const miles = haversineMiles(BUSINESS_LAT, BUSINESS_LNG, lat, lon);
      setDistanceMiles(Math.round(miles));
      if (miles > FUEL_CHARGE_MILES) {
        setAddonFuelCharge(true);
        setFuelAutoApplied(true);
      } else {
        setFuelAutoApplied(false);
      }
    }
  };

  // Fallback: if user typed instead of picking from dropdown, geocode on blur
  const handleAddressBlur = async () => {
    setShowSuggestions(false);
    if (distanceMiles === null && eventAddress.length >= 10) {
      try {
        const url =
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(eventAddress)}&format=json&countrycodes=us&limit=1&addressdetails=0&extratags=0`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'en-US,en' } });
        const data: NominatimResult[] = await res.json();
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (!isNaN(lat) && !isNaN(lon)) {
            const miles = haversineMiles(BUSINESS_LAT, BUSINESS_LNG, lat, lon);
            setDistanceMiles(Math.round(miles));
            if (miles > FUEL_CHARGE_MILES) {
              setAddonFuelCharge(true);
              setFuelAutoApplied(true);
            } else {
              setFuelAutoApplied(false);
            }
          }
        }
      } catch {
        // silent fail — user can manually toggle fuel charge if needed
      }
    }
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

  const bundle = PARTY_PACKAGES.find((p) => p.id === selectedBundle);
  const bundlePrice = bundle ? bundle.price : 0;
  const addonsTotal = calcAddonsTotal(selection);
  const baseTotal = calcTotal(selection);
  const fuelAmount = addonFuelCharge ? 39.99 : 0;
  const totalAmount = baseTotal + fuelAmount + bundlePrice;
  const depositAmount = Math.max(100, Math.ceil(totalAmount * 0.25));
  const chargeAmount = paymentType === 'full' ? totalAmount : depositAmount;
  const staticDeposit = baseDeposit(rental.price);
  const isWet = rental.wetDry.toLowerCase().includes('wet');

  const canCheckout = !!(eventDate && availability === 'available' && !isCheckingOut && waiverSigned);

  const handleCheckout = async (type: 'deposit' | 'full') => {
    if (!canCheckout) return;
    setPaymentType(type);
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
          addonFuelCharge,
          partyBundle: bundlePrice,
          partyBundleName: bundle ? bundle.name : '',
          paymentType: type,
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

        {/* STEP 1: Product Info */}
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
                  📏 {rental.dimensions}
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

        {/* Main + Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Steps 2, 3 */}
          <div className="lg:col-span-2 space-y-6">

            {/* Section B: Good to Know */}
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

            {/* STEP 2: Add-ons */}
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

                {/* Party Package Bundles */}
                <div className="mt-6 mb-2">
                  <p className="text-sm font-bold text-[#0d2340] mb-1">🎪 Party Package Bundles</p>
                  <p className="text-xs text-gray-400 mb-3">Add a tent, tables &amp; chairs bundle to any rental. Select one or skip.</p>
                  <div className="space-y-3">
                    {PARTY_PACKAGES.map((pkg) => {
                      const selected = selectedBundle === pkg.id;
                      const colorMap: Record<string, string> = {
                        blue: 'border-[#1a6fa8] bg-blue-50',
                        orange: 'border-[#f5a623] bg-yellow-50',
                        purple: 'border-purple-500 bg-purple-50',
                      };
                      const activeClass = selected ? colorMap[pkg.color] : 'border-gray-200 bg-gray-50 hover:border-gray-300';
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedBundle(selected ? null : pkg.id)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${activeClass}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-[#0d2340] text-sm">{pkg.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {pkg.tent} · {pkg.tables} Tables · {pkg.chairs} Chairs · Up to {pkg.guests} guests
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-3">
                              <p className="font-extrabold text-lg text-[#f5a623]">+${pkg.price}</p>
                              {selected && <p className="text-xs text-green-700 font-semibold">✓ Selected</p>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fuel Charge add-on */}
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                    fuelAutoApplied
                      ? 'border-orange-400 bg-orange-50 cursor-not-allowed'
                      : addonFuelCharge
                      ? 'border-[#f5a623] bg-yellow-50 cursor-pointer'
                      : 'border-gray-100 hover:border-yellow-200 bg-gray-50 hover:bg-yellow-50/20 cursor-pointer'
                  }`}
                  onClick={() => !fuelAutoApplied && setAddonFuelCharge((v) => !v)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0d2340] text-sm">
                      ⛽ Fuel Charge
                      {fuelAutoApplied && (
                        <span className="ml-2 text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                          Auto-applied — {distanceMiles} mi away
                        </span>
                      )}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {fuelAutoApplied
                        ? `Your event is ${distanceMiles} miles from our base — fuel charge is required.`
                        : 'Required if delivery is more than 20 miles from Cape Coral'}
                    </p>
                    <p className="text-[#1a6fa8] font-bold text-sm">$39.99 flat fee</p>
                  </div>
                  <div className="flex-shrink-0">
                    {fuelAutoApplied ? (
                      <span className="text-orange-700 font-bold text-sm">✓ Required</span>
                    ) : (
                      <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                        addonFuelCharge ? 'bg-[#f5a623]' : 'bg-gray-200'
                      }`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          addonFuelCharge ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {(addonsTotal > 0 || addonFuelCharge || bundlePrice > 0) && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex justify-between items-center">
                  <span className="font-semibold text-[#0d2340] text-sm">Add-ons Total</span>
                  <span className="text-xl font-extrabold text-[#f5a623]">+${(addonsTotal + fuelAmount + bundlePrice).toFixed(2).replace('.00', '')}</span>
                </div>
              )}
            </section>

            {/* STEP 3: Book & Pay */}
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
                Choose your date and payment option below. All bookings are held with a non-refundable deposit.
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

                {/* Event Address with autocomplete */}
                <div className="relative" ref={suggestionsRef}>
                  <label className="block text-sm font-bold text-[#0d2340] mb-2">
                    📍 Event Address
                  </label>
                  <input
                    type="text"
                    value={eventAddress}
                    onChange={handleAddressChange}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={handleAddressBlur}
                    placeholder="Start typing your address…"
                    autoComplete="off"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#0d2340] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a6fa8] focus:border-transparent transition"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">We'll confirm delivery logistics before your event.</p>
                  {distanceMiles !== null && (
                    <p className={`text-xs font-semibold mt-1 ${distanceMiles > FUEL_CHARGE_MILES ? 'text-orange-600' : 'text-green-600'}`}>
                      📍 ~{distanceMiles} miles from our base
                      {distanceMiles > FUEL_CHARGE_MILES
                        ? ' — fuel charge automatically applied'
                        : ' — within free delivery zone ✓'}
                    </p>
                  )}
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
                    {bundle && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">🎪 {bundle.name}</span>
                        <span className="font-semibold text-[#0d2340]">+${bundle.price}</span>
                      </div>
                    )}
                    {addonFuelCharge && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">⛽ Fuel Charge</span>
                        <span className="font-semibold text-[#0d2340]">+$39.99</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 mt-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-[#0d2340]">Total</span>
                        <span className="text-[#0d2340]">${totalAmount.toFixed(2).replace('.00', '')}</span>
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-sm text-gray-500">25% Deposit option</span>
                        <span className="text-sm font-bold text-[#f5a623]">${depositAmount}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">Pay in Full option</span>
                        <span className="text-sm font-bold text-[#1a6fa8]">${totalAmount.toFixed(2).replace('.00', '')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Waiver Checkbox */}
                <div className={`p-4 rounded-xl border-2 transition-colors ${
                  waiverSigned ? 'border-green-300 bg-green-50' : 'border-orange-200 bg-orange-50'
                }`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={waiverSigned}
                      onChange={(e) => setWaiverSigned(e.target.checked)}
                      className="mt-0.5 w-5 h-5 accent-[#1a6fa8] flex-shrink-0 cursor-pointer"
                    />
                    <span className="text-sm text-[#0d2340] leading-relaxed">
                      <strong>I agree to the Rental Agreement, Safety Rules, Assumption of Risk, Release of Liability, and Indemnification Agreement.</strong>{' '}
                      I certify I am at least 18 years of age, have read and understand the full waiver, and voluntarily accept responsibility for supervision of all participants.{' '}
                      <Link href="/waiver" target="_blank" className="text-[#1a6fa8] underline font-semibold">
                        Read full agreement →
                      </Link>
                    </span>
                  </label>
                  {!waiverSigned && (
                    <p className="text-orange-700 text-xs font-semibold mt-2 ml-8">
                      ⚠️ You must agree to the waiver before completing your booking.
                    </p>
                  )}
                </div>

                {/* Two Checkout Buttons */}
                {isCheckingOut ? (
                  <div className="w-full bg-gray-100 text-gray-500 font-bold py-4 px-6 rounded-xl text-center text-lg">
                    ⏳ Redirecting to secure payment…
                  </div>
                ) : !canCheckout ? (
                  <button
                    disabled
                    className="w-full bg-[#f5a623] opacity-40 cursor-not-allowed text-white font-extrabold py-4 px-6 rounded-xl text-lg shadow-lg"
                  >
                    {!eventDate
                      ? 'Select a Date Above to Continue'
                      : availability === 'checking'
                      ? 'Checking availability…'
                      : availability !== 'available'
                      ? 'Date Unavailable — Choose Another'
                      : '⚠️ Agree to Waiver to Continue'}
                  </button>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleCheckout('deposit')}
                      className="bg-[#f5a623] hover:bg-[#e09610] active:bg-[#c87d00] text-white font-extrabold py-4 px-4 rounded-xl text-base transition-colors shadow-lg text-center"
                    >
                      <span className="block text-xs font-semibold opacity-80 mb-0.5">NON-REFUNDABLE</span>
                      🔒 25% Deposit — ${depositAmount}
                      <span className="block text-xs font-normal opacity-75 mt-0.5">${(totalAmount - depositAmount).toFixed(2).replace('.00','')} balance due day-of</span>
                    </button>
                    <button
                      onClick={() => handleCheckout('full')}
                      className="bg-[#1a6fa8] hover:bg-[#155d8e] active:bg-[#0d2340] text-white font-extrabold py-4 px-4 rounded-xl text-base transition-colors shadow-lg text-center"
                    >
                      <span className="block text-xs font-semibold opacity-80 mb-0.5">NOTHING DUE DAY-OF</span>
                      🔒 Pay in Full — ${totalAmount.toFixed(2).replace('.00','')}
                      <span className="block text-xs font-normal opacity-75 mt-0.5">Complete payment now</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <span>🔒</span>
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Sticky Price Card */}
            <div className="bg-[#0d2340] rounded-2xl p-6 text-white sticky top-20">
              <p className="text-3xl font-extrabold">${rental.price}</p>
              <p className="text-white/50 text-sm mb-1">per day</p>
              {(addonsTotal > 0 || addonFuelCharge || bundlePrice > 0) && (
                <p className="text-white/60 text-xs mb-1">+ ${(addonsTotal + fuelAmount + bundlePrice).toFixed(2).replace('.00', '')} add-ons = ${totalAmount.toFixed(2).replace('.00', '')} total</p>
              )}
              <p className="text-[#f5a623] font-bold text-sm">
                ${depositAmount} deposit <span className="text-white/40 font-normal">or</span>
              </p>
              <p className="text-white/70 text-sm mb-5">
                ${totalAmount.toFixed(2).replace('.00', '')} pay in full
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

        {/* Related Rentals */}
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
