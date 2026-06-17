CREATE TABLE IF NOT EXISTS public.mentor_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  minute_window_start timestamptz NOT NULL DEFAULT now(),
  minute_count integer NOT NULL DEFAULT 0,
  day_date date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  day_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.mentor_usage TO authenticated;
GRANT ALL ON public.mentor_usage TO service_role;

ALTER TABLE public.mentor_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own mentor usage" ON public.mentor_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.check_mentor_rate_limit()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
  v_today date := (v_now AT TIME ZONE 'UTC')::date;
  v_row public.mentor_usage;
  v_minute_limit int := 5;
  v_day_limit int := 30;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT * INTO v_row FROM public.mentor_usage WHERE user_id = v_uid FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mentor_usage (user_id, minute_window_start, minute_count, day_date, day_count)
      VALUES (v_uid, v_now, 1, v_today, 1);
    RETURN jsonb_build_object('allowed', true, 'minute_remaining', v_minute_limit - 1, 'day_remaining', v_day_limit - 1);
  END IF;

  IF v_row.day_date <> v_today THEN
    v_row.day_date := v_today;
    v_row.day_count := 0;
  END IF;

  IF v_now - v_row.minute_window_start > INTERVAL '1 minute' THEN
    v_row.minute_window_start := v_now;
    v_row.minute_count := 0;
  END IF;

  IF v_row.day_count >= v_day_limit THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'daily', 'message', 'Daily limit reached (30 messages). Try again tomorrow.');
  END IF;

  IF v_row.minute_count >= v_minute_limit THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'minute', 'message', 'Slow down! You can send 5 messages per minute.');
  END IF;

  UPDATE public.mentor_usage SET
    minute_window_start = v_row.minute_window_start,
    minute_count = v_row.minute_count + 1,
    day_date = v_row.day_date,
    day_count = v_row.day_count + 1,
    updated_at = v_now
  WHERE user_id = v_uid;

  RETURN jsonb_build_object(
    'allowed', true,
    'minute_remaining', v_minute_limit - v_row.minute_count - 1,
    'day_remaining', v_day_limit - v_row.day_count - 1
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_mentor_rate_limit() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_mentor_rate_limit() TO authenticated;
