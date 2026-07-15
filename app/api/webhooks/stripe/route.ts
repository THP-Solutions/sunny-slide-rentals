import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase'
import { sendBookingConfirmation } from '@/lib/email'
import { getRentalById } from '@/lib/rentals'
import { getOrCreateGhlContact, createGhlAppointment } from '@/lib/ghl'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
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

    const customerEmail = session.customer_details?.email ?? ''
    const customerName  = session.customer_details?.name  ?? ''
    const customerPhone = session.customer_details?.phone ?? ''

    // 1. Save booking to Supabase
    const supabase = createServiceClient()
    const { error: dbError } = await supabase.from('bookings').upsert(
      {
        rental_id:      meta.rentalId,
        rental_name:    meta.rentalName,
        event_date:     meta.eventDate,
        deposit_amount: Number(meta.depositAmount),
        total_amount:   Number(meta.totalAmount),
        status:         'confirmed',
        stripe_session_id: session.id,
        customer_email: customerEmail,
        customer_name:  customerName,
        customer_phone: customerPhone,
        addon_tables:   Number(meta.addonTables),
        addon_chairs:   Number(meta.addonChairs),
        addon_tent:     Number(meta.addonTent),
        event_address:  meta.eventAddress ?? '',
      },
      { onConflict: 'stripe_session_id' },
    )

    if (dbError) {
      console.error('Failed to save booking to Supabase:', dbError)
    }

    // 2. Create GHL appointment (if calendarId exists for this rental)
    const rental = getRentalById(meta.rentalId)
    if (rental?.calendarId) {
      try {
        const contactId = await getOrCreateGhlContact(
          customerEmail,
          customerName,
          customerPhone,
        )
        const notes = [
          `Event address: ${meta.eventAddress ?? 'TBD'}`,
          Number(meta.addonTables)  > 0 ? `Tables: ${meta.addonTables}` : '',
          Number(meta.addonChairs)  > 0 ? `Chairs: ${meta.addonChairs}` : '',
          Number(meta.addonTent)    > 0 ? `Tent: yes` : '',
          Number(meta.addonGenerator) > 0 ? `Generator: yes` : '',
          `Total: $${meta.totalAmount} | Paid: $${meta.chargeAmount} (${meta.paymentType})`,
          `Stripe session: ${session.id}`,
        ].filter(Boolean).join('\n')

        await createGhlAppointment({
          calendarId: rental.calendarId,
          contactId,
          title: `${meta.rentalName} — ${customerName}`,
          eventDate: meta.eventDate,
          notes,
        })
        console.log(`GHL appointment created for ${meta.rentalName} on ${meta.eventDate}`)
      } catch (ghlErr) {
        // Don't fail the webhook if GHL errors — booking is already saved to Supabase
        console.error('Failed to create GHL appointment:', ghlErr)
      }
    }

    // 3. Send confirmation email
    sendBookingConfirmation({
      customerEmail,
      customerName,
      customerPhone: customerPhone || undefined,
      rentalName:    meta.rentalName,
      eventDate:     meta.eventDate,
      depositAmount: Number(meta.depositAmount),
      totalAmount:   Number(meta.totalAmount),
      eventAddress:  meta.eventAddress ?? '',
      addonTables:   Number(meta.addonTables),
      addonChairs:   Number(meta.addonChairs),
      addonTent:     Number(meta.addonTent),
    }).catch((err) => console.error('Email send failed:', err))
  }

  return NextResponse.json({ received: true })
}
