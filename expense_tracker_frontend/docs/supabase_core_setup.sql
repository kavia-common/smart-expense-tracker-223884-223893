-- Core tables and RLS policy setup for Ocean Expenses (Frontend repo helper)
-- Run this in your Supabase project's SQL editor.
-- This complements docs/supabase_expenses_setup.sql which creates the expenses table.

-- 0) Extensions needed
create extension if not exists moddatetime with schema extensions;

-- 1) PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text null,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_timestamp_profiles on public.profiles;
create trigger set_timestamp_profiles
before update on public.profiles
for each row execute procedure extensions.moddatetime (updated_at);

alter table public.profiles enable row level security;

drop policy if exists "Profiles selectable by owner" on public.profiles;
create policy "Profiles selectable by owner"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Profiles upsert by owner" on public.profiles;
create policy "Profiles upsert by owner"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Profiles update by owner" on public.profiles;
create policy "Profiles update by owner"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- 2) CATEGORIES
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text null,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name) -- prevent dup names per user
);

drop trigger if exists set_timestamp_categories on public.categories;
create trigger set_timestamp_categories
before update on public.categories
for each row execute procedure extensions.moddatetime (updated_at);

alter table public.categories enable row level security;

drop policy if exists "Categories by owner select" on public.categories;
create policy "Categories by owner select"
on public.categories
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Categories by owner insert" on public.categories;
create policy "Categories by owner insert"
on public.categories
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Categories by owner update" on public.categories;
create policy "Categories by owner update"
on public.categories
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Categories by owner delete" on public.categories;
create policy "Categories by owner delete"
on public.categories
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists categories_user_name_idx on public.categories (user_id, name);

-- 3) BUDGETS
-- Monthly budget by category or overall (category_id nullable). Month stored as text 'YYYY-MM'
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid null references public.categories(id) on delete set null,
  month text not null check (month ~ '^[0-9]{4}-[0-9]{2}$'),
  limit numeric not null check (limit >= 0),
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category_id, month)
);

drop trigger if exists set_timestamp_budgets on public.budgets;
create trigger set_timestamp_budgets
before update on public.budgets
for each row execute procedure extensions.moddatetime (updated_at);

alter table public.budgets enable row level security;

drop policy if exists "Budgets by owner select" on public.budgets;
create policy "Budgets by owner select"
on public.budgets
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Budgets by owner insert" on public.budgets;
create policy "Budgets by owner insert"
on public.budgets
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Budgets by owner update" on public.budgets;
create policy "Budgets by owner update"
on public.budgets
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Budgets by owner delete" on public.budgets;
create policy "Budgets by owner delete"
on public.budgets
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists budgets_user_month_idx on public.budgets (user_id, month);
create index if not exists budgets_user_cat_idx on public.budgets (user_id, category_id);

-- 4) STORAGE bucket 'receipts' note:
-- Create a bucket named 'receipts' (public recommended for this SPA):
--   In Supabase Dashboard -> Storage -> New Bucket -> name 'receipts' -> Public: checked.
-- If you prefer private bucket, do not make it public and serve signed URLs via a backend.

-- 5) Quick sanity selects (safe if tables are empty)
-- select * from public.profiles limit 5;
-- select * from public.categories limit 5;
-- select * from public.budgets limit 5;
