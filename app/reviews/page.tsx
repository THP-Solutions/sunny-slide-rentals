'use client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const REVIEWS = [
  { name: 'Jessica M.', location: 'Cape Coral, FL',      en: "Absolutely amazing experience! The Tiki Tsunami was a hit at my son's birthday party. Setup crew was professional and on time. Will definitely book again!", es: '¡Una experiencia absolutamente increíble! El Tiki Tsunami fue un éxito en el cumpleaños de mi hijo. El equipo de montaje fue profesional y puntual. ¡Definitivamente volveré a reservar!' },
  { name: 'Carlos R.',  location: 'Lehigh Acres, FL',    en: "Best party rental company in Southwest Florida. The Shark Attack Slide was incredible — kids wouldn't get off it. Super clean and the delivery team was great.", es: 'La mejor empresa de alquiler de fiestas en el suroeste de Florida. El Shark Attack Slide fue increíble — los niños no querían bajarse. Muy limpio y el equipo de entrega fue excelente.' },
  { name: 'Amanda T.', location: 'Fort Myers, FL',       en: "Easy online booking, great communication, and the slide was exactly as pictured. The weather guarantee gave us so much peace of mind. 10/10!", es: 'Reserva en línea fácil, excelente comunicación, y el tobogán era exactamente como en las fotos. La garantía del clima nos dio mucha tranquilidad. ¡10/10!' },
  { name: 'Mike D.',   location: 'Cape Coral, FL',       en: "Rented the Yeti's Peak for a neighborhood block party. Everyone loved it. Sunny Slide made the whole process stress-free from start to finish.", es: 'Alquilé el Yeti's Peak para una fiesta de vecinos. A todos les encantó. Sunny Slide hizo todo el proceso sin estrés de principio a fin.' },
  { name: 'Sandra L.', location: 'North Fort Myers, FL', en: "We added the tables and chairs package — everything was included and set up perfectly. Highly recommend Sunny Slide Rentals for any party!", es: 'Agregamos el paquete de mesas y sillas — todo estaba incluido y montado perfectamente. ¡Recomiendo ampliamente Sunny Slide Rentals para cualquier fiesta!' },
  { name: 'Roberto G.', location: 'Buckingham, FL',      en: "Fantastic service. Booked online at midnight, got a confirmation the next morning, and the team showed up right on time. The kids are still talking about it.", es: 'Servicio fantástico. Reservé en línea a medianoche, recibí confirmación a la mañana siguiente, y el equipo llegó puntual. Los niños todavía hablan de eso.' },
];

export default function ReviewsPage() {
  const { t } = useLanguage();

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="bg-[#0d2340] py-16 px-4 text-center">
        <p className="text-[#f5a623] font-bold text-xs uppercase tracking-widest mb-3">
          {t('Happy Customers', 'Clientes Felices')}
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          {t('Customer Reviews', 'Reseñas de Clientes')}
        </h1>
        <div className="flex items-center justify-center gap-1 mb-3">
          {[1,2,3,4,5].map((i) => <span key={i} className="text-[#f5a623] text-2xl">★</span>)}
        </div>
        <p className="text-white/70">
          5.0 · {t('Loved by families across Southwest Florida', 'Amado por familias en todo el suroeste de Florida')}
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {REVIEWS.map((review) => (
            <div key={review.name} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-[#f5a623] text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">&quot;{t(review.en, review.es)}&quot;</p>
              <div>
                <p className="font-bold text-[#0d2340] text-sm">{review.name}</p>
                <p className="text-gray-400 text-xs">{review.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-2xl font-extrabold text-[#0d2340] mb-3">
            {t('Ready to make your own memories?', '¿Listo para crear tus propios recuerdos?')}
          </p>
          <p className="text-gray-500 mb-6">
            {t('Join hundreds of happy families across Southwest Florida.', 'Únete a cientos de familias felices en todo el suroeste de Florida.')}
          </p>
          <Link href="/rentals" className="inline-block bg-[#f5a623] hover:bg-[#e09610] text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg">
            📅 {t('Book Your Rental Today', 'Reserva Tu Renta Hoy')}
          </Link>
        </div>
      </div>
    </main>
  );
}
