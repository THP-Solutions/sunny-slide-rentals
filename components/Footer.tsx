import Link from 'next/link';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/rentals', label: 'Rentals' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

const SERVICE_AREAS = [
  'Cape Coral',
  'Lehigh Acres',
  'Fort Myers',
  'North Fort Myers',
  'Buckingham',
  'Estero',
];

export default function Footer() {
  return (
    <footer className="bg-[#0d2340] text-white pt-14 pb-6 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-extrabold text-xl mb-3">
              <span>🌞</span> Sunny Slide Rentals
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Southwest Florida&apos;s trusted party rental company serving Cape Coral, Lehigh Acres,
              Fort Myers, and beyond.
            </p>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-full w-fit">
                ✓ Licensed &amp; Insured
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-full w-fit">
                ✓ Delivery &amp; Setup Included
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-5 text-[#f5a623]">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-5 text-[#f5a623]">
              Service Areas
            </h3>
            <ul className="space-y-2">
              {SERVICE_AREAS.map((area) => (
                <li key={area} className="text-sm text-gray-400">
                  {area}
                </li>
              ))}
              <li className="text-sm text-gray-500 italic">Naples (ask about availability)</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              20-mile radius from Buckingham/Fort Myers base
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-5 text-[#f5a623]">
              Contact Us
            </h3>
            <ul className="space-y-3 mb-5">
              <li>
                <a
                  href="sms:+12392204067"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <span>📱</span> Text Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:booking@sunnysliderentals.com"
                  className="flex items-start gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <span className="mt-0.5">✉️</span>
                  <span className="break-all">booking@sunnysliderentals.com</span>
                </a>
              </li>
            </ul>
            <Link
              href="/rentals"
              className="inline-block bg-[#f5a623] hover:bg-[#e09610] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              📅 Book Online
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2025 Sunny Slide Rentals. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
