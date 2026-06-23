import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { name, phone, source } = await req.json()

  if (!name || !phone) {
    return NextResponse.json({ error: 'Missing name or phone' }, { status: 400 })
  }

  const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL
  if (ghlWebhookUrl) {
    try {
      const nameParts = name.trim().split(' ')
      const firstName = nameParts[0] || name
      const lastName = nameParts.slice(1).join(' ') || ''

      await fetch(ghlWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          source: source || 'Sunny Chatbot',
          tags: ['chatbot-lead', 'website'],
          customData: {
            capturedBy: 'Sunny Bot',
            website: 'sunnysliderentals.com',
          },
        }),
      })
    } catch (err) {
      console.error('GHL webhook error (chat-lead):', err)
    }
  } else {
    console.warn('GHL_WEBHOOK_URL not set — chatbot lead not forwarded:', { name, phone })
  }

  return NextResponse.json({ ok: true })
}
