-- Timeless Resurfacing quote app — Supabase schema.
-- Run this ONCE in your Supabase project: Dashboard -> SQL Editor -> New query -> paste -> Run.

-- Saved quotes & invoices (full document lives in `data`; the columns are for fast listing)
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  doc_no text not null default '',
  doc_type text not null default 'quote',
  customer text not null default '',
  status text not null default 'draft',
  total numeric not null default 0,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Single-row app settings (business details, counters, GST flag)
create table if not exists public.app_settings (
  id int primary key check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Lock everything down to signed-in users only (you create the user in Authentication -> Users)
alter table public.quotes enable row level security;
alter table public.app_settings enable row level security;

drop policy if exists "authenticated full access quotes" on public.quotes;
create policy "authenticated full access quotes" on public.quotes
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access settings" on public.app_settings;
create policy "authenticated full access settings" on public.app_settings
  for all to authenticated using (true) with check (true);

-- No anonymous access: the anon key alone can read/write NOTHING without a signed-in user.
