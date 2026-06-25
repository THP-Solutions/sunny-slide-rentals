export interface Rental {
  id: string;
  name: string;
  price: number;
  deposit: number;
  category: string;
  dimensions: string;
  wetDry: string;
  rentalHours: number;
  description: string;
  image: string;
  calendarId: string;
  hidden?: boolean; // if true, exclude from browse grids
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  unit: string;
  max: number;
}

export const RENTALS: Rental[] = [
  {
    id: 'tiki-tsunami-mega-splash',
    name: 'Tiki Tsunami Mega Splash',
    price: 725,
    deposit: 182,
    category: 'Water Slides',
    dimensions: "63' L × 19' W × 27' H",
    wetDry: 'Wet/Dry',
    rentalHours: 9,
    description:
      "Our biggest tropical adventure yet! The Tiki Tsunami is a towering mega slide that brings the ultimate island thrill to your backyard.",
    image: '/images/tiki-tsunami-mega-splash.jpg',
    calendarId: 'KHdXvpHYgEUPYB6gpMuj',
  },
  {
    id: 'shark-attack-splash',
    name: 'Shark Attack Splash',
    price: 575,
    deposit: 144,
    category: 'Water Slides',
    dimensions: "52' L × 21' W × 24' H",
    wetDry: 'Wet/Dry',
    rentalHours: 9,
    description:
      "Brave the bite! This giant shark-themed water slide features a massive drop right through the jaws of a great white.",
    image: '/images/shark-attack-splash.jpg',
    calendarId: 'dMrXXTDRKKQjYZI2SMxK',
  },
  {
    id: 'yetis-peak',
    name: "Yeti's Peak",
    price: 425,
    deposit: 107,
    category: 'Water Slides',
    dimensions: "42.5' L × 19' W × 22' H",
    wetDry: 'Wet/Dry',
    rentalHours: 9,
    description:
      "Conquer the mountain! This towering Yeti-themed water slide features a steep drop and a massive splash pool.",
    image: '/images/yetis-peak.jpg',
    calendarId: 'guQnUYVaBIibEtLzOphS',
  },
  {
    id: 'riptide-rush-dual-lane',
    name: 'Riptide Rush Dual Lane',
    price: 450,
    deposit: 113,
    category: 'Water Slides',
    dimensions: "40' L × 19' W × 21' H",
    wetDry: 'Wet/Dry',
    rentalHours: 9,
    description:
      "Race your friends to the finish line! This dual-lane water slide ends in a long slip-n-slide for the ultimate competitive splash down.",
    image: '/images/riptide-rush-dual-lane.jpg',
    calendarId: 'UvJuHUWYvhA7NxF9smrV',
  },
  {
    id: 'baja-blast-hybrid',
    name: 'Baja Blast Hybrid',
    price: 425,
    deposit: 107,
    category: 'Water Slides',
    dimensions: "37' L × 19' W × 19' H",
    wetDry: 'Wet/Dry',
    rentalHours: 9,
    description:
      "Experience the rush of the Baja Blast! A thrilling hybrid water slide with a long slip-n-slide ending.",
    image: '/images/baja-blast-hybrid.jpg',
    calendarId: 'AyoAcsSeJoNHnWjBBQ2t',
  },
  {
    id: 'caymans-crush',
    name: "Cayman's Crush",
    price: 375,
    deposit: 94,
    category: 'Water Slides',
    dimensions: "32.5' L × 19' W × 19' H",
    wetDry: 'Wet/Dry',
    rentalHours: 9,
    description:
      "Ride the wave with Cayman's Crush! A beautiful blue marble water slide perfect for beating the Florida heat.",
    image: '/images/caymans-crush.jpg',
    calendarId: 'Yb1UJqNqaUflBbYQRMfe',
  },
  {
    id: 'palm-paradise-combo',
    name: 'Palm Paradise Combo',
    price: 325,
    deposit: 82,
    category: 'Combo Units',
    dimensions: "28' L × 15' W × 14' H",
    wetDry: 'Wet/Dry',
    rentalHours: 9,
    description:
      "Bounce. Slide. Splash. The Palm Paradise Combo is a tropical-themed all-in-one unit with a bounce area, climbing wall, and water slide leading to a splash pool.",
    image: '/images/palm-paradise-combo.jpg',
    calendarId: '',
  },
  {
    id: 'akua-falls-dual-lane-combo',
    name: 'Akua Falls Dual Lane Combo',
    price: 350,
    deposit: 88,
    category: 'Combo Units',
    dimensions: "34' L × 17' W × 14' H",
    wetDry: 'Wet/Dry',
    rentalHours: 9,
    description:
      "Double the fun with dual sliding lanes! Features a spacious bounce area and a cool wave design.",
    image: '/images/akua-falls-dual-lane-combo.jpg',
    calendarId: 'dD0diOFAOQ5CS91562fL',
  },
  {
    id: 'goombay-splash-combo',
    name: 'Goombay Splash Combo',
    price: 300,
    deposit: 75,
    category: 'Combo Units',
    dimensions: "26.5' L × 12.5' W × 13.5' H",
    wetDry: 'Wet/Dry',
    rentalHours: 9,
    description:
      "Bounce, climb, and slide into a refreshing splash pool with this tropical-themed combo unit.",
    image: '/images/goombay-splash-combo.jpg',
    calendarId: '3EOqV5IZWDaykORwlMrF',
  },
  {
    id: 'party-tent-package',
    name: 'Tent, Tables & Chairs Package',
    price: 325,
    deposit: 82,
    category: 'Party Packages',
    dimensions: "32' L × 16' W",
    wetDry: 'N/A',
    rentalHours: 9,
    description:
      "Everything you need for seating and shade. 16×32 tent, 8ft tables, and white folding chairs — delivered and set up.",
    image: '/images/tiki-tsunami-mega-splash.jpg',
    calendarId: '5ZfM2NUPUmL0SzV4LRyu',
  },
  {
    id: 'big-day-party-package',
    name: 'Big Day Party Package',
    price: 550,
    deposit: 138,
    category: 'Party Packages',
    dimensions: 'Varies',
    wetDry: 'N/A',
    rentalHours: 9,
    description:
      "The ultimate party bundle! Choose any water slide or combo unit + 16×32 tent, 8ft tables, and white chairs. Everything delivered and set up — you just show up.",
    image: '/images/akua-falls-dual-lane-combo.jpg',
    calendarId: 'guQnUYVaBIibEtLzOphS',
  },
  {
    id: 'generator-rental',
    name: 'Generator Rental',
    price: 75,
    deposit: 75,
    category: 'Generators',
    dimensions: 'Portable',
    wetDry: 'N/A',
    rentalHours: 9,
    description:
      "Reliable power for your inflatables when an outlet isn't within 100ft of the setup area. Add this during checkout if needed.",
    image: '/images/baja-blast-hybrid.jpg',
    calendarId: 'guQnUYVaBIibEtLzOphS',
    hidden: true, // No generator photo — available as checkout add-on
  },
];

export const CATEGORIES = [
  'All',
  'Water Slides',
  'Combo Units',
  'Party Packages',
];

export const ADDONS: Addon[] = [
  { id: 'tables', name: '8ft Folding Tables', price: 10, unit: 'each', max: 20 },
  { id: 'chairs', name: 'White Folding Chairs', price: 3, unit: 'each', max: 100 },
  { id: 'tent', name: '16×32 Frame Tent', price: 59, unit: 'flat', max: 1 },
  { id: 'generator', name: 'Generator (if no outlet within 100ft)', price: 75, unit: 'flat', max: 1 },
];

export interface PartyPackage {
  id: string;
  name: string;
  tent: string;
  tables: number;
  chairs: number;
  guests: number;
  price: number; // add-on price on top of unit
  color: string;
}

export const PARTY_PACKAGES: PartyPackage[] = [
  {
    id: 'pkg-1',
    name: 'Party Package 1',
    tent: '10×20 Frame Tent',
    tables: 2,
    chairs: 18,
    guests: 18,
    price: 150,
    color: 'blue',
  },
  {
    id: 'pkg-2',
    name: 'Party Package 2',
    tent: '10×30 Frame Tent',
    tables: 3,
    chairs: 27,
    guests: 27,
    price: 250,
    color: 'orange',
  },
  {
    id: 'pkg-3',
    name: 'Party Package 3',
    tent: '16×32 Frame Tent',
    tables: 6,
    chairs: 50,
    guests: 50,
    price: 450,
    color: 'purple',
  },
];

export function getRentalById(id: string): Rental | undefined {
  return RENTALS.find((r) => r.id === id);
}

export const rentals = RENTALS;
