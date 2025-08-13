# Supabase Configuration for HME Camp Logistics Manager (Frontend)

This document records the Supabase setup, database schema, RLS policies, and the frontend integration details.

Status:
- Env vars present: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY
- Supabase tools auto-setup attempt: public.run_sql RPC missing (see below)
- Frontend integration: Completed (supabase-js installed, client configured, auth flow and callback implemented)

IMPORTANT: In your Supabase Dashboard:
1) Authentication > URL Configuration
   - Site URL: Set to your production domain or dev URL (e.g., http://localhost:3000)
   - Additional Redirect URLs:
     - http://localhost:3000/**
     - https://yourapp.com/** (replace with your prod domain)
2) Authentication > Email Templates
   - Ensure templates use the site URL and redirect values
3) RLS policies must be enabled for tables and properly configured (see below)
4) For OAuth or magic link flows, ensure Redirect URLs match the getURL() used on the frontend

Environment variables (frontend):
- REACT_APP_SUPABASE_URL=[your supabase project url]
- REACT_APP_SUPABASE_KEY=[your supabase anon key]
- Optional: REACT_APP_SITE_URL=[prod app url] (fallbacks to http://localhost:3000)

--------------------------------------------------------------------------------
Tooling bootstrap issue (public.run_sql)
--------------------------------------------------------------------------------
Supabase tool calls failed because the helper RPC public.run_sql(query text) is not installed on your project. To enable automated tooling and future migrations, run this SQL in the Supabase SQL Editor:

-- Create helper RPC for tooling (optional but recommended for automation)
create or replace function public.run_sql(query text)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  execute format('select coalesce(json_agg(t), ''[]''::json) from (%s) t', query) into result;
  return result;
exception when others then
  return json_build_object('error', SQLERRM);
end;
$$;

revoke all on function public.run_sql(text) from public;
grant execute on function public.run_sql(text) to anon, authenticated, service_role;

After running the above, our automation can use SupabaseTool_list_tables / create_table / run_sql idempotently.

--------------------------------------------------------------------------------
Initial schema (idempotent)
--------------------------------------------------------------------------------
-- Recommended extensions
create extension if not exists pgcrypto;

-- Users profile table (maps to Supabase auth.users via user_id)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  email text,
  name text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Basic domain tables for prototype stage (simplified)
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  crew text not null,
  slots integer not null default 1,
  assignees uuid[] default '{}'::uuid[],
  created_at timestamptz default now()
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null,
  type text not null,
  signups uuid[] default '{}'::uuid[],
  created_at timestamptz default now()
);

create table if not exists public.dues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  description text not null,
  amount numeric(10,2) not null,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null,
  category text not null,
  created_at timestamptz default now()
);

--------------------------------------------------------------------------------
RLS Policies
--------------------------------------------------------------------------------
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.jobs enable row level security;
alter table public.meals enable row level security;
alter table public.dues enable row level security;
alter table public.calendar_events enable row level security;

-- Profiles: users can read/update their own profile
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = user_id);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = user_id);

-- Optionally allow profile insert via service role or PostgREST JWT for signup flows
-- (Recommend creating row on sign up via function & trigger; not included here)

-- Members: read for all authenticated; write for admins only
drop policy if exists "members_read_all" on public.members;
create policy "members_read_all" on public.members
  for select to authenticated using (true);

drop policy if exists "members_write_admins" on public.members;
create policy "members_write_admins" on public.members
  for all to authenticated using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin = true)
  );

-- Jobs: read for all authenticated; write for admins
drop policy if exists "jobs_read_all" on public.jobs;
create policy "jobs_read_all" on public.jobs
  for select to authenticated using (true);

drop policy if exists "jobs_write_admins" on public.jobs;
create policy "jobs_write_admins" on public.jobs
  for all to authenticated using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin = true)
  );

-- Meals: read for all authenticated; write for admins
drop policy if exists "meals_read_all" on public.meals;
create policy "meals_read_all" on public.meals
  for select to authenticated using (true);

drop policy if exists "meals_write_admins" on public.meals;
create policy "meals_write_admins" on public.meals
  for all to authenticated using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin = true)
  );

-- Dues: users can read their own + admins can read all; write restricted to admins or owner actions
drop policy if exists "dues_read_self_or_admin" on public.dues;
create policy "dues_read_self_or_admin" on public.dues
  for select to authenticated using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin = true)
  );

drop policy if exists "dues_write_admins" on public.dues;
create policy "dues_write_admins" on public.dues
  for all to authenticated using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin = true)
  );

-- Calendar: read for all authenticated; write for admins
drop policy if exists "calendar_read_all" on public.calendar_events;
create policy "calendar_read_all" on public.calendar_events
  for select to authenticated using (true);

drop policy if exists "calendar_write_admins" on public.calendar_events;
create policy "calendar_write_admins" on public.calendar_events
  for all to authenticated using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin = true)
  );

--------------------------------------------------------------------------------
Frontend Integration Summary
--------------------------------------------------------------------------------
- Library: @supabase/supabase-js installed
- Files added:
  - src/utils/getURL.js (dynamic URL builder)
  - src/utils/supabase.js (client factory using REACT_APP_SUPABASE_URL/KEY)
  - src/utils/auth.js (auth error handler)
  - src/pages/AuthCallback.js (handles OAuth/magic link callback with exchangeCodeForSession)
  - src/context/AuthContext.js (integrated with Supabase auth state; signIn/signOut helpers)
  - src/services/api.js updated to send Authorization: Bearer <access_token> to backend

Auth flows implemented on frontend:
- Magic link sign-in (signInWithMagicLink)
- Email/password sign up/sign in scaffolding methods in context can be added as needed
- Callback route: /auth/callback (ensure it is whitelisted in Supabase redirect URLs)

Usage notes:
- To sign-in with a magic link, wire a simple UI to call context.loginWithMagicLink(email)
- After a successful callback, users are redirected to / (Dashboard)
- isAdmin is based on profiles.is_admin; Populate that via admin dashboard or SQL

Troubleshooting:
- If you see "supabaseUrl is required" at runtime, the frontend doesn't have REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_KEY at build time. Fix:
  1) Copy .env.example to .env in the frontend root, and fill in values:
     - REACT_APP_SUPABASE_URL=https://<your-project>.supabase.co
     - REACT_APP_SUPABASE_KEY=<your-anon-key>
     - Optional: REACT_APP_SITE_URL, REACT_APP_API_BASE_URL, REACT_APP_VENMO_HANDLE
  2) Restart the dev server (env vars are baked at build time in CRA).
  3) Never commit secrets (.env) to source control.
- If redirects fail, confirm the Redirect URL allowlist in Supabase Authentication settings includes your dev and prod URLs with /** wildcard.
- If API requests to your future backend need the Supabase JWT, api.js now attaches the bearer token automatically when available.

Change log:
- Attempted SupabaseTool_list_tables, SupabaseTool_create_table, SupabaseTool_run_sql failed due to missing public.run_sql RPC.
- Provided SQL to bootstrap RPC and idempotent schema + RLS.
- Integrated frontend with Supabase.

