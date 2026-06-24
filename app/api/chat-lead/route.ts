import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { name, phone, source } = await req.json()

  if (!name || !phone) {
    return NextResponse.json({ error: 'Missing name or phone' }, { status: 400 })
  }

  const apiKey = process.env.GHL_API_KEY
  if (!apiKey) {
    console.warn('GHL_API_KEY not set — chatbot lead not sent to GHL:', { name, phone })
    return NextResponse.json({ ok: true })
  }

  const nameParts = name.trim().split(' ')
  const firstName = nameParts[0] || name
  const lastName = nameParts.slice(1).join(' ') || ''

  try {
    const res = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
        Version: '2021-07-28',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        source: source || 'Sunny Chatbot',
        tags: ['chatbot-lead', 'website'],
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('GHL API error (chat-lead):', res.status, err)
    }
  } catch (err) {
    console.error('GHL API request failed (chat-lead):', err)
  }

  return NextResponse.json({ ok: true })
}
