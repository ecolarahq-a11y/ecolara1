import { useState, useCallback } from "react";

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

function loadProgress(): UserProgress {
  try {
    const saved = localStorage.getItem("ecolara-progress");
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_PROGRESS;
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem("ecolara-progress", JSON.stringify(progress));
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  const updateProgress = useCallback((updater: (prev: UserProgress) => UserProgress) => {
    setProgress(prev => {
      const next = updater(prev);
      next.level = getLevel(next.totalPoints);
      saveProgress(next);
      return next;
    });
  }, []);

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

  const setName = useCallback((name: string) => {
    updateProgress(p => ({ ...p, name }));
  }, [updateProgress]);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    saveProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    progress,
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
