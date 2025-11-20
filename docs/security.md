# Security and Coding Standards

## Security Model

- Backend is Supabase; authentication and data access are enforced server-side by RLS.
- The SPA never stores or embeds secrets in code. All configuration is provided through environment variables and the Supabase anon/public key.
- For file storage, use a dedicated bucket (receipts). Public buckets enable simple SPA viewing; private buckets require a backend proxy that issues signed URLs.

## Bandit-Style Enforcement (Adapted)

- Avoid insecure dynamic execution patterns.
- Validate and sanitize all external inputs before use in logic or rendering.
- Never log PII or secrets to the console.
- Always use HTTPS endpoints; do not downgrade to insecure transport.
- Wrap network or storage operations in try/catch and display user-friendly errors without stack traces.
- Do not expose internal details (SQL, stack traces, server messages) in the UI.

## React and JS Coding Standards

- Functional components and hooks
- Keep components small and composable
- Accessibility with labels, roles, and keyboard navigation
- Use ESLint for consistent code style (see eslint.config.mjs)
- Prefer centralized services for data access (src/services)

## Supabase Practices

- Ensure RLS policies are enabled and restrict by auth.uid()
- Use anon/public keys with minimal privileges in client
- When adopting private storage, avoid exposing signed URLs in logs or error messages
- Regularly audit schema and policies for least privilege

## Dependency and CI

- Keep dependencies updated
- Run tests and lint in CI
- Consider adding tooling such as Dependabot or Snyk for alerts

---

Sources:
- expense_tracker_frontend/docs/SECURITY_COMPLIANCE.md
- expense_tracker_frontend/src/services/*.js
- expense_tracker_frontend/eslint.config.mjs
