
ALTER TABLE public.user_progress
  ADD COLUMN IF NOT EXISTS streak_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date date;

CREATE OR REPLACE FUNCTION public.update_daily_streak()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_today date := (now() AT TIME ZONE 'UTC')::date;
  v_last date;
  v_streak int;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT last_active_date, streak_count INTO v_last, v_streak
  FROM public.user_progress WHERE user_id = v_uid FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.user_progress (user_id, streak_count, last_active_date)
    VALUES (v_uid, 1, v_today);
    RETURN 1;
  END IF;

  IF v_last IS NULL THEN
    v_streak := 1;
  ELSIF v_last = v_today THEN
    RETURN v_streak;
  ELSIF v_last = v_today - INTERVAL '1 day' THEN
    v_streak := COALESCE(v_streak, 0) + 1;
  ELSE
    v_streak := 1;
  END IF;

  UPDATE public.user_progress
  SET streak_count = v_streak, last_active_date = v_today, updated_at = now()
  WHERE user_id = v_uid;

  RETURN v_streak;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_daily_streak() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_daily_streak() TO authenticated;
