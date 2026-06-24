'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';

const ServiceAreasMapLeaflet = dynamic(() => import('./ServiceAreasMapLeaflet'), { ssr: false });

const AREAS = [
  { city: 'Cape Coral',      primary: true,  emoji: '🌴', en: 'Full availability — our most popular area',   es: 'Disponibilidad total — nuestra área más popular' },
  { city: 'Lehigh Acres',   primary: true,  emoji: '🌴', en: 'Full availability — great response times',    es: 'Disponibilidad total — excelentes tiempos de respuesta' },
  { city: 'Fort Myers',     primary: true,  emoji: '🌴', en: 'Full availability — all units available',     es: 'Disponibilidad total — todas las unidades disponibles' },
  { city: 'North Fort Myers', primary: true, emoji: '🌴', en: 'Full availability',                          es: 'Disponibilidad total' },
  { city: 'Buckingham',     primary: true,  emoji: '🏠', en: 'Our home base — fastest delivery',            es: 'Nuestra base — entrega más rápida' },
  { city: 'Estero',         primary: false, emoji: '📍', en: 'Available — standard delivery',               es: 'Disponible — entrega estándar' },
  { city: 'Bonita Springs', primary: false, emoji: '📍', en: 'Available — text to confirm',                 es: 'Disponible — escribe para confirmar' },
  { city: 'Naples',         primary: false, emoji: '⚠️', en: 'May require delivery fee — text us',          es: 'Puede requerir tarifa de entrega — escríbenos' },
];

export default function ServiceAreasPage() {
  const { t } = useLanguage();

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d2340] to-[#1a4f7a] py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#f5a623]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#1a6fa8]/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-4">
            {t('We Come to You', 'Llegamos Hasta Ti')}
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-5 leading-tight">
            {t('Delivering Fun', 'Llevando Diversión')}<br />
            <span className="text-[#f5a623]">{t('Across SW Florida', 'Por Todo el SO de Florida')}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            {t(
              'Based in Buckingham, FL — we deliver within a 20-mile radius to Cape Coral, Lehigh Acres, Fort Myers and beyond.',
              'Con base en Buckingham, FL — entregamos dentro de un radio de 20 millas a Cape Coral, Lehigh Acres, Fort Myers y más.'
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="sms:+12392204067" className="bg-[#f5a623] hover:bg-[#e09610] text-white font-black px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-xl">
              📱 {t('Text to Check Your Address', 'Escribe para Verificar Tu Dirección')}
            </a>
            <Link href="/rentals" className="bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 font-bold px-6 py-3 rounded-xl transition-all">
              🛝 {t('Browse Rentals', 'Ver Rentas')}
            </Link>
          </div>
        </div>
      </section>

      {/* Map + Cards */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-2">
            {t('Interactive Map', 'Mapa Interactivo')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d2340] mb-3">
            {t('Where We Deliver', 'Dónde Entregamos')}
          </h2>
          <p className="text-gray-500">
            {t('Click any pin to see service details. Dashed circle = our delivery radius.', 'Haz clic en cualquier pin para ver detalles. Círculo punteado = nuestro radio de entrega.')}
          </p>
        </div>

        <div className="mb-10">
          <ServiceAreasMapLeaflet />
        </div>

        {/* Area Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {AREAS.map((area) => (
            <div
              key={area.city}
              className={`bg-white rounded-2xl shadow-sm p-5 border-l-4 hover:shadow-md transition-shadow ${area.primary ? 'border-[#f5a623]' : 'border-gray-200'}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0 mt-0.5">{area.emoji}</span>
                <div>
                  <p className="font-black text-[#0d2340] text-base leading-tight">{area.city}</p>
                  <p className="text-gray-500 text-xs mt-1 leading-snug">{t(area.en, area.es)}</p>
                  {area.primary && (
                    <span className="inline-block bg-[#f5a623]/10 text-[#f5a623] text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full mt-2">
                      {t('Primary Zone', 'Zona Principal')}
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
            <p className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-3">
              {t('Not Sure?', '¿No Estás Seguro?')}
            </p>
            <h3 className="text-2xl sm:text-3xl font-black mb-3">
              {t('Not Sure If We Reach You?', '¿No Sabes Si Llegamos a Ti?')}
            </h3>
            <p className="text-white/70 mb-6 text-lg">
              {t("Just text us your address — we'll reply within minutes!", '¡Solo escríbenos tu dirección — respondemos en minutos!')}
            </p>
            <a href="sms:+12392204067" className="inline-block bg-[#f5a623] hover:bg-[#e09610] text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl">
              📱 {t('Text (239) 220-4067', 'Mensaje al (239) 220-4067')}
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
