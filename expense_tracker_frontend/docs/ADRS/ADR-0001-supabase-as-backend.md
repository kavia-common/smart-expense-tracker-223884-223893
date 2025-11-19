# ADR-0001: Supabase as Backend for Ocean Expenses

## Status

Accepted

## Context

We need a backend for expense and budget data that:
- Enables secure user authentication (email/password, password reset)
- Provides a scalable hosted database with row-level security (RLS)
- Offers file storage for receipts/images
- Is easily integrated in a frontend-focused SPA architecture
- Is affordable and low-overhead for MVP launch

## Decision

**Supabase** is used as the backend for:
- Auth (supabase-js client, managed sessions)
- Database (Postgres, with schema and policies for `profiles`, `categories`, `expenses`, `budgets`)
- Storage (bucket `receipts`, public by default)

Benefits:
- No operational burden (hosting, scaling, patching handled)
- Modern developer UX (SQL editor, storage dashboard)
- Native RLS for data protection
- Seamless client SDK support

Drawbacks:
- Some "backend" code complexity moves to frontend
- Vendor lock-in for DB/storage/auth
- Some operational limits (free tier caps, rate limits)

Mitigations:
- All data and UI modular for future backend switch
- Use only portable SQL/CSS, minimize Supabase-specific logic outside data access layer

## Consequences

- Fast development for MVP
- All secrets managed in env
- Production readiness will depend on Supabase’s SLAs and scaling model
- Switching backend/database would require custom server implementation

## Compliance

- **Security:** All sensitive data protected by RLS and HTTPS
- **Compliance:** No secrets hardcoded; no direct access to DB tables; all storage keys are opaque

---
Sources:  
- PRD, project README, setup docs, SQL files, src/services, frontend/backend integration points
