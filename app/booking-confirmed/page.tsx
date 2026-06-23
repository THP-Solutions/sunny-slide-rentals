import Link from 'next/link';

export default function BookingConfirmedPage() {
  return (
    <main className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        {/* Big checkmark */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold text-[#0d2340] mb-3">You&apos;re Booked! 🎉</h1>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          Your deposit has been received and your date is secured. Check your email for a
          confirmation receipt — our team will reach out within 24 hours to confirm delivery
          details.
        </p>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 text-left space-y-4">
          <div className="flex items-start gap-4">
            <span className="text-2xl mt-0.5">📱</span>
            <div>
              <p className="font-bold text-[#0d2340] text-sm">Questions? Text us anytime</p>
              <a
                href="sms:+12392314477"
                className="text-[#1a6fa8] font-semibold text-sm hover:underline"
              >
                (239) 231-4477
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-2xl mt-0.5">✉️</span>
            <div>
              <p className="font-bold text-[#0d2340] text-sm">Check your inbox</p>
              <p className="text-gray-500 text-sm">
                A full booking confirmation was sent to your email.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-2xl mt-0.5">🚚</span>
            <div>
              <p className="font-bold text-[#0d2340] text-sm">What happens next?</p>
              <p className="text-gray-500 text-sm">
                We&apos;ll confirm your delivery window and setup time. Remaining balance is
                due on the day of your event.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/rentals"
            className="bg-[#1a6fa8] hover:bg-[#0d2340] text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
          >
            Browse More Rentals
          </Link>
          <a
            href="sms:+12392314477"
            className="border-2 border-[#1a6fa8] text-[#1a6fa8] hover:bg-blue-50 font-bold px-8 py-3.5 rounded-xl transition-colors"
          >
            Text Us
          </a>
        </div>
      </div>
    </main>
  );
}
