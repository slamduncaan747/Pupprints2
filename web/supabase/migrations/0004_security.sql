-- Security hardening (defense in depth; the RLS model from 0001 is unchanged).

-- 1) TRUNCATE / REFERENCES / TRIGGER are not covered by row-level security. PostgREST can't
--    issue them today, but the browser-facing roles have no reason to hold them at all.
revoke truncate, references, trigger on all tables in schema public from anon, authenticated;

-- 2) /api/generate counts site-wide generations in the last 24h when
--    GLOBAL_DAILY_GENERATION_LIMIT is set; keep that count an index range scan.
create index if not exists generations_created_idx on public.generations (created_at desc);
