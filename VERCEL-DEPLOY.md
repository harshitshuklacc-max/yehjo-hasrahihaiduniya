# Deploy Smart Step Academy on Vercel

Vercel needs **PostgreSQL** (not SQLite). Follow these steps once.

## 1. Free PostgreSQL (Neon — recommended)

1. Open [https://neon.tech](https://neon.tech) and sign up (free).
2. Create a project → copy **Connection string** (pooled) and **Direct connection**.
3. In Neon dashboard, enable **Connection pooling** if asked; use:
   - **DATABASE_URL** = pooled URL (often contains `pooler`)
   - **DIRECT_URL** = direct URL (no pooler)

## 2. Push code to GitHub

1. Create a repo on GitHub (e.g. `smart-step-academy`).
2. In folder `D:\new smartttttttttttttttttttt`, push the project (Git Bash or GitHub Desktop).

## 3. Import on Vercel

1. [https://vercel.com/new](https://vercel.com/new) → Import your GitHub repo.
2. **Root directory:** project folder (default).
3. **Framework:** Next.js (auto-detected).
4. **Environment variables** (Settings → Environment Variables → Production):

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon pooled connection string |
| `DIRECT_URL` | Neon direct connection string |
| `JWT_SECRET` | Long random string (32+ characters) |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-PROJECT.vercel.app` (update after first deploy) |

5. Click **Deploy**.

The build runs `prisma db push` and seeds the admin user automatically.

## 4. Admin login (production)

- URL: `https://YOUR-PROJECT.vercel.app/login/admin`
- Username: `Smartstep05618`
- Password: `SmartTed*#1`

## 5. After first deploy

1. Set `NEXT_PUBLIC_SITE_URL` to your real Vercel URL and **Redeploy**.
2. Open the site — the yellow “Database not connected” bar should be gone.

## Local dev with same database (optional)

In `.env` on your PC, paste the same Neon `DATABASE_URL` and `DIRECT_URL`, then:

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

## Troubleshooting

| Problem | Fix |
|--------|-----|
| Build fails on `prisma db push` | Set **both** `DATABASE_URL` (pooled) and `DIRECT_URL` (direct, no pooler) in Vercel env vars |
| `Added the required column batchId... cannot be executed` | Redeploy with latest code — build auto-clears legacy timetable rows, then resets schema if needed |
| `Missing required environment variable: DIRECT_URL` | In Neon dashboard, copy the **direct** connection string (not the pooler one) into `DIRECT_URL` |
| `DIRECT_URL must be the Neon direct connection` | You pasted the pooler URL into `DIRECT_URL` — swap: pooled → `DATABASE_URL`, direct → `DIRECT_URL` |
| Admin login: database error | Redeploy after env vars are set; check Neon project is active |
| Login works but home shows DB warning | Redeploy; confirm Neon allows connections from Vercel |

## Student data (1 year)

Unchanged: records are kept 1 year, then auto-archived in **Admin → Archive**.
