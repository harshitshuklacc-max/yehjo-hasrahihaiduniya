# Smart Step Academy

Premium coaching institute website + ERP/LMS for Bilaspur, Chhattisgarh.

## Deploy on Vercel

### 1. Database (required)

Vercel **cannot** use SQLite. Use a free PostgreSQL database:

- [Neon](https://neon.tech) (recommended)
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com)

Copy the **connection string** (pooled + direct for Neon).

### 2. Vercel environment variables

In Vercel → Project → Settings → Environment Variables, add:

| Name | Value |
|------|--------|
| `DATABASE_URL` | PostgreSQL pooled URL |
| `DIRECT_URL` | PostgreSQL direct URL (same as Neon direct connection) |
| `JWT_SECRET` | Long random string |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` |

### 3. Push database schema (once)

After first deploy, run locally (or in Vercel CLI):

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

Or connect Neon SQL editor and ensure tables exist after `db push`.

### 4. Deploy

Push to GitHub and import the repo in Vercel. Build command (auto from `vercel.json`):

```
prisma generate && next build
```

### Admin login

- `/login/admin`
- Username: `Smartstep05618`
- Password: `SmartTed*#1`

## Local development

```bash
npm install
# .env is created automatically (SQLite file:./dev.db)
npx prisma db push
npm run db:seed
npm run dev
```

**Admin login:** http://localhost:3000/login/admin  
Username: `Smartstep05618` · Password: `SmartTed*#1`

If admin login shows "Internal server error", run:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```
Then restart `npm run dev`.

Place official logo at `public/logo.png`.
