-- Gift Reveal + lifecycle email tracking on orders, nurture state on leads.
alter table public.orders
  add column if not exists reveal_token text unique default encode(extensions.gen_random_bytes(16), 'hex'),
  add column if not exists ship_country text,
  add column if not exists gift_sender_name text,
  add column if not exists gift_recipient_name text,
  add column if not exists gift_recipient_email text,
  add column if not exists reveal_sent_at timestamptz,
  add column if not exists reveal_viewed_at timestamptz,
  add column if not exists confirmation_sent_at timestamptz,
  add column if not exists shipped_email_sent_at timestamptz,
  add column if not exists review_request_sent_at timestamptz;

alter table public.leads
  add column if not exists nurture_step int not null default 0,
  add column if not exists last_nurture_at timestamptz,
  add column if not exists converted_order_id uuid references public.orders (id) on delete set null;
