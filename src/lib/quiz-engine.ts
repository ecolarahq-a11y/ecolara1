import type { QuizQuestion } from "@/data/modules";

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  pointsAwarded: number;
  nextDifficulty: Difficulty;
  feedbackMessage: string;
  newBadges: string[];
}

export function calculateQuizResult(
  score: number,
  total: number,
  moduleId: number,
  completedModules: number[],
  allQuizScores: Record<number, number>,
  consecutivePasses: number,
  earnedBadges: string[]
): QuizResult {
  const percentage = Math.round((score / total) * 100);
  let pointsAwarded: number;
  let nextDifficulty: Difficulty;
  let feedbackMessage: string;

  if (percentage <= 30) {
    nextDifficulty = "easy";
    pointsAwarded = 5;
    feedbackMessage = "Keep pushing! Every expert started as a beginner.";
  } else if (percentage <= 50) {
    nextDifficulty = "easy";
    pointsAwarded = 10;
    feedbackMessage = "Good effort! Try this module again to improve.";
  } else if (percentage <= 70) {
    nextDifficulty = "medium";
    pointsAwarded = 20;
    feedbackMessage = "Nice work! You are making real progress.";
  } else if (percentage <= 80) {
    nextDifficulty = "medium";
    pointsAwarded = 30;
    feedbackMessage = "Great job! You are almost at the top.";
  } else {
    nextDifficulty = "hard";
    pointsAwarded = 50;
    feedbackMessage = "Outstanding! You have mastered this topic.";
  }

  const newBadges: string[] = [];
  const updatedModules = completedModules.includes(moduleId) ? completedModules : [...completedModules, moduleId];
  const updatedScores = { ...allQuizScores, [moduleId]: Math.max(allQuizScores[moduleId] || 0, percentage) };

  if (moduleId === 1 && !earnedBadges.includes("climate-beginner")) {
    newBadges.push("climate-beginner");
  }
  if (updatedModules.length >= 3 && !earnedBadges.includes("knowledge-seeker")) {
    newBadges.push("knowledge-seeker");
  }
  if (percentage > 50 && !earnedBadges.includes("quiz-challenger")) {
    newBadges.push("quiz-challenger");
  }
  if (percentage > 80 && !earnedBadges.includes("quiz-master")) {
    newBadges.push("quiz-master");
  }
  if (updatedModules.length >= 5 && !earnedBadges.includes("eco-warrior")) {
    newBadges.push("eco-warrior");
  }
  if (percentage === 100 && !earnedBadges.includes("perfect-score")) {
    newBadges.push("perfect-score");
  }
  const allFiveScored = [1,2,3,4,5].every(id => (updatedScores[id] || 0) > 80);
  if (allFiveScored && !earnedBadges.includes("climate-champion")) {
    newBadges.push("climate-champion");
  }
  const newConsecutive = percentage >= 50 ? consecutivePasses + 1 : 0;
  if (newConsecutive >= 3 && !earnedBadges.includes("unstoppable")) {
    newBadges.push("unstoppable");
  }

  return { score, total, percentage, pointsAwarded, nextDifficulty, feedbackMessage, newBadges };
}

export function getQuestionsForDifficulty(questions: QuizQuestion[], difficulty: Difficulty, count = 5): QuizQuestion[] {
  const filtered = questions.filter(q => q.difficulty === difficulty);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
