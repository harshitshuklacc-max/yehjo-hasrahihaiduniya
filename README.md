# Smart Step Academy

Premium coaching institute website + ERP/LMS for Bilaspur, Chhattisgarh.

## Deploy on Vercel

**Full step-by-step:** see **[VERCEL-DEPLOY.md](./VERCEL-DEPLOY.md)**

Summary:

1. Create free DB at [Neon](https://neon.tech) (PostgreSQL).
2. Push this folder to GitHub.
3. Import repo on [vercel.com/new](https://vercel.com/new).
4. Add env vars: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`.
5. Deploy — build runs `db push` + admin seed automatically.

### Admin login

- `/login/admin`
- Username: `Smartstep05618`
- Password: `SmartTed*#1`

## Local development

Use **Neon PostgreSQL** URLs in `.env` (same as Vercel). SQLite is not used after Vercel setup.

```bash
npm install
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
