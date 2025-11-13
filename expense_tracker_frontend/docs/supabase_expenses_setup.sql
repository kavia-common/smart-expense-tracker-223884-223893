-- Expenses table and RLS policy setup for Ocean Expenses (Frontend repo helper)
-- Run this in your Supabase project's SQL editor.

-- 1) Create table if not exists
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null check (amount >= 0),
  category_id uuid null, -- optionally reference categories.id if you have categories table as public.categories(id)
  merchant text null,
  notes text null,
  date date not null,
  receipt_url text null,
  inserted_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Optional: If you have a categories table, uncomment to add FK (adjust schema/name as needed)
-- alter table public.expenses
--   add constraint expenses_category_fk
--   foreign key (category_id) references public.categories(id) on delete set null;

-- Update trigger for updated_at
create extension if not exists moddatetime with schema extensions;
drop trigger if exists set_timestamp on public.expenses;
create trigger set_timestamp
before update on public.expenses
for each row execute procedure extensions.moddatetime (updated_at);

-- 2) Enable RLS
alter table public.expenses enable row level security;

-- 3) Policies – allow authenticated users to manage only their rows
drop policy if exists "Expenses can be viewed by owner" on public.expenses;
create policy "Expenses can be viewed by owner"
on public.expenses
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Expenses can be inserted by owner" on public.expenses;
create policy "Expenses can be inserted by owner"
on public.expenses
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Expenses can be updated by owner" on public.expenses;
create policy "Expenses can be updated by owner"
on public.expenses
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Expenses can be deleted by owner" on public.expenses;
create policy "Expenses can be deleted by owner"
on public.expenses
for delete
to authenticated
using (auth.uid() = user_id);

-- 4) Optional: Performance indexes
create index if not exists expenses_user_date_idx on public.expenses (user_id, date desc);
create index if not exists expenses_user_category_idx on public.expenses (user_id, category_id);

-- 5) Storage bucket note (run separately via Storage UI if needed):
-- Ensure a public bucket named 'receipts' exists for getPublicUrl to work.
-- Alternatively, keep bucket private and serve via signed URLs from a backend.
