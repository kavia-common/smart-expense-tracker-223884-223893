# Testing Strategy

## Overview

Testing focuses on ensuring reliability across data entry, navigation, state updates, and authentication flows.  
Main goals: reach 80%+ coverage, exercise all critical user paths, and protect regressions.

## Approach

1. **Unit Tests:** Isolate functions in `src/services/` (data normalization, API errors).
2. **Integration Tests:** Simulate user flows with UI actions (`@testing-library/react`).
3. **E2E (future):** Optional; could use Cypress or Playwright.

## Tools

- **Jest**: Main test runner, assertions, snapshot capability.
- **@testing-library/react**: DOM queries by accessibility, simulating interactions.
- Test hooks: testid attributes for buttons, forms, etc.

## Coverage Targets

- ≥80% line/function coverage in `src/`
- 100% for critical paths (auth, expenses CRUD, budget logic, dashboard rendering).
- Use method and branch reporting (`npm test -- --coverage`)

## Test Structure

- `src/App.test.js`: App shell render check.
- Components: `src/components/__tests__/*.test.js` (if needed)
- Pages: Page-level integration via simulated session/context.
- Services: Logic/unit for data transformation and API returns.

## Continuous Integration

- All tests must pass before deployment.
- Future: adopt Github Actions or similar for workflow.

## Mocking and Stubs

- Supabase APIs are mocked/stubbed using jest.
- File upload and storage APIs are stubbed.

## Accessibility Audits

- Tests verify labels, alt attributes, and keyboard navigation.

## Example

```jsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app shell', () => {
  render(<App />);
  expect(screen.getByText(/Ocean Expenses/i)).toBeInTheDocument();
});
```

---
Sources:  
- src/App.test.js, other src files, package.json test scripts
