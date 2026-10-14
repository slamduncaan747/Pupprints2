-- Rule-of-100 scorecard (admin): primary acquisition actions logged per channel per day, plus
-- ad spend, so /admin/scorecard can compare inputs (actions, $) with outcomes (leads, orders).
-- One row per (day, channel). `day` is the founder's calendar day in America/New_York.
create table if not exists public.daily_actions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  day date not null,
  channel text not null
    check (channel in (
      'creator_dm', 'b2b_email', 'b2b_walkin', 'content_post', 'ad_boost',
      'etsy', 'community_post', 'follow_up', 'other'
    )),
  count int not null default 0 check (count >= 0),
  -- Paid spend attributed to this channel on this day (e.g. ad_boost = Meta/TikTok boosts, etsy = Etsy Ads).
  ad_spend_cents int not null default 0 check (ad_spend_cents >= 0),
  notes text,
  unique (day, channel)
);

-- Server-only access, same model as every other table (see 0001 / 0003).
alter table public.daily_actions enable row level security;
drop policy if exists server_all on public.daily_actions;
create policy server_all on public.daily_actions for all to anon, authenticated
  using (private.is_server()) with check (private.is_server());
revoke truncate, references, trigger on public.daily_actions from anon, authenticated;

-- Atomic +N / -N for the scorecard buttons, so rapid taps or two devices never lose a count.
-- SECURITY INVOKER: the server-only RLS policy above applies to every call.
create or replace function public.bump_daily_action(p_day date, p_channel text, p_delta int)
returns int
language sql
security invoker
set search_path = ''
as $$
  insert into public.daily_actions as d (day, channel, count)
  values (p_day, p_channel, greatest(0, p_delta))
  on conflict (day, channel) do update
    set count = greatest(0, d.count + p_delta), updated_at = now()
  returning d.count;
$$;
revoke execute on function public.bump_daily_action(date, text, int) from public;
grant execute on function public.bump_daily_action(date, text, int) to anon, authenticated;
