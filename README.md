# Lucid Futures Journal

MVP trading journal for futures traders using Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Included

- Account creation and funded-account rule settings
- Tradovate CSV upload with flexible header mapping
- PostgreSQL-ready Prisma schema for accounts and trades
- Dashboard with core funded-account metrics
- Filterable trades table
- Trade detail journal page for notes, setup tags, mistake tags, and screenshot URLs
- Analytics page with charts for equity curve, daily PnL, symbol performance, setup performance, and time-of-day performance

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Recharts

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` and `DIRECT_URL` from your Postgres provider.
3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Create the database schema:

```bash
npx prisma migrate deploy
```

6. Start the app:

```bash
npm run dev
```

## Notes

- The CSV parser is designed to tolerate common Tradovate header variations.
- For MVP speed, imports are stored as one trade row per parsed CSV row rather than attempting complex position reconstruction.
- Lucid consistency is estimated as `largest winning day / total net profit`.

## Vercel Postgres Setup

This project is set up for a Vercel-connected Postgres database.

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. In the Vercel project, open `Storage` and connect a Postgres provider from the Marketplace.
4. Pull the injected environment variables locally:

```bash
vercel env pull .env
```

5. Run your schema deployment:

```bash
npx prisma migrate deploy
```

If your provider gives you a separate direct connection string for schema operations, use it as `DIRECT_URL`. Otherwise you can temporarily point both vars at the same Postgres database.
