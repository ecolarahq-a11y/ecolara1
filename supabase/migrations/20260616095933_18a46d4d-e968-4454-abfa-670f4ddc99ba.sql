-- Allow authenticated users to read display_name from profiles for leaderboard
CREATE POLICY "Authenticated can view profile names"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to read total_points and level from user_progress for leaderboard
CREATE POLICY "Authenticated can view leaderboard stats"
ON public.user_progress FOR SELECT
TO authenticated
USING (true);

GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.user_progress TO authenticated;

-- Daily missions table
CREATE TABLE public.daily_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mission_date date NOT NULL DEFAULT CURRENT_DATE,
  mission_1_done boolean NOT NULL DEFAULT false,
  mission_2_done boolean NOT NULL DEFAULT false,
  mission_3_done boolean NOT NULL DEFAULT false,
  mission_1_rewarded boolean NOT NULL DEFAULT false,
  mission_2_rewarded boolean NOT NULL DEFAULT false,
  mission_3_rewarded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, mission_date)
);

GRANT SELECT, INSERT, UPDATE ON public.daily_missions TO authenticated;
GRANT ALL ON public.daily_missions TO service_role;

ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own missions" ON public.daily_missions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own missions" ON public.daily_missions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own missions" ON public.daily_missions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_daily_missions_updated_at
  BEFORE UPDATE ON public.daily_missions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Get or create today's missions row
CREATE OR REPLACE FUNCTION public.get_or_create_daily_missions()
RETURNS public.daily_missions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_today date := (now() AT TIME ZONE 'UTC')::date;
  v_row public.daily_missions;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO v_row FROM public.daily_missions
    WHERE user_id = v_uid AND mission_date = v_today;
  IF NOT FOUND THEN
    INSERT INTO public.daily_missions (user_id, mission_date)
      VALUES (v_uid, v_today)
      RETURNING * INTO v_row;
  END IF;
  RETURN v_row;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_or_create_daily_missions() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_or_create_daily_missions() TO authenticated;

-- Complete a mission and award points
CREATE OR REPLACE FUNCTION public.complete_mission(p_mission_number integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_today date := (now() AT TIME ZONE 'UTC')::date;
  v_row public.daily_missions;
  v_reward int;
  v_was_done boolean;
  v_was_rewarded boolean;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_mission_number NOT IN (1,2,3) THEN RAISE EXCEPTION 'Invalid mission'; END IF;

  SELECT * INTO v_row FROM public.daily_missions
    WHERE user_id = v_uid AND mission_date = v_today FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.daily_missions (user_id, mission_date)
      VALUES (v_uid, v_today) RETURNING * INTO v_row;
  END IF;

  v_reward := CASE p_mission_number WHEN 1 THEN 15 WHEN 2 THEN 20 WHEN 3 THEN 10 END;

  IF p_mission_number = 1 THEN
    v_was_done := v_row.mission_1_done; v_was_rewarded := v_row.mission_1_rewarded;
  ELSIF p_mission_number = 2 THEN
    v_was_done := v_row.mission_2_done; v_was_rewarded := v_row.mission_2_rewarded;
  ELSE
    v_was_done := v_row.mission_3_done; v_was_rewarded := v_row.mission_3_rewarded;
  END IF;

  IF NOT v_was_rewarded THEN
    UPDATE public.user_progress SET total_points = total_points + v_reward, updated_at = now()
      WHERE user_id = v_uid;
  END IF;

  UPDATE public.daily_missions SET
    mission_1_done = CASE WHEN p_mission_number = 1 THEN true ELSE mission_1_done END,
    mission_2_done = CASE WHEN p_mission_number = 2 THEN true ELSE mission_2_done END,
    mission_3_done = CASE WHEN p_mission_number = 3 THEN true ELSE mission_3_done END,
    mission_1_rewarded = CASE WHEN p_mission_number = 1 THEN true ELSE mission_1_rewarded END,
    mission_2_rewarded = CASE WHEN p_mission_number = 2 THEN true ELSE mission_2_rewarded END,
    mission_3_rewarded = CASE WHEN p_mission_number = 3 THEN true ELSE mission_3_rewarded END,
    updated_at = now()
  WHERE id = v_row.id
  RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'mission', p_mission_number,
    'newly_rewarded', NOT v_was_rewarded,
    'reward', v_reward,
    'row', to_jsonb(v_row)
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.complete_mission(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_mission(integer) TO authenticated;
