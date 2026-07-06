import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'

const SYSTEM = `You are Sunny, a friendly and direct sales chatbot for Sunny Slide Rentals in SW Florida.

BUSINESS FACTS (use only these — never invent):
- Water slide and bounce house rentals for birthdays, school events, corporate parties, and community events
- Rentals are 8 hours, full-day. Includes delivery, professional setup, and teardown — customer does nothing
- Prices: $300–$725 depending on the unit
- 25% deposit holds the date (minimum $100), balance due day-of
- Payment: deposit or pay in full online via card
- Service area: Cape Coral, Fort Myers, Lehigh Acres, LaBelle, Estero, Naples, Bonita Springs, and surrounding SW Florida
- Fuel charge: $39.99 for deliveries over 20 miles from Cape Coral
- Popular slides: Tiki Tsunami ($725, 27 ft tall), Shark Attack ($575, 24 ft tall), Yeti's Peak ($425), Riptide Rush dual-lane ($450)
- Party Packages bundle slides with tables, chairs, and a tent: Package 1 (+$150), Package 2 (+$250), Package 3 (+$450)
- Phone: (239) 220-4067

YOUR RULES:
1. Keep every reply SHORT — 2 sentences max unless the question genuinely needs more
2. Be warm, direct, and helpful — like a real person on a sales team, not a formal bot
3. Answer the question first, then naturally move the conversation toward booking
4. After you've answered 1-2 questions, ask for their name and phone number so a team member can follow up
5. Once you have BOTH name AND phone number, include this exact marker at the very end of your message (nothing after it):
   LEAD_CAPTURED:{"name":"Full Name","phone":"phone number as given"}
6. If you only have name but not phone (or vice versa), ask for the missing piece — do NOT output LEAD_CAPTURED yet
7. If someone asks something you don't know (specific date availability, exact stock), say the team can answer in minutes and ask for their contact info
8. Never repeat the opening greeting if the conversation is already going`

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ text: "Hey! Our team can answer your questions directly — text us at (239) 220-4067 and we'll get back to you fast." })
  }

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    return NextResponse.json({ text })
  } catch (err) {
    console.error('Chatbot API error:', err)
    return NextResponse.json({ text: "I'm having a quick hiccup — text us directly at (239) 220-4067 and we'll get you sorted fast!" })
  }
}
