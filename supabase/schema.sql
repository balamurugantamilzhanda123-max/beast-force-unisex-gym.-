create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  phone text not null,
  email text not null,
  age integer not null check (age between 12 and 90),
  gender text not null check (gender in ('female', 'male', 'non_binary', 'prefer_not_to_say')),
  address text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_inr integer not null check (price_inr >= 0),
  duration_days integer not null check (duration_days > 0),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  member_id uuid not null references public.members(id) on delete cascade,
  plan_id uuid not null references public.membership_plans(id),
  start_date date not null,
  expiry_date date not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'expired', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  membership_id uuid not null references public.memberships(id) on delete cascade,
  amount_inr integer not null,
  currency text not null default 'INR',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  provider text not null default 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  provider_signature text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text not null,
  bio text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete set null,
  channel text not null check (channel in ('email', 'whatsapp', 'voice')),
  kind text not null check (kind in ('membership_confirmation', 'expiry_reminder', 'manual')),
  recipient text not null,
  status text not null check (status in ('sent', 'failed', 'skipped')),
  message text not null,
  provider_response jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  content jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

insert into public.membership_plans (id, name, description, price_inr, duration_days, is_featured)
values
  ('00000000-0000-0000-0000-000000000030', 'Monthly', '30 days of full gym access.', 1999, 30, false),
  ('00000000-0000-0000-0000-000000000090', 'Quarterly', '90 days of consistent strength training.', 4999, 90, true),
  ('00000000-0000-0000-0000-000000000365', 'Yearly', '365 days of premium fitness support.', 15999, 365, false)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price_inr = excluded.price_inr,
  duration_days = excluded.duration_days,
  is_featured = excluded.is_featured;

alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.membership_plans enable row level security;
alter table public.memberships enable row level security;
alter table public.payments enable row level security;
alter table public.trainers enable row level security;
alter table public.facilities enable row level security;
alter table public.gallery_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.notification_logs enable row level security;
alter table public.site_content enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  );
$$;

drop policy if exists "public read active plans" on public.membership_plans;
drop policy if exists "public read active trainers" on public.trainers;
drop policy if exists "public read active facilities" on public.facilities;
drop policy if exists "public read active gallery" on public.gallery_items;
drop policy if exists "admin manage profiles" on public.profiles;
drop policy if exists "admin manage members" on public.members;
drop policy if exists "admin manage memberships" on public.memberships;
drop policy if exists "admin manage payments" on public.payments;
drop policy if exists "admin manage content" on public.site_content;
drop policy if exists "admin manage messages" on public.contact_messages;
drop policy if exists "admin manage notifications" on public.notification_logs;
drop policy if exists "customer read own member" on public.members;
drop policy if exists "customer read own memberships" on public.memberships;
drop policy if exists "customer read own payments" on public.payments;

create policy "public read active plans" on public.membership_plans for select using (is_active = true or public.is_admin());
create policy "public read active trainers" on public.trainers for select using (is_active = true or public.is_admin());
create policy "public read active facilities" on public.facilities for select using (is_active = true or public.is_admin());
create policy "public read active gallery" on public.gallery_items for select using (is_active = true or public.is_admin());
create policy "admin manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage members" on public.members for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage memberships" on public.memberships for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage payments" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage content" on public.site_content for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage messages" on public.contact_messages for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage notifications" on public.notification_logs for all using (public.is_admin()) with check (public.is_admin());
create policy "customer read own member" on public.members for select using (user_id = auth.uid());
create policy "customer read own memberships" on public.memberships for select using (user_id = auth.uid());
create policy "customer read own payments" on public.payments for select using (membership_id in (select id from public.memberships where user_id = auth.uid()));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
