# Testing Strategy

## Objectives

- Validate critical flows: authentication, expenses CRUD, budgets, dashboard totals
- Maintain 80%+ coverage with focused unit and integration tests
- Protect against regressions in data transformations and Supabase interactions

## Levels

1) Unit
- Focus on src/services modules for data normalization and aggregation
- Mock Supabase client calls and verify method invocations and error handling

2) Integration
- Use @testing-library/react to render pages and simulate user interactions
- Test page-level flows: sign in/up, add/edit/delete expense, add/edit budget, dashboard KPIs

3) E2E (Future)
- Add Cypress or Playwright to automate full user journeys against a test environment

## Tools and Commands

- Test runner: Jest (via react-scripts)
- React Testing Library for DOM interactions
- Example commands:
  - npm test
  - npm test -- --coverage

## Structure

- src/App.test.js: app shell render check
- Future directories:
  - src/components/__tests__/
  - src/pages/__tests__/
  - src/services/__tests__/ (service unit tests)

## Mocking and Supabase

- Stub supabase-js calls at service boundaries
- For storage uploads, simulate successful and failing scenarios
- For auth, mock getSession and onAuthStateChange as needed

## Accessibility Checks

- Ensure inputs have accessible labels
- Ensure keyboard navigation for primary actions

---

Sources:
- expense_tracker_frontend/docs/TESTING_STRATEGY.md
- expense_tracker_frontend/src/App.test.js
- expense_tracker_frontend/package.json
