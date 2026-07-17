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

export const FL_SALES_TAX_RATE = 0.065   // 6.5% Florida sales tax
export const CARD_FEE_RATE = 0.027        // 2.7% card processing fee

export function calcAddonsTotal(sel: BookingSelection): number {
  return (
    sel.addonTables * 10 +
    sel.addonChairs * 3 +
    sel.addonTent * 259 +
    sel.addonGenerator * 75
  )
}

// Subtotal = rental price + add-ons (before tax/fee)
export function calcSubtotal(sel: BookingSelection, fuelCharge = 0, bundlePrice = 0): number {
  return sel.price + calcAddonsTotal(sel) + fuelCharge + bundlePrice
}

// Alias kept for backwards compatibility
export function calcTotal(sel: BookingSelection): number {
  return sel.price + calcAddonsTotal(sel)
}

export function calcTax(subtotal: number): number {
  return Math.round(subtotal * FL_SALES_TAX_RATE * 100) / 100
}

export function calcCardFee(preTaxTotal: number): number {
  return Math.round(preTaxTotal * CARD_FEE_RATE * 100) / 100
}

// Grand total including FL sales tax + card processing fee
export function calcGrandTotal(sel: BookingSelection, fuelCharge = 0, bundlePrice = 0): number {
  const subtotal = calcSubtotal(sel, fuelCharge, bundlePrice)
  const tax = calcTax(subtotal)
  const fee = calcCardFee(subtotal + tax)
  return Math.round((subtotal + tax + fee) * 100) / 100
}

// Deposit = 25% of grand total (min $100)
export function calcDeposit(sel: BookingSelection, fuelCharge = 0, bundlePrice = 0): number {
  return Math.max(100, Math.ceil(calcGrandTotal(sel, fuelCharge, bundlePrice) * 0.25))
}

// Static deposit for card/listing display (no add-ons factored in)
export function baseDeposit(price: number): number {
  return Math.max(100, Math.ceil(price * 0.25))
}
