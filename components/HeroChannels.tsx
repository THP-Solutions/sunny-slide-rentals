'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

type ChannelCard = {
  image: string;
  name: string;
  price: number;
  deposit: number;
  id: string;
  dim: string;
  tag: string;
  tagEs: string;
};

type Channel = {
  id: string;
  labelEn: string;
  labelEs: string;
  emoji: string;
  headlineEn: string[];
  headlineEs: string[];
  accentLine: string;
  subEn: string;
  subEs: string;
  ctaEn: string;
  ctaEs: string;
  cards: ChannelCard[];
};

const CHANNELS: Channel[] = [
  {
    id: 'water-slides',
    labelEn: 'Water Slides', labelEs: 'Toboganes de Agua',
    emoji: '💦',
    headlineEn: ['EPIC', 'DROPS.', 'BIG', 'SPLASHES.'],
    headlineEs: ['CAÍDAS', 'ÉPICAS.', 'GRANDES', 'SALPICONES.'],
    accentLine: 'SPLASHES.',
    subEn: 'The coolest way to beat the Florida heat.',
    subEs: 'La mejor manera de vencer el calor de Florida.',
    ctaEn: '💦 Book a Water Slide',
    ctaEs: '💦 Reservar Tobogán',
    cards: [
      { image: '/images/tiki-tsunami-mega-splash.jpg', name: 'Tiki Tsunami Mega Splash', price: 725, deposit: 182, id: 'tiki-tsunami-mega-splash', dim: "63' L × 27' H", tag: 'Most Popular', tagEs: 'Más Popular' },
      { image: '/images/shark-attack-splash.jpg',      name: 'Shark Attack Splash',      price: 575, deposit: 144, id: 'shark-attack-splash',      dim: "52' L × 24' H", tag: 'Fan Favorite', tagEs: 'Favorito' },
    ],
  },
  {
    id: 'combo-units',
    labelEn: 'Combo Units', labelEs: 'Unidades Combo',
    emoji: '🎉',
    headlineEn: ['BOUNCE.', 'SLIDE.', 'SPLASH.'],
    headlineEs: ['REBOTA.', 'DESLIZA.', 'SALPICA.'],
    accentLine: 'SPLASH.',
    subEn: 'One unit. Three ways to have the best day ever.',
    subEs: 'Una unidad. Tres formas de vivir el mejor día.',
    ctaEn: '🎉 See Combo Units',
    ctaEs: '🎉 Ver Combos',
    cards: [
      { image: '/images/akua-falls-dual-lane-combo.jpg', name: 'Akua Falls Dual Lane',   price: 350, deposit: 88,  id: 'akua-falls-dual-lane-combo', dim: "34' L × 14' H", tag: 'Dual Lane', tagEs: 'Doble Carril' },
      { image: '/images/palm-paradise-combo.jpg',        name: 'Palm Paradise Combo',    price: 325, deposit: 82,  id: 'palm-paradise-combo',        dim: "28' L × 14' H", tag: 'Best Value', tagEs: 'Mejor Precio' },
    ],
  },
  {
    id: 'party-packages',
    labelEn: 'Party Packages', labelEs: 'Paquetes de Fiesta',
    emoji: '🎁',
    headlineEn: ['THE', 'ULTIMATE', 'PARTY.'],
    headlineEs: ['LA', 'FIESTA', 'PERFECTA.'],
    accentLine: 'PARTY.',
    subEn: 'Slides, tents, tables & chairs — we handle it all.',
    subEs: 'Toboganes, carpas, mesas y sillas — nosotros lo manejamos todo.',
    ctaEn: '🎁 Build Your Package',
    ctaEs: '🎁 Armar Tu Paquete',
    cards: [
      { image: '/images/goombay-splash-combo.jpg',       name: 'Goombay Splash Combo',    price: 300, deposit: 100, id: 'goombay-splash-combo',       dim: "26.5' L × 13.5' H", tag: 'Starter Pack', tagEs: 'Paquete Inicial' },
      { image: '/images/akua-falls-dual-lane-combo.jpg', name: 'Big Day Party Package',   price: 550, deposit: 138, id: 'big-day-party-package',       dim: 'Bundle Deal',       tag: 'All-Inclusive', tagEs: 'Todo Incluido' },
    ],
  },
];

function FlipCard({ card, index, t }: { card: ChannelCard; index: number; t: (en: string, es: string) => string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="flex-1 cursor-pointer rounded-2xl overflow-hidden"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="relative w-full h-full rounded-2xl"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.65s cubic-bezier(0.4,0.2,0.2,1)',
          height: '100%',
        }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
          <Image src={card.image} alt={card.name} fill className="object-contain" priority={index === 0} sizes="30vw" />
          <div className="absolute top-3 left-3">
            <span className="bg-[#f5a623] text-white text-xs font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wide">
              {t(card.tag, card.tagEs)}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 opacity-60">
            <span className="bg-black/40 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              {t('Hover for details', 'Pasa el cursor')}
            </span>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0d2340] to-[#1a4f7a] flex flex-col justify-center items-center p-8 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-20 h-20 rounded-2xl overflow-hidden mb-5 border-2 border-white/20 flex-shrink-0">
            <Image src={card.image} alt={card.name} width={80} height={80} className="object-cover object-top w-full h-full" />
          </div>
          <span className="bg-[#f5a623] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            {t(card.tag, card.tagEs)}
          </span>
          <h3 className="text-white font-black text-2xl leading-tight mb-2">{card.name}</h3>
          <p className="text-white/50 text-sm mb-4">{card.dim}</p>
          <div className="mb-6">
            <p className="text-[#f5a623] font-black text-4xl leading-none">${card.price}</p>
            <p className="text-white/50 text-xs mt-1">${card.deposit} {t('deposit to hold your date', 'de depósito para reservar tu fecha')}</p>
          </div>
          <Link
            href={'/rentals/' + card.id}
            className="bg-[#f5a623] hover:bg-[#e09610] text-white font-black px-8 py-3 rounded-xl text-sm transition-all hover:scale-105 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {t('Book This One', 'Reservar Este')} →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HeroChannels() {
  const [active, setActive] = useState(0);
  const { t } = useLanguage();
  const ch = CHANNELS[active];

  const headline = t(ch.headlineEn.join('|||'), ch.headlineEs.join('|||')).split('|||');
  const accentIdx = ch.headlineEn.indexOf(ch.accentLine);

  return (
    <section className="flex h-[90vh] bg-[#0d2340]">

      {/* LEFT — text panel */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-14 py-16 w-full lg:w-[36%] xl:w-[34%] flex-shrink-0">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 w-fit">
          <span className="text-[#f5a623] text-sm">★★★★★</span>
          <span className="text-white text-xs font-semibold">{t("SW Florida's #1 Rentals", 'Los #1 Alquileres del SO de Florida')}</span>
        </div>

        <h1 className="font-black text-white leading-[0.88] tracking-tighter mb-6 text-5xl sm:text-6xl xl:text-7xl">
          {headline.map((line, i) => (
            <span key={i} className={'block ' + (i === accentIdx ? 'text-[#f5a623]' : '')}>
              {line}
            </span>
          ))}
        </h1>

        <p className="text-white/70 text-lg font-medium mb-10 max-w-xs leading-relaxed">{t(ch.subEn, ch.subEs)}</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link href="/rentals" className="bg-[#f5a623] hover:bg-[#e09610] text-white font-black px-8 py-4 rounded-2xl text-base transition-all shadow-2xl hover:scale-105 text-center">
            {t(ch.ctaEn, ch.ctaEs)}
          </Link>
          <a href="sms:+12392204067" className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 font-bold px-8 py-4 rounded-2xl text-base transition-all text-center">
            📱 {t('Text Us', 'Escríbenos')}
          </a>
        </div>

        <div className="flex gap-3 flex-wrap">
          {[
            { value: '100+', enLabel: 'Events',   esLabel: 'Eventos'  },
            { value: '5.0★', enLabel: 'Rated',    esLabel: 'Calificado' },
            { value: '$0',   enLabel: 'Setup',    esLabel: 'Montaje'  },
            { value: '20mi', enLabel: 'Delivery', esLabel: 'Entrega'  },
          ].map((s) => (
            <div key={s.enLabel} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center">
              <p className="text-white font-black text-xl leading-none">{s.value}</p>
              <p className="text-white/50 text-[11px] mt-1">{t(s.enLabel, s.esLabel)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — flip cards + switcher */}
      <div className="hidden lg:flex flex-1 gap-3 p-4 items-stretch h-full overflow-hidden">
        {ch.cards.map((card, i) => (
          <FlipCard key={card.id} card={card} index={i} t={t} />
        ))}

        {/* Channel switcher */}
        <div className="flex flex-col justify-center gap-2 pl-2 flex-shrink-0">
          <p className="text-white/30 text-[9px] font-black uppercase tracking-widest text-center mb-1">↕</p>
          {CHANNELS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(i)}
              title={t(c.labelEn, c.labelEs)}
              className={'w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ' + (
                i === active
                  ? 'border-[#f5a623] scale-110 shadow-xl shadow-[#f5a623]/30'
                  : 'border-white/20 opacity-50 hover:opacity-80 hover:border-white/50'
              )}
            >
              <div className="relative w-full h-full">
                <Image src={c.cards[0].image} alt={t(c.labelEn, c.labelEs)} fill className="object-cover object-top" sizes="56px" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: channel strip */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex gap-2 px-4 pb-4 pt-3 bg-gradient-to-t from-[#0d2340]">
        {CHANNELS.map((c, i) => (
          <button key={c.id} onClick={() => setActive(i)}
            className={'flex-1 py-3 rounded-xl font-bold text-sm transition-all ' + (i === active ? 'bg-[#f5a623] text-white' : 'bg-white/10 text-white/70 border border-white/20')}
          >
            {c.emoji} {t(c.labelEn, c.labelEs)}
          </button>
        ))}
      </div>
    </section>
  );
}
