import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { RENTALS } from '@/lib/rentals'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || stripeKey.startsWith('sk_test_YOUR') || stripeKey === '') {
    return NextResponse.json(
      { error: 'Online booking is temporarily unavailable. Please text us at (239) 220-4067 to reserve your date.' },
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
      addonFuelCharge = false,   // $39.99 if delivery > 20 miles
      partyBundle = 0,           // 0, 150, 250, or 450
      partyBundleName = '',      // e.g. 'Party Package 2'
      paymentType = 'deposit',   // 'deposit' | 'full'
      eventAddress = '',
    } = body

    const rental = RENTALS.find((r) => r.id === rentalId)
    if (!rental) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 })
    }

    const fuelCharge = addonFuelCharge ? 39.99 : 0
    const bundleCharge = partyBundle > 0 ? Number(partyBundle) : 0
    const addonsTotal =
      addonTables * 10 + addonChairs * 3 + addonTent * 59 + addonGenerator * 75 + fuelCharge + bundleCharge
    const totalAmount = rental.price + addonsTotal

    // Payment amount: full or 25% deposit (min $100)
    const depositAmount = Math.max(100, Math.ceil(totalAmount * 0.25))
    const chargeAmount = paymentType === 'full' ? totalAmount : depositAmount
    const isFullPayment = paymentType === 'full'

    const formattedDate = new Date(eventDate + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

    const addonLines = [
      addonTables  > 0 ? `${addonTables}× 8ft Table${addonTables > 1 ? 's' : ''} (+$${addonTables * 10})` : '',
      addonChairs  > 0 ? `${addonChairs}× Chair${addonChairs > 1 ? 's' : ''} (+$${addonChairs * 3})` : '',
      addonTent    > 0 ? '1× 16×32 Frame Tent (+$59)' : '',
      partyBundle  > 0 ? `${partyBundleName} (+$${partyBundle})` : '',
      addonGenerator > 0 ? '1× Generator (+$75)' : '',
      addonFuelCharge   ? 'Fuel Charge (+$39.99)' : '',
    ].filter(Boolean).join(', ')

    const description = [
      `Event date: ${formattedDate}`,
      addonLines && `Add-ons: ${addonLines}`,
      isFullPayment
        ? `Total: $${totalAmount} | PAID IN FULL`
        : `Total: $${totalAmount} | Deposit: $${depositAmount} | Balance due day-of: $${totalAmount - depositAmount}`,
    ].filter(Boolean).join(' · ')

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isFullPayment
                ? `${rental.name} — Paid in Full`
                : `${rental.name} — 25% Deposit`,
              description,
            },
            unit_amount: Math.round(chargeAmount * 100),
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
        addonTables:  String(addonTables),
        addonChairs:  String(addonChairs),
        addonTent:    String(addonTent),
        addonGenerator: String(addonGenerator),
        addonFuelCharge: String(addonFuelCharge),
        partyBundle: String(partyBundle),
        partyBundleName,
        paymentType,
        totalAmount:  String(totalAmount),
        chargeAmount: String(chargeAmount),
        depositAmount: String(depositAmount),
        eventAddress,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    const message = err instanceof Error ? err.message : 'Payment setup failed.'
    return NextResponse.json(
      { error: `${message} Please text us at (239) 220-4067 to book.` },
      { status: 500 },
    )
  }
}
