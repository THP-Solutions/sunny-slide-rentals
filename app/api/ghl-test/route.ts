import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.GHL_API_KEY
  const locationId = process.env.GHL_LOCATION_ID

  if (!apiKey) {
    return NextResponse.json({
      status: 'ERROR',
      problem: 'GHL_API_KEY is NOT set in Vercel',
      fix: 'Add GHL_API_KEY in Vercel → Settings → Environment Variables',
    }, { status: 500 })
  }

  if (!locationId) {
    return NextResponse.json({
      status: 'ERROR',
      problem: 'GHL_LOCATION_ID is NOT set in Vercel',
      fix: 'Add GHL_LOCATION_ID in Vercel → Settings → Environment Variables',
    }, { status: 500 })
  }

  const headers = {
    'Authorization': 'Bearer ' + apiKey,
    'Version': '2021-07-28',
    'Content-Type': 'application/json',
  }

  // Test 1: Fetch the sub-account directly by location ID
  try {
    const locRes = await fetch(
      `https://services.leadconnectorhq.com/locations/${locationId}`,
      { headers }
    )
    const locData = await locRes.json()

    if (!locRes.ok) {
      return NextResponse.json({
        status: 'ERROR',
        problem: `GHL returned ${locRes.status} when fetching location`,
        ghl_response: locData,
        api_key_prefix: apiKey.substring(0, 12) + '...',
        location_id: locationId,
        fix: locRes.status === 401
          ? 'API key is invalid or expired — regenerate it in GHL Private Integrations'
          : locRes.status === 403
          ? 'API key does not have access to this location — check scopes in GHL Private Integrations'
          : 'Check GHL API key and location ID',
      }, { status: 500 })
    }

    // Test 2: Try fetching recent contacts to verify full read access
    const contactsRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/?locationId=${locationId}&limit=3`,
      { headers }
    )
    const contactsData = await contactsRes.json()

    return NextResponse.json({
      status: 'OK',
      message: '✅ GHL credentials are working correctly',
      location: {
        id: locData?.location?.id ?? locationId,
        name: locData?.location?.name ?? locData?.name ?? 'unknown',
        email: locData?.location?.email ?? locData?.email ?? '',
        phone: locData?.location?.phone ?? locData?.phone ?? '',
      },
      contacts_check: contactsRes.ok
        ? `✅ Can read contacts (${contactsData?.contacts?.length ?? 0} returned)`
        : `⚠️ Contacts endpoint returned ${contactsRes.status}`,
      api_key_prefix: apiKey.substring(0, 12) + '...',
      location_id: locationId,
      next_step: 'Submit the chatbot lead capture or contact form — it should now appear in GHL',
    })
  } catch (err) {
    return NextResponse.json({
      status: 'ERROR',
      problem: 'Could not reach GHL API — network error',
      error: String(err),
    }, { status: 500 })
  }
}
