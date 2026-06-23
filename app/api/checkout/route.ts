import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { RENTALS } from '@/lib/rentals'


export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Guard: Stripe key must be configured
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || stripeKey.startsWith('sk_test_YOUR') || stripeKey === '') {
    return NextResponse.json(
      { error: 'Online booking is temporarily unavailable. Please text us at (239) 231-4477 to reserve your date.' },
      { status: 503 },
    )
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2026-05-27.dahlia' as const })

  try {
    const body = await req.json()
    const {
      rentalId,
      eventDate,
      addonTables = 0,
      addonChairs = 0,
      addonTent = 0,
      addonGenerator = 0,
      eventAddress = '',
    } = body

    const rental = RENTALS.find((r) => r.id === rentalId)
    if (!rental) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 })
    }

    const addonsTotal =
      addonTables * 10 + addonChairs * 3 + addonTent * 59 + addonGenerator * 75
    const totalAmount = rental.price + addonsTotal
    // Minimum deposit is $100 per company policy
    const depositAmount = Math.max(100, Math.ceil(totalAmount * 0.25))

    // Human-readable event date
    const formattedDate = new Date(eventDate + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Build add-on description lines
    const addonLines = [
      addonTables > 0 ? `${addonTables}× 8ft Table${addonTables > 1 ? 's' : ''} (+$${addonTables * 10})` : '',
      addonChairs > 0 ? `${addonChairs}× Chair${addonChairs > 1 ? 's' : ''} (+$${addonChairs * 3})` : '',
      addonTent > 0 ? `1× 10×20 Tent (+$59)` : '',
      addonGenerator > 0 ? `1× Generator (+$75)` : '',
    ]
      .filter(Boolean)
      .join(', ')

    const description = [
      `Event date: ${formattedDate}`,
      addonLines && `Add-ons: ${addonLines}`,
      `Total: $${totalAmount} | Deposit: $${depositAmount} | Balance due day-of: $${totalAmount - depositAmount}`,
    ]
      .filter(Boolean)
      .join(' · ')

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${rental.name} — 25% Deposit`,
              description,
            },
            unit_amount: depositAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/booking-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/rentals/${rentalId}`,
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      metadata: {
        rentalId,
        rentalName: rental.name,
        eventDate,
        addonTables: String(addonTables),
        addonChairs: String(addonChairs),
        addonTent: String(addonTent),
        addonGenerator: String(addonGenerator),
        totalAmount: String(totalAmount),
        depositAmount: String(depositAmount),
        eventAddress,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    const message =
      err instanceof Error ? err.message : 'Payment setup failed.'
    return NextResponse.json(
      { error: `${message} Please text us at (239) 231-4477 to book.` },
      { status: 500 },
    )
  }
}
