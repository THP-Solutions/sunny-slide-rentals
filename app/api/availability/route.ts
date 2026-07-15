import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getRentalById } from '@/lib/rentals'
import { checkGhlAvailability } from '@/lib/ghl'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rentalId = searchParams.get('rentalId')
  const date = searchParams.get('date')

  if (!rentalId || !date) {
    return NextResponse.json({ error: 'Missing rentalId or date' }, { status: 400 })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
  }

  const rental = getRentalById(rentalId)

  // --- Primary: GHL calendar (if calendarId is set) ---
  if (rental?.calendarId) {
    try {
      const available = await checkGhlAvailability(rental.calendarId, date)
      return NextResponse.json({ available, source: 'ghl' })
    } catch (err) {
      console.warn('GHL availability check failed, falling back to Supabase:', err)
      // Fall through to Supabase
    }
  }

  // --- Fallback: Supabase bookings table ---
  const supabase = createServiceClient()
  const { count, error } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('rental_id', rentalId)
    .eq('event_date', date)
    .in('status', ['confirmed', 'pending'])

  if (error) {
    console.error('Supabase availability check error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ available: (count ?? 0) === 0, source: 'supabase' })
}
