# Sunny Slide Rentals — Project Handoff
**Last updated:** June 23, 2026  
**Status:** Code complete ✅ | Deployment in progress 🔄

---

## What's Been Built

A full Next.js 14 rebuild of sunnysliderentals.com with:
- Channel-switcher hero (3 categories, flip cards on hover)
- Full booking cart with Stripe Checkout (25% deposit)
- Supabase bookings database
- Resend transactional email confirmations
- "Sunny" AI chatbot (floating widget, FAQ + lead capture → GHL)
- Contact form → GHL webhook + Resend email notification
- Service Areas page with interactive Leaflet map
- Spanish/English language toggle
- Gallery, FAQ, Reviews, Booking Confirmed pages
- `/api/webhooks/stripe` endpoint for payment confirmation

**LOCKED — DO NOT TOUCH:**  
`app/rentals/[id]/RentalDetail.tsx` — rental detail pages are perfect, user locked them.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe Checkout (live keys) |
| Email | Resend |
| CRM/Automation | GoHighLevel (GHL) via webhook |
| Deployment | Vercel |
| Domain | sunnysliderentals.com |

**Brand colors:** `#1a6fa8` (blue) · `#0d2340` (dark navy) · `#f5a623` (yellow)

---

## File Structure (Key Files)

```
app/
  page.tsx                        ← Homepage (HeroChannels + rental rows)
  layout.tsx                      ← Root layout (Navbar + Footer + ChatBot)
  contact/page.tsx                ← Contact page with inquiry form
  rentals/page.tsx                ← All rentals listing
  rentals/[id]/RentalDetail.tsx   ← ⚠️ LOCKED — DO NOT TOUCH
  gallery/page.tsx                ← Photo gallery
  faq/page.tsx                    ← FAQ
  reviews/page.tsx                ← Reviews
  service-areas/page.tsx          ← Map + area coverage
  booking-confirmed/page.tsx      ← Post-payment success page
  api/
    availability/route.ts         ← Check date availability (Supabase)
    checkout/route.ts             ← Create Stripe Checkout session
    contact/route.ts              ← Contact form → GHL + Resend
    chat-lead/route.ts            ← Sunny chatbot lead → GHL
    webhooks/stripe/route.ts      ← Stripe payment webhook → Supabase + Resend

components/
  HeroChannels.tsx                ← Channel switcher hero (3 categories, flip cards)
  Navbar.tsx                      ← Sticky nav with EN/ES toggle
  Footer.tsx                      ← Footer
  ChatBot.tsx                     ← "Sunny" floating chatbot with GHL integration
  ContactForm.tsx                 ← Contact form client component
  RentalRow.tsx                   ← Netflix-style horizontal scroll row

contexts/
  LanguageContext.tsx             ← EN/ES toggle with localStorage persistence

lib/
  rentals.ts                      ← Product catalog (all rentals, pricing, images)
  supabase.ts                     ← Supabase client (lazy-initialized for build safety)
  email.ts                        ← Resend email templates
```

---

## Environment Variables

### Already in Vercel ✅
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Still Need to Add to Vercel ❌
```
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY=re_YOUR_RESEND_API_KEY
NEXT_PUBLIC_SITE_URL=https://sunnysliderentals.com
CONTACT_EMAIL=booking@sunnysliderentals.com
STRIPE_WEBHOOK_SECRET=whsec_...   ← Get from Stripe after webhook is created
GHL_WEBHOOK_URL=https://...       ← Get from GHL Automations → New Workflow → Webhook trigger
```

---

## Remaining Steps to Go Live

### 1. Fix GitHub Push (Wrong Account)
Pushed to Erika's personal account by mistake. Fix:
```powershell
cd C:\Users\rodri\Desktop\sunny-slide-rentals
git remote set-url origin https://github.com/THP-Solutions/sunny-slide-rentals.git
git push -u origin main
```
If it still uses the wrong account, use a Personal Access Token from THP-Solutions:
```powershell
git remote set-url origin https://YOUR_TOKEN@github.com/THP-Solutions/sunny-slide-rentals.git
git push -u origin main
```

### 2. Deploy on Vercel
- Connect the THP-Solutions/sunny-slide-rentals repo
- Change preset from NestJS → **Next.js**
- Add all env vars listed above
- Click Deploy → note the Vercel URL (e.g., `sunny-slide-rentals.vercel.app`)

### 3. Stripe Webhook (tell Dan)
**Endpoint URL:** `https://sunnysliderentals.com/api/webhooks/stripe`  
**Event to listen to:** `checkout.session.completed` (only this one)  
**NOT** `setup_intent.created` — that's the wrong event.

After creating → Stripe shows a **Signing Secret** (`whsec_...`) → add to Vercel as `STRIPE_WEBHOOK_SECRET` → Redeploy.

### 4. GHL Webhook
1. GHL → Automations → + New Workflow
2. Trigger: **Webhook** / Inbound Webhook
3. Copy the generated URL (`https://services.leadconnectorhq.com/hooks/...`)
4. Add to Vercel as `GHL_WEBHOOK_URL` → Redeploy

Both the **contact form** and **Sunny chatbot** automatically POST to this URL when a lead is captured, with fields: `firstName`, `lastName`, `email`, `phone`, `source`, `tags`, `customData`.

### 5. Connect Custom Domain
In Vercel → Domains → Add `sunnysliderentals.com` → update DNS per Vercel instructions.

---

## Critical Technical Notes

### File Write Method
**IMPORTANT for future AI sessions:**  
Write/Edit tools corrupt files on this Windows-mounted filesystem.  
ALL file writes MUST use: `python3 -c "open(path,'w').write(content)"`  
Or `cat > file.ts << 'EOF'` in bash.  
**NEVER use the Write or Edit tools directly for long files.**

### Sandbox Paths
- Windows: `C:\Users\rodri\Desktop\sunny-slide-rentals`
- Bash: `/sessions/tender-cool-maxwell/mnt/sunny-slide-rentals/`

### Supabase Build Guard
`lib/supabase.ts` uses `|| 'placeholder'` fallbacks on all env vars to prevent  
`supabaseUrl is required` error during Next.js build-time static analysis.

### API Routes — All Force Dynamic
All routes under `app/api/` have `export const dynamic = 'force-dynamic'`  
to prevent Next.js from trying to statically pre-render them.

### ChunkLoadError Fix
If you see `ChunkLoadError: Loading chunk app/layout failed`:
```powershell
npm run dev:clean
```
Or double-click `start-fresh.bat`. Both delete `.next` before starting dev server.

### Chatbot Lead Flow
Sunny chatbot → detects buying intent → asks for name + phone →  
POSTs to `/api/chat-lead` → forwards to `GHL_WEBHOOK_URL` with tags: `['chatbot-lead', 'website']`

### Contact Form Flow
Contact form → POSTs to `/api/contact` →  
1. Forwards to `GHL_WEBHOOK_URL` with tags: `['contact-form', 'website']`
2. Sends notification email via Resend to `CONTACT_EMAIL`

---

## Supabase Schema (bookings table)
```sql
create table bookings (
  id uuid primary key default gen_random_uuid(),
  rental_id text not null,
  rental_name text not null,
  event_date date not null,
  deposit_amount numeric not null,
  total_amount numeric not null,
  status text default 'pending',
  stripe_session_id text unique,
  customer_email text,
  customer_name text,
  customer_phone text,
  addon_tables int default 0,
  addon_chairs int default 0,
  addon_tent boolean default false,
  event_address text,
  created_at timestamptz default now()
);
```

---

## Phone / Contact Info on Site
- Text: (239) 231-4477
- Email: booking@sunnysliderentals.com
- Service area: Cape Coral, Lehigh Acres, Fort Myers, North Fort Myers, Estero, SW Florida

