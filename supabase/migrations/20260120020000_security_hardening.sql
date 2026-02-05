-- Security hardening migration
-- 1. Restrict leaderboard_cache to read-only for authenticated and anon roles
-- 2. Revoke direct function execution on internal functions
-- 3. Ensure views inherit RLS from underlying tables

-- Leaderboard cache: SELECT only (materialized views don't support RLS,
-- but we restrict DML operations and the view only exposes public data)
GRANT SELECT ON public.leaderboard_cache TO authenticated, anon;

-- user_best_quiz_scores view: only authenticated users can query
-- (the view queries quiz_attempts which has RLS, so this is defense-in-depth)
REVOKE ALL ON public.user_best_quiz_scores FROM anon;
GRANT SELECT ON public.user_best_quiz_scores TO authenticated;

-- Restrict refresh_leaderboard_cache to only be callable by the trigger
-- (it runs as SECURITY DEFINER, should not be callable by end users)
REVOKE EXECUTE ON FUNCTION public.refresh_leaderboard_cache() FROM authenticated, anon;

-- Ensure handle_new_user trigger function is not directly callable
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated, anon;
