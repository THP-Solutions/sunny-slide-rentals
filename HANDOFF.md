# Sunny Slide Rentals — Developer Handoff

**Date:** June 25, 2026  
**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Stripe · Supabase · Resend · GoHighLevel

---

## 1. LIVE STATUS

| Item | Status |
|------|--------|
| Domain | sunnysliderentals.com → Vercel |
| GHL API | WORKING confirmed |
| GHL Location ID | gFXKSvk8RdfoOYbhnUJa |
| Stripe | Live keys active |
| Chatbot lead flow | Full flow working |
| Contact form GHL | Wired |
| Resend emails | Active |
| Fuel charge auto-apply | Fixed |
| Pay in Full amount | Fixed |
| Address autofill dropdown | Fixed |

---

## 2. ENVIRONMENT VARIABLES

Set in both .env.local and Vercel → Settings → Environment Variables.

```
NEXT_PUBLIC_SUPABASE_URL=https://omstlbimsbpkvrmgkhte.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51TkDh3...
STRIPE_SECRET_KEY=sk_live_51TkDh3...
STRIPE_WEBHOOK_SECRET=whsec_v7OKtq...

RESEND_API_KEY=re_DzceWWWW...

NEXT_PUBLIC_SITE_URL=https://sunnysliderentals.com

GHL_API_KEY=pit-0535ed77-8342-45c5-bb72-13cb38f7e954
GHL_LOCATION_ID=gFXKSvk8RdfoOYbhnUJa

CONTACT_EMAIL=booking@sunnysliderentals.com
```

GHL_LOCATION_ID was the root cause of all GHL 403 errors. Sub-account PIT tokens MUST include locationId in every request body. Without it every call returns 403.

---

## 3. FILE MAP

```
app/
  page.tsx                    Homepage
  layout.tsx                  Root layout: Navbar + ChatBot + Footer
  rentals/[id]/
    RentalDetail.tsx          LARGE FILE - booking UI, address, fuel, Stripe
  contact/page.tsx            Contact page
  booking-confirmed/page.tsx  Post-payment success
  waiver/page.tsx             Digital waiver
  api/
    checkout/route.ts         Stripe session creation
    contact/route.ts          Contact form -> GHL + Resend email
    chat-lead/route.ts        Chatbot lead -> GHL + conversation note
    ghl-test/route.ts         Diagnostic endpoint
    webhooks/stripe/route.ts  Stripe webhook

components/
  ChatBot.tsx                 LARGE FILE - chatbot + lead flow
  ContactForm.tsx
  Navbar.tsx
  Footer.tsx
  RentalRow.tsx               Netflix horizontal scroll row

lib/
  rentals.ts                  All products + pricing
  cart.ts                     Cart context
  email.ts                    Resend helpers
  supabase.ts                 Supabase client
```

---

## 4. CRITICAL: WRITING LARGE FILES

The Windows-mounted filesystem truncates large files when using Write/Edit tools directly. For any file over 100 lines (RentalDetail.tsx, ChatBot.tsx, route files), always write via Python in bash:

```bash
python3 - << 'PYEOF'
content = r"""...file content..."""
with open('/sessions/tender-cool-maxwell/mnt/sunny-slide-rentals/path/to/file.ts', 'w') as f:
    f.write(content)
PYEOF
```

Bash path: C:\Users\rodri\Desktop\sunny-slide-rentals maps to /sessions/tender-cool-maxwell/mnt/sunny-slide-rentals/

---

## 5. ALL BUGS FIXED THIS SESSION

### Bug 1 - Pay in Full charged wrong amount
Symptom: Party Package 3 (+$450) + Shark Attack ($575) = should be $1,025 but Stripe charged $575.
Root cause: partyBundle arrived in the checkout body but was never added to addonsTotal.
File: app/api/checkout/route.ts
Fix:
```
const bundleCharge = partyBundle > 0 ? Number(partyBundle) : 0
const addonsTotal = addonTables * 10 + addonChairs * 3 + addonTent * 59 +
  addonGenerator * 75 + fuelCharge + bundleCharge
```

### Bug 2 - Fuel surcharge not auto-applying on paste
Symptom: Pasting an address >20 miles away did not trigger the $39.99 fuel charge.
Root cause: handleAddressBlur had if (distanceMiles === null) guard. On paste, distanceMiles was already set, so geocoding was skipped.
File: app/rentals/[id]/RentalDetail.tsx
Fix: Removed the null guard. Blur always re-geocodes when address >= 10 chars.

### Bug 3 - Address suggestion dropdown not autofilling on click
Symptom: Clicking a Nominatim suggestion closed the dropdown without filling the address field.
Root cause: Browser event order - onBlur fires before onClick. The blur handler called setShowSuggestions(false) before the click registered, so click was lost.
File: app/rentals/[id]/RentalDetail.tsx
Fix: Changed from onClick to onMouseDown + e.preventDefault(). preventDefault stops blur from firing while mouse button is held.
```
onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
```

### Bug 4 - Chatbot stored "yes" as the lead name
Symptom: GHL contacts showed name = "yes".
Root cause: "Let's do it!" button called handleLeadInput('yes'). Inside handleLeadInput, when leadStep === 'offered', first action was setLeadName(input) -- storing "yes".
File: components/ChatBot.tsx
Fix: Button now directly calls setLeadStep('askName') and pushes the name prompt. Never routes through handleLeadInput.
IMPORTANT: Do not change this. The "Let's do it!" button must NOT call handleLeadInput.

### Bug 5 - Phone number triggered age detection
Symptom: Entering "(929) 399-3114" caused chatbot to respond with age handler instead of continuing lead flow. "14" in patterns matched "3114".
File: components/ChatBot.tsx
Fix: Age patterns changed to space-padded: ' 14 ', ' 5 ', ' 10 ' etc. Input is padded before matching:
```
const lower = ' ' + input.toLowerCase().trim() + ' '
```

### Bug 6 - Lead capture fired too early
Symptom: "Before you go" prompt fired after only 2 exchanges, interrupting mid-conversation.
Root cause: buyingIntent threshold was 2.
File: components/ChatBot.tsx
Fix: Threshold raised to 3 buying-intent messages before offer triggers.

### Bug 7 - GHL 403: contacts and conversations not appearing
Symptom: No contacts or conversations in GHL after chatbot or form submissions.
Error: {"statusCode":403,"message":"The token does not have access to this location."}
Root cause: Sub-account PIT token requires locationId in the request body for every API call. It was missing entirely. Without it GHL rejects every request even though the token is valid.
Files: app/api/chat-lead/route.ts and app/api/contact/route.ts
Fix: Both routes now read process.env.GHL_LOCATION_ID as envLocationId and include it in the contact creation body:
```
const envLocationId = process.env.GHL_LOCATION_ID
// in request body:
...(envLocationId ? { locationId: envLocationId } : {}),
// locationId for conversation creation falls back:
const locationId = contactData?.contact?.locationId ?? envLocationId
```

### Bug 8 - TypeScript duplicate variable error
Symptom: Build error TS2451: Cannot redeclare block-scoped variable 'locationId'.
Root cause: Added const locationId = process.env.GHL_LOCATION_ID on line 57 but const locationId = contactData?.contact?.locationId already existed on line 73 in the same function scope. Both files had this issue.
Fix: Renamed the env var to envLocationId in both files. Contact-response variable stays locationId and falls back with ?? envLocationId.

### Bug 9 - GHL diagnostic always returned NO_LOCATIONS
Symptom: /api/ghl-test showed "status":"NO_LOCATIONS" even with correct credentials.
Root cause: Test route called GET /locations/search?name=sunny which is an agency-level endpoint. A sub-account PIT cannot list locations. Returns empty array (not 403), making credentials look wrong when they were correct.
File: app/api/ghl-test/route.ts
Fix: Rewritten to call GET /locations/{locationId} directly (location-scoped). Also tests GET /contacts/?locationId=... to verify read access.
Confirmed working:
```
{"status":"OK","location":{"id":"gFXKSvk8RdfoOYbhnUJa","name":"sunnysliderentals"},"contacts_check":"Can read contacts (3 returned)"}
```

---

## 6. GHL INTEGRATION ARCHITECTURE

### Chatbot lead flow -> GHL
1. User completes: event type -> group size -> name -> phone
2. POST /api/chat-lead called with { name, phone, source }
3. Creates GHL contact with locationId in body
4. Creates GHL conversation (POST /conversations/)
5. Adds activity note with full lead context

### Contact form -> GHL + email
1. User submits: name, email, phone, event date, city, interest, message
2. POST /api/contact called
3. Creates GHL contact with custom fields + locationId
4. Creates GHL conversation + activity note
5. Resend sends formatted email to booking@sunnysliderentals.com

### Required API call pattern
```typescript
fetch('https://services.leadconnectorhq.com/contacts/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pit-0535ed77-8342-45c5-bb72-13cb38f7e954',
    'Version': '2021-07-28',  // required header
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName, lastName, phone,
    locationId: 'gFXKSvk8RdfoOYbhnUJa',  // REQUIRED - without this: 403
  })
})
```

### Diagnostic
GET https://sunnysliderentals.com/api/ghl-test -- verify credentials any time.

---

## 7. CHATBOT LEAD FLOW STATES

idle -> (3+ buying-intent exchanges) -> offered -> askName -> askPhone -> done

- idle: Normal Q&A
- offered: "Before you go..." prompt + "Let's do it!" button shown
- askName: Waiting for name (text input visible)
- askPhone: Waiting for phone
- done: Submitted to GHL, confirmation shown

The "Let's do it!" button sets leadStep('askName') directly -- does NOT call handleLeadInput. This is intentional (Bug 4 fix). Do not change.

---

## 8. BUSINESS CONSTANTS (in RentalDetail.tsx)

```typescript
const BUSINESS_LAT = 26.5629    // Cape Coral, FL
const BUSINESS_LNG = -81.9495
const FUEL_CHARGE_MILES = 20    // $39.99 surcharge triggers beyond this
```

---

## 9. PRICING

Add-ons:
- Tables: $10/each
- Chairs: $3/each
- 16x32 Frame Tent: $59
- Generator: $75
- Fuel Surcharge: $39.99 (auto-applied when >20 miles from Cape Coral)

Party Packages:
- Package 1: $150
- Package 2: $250
- Package 3: $450

Payment: 25% deposit (min $100) or Pay in Full.

---

## 10. DUAL SMS NOTIFICATIONS

Both owners notified on every booking and contact form:
- Kyle: (239) 634-9809
- Junior: (239) 220-4067

---

## 11. PENDING TASKS

### Domain (Task 22)
If domain is managed in GHL, point DNS to Vercel:
- A record @ -> 76.76.21.21
- CNAME www -> cname.vercel-dns.com
Then add domain in Vercel -> Project -> Settings -> Domains.

### Push to GitHub (Task 26)
```powershell
cd C:\Users\rodri\Desktop\sunny-slide-rentals
git add -A
git commit -m "fix: GHL integration working, all bugs resolved"
git push origin main
```
If git lock error: Remove-Item .git\index.lock -Force

---

## 12. END OF SESSION - ALL VERIFIED WORKING

- GHL API confirmed OK with correct location
- GHL can read contacts (3 returned)
- Chatbot: event -> size -> offer -> name -> phone -> confirmation
- Stripe Pay in Full includes party bundle in total
- Fuel surcharge auto-applies on paste when >20 miles
- Address suggestions autofill on click
- Lead name no longer stored as "yes"
- Phone number no longer triggers age pattern
- TypeScript builds clean
