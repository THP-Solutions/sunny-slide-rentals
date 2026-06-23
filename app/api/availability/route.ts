import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'


export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rentalId = searchParams.get('rentalId')
  const date = searchParams.get('date')

  if (!rentalId || !date) {
    return NextResponse.json({ error: 'Missing rentalId or date' }, { status: 400 })
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
  }

  // Check if there is already a confirmed or pending booking for this rental+date
  const { count, error } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('rental_id', rentalId)
    .eq('event_date', date)
    .in('status', ['confirmed', 'pending'])

  if (error) {
    console.error('Availability check error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ available: (count ?? 0) === 0 })
}
