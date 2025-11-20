# Setup and Local Development

## Prerequisites

- Node.js 18+
- npm 8+
- Supabase project (cloud hosted)
- Web browser

## Repository Structure

- Frontend container:
  - smart-expense-tracker-223884-223893/expense_tracker_frontend

## Environment Variables

Create a .env file in expense_tracker_frontend with the following keys (do not commit this file):

Required:
- REACT_APP_SUPABASE_URL: your Supabase project URL
- REACT_APP_SUPABASE_KEY: Supabase anon/public key
- REACT_APP_FRONTEND_URL: public URL of your app (for auth email redirects)

Optional:
- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
- REACT_APP_WS_URL
- REACT_APP_NODE_ENV
- REACT_APP_NEXT_TELEMETRY_DISABLED
- REACT_APP_ENABLE_SOURCE_MAPS
- REACT_APP_PORT
- REACT_APP_TRUST_PROXY
- REACT_APP_LOG_LEVEL
- REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED

## Provision Supabase

1) In the Supabase SQL Editor, run:
- expense_tracker_frontend/docs/supabase_core_setup.sql
- expense_tracker_frontend/docs/supabase_expenses_setup.sql

2) In Supabase Auth, enable Email/Password.

3) In Supabase Storage, create a bucket named receipts. For a pure SPA, public is convenient. For private storage, plan a backend proxy and use signed URLs.

## Local Development

- Navigate to the frontend container and start the dev server:
  - cd smart-expense-tracker-223884-223893/expense_tracker_frontend
  - npm install
  - npm start
- The app will be available on the configured port (default 3000).
- The preview system is started/stopped outside of code. This documentation does not provide commands to control previews directly.

## Testing and Build

- npm test to run unit/integration tests
- npm run build to produce a production bundle

---

Sources:
- expense_tracker_frontend/docs/SETUP.md
- expense_tracker_frontend/docs/supabase_core_setup.sql
- expense_tracker_frontend/docs/supabase_expenses_setup.sql
- expense_tracker_frontend/README.md
