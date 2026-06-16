
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS last_mentor_reward_date date;

CREATE OR REPLACE FUNCTION public.award_mentor_points()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_today date := (now() AT TIME ZONE 'UTC')::date;
  v_last date;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT last_mentor_reward_date INTO v_last FROM public.user_progress
    WHERE user_id = v_uid FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.user_progress (user_id, total_points, last_mentor_reward_date)
      VALUES (v_uid, 5, v_today);
    RETURN jsonb_build_object('awarded', true, 'points', 5);
  END IF;

  IF v_last IS NOT NULL AND v_last = v_today THEN
    RETURN jsonb_build_object('awarded', false, 'points', 0);
  END IF;

  UPDATE public.user_progress
    SET total_points = total_points + 5,
        last_mentor_reward_date = v_today,
        updated_at = now()
    WHERE user_id = v_uid;

  RETURN jsonb_build_object('awarded', true, 'points', 5);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.award_mentor_points() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_mentor_points() TO authenticated;
