# Sunny Slide Rentals — Setup & Deployment Guide

## What's Already Done
- ✅ Full Next.js 14 site (App Router, Tailwind, TypeScript)
- ✅ Real product images from your PDF (in `/public/images/`)
- ✅ 3-step Amazon-style checkout: Browse → Product Detail → Stripe payment
- ✅ Supabase database provisioned — availability checking prevents double-bookings
- ✅ Stripe Checkout API routes (deposit-only, 25%)
- ✅ Resend email confirmations (customer + owner) on booking
- ✅ All pages: Home, Rentals, Product Detail, Gallery, Service Areas, Reviews, FAQ, Contact, Booking Confirmed
- ✅ No more GHL calendar iframe mess

---

## Step 1 — Push to GitHub

Open a terminal (PowerShell or Command Prompt) in this folder, then run:

```bash
git init
git add .
git commit -m "Initial build: full site with Stripe checkout"
git branch -M main
git remote add origin https://github.com/THP-Solutions/sunny-slide-rentals.git
git push -u origin main
```

> If asked for GitHub credentials, use a Personal Access Token (GitHub → Settings → Developer Settings → Personal Access Tokens)

---

## Step 2 — Get Your Secret Keys

### Supabase Service Role Key
1. Go to https://supabase.com → your "sunny-slide-rentals" project
2. Project Settings → API → **service_role** key (keep secret!)
3. Paste into `.env.local` replacing `YOUR_SUPABASE_SERVICE_ROLE_KEY`

### Stripe API Keys
1. Go to https://dashboard.stripe.com → Developers → API keys
2. Copy **Publishable key** → paste into `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** → paste into `STRIPE_SECRET_KEY`
4. Start in **Test Mode** first (toggle at top of Stripe dashboard)

### Stripe Webhook Secret
After deploying to Vercel (Step 3), come back here:
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://YOUR-VERCEL-URL.vercel.app/api/webhooks/stripe`
3. Events to listen for: `checkout.session.completed`
4. Copy the **Signing secret** → paste into `STRIPE_WEBHOOK_SECRET`

### Resend API Key
1. Sign up free at https://resend.com
2. API Keys → Create API Key
3. Paste into `RESEND_API_KEY`
4. Verify your domain `sunnysliderentals.com` in Resend → Domains
   (This lets you send from `booking@sunnysliderentals.com`)

---

## Step 3 — Deploy to Vercel

1. Go to https://vercel.com → New Project
2. Import from GitHub → select `THP-Solutions/sunny-slide-rentals`
3. Framework: **Next.js** (auto-detected)
4. Add all environment variables from `.env.local` (copy each one into Vercel's env var settings)
5. Deploy!

> Once deployed, update `NEXT_PUBLIC_SITE_URL` in Vercel env vars to your actual Vercel URL (e.g. `https://sunny-slide-rentals.vercel.app`)

---

## Step 4 — Test the Full Flow

1. Go to your Vercel URL → browse rentals → click a product
2. Pick a date — should show "✓ Available!"
3. Click "Reserve Now" — should redirect to Stripe Checkout
4. Use test card: **4242 4242 4242 4242** · any future date · any CVC
5. After payment → should land on `/booking-confirmed`
6. Check Supabase → bookings table should have a new row
7. Check email — confirmation should arrive at both customer + booking@sunnysliderentals.com

---

## Step 5 — Go Live

1. Switch Stripe from **Test Mode** to **Live Mode**
2. Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` in Vercel with live keys
3. Add a new Stripe webhook for the live endpoint
4. Update `STRIPE_WEBHOOK_SECRET` with the live signing secret
5. Point your domain `sunnysliderentals.com` to Vercel (Vercel → Domains → Add)

---

## Environment Variables Reference

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Already set — Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Already set — Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → signing secret |
| `RESEND_API_KEY` | resend.com → API Keys |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL |

---

## Questions?

Text Eddy: or email erika.orozcop84@gmail.com
