import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')

function buildEmail(fields: Record<string, string>) {
  const { name, email, phone, eventDate, city, interest, message } = fields
  const firstName = name.split(' ')[0]
  const rows = [
    ['Name', name],
    ['Email', `<a href="mailto:${email}">${email}</a>`],
    ['Phone', `<a href="tel:${phone}">${phone}</a>`],
    ...(eventDate ? [['Event Date', eventDate]] : []),
    ...(city ? [['City', city]] : []),
    ...(interest ? [['Interested In', interest]] : []),
  ]
    .map(([label, val]) =>
      `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;width:120px">${label}</td>` +
      `<td style="padding:6px 0;font-size:14px">${val}</td></tr>`,
    )
    .join('')

  return (
    `<div style="font-family:sans-serif;max-width:520px;margin:0 auto">` +
    `<div style="background:#1a6fa8;padding:20px 24px;border-radius:8px 8px 0 0">` +
    `<h2 style="color:#fff;margin:0;font-size:18px">New Website Inquiry</h2></div>` +
    `<div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">` +
    `<table style="width:100%;border-collapse:collapse">${rows}</table>` +
    (message
      ? `<div style="margin-top:16px;padding:12px;background:#fff;border:1px solid #e5e7eb;border-radius:6px">` +
        `<p style="margin:0;font-size:14px;color:#374151">${message}</p></div>`
      : '') +
    `<div style="margin-top:20px;text-align:center">` +
    `<a href="sms:${phone}" style="display:inline-block;background:#f5a623;color:#fff;font-weight:700;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px">` +
    `Text ${firstName} Now</a></div></div></div>`
  )
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, eventDate, city, interest, message } = body

  if (!name || !email || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 1. Forward to GHL
  const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL
  if (ghlWebhookUrl) {
    try {
      const nameParts = name.trim().split(' ')
      await fetch(ghlWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: nameParts[0] || name,
          lastName: nameParts.slice(1).join(' ') || '',
          email,
          phone,
          source: 'Website Contact Form',
          tags: ['contact-form', 'website'],
          customData: { eventDate, city, interest, message },
        }),
      })
    } catch (err) {
      console.error('GHL webhook error:', err)
    }
  }

  // 2. Notify business via email
  try {
    await resend.emails.send({
      from: 'Sunny Slide Rentals <noreply@sunnysliderentals.com>',
      to: process.env.CONTACT_EMAIL || 'booking@sunnysliderentals.com',
      subject: 'New Inquiry from ' + name,
      html: buildEmail({ name, email, phone, eventDate: eventDate || '', city: city || '', interest: interest || '', message: message || '' }),
    })
  } catch (err) {
    console.error('Resend error:', err)
  }

  return NextResponse.json({ ok: true })
}
