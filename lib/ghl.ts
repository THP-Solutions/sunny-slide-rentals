// GHL Calendar Integration Helpers

const GHL_BASE = 'https://services.leadconnectorhq.com'

function ghlHeaders() {
  return {
    'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
    'Version': '2021-07-28',
    'Content-Type': 'application/json',
  }
}

/**
 * Check if a GHL calendar has any confirmed/new appointments on a given date.
 * Returns true = available, false = taken.
 * Throws if the API call fails (caller should catch and fall back to Supabase).
 */
export async function checkGhlAvailability(
  calendarId: string,
  date: string, // YYYY-MM-DD
): Promise<boolean> {
  const locationId = process.env.GHL_LOCATION_ID
  if (!locationId || !process.env.GHL_API_KEY) {
    throw new Error('GHL env vars not set')
  }

  // Cover the full calendar day in Eastern Time (UTC-4 in summer / UTC-5 winter)
  // Use UTC midnight boundaries — wide enough to catch any appointment that day
  const startDate = new Date(`${date}T00:00:00.000Z`).getTime()
  const endDate   = new Date(`${date}T23:59:59.999Z`).getTime()

  const url =
    `${GHL_BASE}/calendars/events/appointments` +
    `?calendarId=${calendarId}` +
    `&locationId=${locationId}` +
    `&startDate=${startDate}` +
    `&endDate=${endDate}`

  const res = await fetch(url, { headers: ghlHeaders() })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GHL appointments API ${res.status}: ${text}`)
  }

  const data = await res.json()
  // GHL returns { events: [...] }
  const events: Array<{ appointmentStatus?: string }> = data?.events ?? []

  // Any non-cancelled appointment means the slot is taken
  const blocked = events.filter(
    (e) => e.appointmentStatus !== 'cancelled',
  )
  return blocked.length === 0
}

/**
 * Find an existing GHL contact by email, or create one if not found.
 * Returns the contactId string.
 */
export async function getOrCreateGhlContact(
  email: string,
  name: string,
  phone: string,
): Promise<string> {
  const locationId = process.env.GHL_LOCATION_ID!

  // Try to find by email first
  const searchRes = await fetch(
    `${GHL_BASE}/contacts/?locationId=${locationId}&email=${encodeURIComponent(email)}`,
    { headers: ghlHeaders() },
  )
  if (searchRes.ok) {
    const searchData = await searchRes.json()
    const contacts: Array<{ id: string }> = searchData?.contacts ?? []
    if (contacts.length > 0) return contacts[0].id
  }

  // Create new contact
  const [firstName, ...rest] = name.trim().split(' ')
  const lastName = rest.join(' ') || ''

  const createRes = await fetch(`${GHL_BASE}/contacts/`, {
    method: 'POST',
    headers: ghlHeaders(),
    body: JSON.stringify({
      locationId,
      email,
      phone,
      firstName,
      lastName,
    }),
  })
  if (!createRes.ok) {
    const text = await createRes.text()
    throw new Error(`GHL create contact ${createRes.status}: ${text}`)
  }
  const createData = await createRes.json()
  return createData?.contact?.id ?? createData?.id
}

/**
 * Create a GHL appointment for a confirmed booking.
 * startTime / endTime are ISO-8601 strings.
 */
export async function createGhlAppointment(params: {
  calendarId: string
  contactId: string
  title: string
  eventDate: string // YYYY-MM-DD
  notes?: string
}): Promise<void> {
  const locationId = process.env.GHL_LOCATION_ID!

  // Schedule 8 AM – 5 PM Eastern (use -04:00 for EDT; close enough for Florida summer)
  const startTime = `${params.eventDate}T08:00:00-04:00`
  const endTime   = `${params.eventDate}T17:00:00-04:00`

  const res = await fetch(`${GHL_BASE}/calendars/events/appointments`, {
    method: 'POST',
    headers: ghlHeaders(),
    body: JSON.stringify({
      calendarId: params.calendarId,
      locationId,
      contactId: params.contactId,
      title: params.title,
      startTime,
      endTime,
      appointmentStatus: 'confirmed',
      notes: params.notes ?? '',
      ignoreDateRange: false,
      toNotify: true,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GHL create appointment ${res.status}: ${text}`)
  }
}
