# Roadmap and Next Steps

## Upcoming Features

- Receipts Page
  - Full listings, filters, and quick preview
  - Bulk operations (delete, re-link, etc.)

- Budget Enhancements
  - Budget rollovers across months
  - Comparative analytics month-over-month
  - Notifications for nearing/over limits

- Insights and Exports
  - Advanced trend analysis and anomaly detection
  - CSV/JSON exports for expenses and budgets

- Recurring and Scheduled Items
  - Recurring expenses (subscriptions)
  - Reminders and calendar integration

## API and Backend (Assumptions and Placeholders)

- Current backend is Supabase; all client calls use supabase-js
- If introducing a custom backend:
  - Define an OpenAPI spec and publish it under docs/api/
  - Route client calls via REACT_APP_BACKEND_URL and REACT_APP_API_BASE
  - Handle secure signing for private storage URLs

## Security and Compliance Work

- Add regular dependency audit
- Add content security policy (CSP) adjustments for host environment
- Consider private storage + signed URLs if PII handling requires stricter controls

## Testing and Quality

- Add unit tests for each service module
- Add integration tests for pages (Dashboard, Expenses, Budgets, Insights)
- Consider E2E suite with Cypress or Playwright

## Deployment

- Confirm build pipeline: lint, test, build
- Define environment variable management per environment
- Add runtime health probe (optional) with REACT_APP_HEALTHCHECK_PATH

---

Sources:
- expense_tracker_frontend/docs/OPERATIONS.md
- expense_tracker_frontend/docs/PRD.md
- expense_tracker_frontend/docs/ARCHITECTURE.md
