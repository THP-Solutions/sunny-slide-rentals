export interface BookingSelection {
  rentalId: string
  rentalName: string
  price: number
  eventDate: string      // YYYY-MM-DD
  addonTables: number
  addonChairs: number
  addonTent: number
  addonGenerator: number
  eventAddress: string
}

export function calcAddonsTotal(sel: BookingSelection): number {
  return (
    sel.addonTables * 10 +
    sel.addonChairs * 3 +
    sel.addonTent * 59 +
    sel.addonGenerator * 75
  )
}

export function calcTotal(sel: BookingSelection): number {
  return sel.price + calcAddonsTotal(sel)
}

// Minimum deposit is $100 (matches sunnysliderentals.com policy)
export function calcDeposit(sel: BookingSelection): number {
  return Math.max(100, Math.ceil(calcTotal(sel) * 0.25))
}

// Static deposit for card/listing display (no add-ons factored in)
export function baseDeposit(price: number): number {
  return Math.max(100, Math.ceil(price * 0.25))
}
