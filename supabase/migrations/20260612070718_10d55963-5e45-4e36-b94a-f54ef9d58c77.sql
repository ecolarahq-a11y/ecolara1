
-- 1. Display name length constraint
ALTER TABLE public.profiles
  ADD CONSTRAINT display_name_length CHECK (char_length(display_name) BETWEEN 1 AND 50);

-- 2. Lock down internal SECURITY DEFINER trigger helpers
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 3. Server-side quiz scoring RPC
CREATE OR REPLACE FUNCTION public.submit_quiz_result(
  p_module_id integer,
  p_correct integer,
  p_total integer
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_total int;
  v_correct int;
  v_pct int;
  v_points int;
  v_next_difficulty text;
  v_feedback text;
  v_prog public.user_progress%ROWTYPE;
  v_modules int[];
  v_scores jsonb;
  v_badges text[];
  v_diff jsonb;
  v_consec int;
  v_new_badges text[] := ARRAY[]::text[];
  v_prev int;
  v_all_five boolean;
  v_level int;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_module_id IS NULL OR p_module_id < 1 OR p_module_id > 100 THEN
    RAISE EXCEPTION 'Invalid module id';
  END IF;
  v_total := LEAST(GREATEST(COALESCE(p_total, 0), 1), 5);
  v_correct := LEAST(GREATEST(COALESCE(p_correct, 0), 0), v_total);
  v_pct := ROUND((v_correct::numeric / v_total) * 100)::int;

  IF v_pct <= 30 THEN v_points := 5;  v_next_difficulty := 'easy';   v_feedback := 'Keep pushing! Every expert started as a beginner.';
  ELSIF v_pct <= 50 THEN v_points := 10; v_next_difficulty := 'easy';   v_feedback := 'Good effort! Try this module again to improve.';
  ELSIF v_pct <= 70 THEN v_points := 20; v_next_difficulty := 'medium'; v_feedback := 'Nice work! You are making real progress.';
  ELSIF v_pct <= 80 THEN v_points := 30; v_next_difficulty := 'medium'; v_feedback := 'Great job! You are almost at the top.';
  ELSE                   v_points := 50; v_next_difficulty := 'hard';   v_feedback := 'Outstanding! You have mastered this topic.';
  END IF;

  SELECT * INTO v_prog FROM public.user_progress WHERE user_id = v_uid FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.user_progress (user_id) VALUES (v_uid)
    RETURNING * INTO v_prog;
  END IF;

  v_modules := v_prog.completed_modules;
  IF NOT (p_module_id = ANY(v_modules)) THEN
    v_modules := array_append(v_modules, p_module_id);
  END IF;

  v_scores := v_prog.quiz_scores;
  v_prev := COALESCE((v_scores ->> p_module_id::text)::int, 0);
  v_scores := v_scores || jsonb_build_object(p_module_id::text, GREATEST(v_prev, v_pct));

  v_diff := v_prog.current_difficulty || jsonb_build_object(p_module_id::text, v_next_difficulty);

  v_consec := CASE WHEN v_pct >= 50 THEN v_prog.consecutive_passes + 1 ELSE 0 END;

  v_badges := v_prog.earned_badges;
  IF p_module_id = 1 AND NOT ('climate-beginner' = ANY(v_badges)) THEN
    v_badges := array_append(v_badges, 'climate-beginner'); v_new_badges := array_append(v_new_badges, 'climate-beginner');
  END IF;
  IF array_length(v_modules,1) >= 3 AND NOT ('knowledge-seeker' = ANY(v_badges)) THEN
    v_badges := array_append(v_badges, 'knowledge-seeker'); v_new_badges := array_append(v_new_badges, 'knowledge-seeker');
  END IF;
  IF v_pct > 50 AND NOT ('quiz-challenger' = ANY(v_badges)) THEN
    v_badges := array_append(v_badges, 'quiz-challenger'); v_new_badges := array_append(v_new_badges, 'quiz-challenger');
  END IF;
  IF v_pct > 80 AND NOT ('quiz-master' = ANY(v_badges)) THEN
    v_badges := array_append(v_badges, 'quiz-master'); v_new_badges := array_append(v_new_badges, 'quiz-master');
  END IF;
  IF array_length(v_modules,1) >= 5 AND NOT ('eco-warrior' = ANY(v_badges)) THEN
    v_badges := array_append(v_badges, 'eco-warrior'); v_new_badges := array_append(v_new_badges, 'eco-warrior');
  END IF;
  IF v_pct = 100 AND NOT ('perfect-score' = ANY(v_badges)) THEN
    v_badges := array_append(v_badges, 'perfect-score'); v_new_badges := array_append(v_new_badges, 'perfect-score');
  END IF;
  v_all_five := (COALESCE((v_scores->>'1')::int,0) > 80
    AND COALESCE((v_scores->>'2')::int,0) > 80
    AND COALESCE((v_scores->>'3')::int,0) > 80
    AND COALESCE((v_scores->>'4')::int,0) > 80
    AND COALESCE((v_scores->>'5')::int,0) > 80);
  IF v_all_five AND NOT ('climate-champion' = ANY(v_badges)) THEN
    v_badges := array_append(v_badges, 'climate-champion'); v_new_badges := array_append(v_new_badges, 'climate-champion');
  END IF;
  IF v_consec >= 3 AND NOT ('unstoppable' = ANY(v_badges)) THEN
    v_badges := array_append(v_badges, 'unstoppable'); v_new_badges := array_append(v_new_badges, 'unstoppable');
  END IF;

  v_prog.total_points := v_prog.total_points + v_points;
  v_level := CASE
    WHEN v_prog.total_points >= 500 THEN 10
    WHEN v_prog.total_points >= 400 THEN 9
    WHEN v_prog.total_points >= 320 THEN 8
    WHEN v_prog.total_points >= 250 THEN 7
    WHEN v_prog.total_points >= 190 THEN 6
    WHEN v_prog.total_points >= 140 THEN 5
    WHEN v_prog.total_points >= 100 THEN 4
    WHEN v_prog.total_points >= 60  THEN 3
    WHEN v_prog.total_points >= 30  THEN 2
    ELSE 1
  END;

  UPDATE public.user_progress SET
    total_points = v_prog.total_points,
    completed_modules = v_modules,
    quiz_scores = v_scores,
    earned_badges = v_badges,
    current_difficulty = v_diff,
    consecutive_passes = v_consec,
    level = v_level,
    updated_at = now()
  WHERE user_id = v_uid;

  RETURN jsonb_build_object(
    'score', v_correct,
    'total', v_total,
    'percentage', v_pct,
    'pointsAwarded', v_points,
    'nextDifficulty', v_next_difficulty,
    'feedbackMessage', v_feedback,
    'newBadges', to_jsonb(v_new_badges)
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.submit_quiz_result(integer, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz_result(integer, integer, integer) TO authenticated;

-- 4. Reset progress RPC
CREATE OR REPLACE FUNCTION public.reset_user_progress()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  UPDATE public.user_progress SET
    total_points = 0,
    completed_modules = '{}'::int[],
    quiz_scores = '{}'::jsonb,
    earned_badges = '{}'::text[],
    current_difficulty = '{}'::jsonb,
    consecutive_passes = 0,
    level = 1,
    updated_at = now()
  WHERE user_id = v_uid;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reset_user_progress() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reset_user_progress() TO authenticated;

-- 5. Revoke direct write access on user_progress from authenticated users.
-- All writes now must go through the trusted RPCs above.
REVOKE INSERT, UPDATE, DELETE ON public.user_progress FROM authenticated;
GRANT SELECT ON public.user_progress TO authenticated;

-- 6. Hide GraphQL schema (app uses REST/PostgREST, not GraphQL)
REVOKE USAGE ON SCHEMA graphql FROM anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA graphql FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA graphql FROM anon, authenticated;
