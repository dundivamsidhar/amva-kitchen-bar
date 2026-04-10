# AmVa Kitchen & Bar — Project Documentation

> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Razorpay · Resend
> **Deployment:** Vercel · GitHub (`dundivamsidhar/amva-kitchen-bar`)
> **Live URL:** https://musing-wilbur-nu.vercel.app

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Pages & Routes](#pages--routes)
3. [Components](#components)
4. [Libraries & Contexts](#libraries--contexts)
5. [Database Schema](#database-schema)
6. [API Routes](#api-routes)
7. [Environment Variables](#environment-variables)
8. [Key Features](#key-features)
9. [Payment Flow](#payment-flow)
10. [Theme System](#theme-system)
11. [Access Control](#access-control)
12. [Gaps & Recommendations](#gaps--recommendations)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Customer Facing                   │
│   Home · Menu · Order · Reservations · About        │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                 Next.js 14 App Router                │
│   ThemeProvider · CartProvider · Navbar · Footer     │
└──────────┬───────────────────────────┬──────────────┘
           │                           │
┌──────────▼──────────┐   ┌───────────▼──────────────┐
│   Supabase (DB)     │   │   Internal Portals        │
│  - menu_items       │   │  Kitchen · Admin ·        │
│  - orders           │   │  Dashboard · Staff        │
│  - order_items      │   │  (PIN-protected)          │
│  - reservations     │   └──────────────────────────┘
│  - employees        │
│  - password_resets  │   ┌──────────────────────────┐
└─────────────────────┘   │   External Services       │
                          │  Razorpay · Resend · UPI  │
                          └──────────────────────────┘
```

**Key architectural decisions:**
- Single Supabase project handles DB + real-time subscriptions
- PIN-based auth for internal portals (no full auth system for staff yet)
- Cart persisted in `localStorage`; theme preference persisted in `localStorage`
- Static menu fallback in `/menu` if Supabase is unreachable
- Theme class (`html.light` / `html.dark`) set by blocking script before first paint to avoid flash

---

## Pages & Routes

### Public Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home page — MenuShowcase carousel, Hero, TodaysSpecials, AboutStrip, FoundersSection, LocationSection |
| `/menu` | `app/menu/page.tsx` | Full menu browser — category filters, search, vegetarian/vegan toggle, add to cart, 75+ items with static fallback |
| `/order` | `app/order/page.tsx` | Cart & checkout — table number, customer name, notes, 3 payment methods (UPI/Card/Cash), live order status tracker |
| `/reservations` | `app/reservations/page.tsx` | Table booking — date/time picker, guest count, occasion, special requests, confirmation screen |
| `/about` | `app/about/page.tsx` | About page — founders story, values, team bios, stats |
| `/contact` | `app/contact/page.tsx` | Contact & location — map embed, address, hours, reservation CTA |

### Internal Portals (PIN-protected)

| Route | File | PIN | Description |
|-------|------|-----|-------------|
| `/kitchen` | `app/kitchen/page.tsx` | `7410` | Kitchen Display System — live order queue, status progression buttons, food vs bar tabs, served counter |
| `/admin` | `app/admin/page.tsx` | — | Admin portal — staff/employee management |
| `/dashboard` | `app/dashboard/page.tsx` | `2580` | Owner dashboard — real-time KPIs, P&L panel, order history, revenue breakdown, top items, upcoming reservations |
| `/staff` | `app/staff/page.tsx` | — | Staff portal — payslips, attendance (clock in/out), leave requests, company announcements, password reset |

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/create-payment` | POST | Creates Razorpay order; returns demo order if keys missing |
| `/api/send-reset-code` | POST | Sends 6-digit password reset code via Resend email |

---

## Components

### Layout

| Component | Description |
|-----------|-------------|
| `Navbar.tsx` | Sticky top nav — logo, links, theme toggle (sun/moon), cart badge, mobile hamburger menu |
| `Footer.tsx` | Site footer — contact info, nav links, social links, copyright |
| `FloatingCart.tsx` | Floating action button — cart item count badge, links to `/order` |

### Home Sections

| Component | Description |
|-----------|-------------|
| `MenuShowcase.tsx` | Full-screen auto-advancing carousel (3.8s) of 5 featured dishes/cocktails with image, name, price, accent color, add-to-cart — fully theme-aware |
| `Hero.tsx` | Full-screen hero — "Bold Flavours. Bolder Drinks." tagline, Reserve/Menu CTAs, info bar (hours, location, phone) — fully theme-aware with inline conditional styles |
| `TodaysSpecials.tsx` | Grid of today's special menu items fetched from Supabase |
| `AboutStrip.tsx` | One-line brand statement strip |
| `FoundersSection.tsx` | Two-column founder cards (Vamsi Dundi, Amar) with portrait, quote, bio — fully theme-aware |
| `LocationSection.tsx` | Address, hours, phone, email, embedded map |
| `CocktailBanner.tsx` | Featured cocktail promotional banner |

### Feature Components

| Component | Description |
|-----------|-------------|
| `UpiModal.tsx` | UPI payment modal — QR code (via qrserver API), UPI ID copy button, deep-links to GPay/PhonePe/Paytm apps, "I've Paid" confirmation |

---

## Libraries & Contexts

### `lib/ThemeContext.tsx`
- `ThemeProvider` wraps the entire app
- `useTheme()` → `{ theme: "light" | "dark", toggle: () => void }`
- Reads `localStorage("amva_theme")` first; falls back to `prefers-color-scheme`
- `toggle()` saves preference to `localStorage` (persists across reloads)
- Applies `html.light` / `html.dark` class via `applyTheme()`
- Blocking inline `<script>` in `layout.tsx` reads localStorage before first paint (no theme flash)

### `lib/CartContext.tsx`
- `CartProvider` wraps the app
- `useCart()` → `{ cart, addToCart, removeFromCart, updateQuantity, updateNotes, clearCart, total, count }`
- Cart persisted to `localStorage("amva_cart")`
- Hydration-safe (prevents SSR mismatch)

### `lib/supabase.ts`
- Singleton Supabase client typed with `Database` schema
- Used across all pages and components for queries and real-time subscriptions

### `lib/database.types.ts`
- Auto-generated TypeScript types from Supabase schema
- Defines `Row`, `Insert`, `Update` types for all tables

---

## Database Schema

### `menu_categories`
| Column | Type | Notes |
|--------|------|-------|
| id | int | Primary key |
| name | text | Display name |
| slug | text | URL slug |
| icon | text | Emoji/icon |
| display_order | int | Sort order |

### `menu_items`
| Column | Type | Notes |
|--------|------|-------|
| id | int | Primary key |
| category_id | int | FK → menu_categories |
| name | text | |
| description | text | |
| price | numeric | INR |
| image_url | text | |
| tags | text[] | e.g. ["signature", "chef-special"] |
| is_available | bool | |
| is_featured | bool | Shows in MenuShowcase |
| is_vegetarian | bool | |
| is_vegan | bool | |
| spice_level | int | 0–3 |
| is_special_today | bool | Shows in TodaysSpecials |
| special_note | text | nullable |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | text | UUID |
| table_number | int | 1–50 |
| customer_name | text | |
| status | enum | `new` → `acknowledged` → `preparing` → `ready` → `served` / `cancelled` |
| notes | text | Order-level notes |
| total | numeric | INR |
| created_at | timestamp | |
| updated_at | timestamp | |

### `order_items`
| Column | Type | Notes |
|--------|------|-------|
| id | int | Primary key |
| order_id | text | FK → orders |
| menu_item_id | int | FK → menu_items |
| menu_item_name | text | Denormalised snapshot |
| menu_item_price | numeric | Denormalised snapshot |
| quantity | int | |
| notes | text | Item-level special requests |
| created_at | timestamp | |

### `reservations`
| Column | Type | Notes |
|--------|------|-------|
| id | int | Primary key |
| name | text | |
| email | text | |
| phone | text | |
| date | date | |
| time | text | e.g. "19:00" |
| guests | int | 1–10 |
| occasion | text | birthday, anniversary, etc. |
| special_requests | text | |
| status | enum | `pending` / `confirmed` / `cancelled` |
| created_at | timestamp | |

### `employees`
| Column | Type | Notes |
|--------|------|-------|
| id | int | Primary key |
| full_name | text | |
| email | text | |
| is_active | bool | |
| role / department | text | (inferred) |

### Additional Tables (inferred)
- `password_resets` — email, code (6-digit), used (bool), created_at
- `attendance` — employee_id, clock_in, clock_out, date
- `leave_requests` — employee_id, type, start_date, end_date, status
- `payslips` — employee_id, month, basic_pay, HRA, allowances, deductions, tax, net_pay
- `announcements` — title, body, is_pinned, created_at

---

## API Routes

### `POST /api/create-payment`
Creates a Razorpay order for card payments.

**Request body:**
```json
{ "amount": 1295 }
```
**Response:**
```json
{ "orderId": "order_xxx", "amount": 129500, "currency": "INR" }
```
- Amount multiplied by 100 (paise)
- Returns demo order `{ id: "demo_order" }` if Razorpay keys missing

### `POST /api/send-reset-code`
Sends password reset email to a staff member.

**Request body:**
```json
{ "email": "staff@amva.com" }
```
- Generates 6-digit code
- Stores in `password_resets` table, invalidates old codes
- Sends via Resend
- Always returns `{ success: true }` (prevents email enumeration)

---

## Environment Variables

| Variable | Visibility | Required | Purpose |
|----------|-----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | ✅ | Supabase anonymous key |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public | ✅ | Razorpay checkout (client) |
| `RAZORPAY_KEY_ID` | Server | ✅ | Razorpay order creation (server) |
| `RAZORPAY_KEY_SECRET` | Server | ✅ | Razorpay order creation (server) |
| `NEXT_PUBLIC_UPI_ID` | Public | ✅ | Restaurant UPI ID for QR |
| `NEXT_PUBLIC_UPI_NAME` | Public | ✅ | UPI display name |
| `NEXT_PUBLIC_ADMIN_PIN` | Public | ✅ | Dashboard access PIN (default: 2580) |
| `NEXT_PUBLIC_KITCHEN_PIN` | Public | ✅ | Kitchen display PIN (default: 7410) |
| `RESEND_API_KEY` | Server | ✅ | Staff password reset emails |

---

## Key Features

### Real-Time Order System
- Customer places order → saved to Supabase `orders` + `order_items`
- Kitchen sees new order instantly via `postgres_changes` subscription
- Kitchen updates status → customer order tracker updates live
- Dashboard shows live revenue and order counts

### Kitchen Display System (KDS)
- PIN protected (`7410`)
- Two views: **Active** (new/acknowledged/preparing/ready) and **All Today**
- One-click status progression: New → Acknowledged → Preparing → Ready → Served
- Food vs Bar order separation tabs
- Toast notification on new order arrival
- Served count and stats bar

### Menu System
- 8 categories, 75+ items
- Filters: vegetarian, vegan, search by name
- Spice level indicators (0–3)
- Tags: signature, chef-special, pre-order
- Static fallback data if DB unreachable
- Add to cart with item-level notes

### Payment Methods
1. **UPI** — QR code + deep-links to GPay/PhonePe/Paytm
2. **Card** — Razorpay checkout modal (server-side order creation)
3. **Cash at Table** — Direct order placement, no payment gateway

### Owner Dashboard
- PIN protected (`2580`)
- Daily P&L with editable cost inputs (food cost %, staff cost, overhead)
- Revenue, orders, avg order value, top 5 items
- Order history table with filters
- Upcoming reservations panel
- Payment method breakdown (UPI/Card/Cash)

### Staff Portal
- Employee self-service: payslips, clock in/out, leave requests
- Manager panel: approve/reject leave, view attendance
- Email-based password reset (6-digit OTP via Resend)
- Company announcements feed

---

## Payment Flow

```
Customer selects payment method
         │
    ┌────┴────────────────┐
    │                     │
   UPI                   Card                    Cash
    │                     │                       │
QR Modal            POST /api/create-payment      │
UPI deep-link       → Razorpay order ID           │
"I've Paid" btn     → Razorpay modal opens        │
    │               → On success callback         │
    └────────────────────┬─────────────────────┘
                         │
              Save to Supabase:
              orders + order_items
                         │
              Kitchen sees order (real-time)
                         │
              Customer sees live status tracker
```

**Gap:** UPI payments use an honour system — no server-side payment verification. The "I've Paid" button trusts the customer.

---

## Theme System

```
Page Load
    │
    ▼
Blocking <script> in layout.tsx
    → reads localStorage("amva_theme")
    → falls back to prefers-color-scheme
    → sets html.light or html.dark
    │
    ▼
ThemeContext mounts
    → reads localStorage first (same logic)
    → React state synced with html class
    │
User clicks toggle
    → ThemeContext.toggle()
    → updates React state
    → calls applyTheme() → updates html class
    → saves to localStorage (persists across reloads)
```

**CSS Strategy:**
- Global light-mode overrides: `html.light body:not(.portal) .bg-brand-* { background: cream !important }`
- `preserve-dark` class: sections with photos/dark backgrounds opt out of light conversion
- Inline `style` props used where Tailwind class selectors would conflict (Hero, MenuShowcase overlays)
- Portal pages (`kitchen-portal`, `admin-portal`, etc.) excluded from public light-mode overrides

---

## Access Control

| Portal | Method | Credential | Storage |
|--------|--------|-----------|---------|
| Kitchen `/kitchen` | PIN | `7410` (env var) | `sessionStorage("amva_kitchen")` |
| Dashboard `/dashboard` | PIN | `2580` (env var) | `sessionStorage("amva_admin")` |
| Admin `/admin` | PIN | — | `sessionStorage` |
| Staff `/staff` | Email + OTP | Resend email | Session |

**Gap:** PINs are stored in `NEXT_PUBLIC_*` env vars — visible in client-side JS bundle. Not suitable for high-security use.

---

## Gaps & Recommendations

### 🔴 Critical

| Gap | Impact | Recommendation |
|-----|--------|---------------|
| **UPI payment not verified server-side** | Revenue loss — customers can click "I've Paid" without paying | Integrate Razorpay UPI API or use a webhook from payment provider to confirm payment before saving order |
| **PINs in NEXT_PUBLIC env vars** | Security — anyone can inspect JS bundle and find kitchen/admin PINs | Move PIN check to a server action or API route; store hashed PINs server-side only |
| **No real authentication for staff** | Security — staff portal uses email OTP but no session management | Implement Supabase Auth with Row Level Security (RLS) for staff portal |

### 🟡 Important

| Gap | Impact | Recommendation |
|-----|--------|---------------|
| **No reservation confirmation email** | Poor UX — customers have no booking confirmation | Send confirmation email via Resend when reservation is created |
| **No order confirmation email/SMS** | Customers can't reference their order | Send SMS via Twilio or email via Resend after order placement |
| **No table availability check** | Reservations can double-book | Add capacity logic — track seats per time slot, reject bookings when full |
| **Razorpay webhook not implemented** | Payment state can go out of sync if callback fails | Add `/api/razorpay-webhook` to verify payment signature and update order status |
| **No admin reservation management** | Reservations always stay `pending` | Add confirm/cancel buttons in dashboard reservations panel |
| **Menu items hardcoded as fallback** | Static fallback gets stale | Move static fallback to a JSON file; add a sync script to keep it updated from DB |
| **No image upload for menu items** | Relies on Unsplash URLs | Add Supabase Storage integration for menu item images |

### 🟢 Nice to Have

| Gap | Impact | Recommendation |
|-----|--------|---------------|
| **No customer accounts** | Can't track order history per customer | Add optional phone-number based customer lookup |
| **No loyalty/repeat customer tracking** | Missed retention opportunity | Track visit count, offer discounts for repeat customers |
| **No push notifications for kitchen** | Kitchen staff must watch screen | Add Web Push notifications when new orders arrive |
| **No printer integration** | Kitchen must read from screen | Integrate thermal receipt printer (e.g. via Star Micronics or Epson API) |
| **No staff scheduling** | Attendance tracking but no shifts | Add shift scheduling to staff portal |
| **No inventory management** | Can't track stock levels | Add basic inventory count with low-stock alerts |
| **Dashboard date range filter** | Dashboard only shows today | Add date range picker for historical reporting |
| **No analytics integration** | No visitor/conversion data | Add Vercel Analytics or PostHog for customer journey insights |
| **Framer Motion imported but underused** | Bundle weight with no benefit | Either use it for page transitions or remove to reduce bundle size |
| **TypeScript errors suppressed at build** | Skipping type checking | Re-enable `tsc` in build once existing type errors are resolved |
| **ESLint suppressed at build** | Code quality not enforced | Fix existing lint warnings and re-enable ESLint in Vercel build |

---

## Project Stats

| Metric | Value |
|--------|-------|
| Pages | 10 (6 public + 4 internal) |
| Components | 12 |
| API Routes | 2 |
| DB Tables | ~10 |
| Menu Items | 75+ |
| Menu Categories | 8 |
| Payment Methods | 3 (UPI, Card, Cash) |

---

*Last updated: April 2026*
