
-- 1. Lock down daily_missions: only RPC writes allowed
REVOKE INSERT, UPDATE, DELETE ON public.daily_missions FROM authenticated;
DROP POLICY IF EXISTS "Users insert own missions" ON public.daily_missions;
DROP POLICY IF EXISTS "Users update own missions" ON public.daily_missions;

-- 2. Lock down mentor_usage: only RPC writes allowed
REVOKE INSERT, UPDATE, DELETE ON public.mentor_usage FROM authenticated;

-- 3. Restrict profiles to owner only
DROP POLICY IF EXISTS "Authenticated can view profile names" ON public.profiles;

-- 4. Restrict user_progress to owner only
DROP POLICY IF EXISTS "Authenticated can view leaderboard stats" ON public.user_progress;

-- 5. Leaderboard RPC exposing only safe fields
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  user_id uuid,
  display_name text,
  total_points integer,
  level integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT up.user_id,
         COALESCE(p.display_name, 'Eco Learner') AS display_name,
         up.total_points,
         up.level
  FROM public.user_progress up
  LEFT JOIN public.profiles p ON p.user_id = up.user_id
  ORDER BY up.total_points DESC
  LIMIT 20;
$$;

REVOKE EXECUTE ON FUNCTION public.get_leaderboard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO authenticated;
