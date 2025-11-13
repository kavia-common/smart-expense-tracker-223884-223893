# Ocean Expenses - Expense Tracker Frontend (React + Supabase)

Modern expense tracker with budgets, receipts, and insights. Ocean Professional theme.

## Prerequisites

- Node.js 18+
- Supabase project with:
  - Auth enabled (Email/Password)
  - Tables: `profiles`, `categories`, `expenses`, `budgets`
  - Storage bucket: `receipts` (public)

## Environment variables

Create a `.env` file (do not commit secrets). Required keys:

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_FRONTEND_URL
- Optional others supported by platform:
  - REACT_APP_API_BASE
  - REACT_APP_BACKEND_URL
  - REACT_APP_WS_URL
  - REACT_APP_NODE_ENV
  - REACT_APP_ENABLE_SOURCE_MAPS
  - REACT_APP_PORT
  - REACT_APP_TRUST_PROXY
  - REACT_APP_LOG_LEVEL
  - REACT_APP_HEALTHCHECK_PATH
  - REACT_APP_FEATURE_FLAGS
  - REACT_APP_EXPERIMENTS_ENABLED

See `.env.example` for template.

## Install & Run

```bash
npm install
npm start
```

Open http://localhost:3000.

## Supabase Schema (expected)

- profiles: id (uuid, pk), display_name (text)
- categories: id (uuid, pk), user_id (uuid), name (text), color (text)
- expenses: id (uuid, pk), user_id (uuid), amount (numeric), category_id (uuid, nullable), merchant (text), notes (text), date (date), receipt_url (text)
- budgets: id (uuid, pk), user_id (uuid), category_id (uuid, nullable), month (text YYYY-MM), limit (numeric)

Note: Client gracefully handles 404/perms errors by showing empty data or toasts.

## Features

- Auth: Sign up/sign in, password reset
- Expenses: CRUD, filters, receipt upload to Storage (bucket `receipts`)
- Budgets: Per category, month; real-time utilization bars
- Insights: Pie (by category), line (over time) using chart.js
- Dashboard: KPIs, recent expenses, quick add modal
- Settings: Manage display name, logout
- Accessibility: Labeled inputs, validation, disabled/loading states
- Test hooks: data-testid on core actions

## Theme

Ocean Professional palette:
- Primary: #2563EB
- Secondary: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827

See `src/theme/global.css` and `src/theme/theme.js`.

## Security

- No secrets in code. Reads via process.env
- Auth session persisted by supabase-js
- Avoids logging PII

## Notes

- If you change auth email redirects, update REACT_APP_FRONTEND_URL accordingly.
- Ensure storage bucket `receipts` is public or generate signed URLs server-side.

## Scripts

- npm start - dev server
- npm test - CRA tests
- npm run build - production build
