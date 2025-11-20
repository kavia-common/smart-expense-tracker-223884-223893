# Architecture Overview

## System Components

### Web Frontend: expense_tracker_frontend
- React SPA responsible for all UI, routing, and client logic
- Pages: Dashboard, Expenses, Budgets, Insights, Receipts (placeholder), Settings, Auth
- Reusable components: Modal, Toast
- Theme and styles: Ocean Professional via CSS tokens in src/theme

### Backend: Supabase (managed)
- Authentication: Email/password via supabase-js
- Database: PostgreSQL with tables for profiles, categories, budgets, and expenses
- Row-Level Security: Enforces per-user data isolation
- Storage: Bucket “receipts” for uploaded images/PDFs

There is no custom server included. All data flows go directly from the SPA to Supabase endpoints via supabase-js.

## Container and Dependencies

- Frontend container: expense_tracker_frontend
  - React 18, react-router-dom 6, chart.js, @supabase/supabase-js, react-chartjs-2
  - ESLint configuration in eslint.config.mjs
  - Jest and @testing-library/react are available through react-scripts

## Supabase Usage

- supabase.auth for sign-in, sign-up, session management, and password reset
- PostgREST-based operations using supabase.from(table) calls in src/services:
  - expensesService.js: CRUD, month totals, category sums
  - budgetsService.js: CRUD with compatibility for limit vs budget_limit DB column
  - categoriesService.js: list and ensure defaults
  - profileService.js: get and upsert profile
  - storageService.js: upload receipt and return public URL

RLS policies restrict all data to the authenticated user (auth.uid() = user_id). SQL templates in docs/supabase_core_setup.sql and docs/supabase_expenses_setup.sql provide starting schemas and policies.

## Key Data Flows

- Authentication:
  - User signs in/up in Auth page
  - Session is stored by supabase-js
  - All application routes are gated; unauthenticated users are redirected to /auth

- Expenses and Receipts:
  - Create, edit, delete operations call src/services/expensesService
  - Optional upload to storage via storageService; the returned URL is saved on the expense row

- Budgets and Analytics:
  - Budgets page creates/updates monthly budgets per category
  - Dashboard and Insights pages aggregate sums by month and category client-side

## Configuration and Environments

- Environment variables define Supabase endpoints and optional features:
  - REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY, REACT_APP_FRONTEND_URL
  - Optional: REACT_APP_API_BASE, REACT_APP_BACKEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV, REACT_APP_NEXT_TELEMETRY_DISABLED, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL, REACT_APP_HEALTHCHECK_PATH, REACT_APP_FEATURE_FLAGS, REACT_APP_EXPERIMENTS_ENABLED

See docs/setup.md for environment setup and the SQL files for provisioning Supabase.

## Security Considerations

- No secrets in code; keys are provided via env and should be restricted (anon/public role)
- All writes and reads check auth.uid() via RLS policies
- Error messages are shown via toast and avoid leaking internal details
- Receipts: use public bucket for simple SPA access; use private + backend if privacy is required

## Extensibility

- Add new features by creating new service modules or extending existing ones
- For private storage or complex business logic, introduce a backend service and point the SPA to it using REACT_APP_BACKEND_URL and REACT_APP_API_BASE

---

Sources:
- expense_tracker_frontend/docs/ARCHITECTURE.md
- expense_tracker_frontend/src/services/*.js
- expense_tracker_frontend/docs/supabase_core_setup.sql
- expense_tracker_frontend/docs/supabase_expenses_setup.sql
