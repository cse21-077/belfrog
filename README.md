# The Bell Frog Inn — Website + CMS

SvelteKit site for The Bell Frog Inn (Okavango Delta, Botswana) with a built-in CMS backed by Supabase Postgres.

## Features

- Public site: hero, accommodation, tented accommodation ("Sleeps 2 · Max 2 guests"), full 2026 activities & transfer rates with a **BWP / USD / EUR currency switcher**, Booking.com + Airbnb CTAs, reviews carousel (or third-party widget embed), and a direct booking request form with live availability.
- **Admin CMS** at `/admin`: dashboard, bookings (confirm/cancel), tents (with multi-photo galleries), rates (with nested price rows), reviews, blocked dates, settings, and a `.docx` export of all site copy.
- **Booking engine**: availability checks against bookings + imported iCal blocks; new requests are stored, emailed to `bookings@thebellfrog.com` (Resend), and the guest gets an auto-reply.
- **2-way calendar sync**: imports Airbnb / Booking.com iCal feeds into blocked dates (auto-syncs when stale), and publishes `/api/calendar.ics` so the platforms can subscribe to direct bookings.

## Setup

1. `pnpm install`
2. Copy `.env.example` → `.env` and fill in:
   - `DATABASE_URL` / `DIRECT_URL` — Supabase pooler URLs (transaction mode for runtime, session mode for migrations)
   - `RESEND_API_KEY` + `EMAIL_FROM` — email delivery (blank key = emails logged to console in dev)
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — initial admin (created by the seed)
   - `ICAL_SYNC_SECRET` — protects `POST /api/ical/sync`
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — image uploads to Supabase Storage (get the service-role key from Supabase Dashboard → Settings → API; the `site-assets` bucket is created automatically on first upload)
3. `pnpm db:migrate && pnpm db:seed`
4. `pnpm dev`

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm preview` | Production build / preview |
| `pnpm check` / `pnpm lint` | Type-check / lint |
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm db:migrate` | Apply migrations (`prisma migrate deploy`) |
| `pnpm db:seed` | Seed tents, 2026 rates, reviews, settings, admin user |
| `pnpm db:studio` | Prisma Studio |

## Calendar sync

- In **Settings** paste the secret iCal feed URLs from the Airbnb and Booking.com extranets, then use **Blocked Dates → Sync calendars now**.
- The site also re-syncs automatically when availability data is older than 1 hour. To sync on a schedule, hit `POST /api/ical/sync` with the `x-sync-secret` header (cron-job.org, Vercel Cron, etc.).
- Subscribe the extranets to `https://<your-domain>/api/calendar.ics` so confirmed direct bookings block the platforms.

## Images & galleries

- Tent galleries live in **Admin → Tents → (edit)** — upload straight to Supabase Storage (JPEG/PNG/WebP/AVIF/GIF, max 8MB), or paste any image URL. Reorder with ↑/↓, remove with the trash icon. The public tent cards render the photos as a slideshow.
- Packages/rates are text + pricing (no images by design) — create/edit/delete them under **Admin → Rates**.

## Notes

- Rates are stored in their native currency (Pula for activities/transfers, USD for Helicopter Horizons) and converted on the site using the FX rates in Settings.
- The Booking.com button URL is a placeholder until the real property URL is saved in Settings.
- Deploy with any SvelteKit adapter (`adapter-auto` picks up Vercel/Netlify/Cloudflare automatically).
