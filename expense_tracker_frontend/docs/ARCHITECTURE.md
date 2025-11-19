# Architecture Overview

## System Components

- **React Web Frontend** (`expense_tracker_frontend`)
  - Implements dashboard, forms, modals, analytics charts.
  - Handles routing, state management, and all UI.
- **Supabase Backend**
  - Authentication (email/password).
  - Database as-a-service (Postgres) with RLS.
  - Storage: Receipts and attachment files.
  - Real-time for sync and potential live features.

## Major Structure

- All logic and UI is served client-side via React.
- All state is local or synced via Supabase APIs.
- No dedicated traditional backend (serverless SPA).

## Component/Major Module Breakdown

### React Modules

| Area      | Location | Responsibility |
|-----------|----------|---------------|
| Routing   | `src/AppRouter.js` | Navigation, auth gating, app shell |
| Pages     | `src/pages/` | Implement dashboard, expenses, budgets, insights, settings, auth |
| Services  | `src/services/` | API calls to Supabase (expenses, budgets, categories, profiles, receipts) |
| Theme     | `src/theme/` | Central theme values, palette (Ocean Professional), CSS |
| Components| `src/components/` | Reusable UI widgets: Modal, Toast |

### Data Model (summarized)

See [API_AND_DATA_MODELS.md](API_AND_DATA_MODELS.md) for full ER schema.

## Data Flow Diagram

```mermaid
graph TD
    A[User Browser] -- UI Events / API Calls --> B(React Frontend)
    B -- HTTP (REST) --> C[Supabase API]
    C -- Auth & DB Policies --> D[Database (Postgres)]
    B -- Storage SDK --> E[Supabase Storage (Receipts)]
    B -- Reads config --> F[Env Vars / .env]
    style B fill:#e3f6fd
    style C fill:#e7e7ff
    style D fill:#f4f9fd
```

## Authentication & Authorization

- Supabase JS client manages session and refresh tokens.
- All API calls are client-initiated and access-controlled by RLS.
- Public role cannot access any data except static assets.

## Tech Stack

- **Frontend:** React 18, react-router 6, chart.js
- **Database/Backend:** Supabase (PostgreSQL with security policies)
- **Auth & Storage:** Handled by Supabase, no custom servers.
- **Testing:** Jest, Testing Library

## Resilience & Security

- All sensitive information is stored in env vars.
- Only authorized users may modify their data; SQL policies enforced.
- Graceful handling of errors and quick UI feedback (Toast).

## Extensibility

- Modular service files for easy maintenance.
- Data schema extensible for new features (tags, recurring, etc).
- Scalable styling and theming.

---
Sources:  
- src directory, docs/supabase*.sql, React/supabase/JS integration, page/components, .env descriptions
