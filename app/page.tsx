import Link from 'next/link';
import { RENTALS } from '@/lib/rentals';
import RentalRow from '@/components/RentalRow';
import HeroChannels from '@/components/HeroChannels';

const TICKER_ITEMS = [
  '💦 Water Slides','🎉 Combo Units','🏠 Bounce Houses',
  '📍 Cape Coral','📍 Lehigh Acres','📍 Fort Myers',
  '⭐ 5-Star Rated','🚚 Free Delivery & Setup','🛡️ Licensed & Insured',
];

const REVIEWS = [
  { text: "My kids literally SCREAMED when they saw the Tiki Tsunami set up in our backyard. Best birthday ever!", name: 'Sarah M.', city: 'Cape Coral', initial: 'S', bg: '#f5a623' },
  { text: "Super professional setup, arrived on time, equipment was spotless. Every kid was obsessed. Worth every penny.", name: 'Carlos R.', city: 'Lehigh Acres', initial: 'C', bg: '#1a6fa8' },
  { text: "Used Sunny Slide for my daughter's 8th birthday. Easy booking, great communication, absolute blast!", name: 'Jennifer K.', city: 'Fort Myers', initial: 'J', bg: '#22c55e' },
  { text: "Easy booking, fast delivery, and the kids didn't want to go home. Already booked for next summer!", name: 'Mike T.', city: 'North Fort Myers', initial: 'M', bg: '#a855f7' },
];

const HOW_IT_WORKS = [
  { num: '01', icon: '🛝', title: 'Choose Your Adventure', desc: 'Browse water slides, bounce houses, and combo units. Something epic for every age and budget.', color: '#1a6fa8' },
  { num: '02', icon: '📅', title: 'Pick Your Date', desc: "Select your event date. Our real-time checker shows open slots instantly — no phone tag.", color: '#f5a623' },
  { num: '03', icon: '💳', title: 'Pay 25% Deposit', desc: 'Secure your date with just a 25% deposit via Stripe. Balance due day-of. Safe and encrypted.', color: '#22c55e' },
  { num: '04', icon: '🚚', title: 'We Handle Everything', desc: 'We deliver, inflate, set up, and tear down. You just show up and enjoy the best day ever.', color: '#a855f7' },
];

const TRUST_ITEMS = [
  { icon: '✨', title: 'Always Spotless', desc: 'Every inflatable is sanitized and inspected after every single rental.' },
  { icon: '🚚', title: 'Setup Included', desc: 'We deliver, inflate, set up, and break it all down. Zero effort on your end.' },
  { icon: '🛡️', title: 'Fully Insured', desc: 'Licensed and insured for your complete peace of mind at every event.' },
  { icon: '⛈️', title: 'Weather Policy', desc: "Florida weather acting up? We'll reschedule at no charge." },
];

const SERVICE_AREAS = ['Cape Coral','Lehigh Acres','Fort Myers','North Fort Myers','Buckingham','Estero','Naples*'];

export default function HomePage() {
  const waterSlides = RENTALS.filter((r) => !r.hidden && r.category === 'Water Slides');
  const comboUnits  = RENTALS.filter((r) => !r.hidden && r.category === 'Combo Units');
  const packages    = RENTALS.filter((r) => !r.hidden && r.category === 'Party Packages');

  return (
    <main className="overflow-x-hidden">

      {/* HERO with channel switcher */}
      <HeroChannels />

      {/* TICKER */}
      <div className="bg-[#f5a623] overflow-hidden py-3.5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-white font-black text-xs sm:text-sm mx-8 uppercase tracking-widest">
              {item}<span className="opacity-40 ml-8">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* NETFLIX BROWSE */}
      <section className="pt-16 pb-8 bg-white">
        <div className="px-4 sm:px-8 lg:px-12 mb-12">
          <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-3">Delivered to Your Backyard</p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0d2340] leading-tight">Browse Our Adventures</h2>
          <p className="text-gray-500 mt-3 text-lg">Every unit is spotless, inspected, and ready to make memories.</p>
        </div>
        <RentalRow title="Water Slides" emoji="💦" rentals={waterSlides} />
        <RentalRow title="Combo Units" emoji="🎉" rentals={comboUnits} />
        {packages.length > 0 && <RentalRow title="Party Packages" emoji="🎪" rentals={packages} />}
        <div className="text-center mt-4 pb-8">
          <Link href="/rentals" className="inline-flex items-center gap-2 bg-[#0d2340] hover:bg-[#1a6fa8] text-white font-black px-8 py-4 rounded-2xl text-base transition-all shadow-lg hover:scale-105">
            View All Rentals →
          </Link>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20 bg-gradient-to-br from-[#0d2340] to-[#1a4f7a] px-4 overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#f5a623]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1a6fa8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-3">Real Families · Real Fun</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              Kids Are Obsessed.<br /><span className="text-[#f5a623]">Parents Are Happy.</span>
            </h2>
            <p className="text-white/60 mt-3 text-lg">★★★★★ rated across Southwest Florida</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((review) => (
              <div key={review.name} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-6 hover:bg-white/15 transition-all hover:-translate-y-1 duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg" style={{ backgroundColor: review.bg }}>
                    {review.initial}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{review.name}</p>
                    <p className="text-white/50 text-xs">{review.city}</p>
                  </div>
                </div>
                <p className="text-[#f5a623] text-sm mb-3">★★★★★</p>
                <p className="text-white/80 text-sm leading-relaxed italic">&ldquo;{review.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl sm:text-5xl font-black text-[#0d2340]">From Couch to Splash<br /><span className="text-[#1a6fa8]">in 4 Easy Steps</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 relative overflow-hidden group">
                <span className="absolute -top-2 -right-1 text-8xl font-black opacity-[0.05] leading-none select-none" style={{ color: step.color }}>{step.num}</span>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-3xl group-hover:scale-110 transition-transform" style={{ backgroundColor: step.color + '18' }}>
                  {step.icon}
                </div>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: step.color }}>Step {i + 1}</p>
                <h3 className="font-black text-[#0d2340] text-lg mb-2 leading-tight">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-20 px-4 bg-[#1a6fa8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-3">Why Families Trust Us</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white">What Sets Sunny Slide Apart</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="bg-white/10 border border-white/20 rounded-3xl p-7 text-center hover:bg-white/20 transition-all hover:-translate-y-1 duration-200">
                <div className="text-5xl mb-5">{item.icon}</div>
                <h3 className="text-white font-black text-lg mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-3">We Come to You</p>
          <h2 className="text-4xl font-black text-[#0d2340] mb-4">Delivery Areas</h2>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            Serving all of Southwest Florida within a 20-mile radius. Not sure if we reach you?{' '}
            <a href="sms:+12392314477" className="text-[#1a6fa8] font-bold hover:underline">Text us!</a>
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {SERVICE_AREAS.map((area) => (
              <span key={area} className="bg-[#0d2340] hover:bg-[#1a6fa8] text-white font-bold px-5 py-2.5 rounded-full text-sm transition-colors cursor-default">
                🌴 {area}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400">*Naples availability — text us to confirm</p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-4 bg-[#0d2340] overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#f5a623]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1a6fa8]/25 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-[#f5a623]/20 text-[#f5a623] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            Dates Fill Up Fast — Book Early!
          </span>
          <h2 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight">
            READY FOR THE<br /><span className="text-[#f5a623]">BEST DAY EVER?</span>
          </h2>
          <p className="text-white/60 text-xl mb-10">Book online 24/7 or text us to check availability.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/rentals" className="bg-[#f5a623] hover:bg-[#e09610] text-white font-black px-12 py-5 rounded-2xl text-xl transition-all shadow-2xl hover:scale-105">
              📅 Book Online Now
            </Link>
            <a href="sms:+12392314477" className="border-2 border-white/30 text-white hover:bg-white/10 font-bold px-10 py-5 rounded-2xl text-xl transition-all">
              📱 Text Us
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
