export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
}

export const badges: Badge[] = [
  { id: "climate-beginner", name: "Climate Beginner", description: "Completed the very first module", icon: "🌱", criteria: "Complete Module 1" },
  { id: "knowledge-seeker", name: "Knowledge Seeker", description: "Completed three modules", icon: "📚", criteria: "Complete any 3 modules" },
  { id: "quiz-challenger", name: "Quiz Challenger", description: "Scored above 50% on a quiz", icon: "⚡", criteria: "Score 51%+ on any quiz" },
  { id: "quiz-master", name: "Quiz Master", description: "Scored above 80% on a quiz", icon: "🏆", criteria: "Score 81%+ on any quiz" },
  { id: "eco-warrior", name: "Eco Warrior", description: "Completed all five modules", icon: "🛡️", criteria: "Complete all 5 modules" },
  { id: "climate-champion", name: "Climate Champion", description: "Scored above 80% on all quizzes", icon: "👑", criteria: "Score 81%+ on all 5 quizzes" },
  { id: "perfect-score", name: "Perfect Score", description: "Scored 100% on a quiz", icon: "💯", criteria: "Get 100% on any quiz" },
  { id: "unstoppable", name: "Unstoppable", description: "3 quizzes in a row without failing", icon: "🔥", criteria: "Score 50%+ on 3 consecutive quizzes" },
];
