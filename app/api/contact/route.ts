import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const GHL_BASE = 'https://services.leadconnectorhq.com'
const GHL_HEADERS = (key: string) => ({
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + key,
  Version: '2021-07-28',
})

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')

async function createOrGetConversation(apiKey: string, locationId: string, contactId: string): Promise<string | null> {
  try {
    const res = await fetch(`${GHL_BASE}/conversations/`, {
      method: 'POST',
      headers: GHL_HEADERS(apiKey),
      body: JSON.stringify({ locationId, contactId }),
    })
    const data = await res.json()
    return data?.conversation?.id ?? data?.id ?? null
  } catch { return null }
}

async function addConversationNote(apiKey: string, conversationId: string, message: string) {
  try {
    await fetch(`${GHL_BASE}/conversations/messages`, {
      method: 'POST',
      headers: GHL_HEADERS(apiKey),
      body: JSON.stringify({ type: 'Activity', conversationId, message }),
    })
  } catch { /* non-critical */ }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, eventDate, city, interest, message } = body

  if (!name || !email || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const nameParts = name.trim().split(' ')
  const firstName = nameParts[0] || name
  const lastName = nameParts.slice(1).join(' ') || ''

  const apiKey = process.env.GHL_API_KEY
  if (apiKey) {
    try {
      // Use env locationId if set (required for agency-level PIT tokens)
      const envLocationId = process.env.GHL_LOCATION_ID

      // 1. Create GHL contact
      const contactRes = await fetch(`${GHL_BASE}/contacts/`, {
        method: 'POST',
        headers: GHL_HEADERS(apiKey),
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          source: 'Website Contact Form',
          tags: ['contact-form', 'website'],
          ...(envLocationId ? { locationId: envLocationId } : {}),
          customField: [
            ...(eventDate ? [{ key: 'event_date', value: eventDate }] : []),
            ...(city     ? [{ key: 'city',       value: city }]      : []),
            ...(interest ? [{ key: 'interest',   value: interest }]  : []),
            ...(message  ? [{ key: 'message',    value: message }]   : []),
          ],
        }),
      })
      const contactData = await contactRes.json()
      const contactId: string | undefined  = contactData?.contact?.id
      // Use locationId from response, fall back to env var
      const locationId: string | undefined = contactData?.contact?.locationId ?? envLocationId

      if (!contactRes.ok) {
        console.error('GHL contact error (contact form):', contactRes.status, contactData)
      }

      // 2. Create conversation so it appears in GHL Conversations tab
      if (contactId && locationId) {
        const conversationId = await createOrGetConversation(apiKey, locationId, contactId)
        if (conversationId) {
          const note = [
            '📋 Website Contact Form',
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            eventDate ? `Event Date: ${eventDate}` : '',
            city      ? `City: ${city}` : '',
            interest  ? `Interested In: ${interest}` : '',
            message   ? `Message: ${message}` : '',
          ].filter(Boolean).join('\n')
          await addConversationNote(apiKey, conversationId, note)
        }
      }
    } catch (err) {
      console.error('GHL API request failed (contact):', err)
    }
  } else {
    console.warn('GHL_API_KEY not set — contact form not sent to GHL')
  }

  // Notify business via Resend email
  try {
    await resend.emails.send({
      from: 'Sunny Slide Rentals <noreply@sunnysliderentals.com>',
      to: process.env.CONTACT_EMAIL || 'booking@sunnysliderentals.com',
      subject: 'New Inquiry from ' + name,
      html:
        '<div style="font-family:sans-serif;max-width:520px;margin:0 auto">' +
        '<div style="background:#1a6fa8;padding:20px 24px;border-radius:8px 8px 0 0">' +
        '<h2 style="color:#fff;margin:0;font-size:18px">New Website Inquiry</h2></div>' +
        '<div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">' +
        '<table style="width:100%;border-collapse:collapse">' +
        '<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;width:120px">Name</td><td style="padding:6px 0;font-weight:600;font-size:14px">' + name + '</td></tr>' +
        '<tr><td style="padding:6px 0;color:#6b7280;font-size:14px">Email</td><td style="padding:6px 0;font-size:14px"><a href="mailto:' + email + '">' + email + '</a></td></tr>' +
        '<tr><td style="padding:6px 0;color:#6b7280;font-size:14px">Phone</td><td style="padding:6px 0;font-size:14px"><a href="tel:' + phone + '">' + phone + '</a></td></tr>' +
        (eventDate ? '<tr><td style="padding:6px 0;color:#6b7280;font-size:14px">Event Date</td><td style="padding:6px 0;font-size:14px">' + eventDate + '</td></tr>' : '') +
        (city      ? '<tr><td style="padding:6px 0;color:#6b7280;font-size:14px">City</td><td style="padding:6px 0;font-size:14px">' + city + '</td></tr>' : '') +
        (interest  ? '<tr><td style="padding:6px 0;color:#6b7280;font-size:14px">Interested In</td><td style="padding:6px 0;font-size:14px">' + interest + '</td></tr>' : '') +
        '</table>' +
        (message ? '<div style="margin-top:16px;padding:12px;background:#fff;border:1px solid #e5e7eb;border-radius:6px"><p style="margin:0;font-size:14px;color:#374151">' + message + '</p></div>' : '') +
        '<div style="margin-top:20px;text-align:center">' +
        '<a href="sms:' + phone + '" style="display:inline-block;background:#f5a623;color:#fff;font-weight:700;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px">Text ' + firstName + ' Now</a>' +
        '</div></div></div>',
    })
  } catch (err) {
    console.error('Resend error:', err)
  }

  return NextResponse.json({ ok: true })
}
