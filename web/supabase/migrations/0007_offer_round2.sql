-- Offer round 2 (Oct 14, 2026): "How did you hear about us?" on orders, and the
-- "Is this in memory?" flag that routes a customer to the gentle track (no urgency, no promos).
-- Only new nullable columns on tables that already carry the server-only RLS policy from 0001
-- (orders, generations, leads), so no new policies are needed. Idempotent.

-- 1) Attribution survey: one optional answer on the order success page (POST /api/order/heard-from).
--    heard_from_detail holds the free text for "Other" only.
alter table public.orders
  add column if not exists heard_from text,
  add column if not exists heard_from_detail text,
  -- The order was placed with "This portrait is in memory of my dog" on: no referral asks.
  add column if not exists memorial boolean;

do $$ begin
  alter table public.orders add constraint orders_heard_from_check check (
    heard_from is null or heard_from in (
      'instagram', 'tiktok', 'google', 'pet_business', 'creator', 'friend', 'gift_reveal', 'pinterest', 'other'
    )
  );
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.orders add constraint orders_heard_from_detail_check
    check (heard_from_detail is null or char_length(heard_from_detail) <= 200);
exception when duplicate_object then null; end $$;

-- 2) "Is this in memory?": set on each preview made with the toggle on, and on the lead that saves
--    it, so the nurture series sends a gentle note instead of an offer.
alter table public.generations add column if not exists memorial boolean;
alter table public.leads add column if not exists memorial boolean;
