# Local Development & Setup Guide

## Prerequisites

- Node.js 18+
- npm 8+
- Supabase project (cloud hosted; free tier works)
- Web browser

## 1. Project Initialization

```sh
git clone <repo_url>
cd expense_tracker_frontend
cp .env.example .env  # update .env with your own Supabase creds
npm install
npm start
# Visit http://localhost:3000
```

## 2. Environment Variables

Set these in `.env`:

| Variable                       | Description |
|--------------------------------|-------------|
| REACT_APP_SUPABASE_URL         | Your Supabase project URL (from dashboard) |
| REACT_APP_SUPABASE_KEY         | Supabase anon/public key |
| REACT_APP_FRONTEND_URL         | Deployed URL of web app (for email redirects) |
| REACT_APP_API_BASE             | (optional) API gateway base, not used by default |
| REACT_APP_BACKEND_URL          | (optional) If using your own backend server |
| REACT_APP_WS_URL               | (optional) Websocket URL for real-time features |
| REACT_APP_NODE_ENV             | Runtime env (development/production) |
| REACT_APP_ENABLE_SOURCE_MAPS   | `true` for source maps (debugging) |
| REACT_APP_PORT                 | Frontend port (default 3000) |
| REACT_APP_TRUST_PROXY          | Trust proxy headers in deployment |
| REACT_APP_LOG_LEVEL            | Logging verbosity |
| REACT_APP_HEALTHCHECK_PATH     | For CI/monitoring health checks |
| REACT_APP_FEATURE_FLAGS        | Enable/disable features |
| REACT_APP_EXPERIMENTS_ENABLED  | Enable hidden experimental features |

> **NEVER** commit your `.env` file.

## 3. Supabase Backend Configuration

### a) Tables & RLS

Run SQL from:

- [`docs/supabase_core_setup.sql`](./supabase_core_setup.sql) – creates `profiles`, `categories`, `budgets`, and core policies.
- [`docs/supabase_expenses_setup.sql`](./supabase_expenses_setup.sql) – creates `expenses` table and policies.

Paste into Supabase SQL Editor.

### b) Authentication

- Go to Auth -> Providers.
- Enable Email/Password.

### c) Storage (Receipts)

- Go to Storage tab in Supabase.
- Create bucket: `receipts` (set Public = checked for easy SPA access).
    - **Alternative:** If private, you'll need to build a backend to serve signed URLs.

## 4. Running and Testing

```sh
npm install
npm start              # runs on http://localhost:3000
npm test               # runs all tests
npm run build          # creates production bundle
```

## 5. Known Issues

- If you modify user redirect URLs in Supabase auth email config, update `REACT_APP_FRONTEND_URL`.
- If storage access fails, check bucket permissions.

---
Sources:  
- .env.example, docs/supabase_*.sql, README, src/services, Supabase portal steps
