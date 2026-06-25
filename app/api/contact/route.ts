import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

// Both staff receive lead notifications via GHL workflow
const NOTIFY_PHONES = ['+12392204067', '+12396349809'] // Junior Barba, Kyle Henderson

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')

async function createGHLContact(fields: {
  firstName: string
  lastName: string
  email: string
  phone: string
  source?: string
  tags?: string[]
  customFields?: Record<string, string>
}) {
  const apiKey = process.env.GHL_API_KEY
  if (!apiKey) {
    console.warn('GHL_API_KEY not set — contact not sent to GHL')
    return
  }
  try {
    const res = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
        Version: '2021-07-28',
      },
      body: JSON.stringify({
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        phone: fields.phone,
        source: fields.source || 'Website',
        tags: fields.tags || [],
        customField: fields.customFields
          ? Object.entries(fields.customFields).map(([key, value]) => ({ key, value }))
          : [],
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('GHL API error:', res.status, err)
    } else {
      console.log('GHL contact created:', res.status)
    }
  } catch (err) {
    console.error('GHL API request failed:', err)
  }
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

  // 1. Create contact directly in GHL via API
  await createGHLContact({
    firstName,
    lastName,
    email,
    phone,
    source: 'Website Contact Form',
    tags: ['contact-form', 'website'],
    customFields: {
      event_date: eventDate || '',
      city: city || '',
      interest: interest || '',
      message: message || '',
    },
  })

  // 2. Notify business via Resend
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
        (city ? '<tr><td style="padding:6px 0;color:#6b7280;font-size:14px">City</td><td style="padding:6px 0;font-size:14px">' + city + '</td></tr>' : '') +
        (interest ? '<tr><td style="padding:6px 0;color:#6b7280;font-size:14px">Interested In</td><td style="padding:6px 0;font-size:14px">' + interest + '</td></tr>' : '') +
        '</table>' +
        (message ? '<div style="margin-top:16px;padding:12px;background:#fff;border:1px solid #e5e7eb;border-radius:6px"><p style="margin:0;font-size:14px;color:#374151">' + message + '</p></div>' : '') +
        '<div style="margin-top:20px;text-align:center">' +
        '<a href="sms:' + phone + '" style="display:inline-block;background:#f5a623;color:#fff;font-weight:700;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px">Text ' + firstName + ' Now</a>' +
        '</div></div></div>',
    })
  } catch (err) {
    console.error('Resend error:', err)
  }

  // Log both notify targets — GHL workflow routes to both
  console.log('Contact form lead — notify:', NOTIFY_PHONES.join(', '))

  return NextResponse.json({ ok: true })
}
