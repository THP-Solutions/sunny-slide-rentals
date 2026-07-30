// lib/inventory.ts
// Shared availability / inventory logic used across homepage and /availability page

export const INVENTORY = 3; // Kyle & JR each have items; we show 3 per category

/** Deterministic "already booked" seed — makes the site look active
 *  without a real database. In production, replace with a Supabase/GHL query.
 */
export function seedBooked(rentalId: string, year: number, month: number): Set<number> {
  const booked = new Set<number>();
  const seed = rentalId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Mark 3-5 days per month as partially or fully booked
  for (let i = 0; i < 5; i++) {
    const day = ((seed * (i + 7) * 13) % daysInMonth) + 1;
    booked.add(day);
  }
  return booked;
}

/** Returns how many units are available for a given rental on a given date.
 *  0 = fully booked, 1 = last unit, 2 = 2 remaining, 3 = fully open.
 */
export function getAvailable(rentalId: string, date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return 0;

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const booked = seedBooked(rentalId, year, month);
  if (booked.has(day)) {
    const seed = rentalId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return ((seed + day) % 2 === 0) ? 1 : 2;
  }
  return INVENTORY;
}

export function availLabel(avail: number): string {
  if (avail === 0) return 'Booked';
  if (avail === 1) return '1 left!';
  if (avail === 2) return '2 left';
  return 'Open';
}

export function availColor(avail: number): string {
  if (avail === 0) return '#ef4444';
  if (avail === 1) return '#f97316';
  if (avail === 2) return '#eab308';
  return '#22c55e';
}
