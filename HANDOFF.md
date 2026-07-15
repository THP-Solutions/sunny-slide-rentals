# Sunny Slide Rentals — Developer Handoff

**Last updated:** 2026-07-14  
**Repo:** https://github.com/THP-Solutions/sunny-slide-rentals  
**Live site:** https://sunnysliderentals.com  
**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Supabase · Stripe · Vercel  

---

## 🔴 BLOCKING ISSUES (live site broken)

### 1. Availability check returns 500
**Symptom:** `/api/availability` returns 500 → "Could not check — try again"  
**Cause:** `SUPABASE_SERVICE_ROLE_KEY` not set in Vercel (falls back to placeholder string)  
**Fix:** Vercel Dashboard → Project → Settings → Environment Variables → Add:
- Key: `SUPABASE_SERVICE_ROLE_KEY`
- Value: copy from Supabase Dashboard → Settings → API → `service_role` (secret key)
- Redeploy after adding.

### 2. Stripe webhooks failing (67 failures since June 25)
**Symptom:** Orders may not be confirmed after payment  
**Cause:** `STRIPE_WEBHOOK_SECRET` in Vercel doesn't match live endpoint signing secret  
**Fix:** Stripe Dashboard → Developers → Webhooks → click the endpoint → copy "Signing secret" (starts with `whsec_`) → update `STRIPE_WEBHOOK_SECRET` in Vercel → Redeploy.

### 3. AI Chatbot not responding
**Cause:** `ANTHROPIC_API_KEY` not set in Vercel  
**Fix:** Add `ANTHROPIC_API_KEY` to Vercel env vars (get from console.anthropic.com)

### 4. Party package images broken (400 error)
**Cause:** `public/images/party-tent.jpeg` does not exist  
**Fix:** Save either of the white party tent photos Kyle sent to `public/images/party-tent.jpeg`, then `git add -A && git commit -m "add party tent image" && git push`

---

## ✅ COMPLETED THIS SESSION

| What | Detail |
|------|--------|
| Tiki Tsunami hidden | `hidden: true` in lib/rentals.ts — removed from browse grids |
| Freedom's Fury added | id: `freedoms-fury`, $700, 25% deposit, images freedoms-fury-1.jpeg → 6.jpeg |
| Gamefly renamed | Formerly "Riptide Rush Dual Lane" → id: `gamefly`, name: Gamefly, $375 |
| Rip Curl added | NEW unit, id: `rip-curl`, $350, dims 37'L×19'W×19'H, image: rip-curl.jpeg |
| Tent add-on price | $59 → $259 (lib/rentals.ts + lib/cart.ts) |
| Party pkg images | both point to `/images/party-tent.jpeg` (file still needs to be saved) |
| Phone number | (239) 220-4067 → Kyle's (239) 634-9809 across ALL files |
| Availability fix | Route now uses `createServiceClient()` (service role, bypasses Supabase RLS) |
| RentalDetail.tsx | Added `if (!res.ok) { setAvailability('error'); return; }` check |
| All changes pushed | Commit `ca91f1d` on main |

---

## 📋 STILL PENDING

- [ ] **Add 3 Vercel env vars** (see Blocking Issues above) + Redeploy
- [ ] **Save party-tent.jpeg** to `public/images/` and push
- [ ] **Gamefly image** — still using `riptide-rush-dual-lane.jpg` as placeholder. Get real Gamefly photo from Kyle, save as `public/images/gamefly.jpeg`, update `lib/rentals.ts` line ~93: `image: '/images/gamefly.jpeg'`
- [ ] **10×30 tent as add-on** — Kyle mentioned it. Price TBD. Add to `ADDONS` array in `lib/rentals.ts` and `calcAddonsTotal()` in `lib/cart.ts`
- [ ] **Freedom's Fury calendarId** — currently `''` (empty). Get the GHL calendar ID from Kyle and add it to lib/rentals.ts
- [ ] **Rip Curl calendarId** — also empty `''`. Same as above.
- [ ] **Test Stripe flow end-to-end** after fixing webhook secret

---

## 🏗 ARCHITECTURE

```
app/
  page.tsx                    ← Homepage
  rentals/
    page.tsx                  ← Browse all rentals
    RentalsClient.tsx         ← Client filter/grid
    [id]/
      page.tsx                ← SSR rental detail page
      RentalDetail.tsx        ← Client booking form (large file, ~600+ lines)
  api/
    availability/route.ts     ← GET /api/availability?rentalId=&date=  (uses service client)
    checkout/route.ts         ← POST /api/checkout  (creates Stripe session)
    chatbot/route.ts          ← POST /api/chatbot  (Claude Haiku AI chat)
    chat-lead/route.ts        ← POST /api/chat-lead  (saves lead from chatbot)
    webhooks/stripe/route.ts  ← POST stripe webhooks  (confirms bookings)
    contact/route.ts          ← POST contact form
  booking-confirmed/page.tsx  ← Post-payment confirmation page
  contact/page.tsx
  faq/FAQClient.tsx
  service-areas/page.tsx

lib/
  rentals.ts     ← ALL rental data, ADDONS, PARTY_PACKAGES arrays
  cart.ts        ← calcAddonsTotal(), calcTotal(), calcDeposit(), baseDeposit()
  supabase.ts    ← createClient() (anon) + createServiceClient() (service role, server only)
  email.ts       ← Email templates (uses Kyle's number)

components/
  ChatBot.tsx    ← AI chatbot UI, parses LEAD_CAPTURED signal
  Navbar.tsx
  Footer.tsx

public/images/   ← All rental photos live here
```

---

## ⚠️ CRITICAL GOTCHAS

### File writes on Windows mount
**NEVER use Write/Edit tools for files >100 lines** — the Windows-mounted filesystem truncates them silently.  
**Always use:** `python3 -c "open('file','w').write(content)"` via Bash tool instead.

### Supabase RLS
Anon client (`createClient()`) is blocked by Row Level Security on the `bookings` table.  
Server routes that read bookings MUST use `createServiceClient()` from `lib/supabase.ts`.  
The `SUPABASE_SERVICE_ROLE_KEY` env var must be set in Vercel (not just locally).

### Git index.lock
The sandbox shell can't delete `.git/index.lock`. When git commit fails in the sandbox, have the user run in PowerShell:
```powershell
Remove-Item "C:\Users\rodri\Desktop\sunny-slide-rentals\.git\index.lock" -Force -ErrorAction SilentlyContinue
git add -A
git commit -m "message"
git push
```

### Large file edits in bash
Bash path: `C:\Users\rodri\Desktop\sunny-slide-rentals` → `/sessions/tender-cool-maxwell/mnt/sunny-slide-rentals/`

---

## 🗄 SUPABASE

- **Project URL:** `NEXT_PUBLIC_SUPABASE_URL` (already in Vercel)
- **Anon key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already in Vercel)
- **Service role key:** `SUPABASE_SERVICE_ROLE_KEY` ← **MISSING from Vercel** (root cause of 500)
- **Table:** `bookings` — columns include `rental_id`, `event_date`, `status` ('confirmed'|'pending'|'cancelled')
- RLS blocks anon reads. Service role bypasses RLS.

---

## 💳 STRIPE

- Checkout session created in `app/api/checkout/route.ts`
- Webhook handler in `app/api/webhooks/stripe/route.ts` — marks booking confirmed
- `STRIPE_WEBHOOK_SECRET` in Vercel must match the signing secret for the live endpoint in Stripe Dashboard
- Deposit logic: `Math.max(100, Math.ceil(totalAmount * 0.25))` — minimum $100

---

## 🤖 AI CHATBOT

- Model: `claude-haiku-4-5-20251001` via `@anthropic-ai/sdk`
- System prompt in `app/api/chatbot/route.ts` — references Kyle's number (239) 634-9809
- Lead capture: AI appends `LEAD_CAPTURED:{"name":"...","phone":"..."}` to response
- `components/ChatBot.tsx` parses this with regex, strips it from display, calls `/api/chat-lead`
- Needs `ANTHROPIC_API_KEY` in Vercel to work

---

## 📋 RENTAL PRICING (current)

| Unit | Price | Deposit |
|------|-------|---------|
| Freedom's Fury | $700 | $175 |
| Shark Attack Splash | $500 | $125 |
| Yeti's Peak | $400 | $100 |
| Gamefly (formerly Riptide Rush) | $375 | $94 |
| Rip Curl (new unit) | $350 | $88 |
| Baja Blast Hybrid | $350 | $88 |
| Cayman's Crush | $350 | $88 |
| Palm Paradise Combo | $325 | $82 |
| Akua Falls Dual Lane | $250 | $63 |
| Goombay Splash Combo | $225 | $57 |
| Tent+Tables+Chairs Package | $325 | $82 |
| Big Day Party Package | $550 | $138 |

**Hidden (not shown in browse):** Tiki Tsunami ($650), Generator ($75)

**Add-ons:** Tables $10ea · Chairs $3ea · 16×32 Frame Tent $259 flat · Generator $75 flat

---

## 📞 CONTACT

- **Main number (Kyle):** (239) 634-9809  
- **SMS link format:** `tel:+12396349809` / `sms:+12396349809`  
- **Email:** Updated in lib/email.ts, app/contact/page.tsx, etc.

