-- ============================================
-- Liberta — Database Schema
-- Execute this in the Supabase SQL Editor
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text default 'user' not null check (role in ('user', 'admin')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

-- Security Definer function to check admin role without recursive RLS
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer set search_path = ''
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'user')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- CATEGORIES
-- ============================================
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  icon text,
  color text,
  created_at timestamptz default now() not null
);

alter table public.categories enable row level security;

create policy "Users can manage their own categories"
  on public.categories for all
  using (auth.uid() = user_id or public.is_admin());

-- Default categories (inserted per user via function)
create or replace function public.create_default_categories()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.categories (user_id, name, type, icon, color) values
    (new.id, 'Salário', 'income', 'Banknote', '#22c55e'),
    (new.id, 'Freelance', 'income', 'Laptop', '#3b82f6'),
    (new.id, 'Investimentos', 'income', 'TrendingUp', '#8b5cf6'),
    (new.id, 'Outros (Receita)', 'income', 'Plus', '#06b6d4'),
    (new.id, 'Alimentação', 'expense', 'UtensilsCrossed', '#ef4444'),
    (new.id, 'Transporte', 'expense', 'Car', '#f97316'),
    (new.id, 'Moradia', 'expense', 'Home', '#eab308'),
    (new.id, 'Saúde', 'expense', 'Heart', '#ec4899'),
    (new.id, 'Educação', 'expense', 'GraduationCap', '#6366f1'),
    (new.id, 'Lazer', 'expense', 'Gamepad2', '#14b8a6'),
    (new.id, 'Assinaturas', 'expense', 'CreditCard', '#f43f5e'),
    (new.id, 'Outros (Despesa)', 'expense', 'Minus', '#78716c');
  return new;
end;
$$;

create or replace trigger on_auth_user_created_categories
  after insert on auth.users
  for each row execute function public.create_default_categories();

-- ============================================
-- TRANSACTIONS
-- ============================================
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category_id uuid references public.categories on delete set null,
  description text not null,
  amount numeric(12, 2) not null,
  type text not null check (type in ('income', 'expense')),
  date date not null default current_date,
  notes text,
  created_at timestamptz default now() not null
);

alter table public.transactions enable row level security;

create policy "Users can manage their own transactions"
  on public.transactions for all
  using (auth.uid() = user_id or public.is_admin());

-- Index for performance
create index idx_transactions_user_date on public.transactions (user_id, date desc);
create index idx_transactions_user_type on public.transactions (user_id, type);

-- ============================================
-- GOALS
-- ============================================
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  target_amount numeric(12, 2) not null,
  current_amount numeric(12, 2) default 0 not null,
  deadline date,
  icon text,
  color text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.goals enable row level security;

create policy "Users can manage their own goals"
  on public.goals for all
  using (auth.uid() = user_id or public.is_admin());

-- ============================================
-- AI MESSAGES
-- ============================================
create table public.ai_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now() not null
);

alter table public.ai_messages enable row level security;

create policy "Users can manage their own ai messages"
  on public.ai_messages for all
  using (auth.uid() = user_id or public.is_admin());
