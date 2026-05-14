# BlueLens
Production-ready Next.js + Supabase cyber threat intelligence portal.
## Setup
1. `npm install`
2. copy `.env.example` to `.env.local`
3. run SQL in `supabase/migrations/001_schema.sql`
4. `npm run dev`
## Daily automation
Configure Vercel Cron to call `/api/ingest/daily` once per day.
## Security & trust model
- No fabricated IOCs.
- Every IOC must map to a `source_id`.
- AI interpretation is separate from source-grounded fields.
