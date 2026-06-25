import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const GHL_BASE = 'https://services.leadconnectorhq.com'
const GHL_HEADERS = (key: string) => ({
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + key,
  Version: '2021-07-28',
})

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
      body: JSON.stringify({
        type: 'Activity',
        conversationId,
        message,
      }),
    })
  } catch { /* non-critical */ }
}

export async function POST(req: NextRequest) {
  const { name, phone, source } = await req.json()

  if (!name || !phone) {
    return NextResponse.json({ error: 'Missing name or phone' }, { status: 400 })
  }

  const apiKey = process.env.GHL_API_KEY
  if (!apiKey) {
    console.warn('GHL_API_KEY not set — chatbot lead not sent:', { name, phone })
    return NextResponse.json({ ok: true })
  }

  const nameParts = name.trim().split(' ')
  const firstName = nameParts[0] || name
  const lastName = nameParts.slice(1).join(' ') || ''

  try {
    // 1. Create contact
    const contactRes = await fetch(`${GHL_BASE}/contacts/`, {
      method: 'POST',
      headers: GHL_HEADERS(apiKey),
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        source: source || 'Sunny Chatbot',
        tags: ['chatbot-lead', 'website'],
      }),
    })

    const contactData = await contactRes.json()
    const contactId: string | undefined = contactData?.contact?.id
    const locationId: string | undefined = contactData?.contact?.locationId

    if (!contactRes.ok) {
      console.error('GHL contact error (chat-lead):', contactRes.status, contactData)
    }

    // 2. Create conversation so it appears in GHL Conversations tab
    if (contactId && locationId) {
      const conversationId = await createOrGetConversation(apiKey, locationId, contactId)
      if (conversationId) {
        await addConversationNote(
          apiKey,
          conversationId,
          `🤖 Chatbot Lead\nName: ${name}\nPhone: ${phone}\nSource: ${source || 'Sunny Chatbot'}\nReceived via website chatbot — follow up by text.`
        )
      }
    }
  } catch (err) {
    console.error('GHL API request failed (chat-lead):', err)
  }

  return NextResponse.json({ ok: true })
}
