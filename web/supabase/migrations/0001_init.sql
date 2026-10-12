-- Pup Prints initial schema.
-- Access model: the browser never talks to Supabase directly. The Next.js server
-- uses the publishable (anon) key plus an `x-pp-server-key` header; RLS policies
-- allow full access only when that header hashes to the value in private.app_secrets.
-- (Set it once with: insert into private.app_secrets(name, sha256) values ('server_key', '<sha256 hex>');)

create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.app_secrets (
  name text primary key,
  sha256 text not null
);

create or replace function private.is_server()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.app_secrets s
    where s.name = 'server_key'
      and s.sha256 = encode(
        extensions.digest(
          coalesce((current_setting('request.headers', true)::json ->> 'x-pp-server-key'), ''),
          'sha256'
        ),
        'hex'
      )
  );
$$;

grant usage on schema private to anon, authenticated;
grant execute on function private.is_server() to anon, authenticated;

-- updated_at columns are set by the application on update.

-- Photos customers upload
create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text,
  ip_hash text,
  storage_path text not null,
  width int,
  height int,
  bytes int,
  mime text
);
create index if not exists uploads_session_idx on public.uploads (session_id);

-- AI portrait generations (one per style attempt)
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  upload_id uuid references public.uploads (id) on delete set null,
  session_id text,
  ip_hash text,
  email text,
  pet_name text,
  style text not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'succeeded', 'failed')),
  provider text,
  model text,
  seed int,
  full_path text,
  preview_path text,
  width int,
  height int,
  error text,
  duration_ms int
);
create index if not exists generations_session_idx on public.generations (session_id, created_at desc);
create index if not exists generations_ip_idx on public.generations (ip_hash, created_at desc);

-- Orders (created by the Stripe webhook)
create sequence if not exists public.order_number_seq start 10241;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  order_number text unique not null default ('PP-' || nextval('public.order_number_seq')::text),
  stripe_session_id text unique,
  stripe_payment_intent text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'in_production', 'shipped', 'delivered', 'canceled', 'refunded', 'needs_attention')),
  email text,
  customer_name text,
  phone text,
  shipping_address jsonb,
  items jsonb not null default '[]'::jsonb,
  subtotal_cents int,
  shipping_cents int,
  discount_cents int,
  tax_cents int,
  total_cents int,
  currency text not null default 'usd',
  referral_code text,
  utm jsonb,
  gift_message text,
  fulfillment_provider text,
  fulfillment_order_id text,
  fulfillment_status text,
  tracking_number text,
  tracking_url text,
  carrier text,
  print_files jsonb,
  notes text
);
create index if not exists orders_email_idx on public.orders (lower(email));
create index if not exists orders_status_idx on public.orders (status, created_at desc);

-- Email subscribers / preview savers
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  source text,
  pet_name text,
  generation_id uuid references public.generations (id) on delete set null,
  referral_code text,
  utm jsonb,
  consent boolean not null default true,
  unsubscribed_at timestamptz
);
create unique index if not exists leads_email_uidx on public.leads (lower(email));

-- Influencer / affiliate CRM
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text,
  handle text,
  platform text,
  profile_url text,
  followers int,
  tier text check (tier in ('nano', 'micro', 'mid', 'macro', 'mega')),
  niche text,
  email text,
  status text not null default 'prospect'
    check (status in ('prospect', 'applied', 'contacted', 'replied', 'negotiating', 'gifted', 'active', 'paused', 'declined')),
  code text unique,
  commission_rate numeric not null default 0.15,
  discount_percent int not null default 15,
  source text,
  notes text,
  last_contacted_at timestamptz,
  application jsonb
);
create unique index if not exists partners_platform_handle_uidx on public.partners (platform, lower(handle));

-- Referral clicks + attributed orders
create table if not exists public.referral_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  code text not null,
  type text not null check (type in ('click', 'order')),
  landing text,
  order_id uuid references public.orders (id) on delete set null,
  amount_cents int,
  commission_cents int,
  utm jsonb
);
create index if not exists referral_events_code_idx on public.referral_events (upper(code), created_at desc);

-- Contact form
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text not null,
  order_number text,
  topic text,
  message text not null,
  handled boolean not null default false
);

-- RLS: server-only access everywhere
do $$
declare t text;
begin
  foreach t in array array['uploads', 'generations', 'orders', 'leads', 'partners', 'referral_events', 'contact_messages']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists server_all on public.%I', t);
    execute format(
      'create policy server_all on public.%I for all to anon, authenticated using (private.is_server()) with check (private.is_server())',
      t
    );
  end loop;
end $$;

grant usage, select on sequence public.order_number_seq to anon, authenticated;
grant usage, select on sequence public.referral_events_id_seq to anon, authenticated;

-- Storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('uploads', 'uploads', false, 15728640, array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']),
  ('portraits', 'portraits', false, 52428800, array['image/png', 'image/jpeg', 'image/webp']),
  ('previews', 'previews', true, 10485760, array['image/jpeg', 'image/webp', 'image/png'])
on conflict (id) do nothing;

drop policy if exists pp_server_objects on storage.objects;
create policy pp_server_objects on storage.objects
  for all to anon, authenticated
  using (bucket_id in ('uploads', 'portraits', 'previews') and private.is_server())
  with check (bucket_id in ('uploads', 'portraits', 'previews') and private.is_server());
