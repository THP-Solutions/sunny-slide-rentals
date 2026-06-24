import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')

interface BookingEmailParams {
  customerEmail: string
  customerName: string
  customerPhone?: string
  rentalName: string
  eventDate: string
  depositAmount: number
  totalAmount: number
  eventAddress?: string
  addonTables: number
  addonChairs: number
  addonTent: number
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function sendBookingConfirmation(params: BookingEmailParams) {
  const {
    customerEmail,
    customerName,
    customerPhone,
    rentalName,
    eventDate,
    depositAmount,
    totalAmount,
    eventAddress,
    addonTables,
    addonChairs,
    addonTent,
  } = params

  const formattedDate = formatDate(eventDate)
  const balance = totalAmount - depositAmount

  const addonsHtml = [
    addonTables > 0 ? `<li>${addonTables}x 8ft Folding Table${addonTables > 1 ? 's' : ''} (+$${addonTables * 10})</li>` : '',
    addonChairs > 0 ? `<li>${addonChairs}x White Folding Chair${addonChairs > 1 ? 's' : ''} (+$${addonChairs * 3})</li>` : '',
    addonTent > 0 ? `<li>1x 10×20 Pop-Up Tent (+$59)</li>` : '',
  ]
    .filter(Boolean)
    .join('')

  // ── Customer confirmation ────────────────────────────────────────────────
  await resend.emails.send({
    from: 'Sunny Slide Rentals <booking@sunnysliderentals.com>',
    to: customerEmail,
    subject: `🎉 Your ${rentalName} is booked for ${formattedDate}!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#0d2340;">
        <div style="background:#1a6fa8;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">🌞 Sunny Slide Rentals</h1>
        </div>
        <div style="background:#fff;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;">
          <h2 style="color:#0d2340;">You&apos;re all set, ${customerName}! 🎉</h2>
          <p style="color:#6b7280;">Your booking is confirmed. Here&apos;s a summary:</p>

          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr style="background:#f9fafb;">
              <td style="padding:10px 12px;font-weight:bold;">Rental</td>
              <td style="padding:10px 12px;">${rentalName}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;font-weight:bold;">Event Date</td>
              <td style="padding:10px 12px;">${formattedDate}</td>
            </tr>
            ${eventAddress ? `<tr style="background:#f9fafb;"><td style="padding:10px 12px;font-weight:bold;">Address</td><td style="padding:10px 12px;">${eventAddress}</td></tr>` : ''}
            ${addonsHtml ? `<tr><td style="padding:10px 12px;font-weight:bold;">Add-ons</td><td style="padding:10px 12px;"><ul style="margin:0;padding-left:16px;">${addonsHtml}</ul></td></tr>` : ''}
            <tr style="background:#f9fafb;">
              <td style="padding:10px 12px;font-weight:bold;">Deposit Paid</td>
              <td style="padding:10px 12px;color:#f5a623;font-weight:bold;">$${depositAmount}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;font-weight:bold;">Balance Due Day-of</td>
              <td style="padding:10px 12px;">$${balance}</td>
            </tr>
          </table>

          <div style="background:#fef3c7;border:1px solid #f5a623;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="margin:0;font-size:14px;color:#92400e;">
              ⚠️ <strong>Important:</strong> Our team will contact you within 24 hours to confirm delivery time and setup details. Please ensure you have a clear, flat area ready for setup.
            </p>
          </div>

          <p style="color:#6b7280;font-size:14px;">Questions? Text or email us anytime:</p>
          <p>
            📱 <a href="sms:+12392314477" style="color:#1a6fa8;">(239) 231-4477</a><br/>
            ✉️ <a href="mailto:booking@sunnysliderentals.com" style="color:#1a6fa8;">booking@sunnysliderentals.com</a>
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
          <p style="color:#9ca3af;font-size:12px;text-align:center;">
            © 2025 Sunny Slide Rentals · Cape Coral, Lehigh Acres &amp; Fort Myers, FL
          </p>
        </div>
      </div>
    `,
  })

  // ── Owner notification ───────────────────────────────────────────────────
  await resend.emails.send({
    from: 'Sunny Slide Bookings <booking@sunnysliderentals.com>',
    to: 'booking@sunnysliderentals.com',
    subject: `🆕 New booking: ${rentalName} — ${formattedDate}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#0d2340;">
        <h2>New Booking Received</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="background:#f9fafb;"><td style="padding:8px 12px;font-weight:bold;width:40%;">Customer</td><td style="padding:8px 12px;">${customerName}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;">Email</td><td style="padding:8px 12px;">${customerEmail}</td></tr>
          ${customerPhone ? `<tr style="background:#f9fafb;"><td style="padding:8px 12px;font-weight:bold;">Phone</td><td style="padding:8px 12px;">${customerPhone}</td></tr>` : ''}
          <tr><td style="padding:8px 12px;font-weight:bold;">Rental</td><td style="padding:8px 12px;">${rentalName}</td></tr>
          <tr style="background:#f9fafb;"><td style="padding:8px 12px;font-weight:bold;">Event Date</td><td style="padding:8px 12px;">${formattedDate}</td></tr>
          ${eventAddress ? `<tr><td style="padding:8px 12px;font-weight:bold;">Address</td><td style="padding:8px 12px;">${eventAddress}</td></tr>` : ''}
          ${addonTables > 0 ? `<tr style="background:#f9fafb;"><td style="padding:8px 12px;font-weight:bold;">Tables</td><td style="padding:8px 12px;">${addonTables}</td></tr>` : ''}
          ${addonChairs > 0 ? `<tr><td style="padding:8px 12px;font-weight:bold;">Chairs</td><td style="padding:8px 12px;">${addonChairs}</td></tr>` : ''}
          ${addonTent > 0 ? `<tr style="background:#f9fafb;"><td style="padding:8px 12px;font-weight:bold;">Tent</td><td style="padding:8px 12px;">Yes</td></tr>` : ''}
          <tr><td style="padding:8px 12px;font-weight:bold;">Total</td><td style="padding:8px 12px;font-weight:bold;">$${totalAmount}</td></tr>
          <tr style="background:#fef3c7;"><td style="padding:8px 12px;font-weight:bold;">Deposit Received</td><td style="padding:8px 12px;color:#f5a623;font-weight:bold;">$${depositAmount}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;">Balance Due</td><td style="padding:8px 12px;">$${balance}</td></tr>
        </table>
      </div>
    `,
  })
}
