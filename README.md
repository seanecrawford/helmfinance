# HelmFinance v2.5

**What’s new vs v2.4**
- ✅ Auth with NextAuth (Credentials)
- ✅ Postgres + Prisma schema (User, Account, Transaction, Budget, Goal)
- ✅ Protected routes via middleware
- ✅ Transactions API (CRUD minimal) + **CSV bulk import** (`/import`)
- ✅ Seed script with demo data

## Quick Start

```bash
# 1) Install deps
npm install

# 2) Configure environment
cp .env.example .env
# edit .env: DATABASE_URL, NEXTAUTH_SECRET

# 3) Set up DB
npx prisma migrate dev --name init
npm run db:seed

# 4) Run
npm run dev
# open http://localhost:3000

# Demo login (after seed)
# email: demo@helmfinance.app
# pass:  helmpass
```

## CSV Import
Go to **/import**, upload a CSV with headers:
```
date,account,category,memo,amount
2025-09-05,Everyday Checking,Groceries,Lidl,-72.17
```
Unknown accounts will be created on the fly.

## Notes
- Credentials auth is basic — upgrade later to OAuth/email magic links as needed.
- Consider adding Prisma `Decimal.js` transformer for precise money math in production.
- For deployment (Vercel/Render/Fly), provision Postgres and set `DATABASE_URL` + `NEXTAUTH_URL`.
