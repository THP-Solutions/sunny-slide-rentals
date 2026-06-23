import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase'
import { sendBookingConfirmation } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  // Initialize Stripe inside the handler so it never runs at build time
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'placeholder', {
    apiVersion: '2026-05-27.dahlia',
  })

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata!

    const supabase = createServiceClient()

    const { error: dbError } = await supabase.from('bookings').upsert(
      {
        rental_id: meta.rentalId,
        rental_name: meta.rentalName,
        event_date: meta.eventDate,
        deposit_amount: Number(meta.depositAmount),
        total_amount: Number(meta.totalAmount),
        status: 'confirmed',
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email ?? '',
        customer_name: session.customer_details?.name ?? '',
        customer_phone: session.customer_details?.phone ?? '',
        addon_tables: Number(meta.addonTables),
        addon_chairs: Number(meta.addonChairs),
        addon_tent: Number(meta.addonTent),
        event_address: meta.eventAddress ?? '',
      },
      { onConflict: 'stripe_session_id' },
    )

    if (dbError) {
      console.error('Failed to save booking to Supabase:', dbError)
    }

    sendBookingConfirmation({
      customerEmail: session.customer_details?.email ?? '',
      customerName: session.customer_details?.name ?? '',
      customerPhone: session.customer_details?.phone ?? undefined,
      rentalName: meta.rentalName,
      eventDate: meta.eventDate,
      depositAmount: Number(meta.depositAmount),
      totalAmount: Number(meta.totalAmount),
      eventAddress: meta.eventAddress ?? '',
      addonTables: Number(meta.addonTables),
      addonChairs: Number(meta.addonChairs),
      addonTent: Number(meta.addonTent),
    }).catch((err) => console.error('Email send failed:', err))
  }

  return NextResponse.json({ received: true })
}
