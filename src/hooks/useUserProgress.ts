import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface UserProgress {
  name: string;
  totalPoints: number;
  completedModules: number[];
  quizScores: Record<number, number>;
  earnedBadges: string[];
  currentDifficulty: Record<number, "easy" | "medium" | "hard">;
  consecutivePasses: number;
  level: number;
  streak: number;
  last_active_date: string | null;
}

export interface SubmitQuizResponse {
  score: number;
  total: number;
  percentage: number;
  pointsAwarded: number;
  nextDifficulty: "easy" | "medium" | "hard";
  feedbackMessage: string;
  newBadges: string[];
}

const DEFAULT_PROGRESS: UserProgress = {
  name: "Eco Learner",
  totalPoints: 0,
  completedModules: [],
  quizScores: {},
  earnedBadges: [],
  currentDifficulty: {},
  consecutivePasses: 0,
  level: 1,
  streak: 0,
  last_active_date: null,
};

function mapRow(prog: any, name: string): UserProgress {
  return {
    name,
    totalPoints: prog.total_points,
    completedModules: prog.completed_modules || [],
    quizScores: prog.quiz_scores
      ? Object.fromEntries(Object.entries(prog.quiz_scores as Record<string, number>).map(([k, v]) => [Number(k), v]))
      : {},
    earnedBadges: prog.earned_badges || [],
    currentDifficulty: prog.current_difficulty
      ? Object.fromEntries(
          Object.entries(prog.current_difficulty as Record<string, string>).map(([k, v]) => [
            Number(k),
            v as "easy" | "medium" | "hard",
          ])
        )
      : {},
    consecutivePasses: prog.consecutive_passes,
    level: prog.level,
    streak: prog.streak_count ?? 0,
    last_active_date: prog.last_active_date ?? null,
  };
}

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [{ data: profile }, { data: prog }] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("user_id", user.id).single(),
      supabase.from("user_progress").select("*").eq("user_id", user.id).single(),
    ]);
    if (prog) {
      setProgress(mapRow(prog, profile?.display_name || "Eco Learner"));
    }
    setLoaded(true);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setProgress(DEFAULT_PROGRESS);
      setLoaded(false);
      return;
    }
    refresh();
  }, [user, refresh]);

  // Server-side scored quiz submission
  const submitQuiz = useCallback(
    async (moduleId: number, correct: number, total: number): Promise<SubmitQuizResponse | null> => {
      if (!user) return null;
      const { data, error } = await supabase.rpc("submit_quiz_result", {
        p_module_id: moduleId,
        p_correct: correct,
        p_total: total,
      });
      if (error) {
        console.error("submit_quiz_result failed", error);
        return null;
      }
      await refresh();
      return data as unknown as SubmitQuizResponse;
    },
    [user, refresh]
  );

  const setName = useCallback(
    async (name: string) => {
      const trimmed = name.trim().slice(0, 50);
      if (!trimmed) return;
      setProgress((p) => ({ ...p, name: trimmed }));
      if (user) {
        await supabase.from("profiles").update({ display_name: trimmed }).eq("user_id", user.id);
      }
    },
    [user]
  );

  const resetProgress = useCallback(async () => {
    if (!user) return;
    const { error } = await supabase.rpc("reset_user_progress");
    if (error) {
      console.error("reset_user_progress failed", error);
      return;
    }
    await refresh();
  }, [user, refresh]);

  return {
    progress,
    loaded,
    submitQuiz,
    setName,
    resetProgress,
  };
}
