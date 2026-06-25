import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.GHL_API_KEY

  if (!apiKey) {
    return NextResponse.json({
      status: 'ERROR',
      problem: 'GHL_API_KEY environment variable is NOT set in Vercel',
      fix: 'Go to Vercel → your project → Settings → Environment Variables → add GHL_API_KEY',
    }, { status: 500 })
  }

  // Test the GHL API with a real contact lookup
  try {
    const res = await fetch('https://services.leadconnectorhq.com/contacts/?limit=1', {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({
        status: 'ERROR',
        problem: 'GHL API key is set but the API returned an error',
        ghl_status: res.status,
        ghl_response: data,
        fix: res.status === 401
          ? 'API key is invalid or expired — generate a new PIT in GHL Settings → Integrations'
          : 'Check GHL API key permissions',
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'OK',
      message: 'GHL API key is valid and working',
      api_key_prefix: apiKey.substring(0, 12) + '...',
      contacts_returned: (data.contacts ?? []).length,
    })
  } catch (err) {
    return NextResponse.json({
      status: 'ERROR',
      problem: 'Network error reaching GHL API',
      error: String(err),
    }, { status: 500 })
  }
}
