-- Gift portraits (e.g. creator outreach): a reveal link not tied to an order.
create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reveal_token text unique not null default encode(extensions.gen_random_bytes(16), 'hex'),
  generation_id uuid references public.generations (id) on delete set null,
  partner_id uuid references public.partners (id) on delete set null,
  recipient_name text,
  pet_name text,
  sender_name text default 'The Pup Prints studio',
  message text,
  source_photo_url text,
  viewed_at timestamptz,
  view_count int not null default 0
);
alter table public.gifts enable row level security;
create policy server_all on public.gifts for all to anon, authenticated
  using (private.is_server()) with check (private.is_server());
