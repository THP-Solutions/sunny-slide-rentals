'use client';
import Image from 'next/image';
import Link from 'next/link';
import { RENTALS } from '@/lib/rentals';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GalleryPage() {
  const { t } = useLanguage();

  const galleryItems = RENTALS.filter((r) =>
    [
      'tiki-tsunami-mega-splash',
      'shark-attack-splash',
      'yetis-peak',
      'riptide-rush-dual-lane',
      'baja-blast-hybrid',
      'caymans-crush',
      'palm-paradise-combo',
      'akua-falls-dual-lane-combo',
      'goombay-splash-combo',
    ].includes(r.id)
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="bg-[#0d2340] py-16 px-4 text-center">
        <p className="text-[#f5a623] font-bold text-xs uppercase tracking-widest mb-3">
          {t('Our Inventory', 'Nuestro Inventario')}
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          {t('Gallery', 'Galería')}
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          {t(
            'See our full lineup of clean, exciting water slides, combo units, and more.',
            'Mira nuestra línea completa de toboganes de agua, combos y más.'
          )}
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {galleryItems.map((rental) => (
            <Link
              key={rental.id}
              href={`/rentals/${rental.id}`}
              className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Fixed: object-contain + bg-sky-50 so full image is visible */}
              <div className="relative h-64 bg-sky-50">
                <Image
                  src={rental.image}
                  alt={rental.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2340]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold text-sm bg-[#f5a623] px-3 py-1.5 rounded-full">
                    {t('View Details', 'Ver Detalles')} →
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#0d2340] text-base mb-1">{rental.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#1a6fa8] font-extrabold">
                    ${rental.price}
                    <span className="text-xs font-normal text-gray-400">/{t('day', 'día')}</span>
                  </span>
                  <span className="text-xs bg-blue-50 text-[#1a6fa8] px-2 py-1 rounded-full font-medium">
                    {rental.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/rentals"
            className="inline-block bg-[#f5a623] hover:bg-[#e09610] text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg"
          >
            📅 {t('Book Any of These Rentals', 'Reservar Cualquiera de Estas Rentas')}
          </Link>
        </div>
      </div>
    </main>
  );
}
