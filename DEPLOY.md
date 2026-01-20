**Run locally (frontend + backend separated)**

- Backend (Prisma + Postgres)
  - Copy `backend/.env.sample` to `backend/.env` and set `DATABASE_URL`.
  - From `backend/`:

```bash
cd backend
npm install
npm run prisma:generate
# Create migration (interactive) or use --skip-seed in CI
npm run prisma:migrate
npm run db:seed
npm start
```

- Frontend (Next.js)
  - From repo root:

```bash
npm install
# run dev server
npm run dev
```

Notes:
- The frontend uses `NEXT_PUBLIC_API_URL` to call the backend. By default the shim points to `http://localhost:8000`.
- Do NOT commit any secrets. `backend/.env` should stay local and out of version control.
- To fully remove Firebase from lockfiles, delete `node_modules` and lockfiles then reinstall with your chosen package manager.
Frontend (run only)

1. From project root install dependencies and start dev server for frontend:

```bash
npm install
npm run dev
```

This will run the Next.js frontend on port 3000.

Backend (Prisma + Postgres)

1. Copy `backend/.env.sample` to `backend/.env` and set `DATABASE_URL` to your Postgres instance.
2. From `backend/` install dependencies and prepare Prisma:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm start
```

Notes

- Firebase client/admin code was removed; the frontend includes a lightweight shim at `src/lib/firebase.ts` so the UI runs without Firebase. Replace this shim with a real auth implementation when needed.
- The backend now uses Prisma. Schema is at `backend/prisma/schema.prisma`.
- You may remove `bun.lock` if you use npm or regenerate lockfiles after changing package managers.
