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
};

function getLevel(points: number): number {
  if (points >= 500) return 10;
  if (points >= 400) return 9;
  if (points >= 320) return 8;
  if (points >= 250) return 7;
  if (points >= 190) return 6;
  if (points >= 140) return 5;
  if (points >= 100) return 4;
  if (points >= 60) return 3;
  if (points >= 30) return 2;
  return 1;
}

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  // Load from Supabase on mount / user change
  useEffect(() => {
    if (!user) {
      setProgress(DEFAULT_PROGRESS);
      setLoaded(false);
      return;
    }

    const load = async () => {
      const [{ data: profile }, { data: prog }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("user_id", user.id).single(),
        supabase.from("user_progress").select("*").eq("user_id", user.id).single(),
      ]);

      if (prog) {
        setProgress({
          name: profile?.display_name || "Eco Learner",
          totalPoints: prog.total_points,
          completedModules: prog.completed_modules || [],
          quizScores: (prog.quiz_scores as Record<string, number>) 
            ? Object.fromEntries(Object.entries(prog.quiz_scores as Record<string, number>).map(([k, v]) => [Number(k), v]))
            : {},
          earnedBadges: prog.earned_badges || [],
          currentDifficulty: (prog.current_difficulty as Record<string, string>)
            ? Object.fromEntries(Object.entries(prog.current_difficulty as Record<string, string>).map(([k, v]) => [Number(k), v as "easy" | "medium" | "hard"]))
            : {},
          consecutivePasses: prog.consecutive_passes,
          level: prog.level,
        });
      }
      setLoaded(true);
    };

    load();
  }, [user]);

  // Persist to Supabase
  const saveToDb = useCallback(async (next: UserProgress) => {
    if (!user) return;
    await supabase.from("user_progress").update({
      total_points: next.totalPoints,
      completed_modules: next.completedModules,
      quiz_scores: next.quizScores as any,
      earned_badges: next.earnedBadges,
      current_difficulty: next.currentDifficulty as any,
      consecutive_passes: next.consecutivePasses,
      level: next.level,
    }).eq("user_id", user.id);
  }, [user]);

  const updateProgress = useCallback((updater: (prev: UserProgress) => UserProgress) => {
    setProgress(prev => {
      const next = updater(prev);
      next.level = getLevel(next.totalPoints);
      saveToDb(next);
      return next;
    });
  }, [saveToDb]);

  const addPoints = useCallback((points: number) => {
    updateProgress(p => ({ ...p, totalPoints: p.totalPoints + points }));
  }, [updateProgress]);

  const completeModule = useCallback((moduleId: number) => {
    updateProgress(p => ({
      ...p,
      completedModules: p.completedModules.includes(moduleId) ? p.completedModules : [...p.completedModules, moduleId],
    }));
  }, [updateProgress]);

  const recordQuizScore = useCallback((moduleId: number, percentage: number) => {
    updateProgress(p => ({
      ...p,
      quizScores: { ...p.quizScores, [moduleId]: Math.max(p.quizScores[moduleId] || 0, percentage) },
    }));
  }, [updateProgress]);

  const addBadges = useCallback((badgeIds: string[]) => {
    updateProgress(p => ({
      ...p,
      earnedBadges: [...new Set([...p.earnedBadges, ...badgeIds])],
    }));
  }, [updateProgress]);

  const setDifficulty = useCallback((moduleId: number, difficulty: "easy" | "medium" | "hard") => {
    updateProgress(p => ({
      ...p,
      currentDifficulty: { ...p.currentDifficulty, [moduleId]: difficulty },
    }));
  }, [updateProgress]);

  const updateConsecutive = useCallback((passed: boolean) => {
    updateProgress(p => ({
      ...p,
      consecutivePasses: passed ? p.consecutivePasses + 1 : 0,
    }));
  }, [updateProgress]);

  const setName = useCallback(async (name: string) => {
    updateProgress(p => ({ ...p, name }));
    if (user) {
      await supabase.from("profiles").update({ display_name: name }).eq("user_id", user.id);
    }
  }, [updateProgress, user]);

  const resetProgress = useCallback(async () => {
    const reset = { ...DEFAULT_PROGRESS, name: progress.name };
    setProgress(reset);
    if (user) {
      await supabase.from("user_progress").update({
        total_points: 0,
        completed_modules: [],
        quiz_scores: {},
        earned_badges: [],
        current_difficulty: {},
        consecutive_passes: 0,
        level: 1,
      }).eq("user_id", user.id);
    }
  }, [user, progress.name]);

  return {
    progress,
    loaded,
    addPoints,
    completeModule,
    recordQuizScore,
    addBadges,
    setDifficulty,
    updateConsecutive,
    setName,
    resetProgress,
  };
}
