-- Customer referrals ("Give $15, get $15") and referrer rewards.
-- Only new columns/indexes on tables that already carry the server-only RLS policy from 0001
-- (partners, referral_events, orders), so no new policies are needed. Idempotent.

-- 1) Every paying customer gets a personal referral code, stored as a partners row with
--    kind = 'customer' (source and niche 'customer'). ?ref= links, click tracking, the typed-code
--    field and the admin CRM then work unchanged. Customer codes are amount-off (discount_cents)
--    with a minimum order (min_order_cents) instead of a creator's percent-off (discount_percent).
alter table public.partners
  add column if not exists kind text not null default 'creator',
  add column if not exists discount_cents int,
  add column if not exists min_order_cents int,
  add column if not exists referrer_order_id uuid references public.orders (id) on delete set null;

do $$ begin
  alter table public.partners add constraint partners_kind_check check (kind in ('creator', 'customer'));
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.partners add constraint partners_discount_cents_check
    check ((discount_cents is null or discount_cents >= 0) and (min_order_cents is null or min_order_cents >= 0));
exception when duplicate_object then null; end $$;

-- One personal code per customer email.
create unique index if not exists partners_customer_email_uidx on public.partners (lower(email)) where kind = 'customer';
create index if not exists partners_kind_idx on public.partners (kind, created_at desc);

-- 2) The referrer's $15 reward lives on the friend's attributed order event:
--    pending (friend paid; waiting out the 30-day guarantee window) → issued (single-use code
--    emailed) or void (refunded, not a first order, self-referral, annual cap).
alter table public.referral_events
  add column if not exists reward_status text,
  add column if not exists reward_due_at timestamptz,
  add column if not exists reward_code text,
  add column if not exists reward_issued_at timestamptz,
  add column if not exists reward_note text;

do $$ begin
  alter table public.referral_events add constraint referral_events_reward_status_check
    check (reward_status is null or reward_status in ('pending', 'issued', 'void'));
exception when duplicate_object then null; end $$;

-- One attributed-order event per order (webhook retries and the success page can race).
create unique index if not exists referral_events_order_uidx on public.referral_events (order_id) where type = 'order';
create index if not exists referral_events_reward_idx on public.referral_events (reward_status, reward_due_at)
  where reward_status is not null;

-- 3) Orders: the "Give $15, get $15" reminder, sent once about 7 days after delivery.
alter table public.orders add column if not exists referral_reminder_sent_at timestamptz;
