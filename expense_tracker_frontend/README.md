# Ocean Expenses - Expense Tracker Frontend (React + Supabase)

Modern expense tracker with budgets, receipts, and insights. Ocean Professional theme.  
This project features a real-time budgeting and analytics web app built with React, fully integrated with Supabase for authentication, data storage, and file uploads.

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase project (create at https://app.supabase.com)
  - Auth enabled (Email/Password)
  - Tables: `profiles`, `categories`, `expenses`, `budgets`
  - Storage bucket: `receipts` (public is recommended for SPA)

### Running Locally

1. Clone repo
2. `cd expense_tracker_frontend`
3. Setup `.env` file (see below)
4. `npm install`
5. `npm start`

App opens at http://localhost:3000.

### Environment Variables

Required in `.env` (do **not** commit secrets):

- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_KEY`
- `REACT_APP_FRONTEND_URL`
- Additional variables supported:
  - `REACT_APP_API_BASE`
  - `REACT_APP_BACKEND_URL`
  - `REACT_APP_WS_URL`
  - `REACT_APP_NODE_ENV`
  - `REACT_APP_ENABLE_SOURCE_MAPS`
  - `REACT_APP_PORT`
  - `REACT_APP_TRUST_PROXY`
  - `REACT_APP_LOG_LEVEL`
  - `REACT_APP_HEALTHCHECK_PATH`
  - `REACT_APP_FEATURE_FLAGS`
  - `REACT_APP_EXPERIMENTS_ENABLED`

See `.env.example` for template.

### Supabase Database Schema

Refer to [`docs/supabase_core_setup.sql`](docs/supabase_core_setup.sql) and [`docs/supabase_expenses_setup.sql`](docs/supabase_expenses_setup.sql) for built-in schema, row-level security, and storage configuration.

## Features Overview

- **Authentication:** Secure sign in/up (Supabase Auth), password reset.
- **Expenses:** CRUD operations, filtering, and receipt uploads.
- **Budgets:** Per-category, month-based budgeting with live utilization.
- **Analytics:** Charts for category and timeline trends (using chart.js).
- **Receipts:** File upload to Supabase Storage, view receipts.
- **Accessibility:** Labeled inputs, keyboard navigation, focus styles.
- **UI Theme:** Ocean Professional—blue/amber, clean dashboard.
- **Testing:** Jest, @testing-library/react, with test hooks (`data-testid`).
- **Security:** No secrets in code; all data operations and storage secured via Supabase RBAC/RLS.
- **Error Handling:** Friendly toasts, handling server errors gracefully.

## Docs

See `/docs/` for detailed PRD, architecture, setup, API/data model, testing, security, and deployment notes.

## Scripts

- `npm start` – dev server
- `npm test` – unit/integration tests
- `npm run build` – production build

## Live Demo / Preview

If deployed, open [https://vscode-internal-23422-beta.beta01.cloud.kavia.ai:3000](https://vscode-internal-23422-beta.beta01.cloud.kavia.ai:3000)

---
Sources:  
- src/ (code structure, theme files, services, components)
- docs/supabase_core_setup.sql, docs/supabase_expenses_setup.sql (DB setup)
- package.json, setup files
