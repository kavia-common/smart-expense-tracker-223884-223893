# API and Data Models

## ER Diagram

```mermaid
erDiagram
  AUTH_USERS {
    uuid id PK
    text email
  }
  PROFILES {
    uuid id PK FK
    text display_name
    timestamptz inserted_at
    timestamptz updated_at
  }
  CATEGORIES {
    uuid id PK
    uuid user_id FK
    text name
    text color
    timestamptz inserted_at
    timestamptz updated_at
  }
  EXPENSES {
    uuid id PK
    uuid user_id FK
    numeric amount
    uuid category_id
    text merchant
    text notes
    date date
    text receipt_url
    timestamp inserted_at
    timestamp updated_at
  }
  BUDGETS {
    uuid id PK
    uuid user_id FK
    uuid category_id
    text month
    numeric limit
    timestamptz inserted_at
    timestamptz updated_at
  }
  
  AUTH_USERS ||..|| PROFILES : id=>
  AUTH_USERS ||--o{ CATEGORIES : id = user_id
  AUTH_USERS ||--o{ EXPENSES : id = user_id
  CATEGORIES ||--o{ EXPENSES : id = category_id
  CATEGORIES ||--o{ BUDGETS : id = category_id
  BUDGETS ||--o{ EXPENSES : id = user_id
```

## Table Reference

### `profiles`
- `id` (`uuid`, PK, **FK** to `auth.users`)
- `display_name` (`text`)
- `inserted_at`, `updated_at` (`timestamptz`)

### `categories`
- `id` (`uuid`, PK)
- `user_id` (`uuid`, FK to `auth.users`)
- `name` (`text`, unique per user)
- `color` (`text`)
- `inserted_at`, `updated_at` (`timestamptz`)

### `expenses`
- `id` (`uuid`, PK)
- `user_id` (`uuid`, FK)
- `amount` (`numeric`)
- `category_id` (`uuid`, nullable, FK-opt)
- `merchant`, `notes` (`text`, nullable)
- `date` (`date`)
- `receipt_url` (`text`, nullable)
- `inserted_at`, `updated_at` (`timestamp`)

### `budgets`
- `id` (`uuid`, PK)
- `user_id` (`uuid`, FK)
- `category_id` (`uuid`, nullable, FK)
- `month` (`text`, format: YYYY-MM)
- `limit` (`numeric`)

### Storage

- Bucket: `receipts`
  - Key: `{userId}/{timestamp}-{random}.{ext}`
  - Uploaded by frontend; public or signed URL

## Supabase Usage Patterns

- **All API functions are client side using `@supabase/supabase-js`.**
- Row-level security blocks all cross-user data access.
- User session handled by frontend (`supabase.auth`).
- File uploads via Supabase storage SDK.

## Typical Flows

### Auth Flow

- User signs in/up with email/password.
- Frontend stores session and user id.
- App queries, inserts, or updates only user-owned data.

### Expense CRUD

- Add/Edit uses normalized payload (see `src/services/expensesService.js`)
- Receipt upload (optional) handled before expense creation (if file attached).
- All expense queries filter by user id.

### Error Scenarios

- 404/missing tables: surfaced via toast and soft fail (no app crash).
- Storage errors render appropriate fallback.

---
Sources:  
- src/types/domain.d.ts, src/services, docs/supabase_core_setup.sql, docs/supabase_expenses_setup.sql
