# Beast Force Gym

Production-ready Next.js membership website for a unisex gym with Supabase, Razorpay, Resend, Twilio WhatsApp, and Vercel Cron.

## Setup

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill credentials.
4. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
5. Create a Supabase Storage bucket named `gym-media`.
6. Run `npm run dev`.

## Deployment

- Deploy to Vercel.
- Add every environment variable from `.env.example`.
- Set `CRON_SECRET` to a strong random value.
- Configure Razorpay webhook or callback URLs to point to the deployed app.
- Configure Twilio WhatsApp approved templates for production messages.

## Admin Access

Create a Supabase Auth user, then update its `profiles.role` to `admin` in Supabase.
