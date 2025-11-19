# Security & Compliance

## Security Foundation

- Built on **Supabase** (Postgres/Storage + Auth with enforced RLS and policies).
- App follows **OWASP** Secure Coding Guidelines and aligns with **NIST SSDF** controls for frontend SPA design.

## Authentication & Authorization

- All endpoints are protected: only authenticated users can view/modify their data.
- Row-level security (RLS) in Supabase policies ensures per-user data isolation.
- Auth sessions are managed by supabase-js SDK and never persisted insecurely.

## Data Protection

- No secrets are hardcoded; all configuration is through environment variables loaded at build/startup time.
- No PII logged client-side or sent in analytics.
- Receipt files are uploaded to a segregated storage bucket (public or signed URL).

## Input Validation

- All form inputs validated (amount, date, email, password length) on client side.
- DB constraints (e.g. amount >= 0, valid date) in SQL enforce further checks.
- TypeScript and strong typing provide further safety.

## Compliance Measures

- **No public exposure of APIs**: API keys are read-only (client role).
- **No PII in logs**: App avoids logging or exposing user data to browser console.
- SSL enforced at all layers (Supabase free tier requires HTTPS).
- No custom backend, so no server-side risk outside Supabase.

## Known Risks and Mitigations

| Threat                     | Mitigation                       |
|----------------------------|----------------------------------|
| SQL Injection/Bad Input    | Only parameterized queries, all via Supabase SDK. |
| Cross-Site Scripting (XSS) | No direct insertion to DOM, React auto-sanitizes. |
| Data Loss (delete)         | Soft deletions possible in future. Users own/delete only their data. |
| Credentials in code        | NONE, all secrets in env only.   |
| Broken Auth                | RLS + strict session checks.     |

## Regulatory Alignment

- **Right to Erasure**: User data deletable.
- **Regional compliance**: All data within Supabase's selected region.

## Dependency Management

- All dependencies are pinned and regularly updated.
- Linting and static analysis required (see eslint config).

---
Sources:  
- src/services, supabase setup docs, ESLint config, RLS policy in SQL.
