import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { modules } from "@/data/modules";
import { badges as allBadges } from "@/data/badges";
import { useUserProgress, type SubmitQuizResponse } from "@/hooks/useUserProgress";
import { getQuestionsForDifficulty } from "@/lib/quiz-engine";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { progress, submitQuiz } = useUserProgress();
  const mod = modules.find(m => m.id === Number(id));

  const difficulty = progress.currentDifficulty[mod?.id || 1] || "medium";
  const questions = useMemo(() => {
    if (!mod) return [];
    return getQuestionsForDifficulty(mod.questions, difficulty, 5);
  }, [mod, difficulty]);

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<SubmitQuizResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!mod || questions.length === 0) {
    return <Layout><div className="p-8 text-center text-muted-foreground">Module not found</div></Layout>;
  }

  const question = questions[currentQ];
  const isCorrect = selectedAnswer === question.correctIndex;
  const progressPct = ((currentQ + (answered ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    if (idx === question.correctIndex) setCorrectCount(c => c + 1);
  };

  const handleNext = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      if (submitting) return;
      setSubmitting(true);
      const res = await submitQuiz(mod.id, correctCount, questions.length);
      setSubmitting(false);
      if (res) setResult(res);
    }
  };


  if (result) {
    return (
      <Layout>
        <div className="container max-w-lg mx-auto px-4 py-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl mb-4 ${
            result.percentage > 80 ? "bg-primary/10" : result.percentage > 50 ? "bg-eco-sun/10" : "bg-muted"
          }`}>
            {result.percentage > 80 ? "🏆" : result.percentage > 50 ? "⭐" : "💪"}
          </div>

          <h2 className="text-2xl font-bold text-foreground">Quiz Complete!</h2>
          <p className="text-muted-foreground mt-1">{mod.title}</p>

          <div className="bg-card rounded-2xl p-6 border border-border mt-6 space-y-4">
            <div className="text-5xl font-bold text-primary">{result.percentage}%</div>
            <p className="text-sm text-muted-foreground">{result.score}/{result.total} correct</p>
            <p className="text-sm font-medium text-foreground">{result.feedbackMessage}</p>

            <div className="flex justify-center gap-4 text-sm">
              <div className="bg-muted rounded-lg px-4 py-2">
                <p className="font-bold text-foreground">+{result.pointsAwarded}</p>
                <p className="text-[10px] text-muted-foreground">Points</p>
              </div>
              <div className="bg-muted rounded-lg px-4 py-2">
                <p className="font-bold text-foreground capitalize">{result.nextDifficulty}</p>
                <p className="text-[10px] text-muted-foreground">Next Level</p>
              </div>
            </div>

            {result.newBadges.length > 0 && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 flex items-center justify-center gap-1">
                  <Trophy className="w-3 h-3" /> New Badges Earned!
                </p>
                <div className="flex justify-center gap-2">
                  {result.newBadges.map(b => {
                    const badge = allBadges.find(bd => bd.id === b);
                    return badge ? (
                      <div key={b} className="bg-primary/10 rounded-lg px-3 py-2 text-center animate-pulse-glow">
                        <span className="text-2xl">{badge.icon}</span>
                        <p className="text-[10px] font-medium text-foreground mt-1">{badge.name}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={() => navigate(`/module/${mod.id}`)} variant="outline" className="flex-1 rounded-xl">
              Review Module
            </Button>
            <Button onClick={() => navigate("/home")} className="flex-1 rounded-xl bg-primary text-primary-foreground">
              Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-muted-foreground capitalize">{difficulty} difficulty</span>
          <span className="text-sm font-semibold text-foreground">{currentQ + 1}/{questions.length}</span>
        </div>

        <Progress value={progressPct} className="h-1.5 mb-6" />

        <div className="bg-card rounded-2xl p-5 border border-border mb-4">
          <p className="text-base font-semibold text-foreground leading-relaxed">{question.question}</p>
        </div>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            let style = "bg-card border-border hover:border-primary/50";
            if (answered) {
              if (idx === question.correctIndex) style = "bg-primary/10 border-primary";
              else if (idx === selectedAnswer) style = "bg-destructive/10 border-destructive";
              else style = "bg-card border-border opacity-50";
            } else if (idx === selectedAnswer) {
              style = "bg-primary/10 border-primary";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm text-foreground">{opt}</span>
                  {answered && idx === question.correctIndex && <CheckCircle2 className="w-5 h-5 text-primary ml-auto flex-shrink-0" />}
                  {answered && idx === selectedAnswer && idx !== question.correctIndex && <XCircle className="w-5 h-5 text-destructive ml-auto flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`mt-4 p-4 rounded-xl text-sm ${isCorrect ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
            <p className="font-semibold mb-1">{isCorrect ? "Correct! ✅" : "Incorrect ❌"}</p>
            <p className="text-foreground/80">{question.explanation}</p>
          </div>
        )}

        {answered && (
          <Button onClick={handleNext} className="w-full mt-4 h-12 rounded-xl text-base font-semibold bg-primary text-primary-foreground gap-2">
            {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Layout>
  );
}
