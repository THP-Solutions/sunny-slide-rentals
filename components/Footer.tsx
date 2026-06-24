'use client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const QUICK_LINKS = [
  { href: '/', en: 'Home', es: 'Inicio' },
  { href: '/rentals', en: 'Rentals', es: 'Rentas' },
  { href: '/gallery', en: 'Gallery', es: 'Galería' },
  { href: '/service-areas', en: 'Service Areas', es: 'Áreas de Servicio' },
  { href: '/reviews', en: 'Reviews', es: 'Reseñas' },
  { href: '/faq', en: 'FAQ', es: 'Preguntas Frecuentes' },
  { href: '/contact', en: 'Contact', es: 'Contacto' },
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
  const { t } = useLanguage();

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
              {t(
                "Southwest Florida's trusted party rental company serving Cape Coral, Lehigh Acres, Fort Myers, and beyond.",
                'La empresa de alquiler de fiestas de confianza del suroeste de Florida, sirviendo Cape Coral, Lehigh Acres, Fort Myers y más.'
              )}
            </p>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-full w-fit">
                ✓ {t('Licensed & Insured', 'Licenciado y Asegurado')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-full w-fit">
                ✓ {t('Delivery & Setup Included', 'Entrega y Montaje Incluidos')}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-5 text-[#f5a623]">
              {t('Quick Links', 'Accesos Rápidos')}
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t(link.en, link.es)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-5 text-[#f5a623]">
              {t('Service Areas', 'Áreas de Servicio')}
            </h3>
            <ul className="space-y-2">
              {SERVICE_AREAS.map((area) => (
                <li key={area} className="text-sm text-gray-400">{area}</li>
              ))}
              <li className="text-sm text-gray-500 italic">
                {t('Naples (ask about availability)', 'Naples (consultar disponibilidad)')}
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              {t('20-mile radius from Buckingham/Fort Myers base', 'Radio de 20 millas desde nuestra base en Buckingham/Fort Myers')}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-5 text-[#f5a623]">
              {t('Contact Us', 'Contáctanos')}
            </h3>
            <ul className="space-y-3 mb-5">
              <li>
                <a href="sms:+12392204067" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <span>📱</span> {t('Text Us', 'Escríbenos')}
                </a>
              </li>
              <li>
                <a href="mailto:booking@sunnysliderentals.com" className="flex items-start gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <span className="mt-0.5">✉️</span>
                  <span className="break-all">booking@sunnysliderentals.com</span>
                </a>
              </li>
            </ul>
            <Link href="/rentals" className="inline-block bg-[#f5a623] hover:bg-[#e09610] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors">
              📅 {t('Book Online', 'Reservar en Línea')}
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2025 Sunny Slide Rentals. {t('All rights reserved.', 'Todos los derechos reservados.')}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              {t('Privacy Policy', 'Política de Privacidad')}
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              {t('Terms of Service', 'Términos de Servicio')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
