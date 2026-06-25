import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.GHL_API_KEY

  if (!apiKey) {
    return NextResponse.json({
      status: 'ERROR',
      problem: 'GHL_API_KEY environment variable is NOT set in Vercel',
      fix: 'Vercel → Project → Settings → Environment Variables → add GHL_API_KEY',
    }, { status: 500 })
  }

  const headers = {
    'Authorization': 'Bearer ' + apiKey,
    'Version': '2021-07-28',
    'Content-Type': 'application/json',
  }

  // Try to find accessible locations
  try {
    const locRes = await fetch('https://services.leadconnectorhq.com/locations/search?name=sunny', { headers })
    const locData = await locRes.json()

    const locations = locData?.locations ?? []

    if (locations.length === 0) {
      // try broader search
      const locRes2 = await fetch('https://services.leadconnectorhq.com/locations/search?name=slide', { headers })
      const locData2 = await locRes2.json()
      locations.push(...(locData2?.locations ?? []))
    }

    return NextResponse.json({
      status: locations.length > 0 ? 'FOUND_LOCATIONS' : 'NO_LOCATIONS',
      instruction: 'Copy the id of the sunnysliderentals location below, then add GHL_LOCATION_ID=<that id> in Vercel env vars',
      locations: locations.map((l: { id: string; name: string; email?: string }) => ({
        id: l.id,
        name: l.name,
        email: l.email,
      })),
      api_key_prefix: apiKey.substring(0, 12) + '...',
      location_id_set: process.env.GHL_LOCATION_ID || 'NOT SET',
    })
  } catch (err) {
    return NextResponse.json({
      status: 'ERROR',
      problem: 'Could not reach GHL API',
      error: String(err),
    }, { status: 500 })
  }
}
