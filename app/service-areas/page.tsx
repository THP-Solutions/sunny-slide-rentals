import Link from 'next/link';
import dynamic from 'next/dynamic';

const ServiceAreasMapLeaflet = dynamic(() => import('./ServiceAreasMapLeaflet'), { ssr: false });

const AREAS = [
  { city: 'Cape Coral', primary: true, emoji: '🌴', desc: 'Full availability — our most popular area' },
  { city: 'Lehigh Acres', primary: true, emoji: '🌴', desc: 'Full availability — great response times' },
  { city: 'Fort Myers', primary: true, emoji: '🌴', desc: 'Full availability — all units available' },
  { city: 'North Fort Myers', primary: true, emoji: '🌴', desc: 'Full availability' },
  { city: 'Buckingham', primary: true, emoji: '🏠', desc: 'Our home base — fastest delivery' },
  { city: 'Estero', primary: false, emoji: '📍', desc: 'Available — standard delivery' },
  { city: 'Bonita Springs', primary: false, emoji: '📍', desc: 'Available — text to confirm' },
  { city: 'Naples', primary: false, emoji: '⚠️', desc: 'May require delivery fee — text us' },
];

export const metadata = {
  title: 'Service Areas — Cape Coral, Fort Myers & SW Florida',
  description: 'Sunny Slide Rentals delivers water slides and inflatables to Cape Coral, Lehigh Acres, Fort Myers, Buckingham and all of Southwest Florida.',
};

export default function ServiceAreasPage() {
  return (
    <main className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d2340] to-[#1a4f7a] py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#f5a623]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#1a6fa8]/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-4">We Come to You</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-5 leading-tight">
            Delivering Fun<br />
            <span className="text-[#f5a623]">Across SW Florida</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Based in Buckingham, FL — we deliver within a 20-mile radius to Cape Coral, Lehigh Acres, Fort Myers and beyond.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="sms:+12392314477" className="bg-[#f5a623] hover:bg-[#e09610] text-white font-black px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-xl">
              📱 Text to Check Your Address
            </a>
            <Link href="/rentals" className="bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 font-bold px-6 py-3 rounded-xl transition-all">
              🛝 Browse Rentals
            </Link>
          </div>
        </div>
      </section>

      {/* Map + Cards */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-2">Interactive Map</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d2340] mb-3">Where We Deliver</h2>
          <p className="text-gray-500">Click any pin to see service details. Dashed circle = our delivery radius.</p>
        </div>

        {/* Map */}
        <div className="mb-10">
          <ServiceAreasMapLeaflet />
        </div>

        {/* Area Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {AREAS.map((area) => (
            <div
              key={area.city}
              className={`bg-white rounded-2xl shadow-sm p-5 border-l-4 hover:shadow-md transition-shadow ${
                area.primary ? 'border-[#f5a623]' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0 mt-0.5">{area.emoji}</span>
                <div>
                  <p className="font-black text-[#0d2340] text-base leading-tight">{area.city}</p>
                  <p className="text-gray-500 text-xs mt-1 leading-snug">{area.desc}</p>
                  {area.primary && (
                    <span className="inline-block bg-[#f5a623]/10 text-[#f5a623] text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full mt-2">
                      Primary Zone
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#0d2340] to-[#1a6fa8] rounded-3xl p-8 text-center text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f5a623]/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-3">Not Sure?</p>
            <h3 className="text-2xl sm:text-3xl font-black mb-3">Not Sure If We Reach You?</h3>
            <p className="text-white/70 mb-6 text-lg">Just text us your address — we&apos;ll reply within minutes!</p>
            <a
              href="sms:+12392314477"
              className="inline-block bg-[#f5a623] hover:bg-[#e09610] text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl"
            >
              📱 Text (239) 231-4477
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
