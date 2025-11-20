# Smart Expense Tracker

## Overview and Goals

Smart Expense Tracker is a modern web application that helps users understand and control their spending. It provides real-time budget calculations, category-wise analytics, receipt uploads, and actionable insights. The application is implemented as a React single-page app that communicates directly with Supabase for authentication, database access, and file storage.

Primary goals:
- Enable fast, accessible expense entry and editing
- Provide live budget utilization by month and category
- Visualize spending trends and category composition
- Store and view receipt images securely
- Maintain strong security with Supabase row-level security (RLS)
- Offer a clean, professional dashboard experience (Ocean Professional theme)

## Containers and Tech Stack

- Frontend container: expense_tracker_frontend
  - Framework: React 18
  - Routing: react-router 6
  - Charts: chart.js via react-chartjs-2
  - Testing: Jest, @testing-library/react
  - Styling: CSS with theme tokens (Ocean Professional)

- Backend service: Supabase (managed)
  - Auth: Email/password via supabase-js
  - Database: PostgreSQL with RLS policies
  - Storage: Bucket for receipts (recommended: public for SPA, otherwise serve signed URLs through a backend)

The repository currently contains the frontend container and helper SQL for provisioning Supabase. There is no custom server included in this repo; all data access is performed via Supabase SDK from the client.

## Architecture Overview

- React SPA renders the dashboard layout with a sidebar navigation and content panels.
- Service modules in src/services encapsulate all Supabase operations for expenses, budgets, categories, profiles, and storage.
- Authentication is handled client-side via supabase.auth; session state gates all routes.
- Row-level security in Supabase ensures users access only their own data.
- For receipts, files are uploaded to a Supabase Storage bucket and referenced from expense records.

See docs/architecture.md for a diagram and details.

## Environment Configuration

This project reads settings from environment variables defined at build/runtime. Configure a .env file in the frontend container (do not commit secrets).

Required:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_FRONTEND_URL

Supported (optional based on deployment and future features):
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

See docs/setup.md for detailed guidance.

## Local Development and Preview

- Use Node.js 18+.
- Install dependencies and start the dev server from the frontend container:
  - cd smart-expense-tracker-223884-223893/expense_tracker_frontend
  - npm install
  - npm start
- The preview system is managed outside of code (start/stop previews via your environment). Do not add commands to start preview services here. When the dev server runs, it serves the SPA on the configured port (default 3000).

## Coding Standards and Security

We follow secure-by-default practices and React best practices:
- No hardcoded secrets; use environment variables
- Input validation and friendly error handling on all forms
- Supabase RLS policies protect data isolation
- Accessibility: labeled inputs, keyboard navigation, and sufficient contrast
- ESLint rules in eslint.config.mjs; strive for clean, maintainable code

Bandit-style security guidelines (adapted for JS/SPA):
- Avoid unsafe dynamic execution patterns
- Validate and sanitize external inputs before use
- Use HTTPS endpoints and secure cookie/session handling via Supabase
- Wrap external calls in try/catch and avoid exposing internal details in UI

See docs/security.md for a concise enforcement summary.

## Features

- Authentication: Sign up, sign in, reset password
- Expenses: CRUD, filters, optional receipt uploads
- Budgets: Per-category or overall monthly budgets with utilization
- Analytics: Category breakdown and spending over time charts
- Receipts: Uploads to Supabase Storage and viewing via public/signed URLs
- Insights: Dashboard KPIs and charts with Ocean Professional styling

## API and Data Model Assumptions

- Supabase is the backend. The SPA uses supabase-js to interact with tables:
  - profiles, categories, expenses, budgets
- SQL and policies are provided in the frontend repo under docs/ for convenience. Apply in your Supabase project.
- Backend endpoints are not custom; all data operations occur via Supabase.
- If you introduce a custom backend, use REACT_APP_BACKEND_URL and REACT_APP_API_BASE and document it under docs/architecture.md.

See docs/architecture.md and docs/api_and_data_models.md for schema details and ER diagram.

## Testing Strategy

- Unit tests for service functions and utilities
- Integration tests for page-level flows (auth, expenses, budgets, dashboard)
- Optional E2E tests (Cypress/Playwright) in future
- CI should run lint, test, and build steps

See docs/testing.md for the testing plan.

## Deployment Considerations

- Build static assets with npm run build
- Configure environment variables in the hosting platform
- Ensure Storage bucket (receipts) permissions match your privacy model
- For private receipts, serve signed URLs through a backend service

See docs/architecture.md and docs/setup.md for more.

## Style Guide

- Theme: Ocean Professional
- Primary: #2563EB, Secondary: #F59E0B, Error: #EF4444
- Background: #f9fafb, Surface: #ffffff, Text: #111827
- Dashboard layout with sidebar, top bar, and responsive content grid

See docs/style-guide.md for detailed guidelines.

## Roadmap and Next Steps

- Add receipts page listing and search
- Budget rollovers and monthly comparisons
- Recurring expenses and reminders
- Export data (CSV/JSON)
- E2E test coverage
- Optional backend proxy for private storage and advanced analytics

See docs/roadmap.md for details.

---

Sources:
- expense_tracker_frontend/src (pages, services, components, theme)
- expense_tracker_frontend/docs (ARCHITECTURE.md, SETUP.md, API_AND_DATA_MODELS.md, STYLE_GUIDE.md, TESTING_STRATEGY.md, SECURITY_COMPLIANCE.md)
- expense_tracker_frontend/package.json
