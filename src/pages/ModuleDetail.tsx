import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { modules } from "@/data/modules";
import { useUserProgress } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { progress } = useUserProgress();
  const mod = modules.find(m => m.id === Number(id));

  useEffect(() => {
    Promise.resolve((supabase.rpc as any)("complete_mission", { p_mission_number: 3 })).catch(() => {});
  }, [id]);

  if (!mod) return <Layout><div className="p-8 text-center text-muted-foreground">Module not found</div></Layout>;

  const completed = progress.completedModules.includes(mod.id);
  const difficulty = progress.currentDifficulty[mod.id] || "medium";

  const handleStartQuiz = () => {
    // Completion is recorded server-side once the quiz is submitted
    navigate(`/quiz/${mod.id}`);
  };

  return (
    <Layout>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{mod.icon}</span>
          <div>
            <p className="text-xs text-muted-foreground">Module {mod.id}</p>
            <h2 className="text-xl font-bold text-foreground">{mod.title}</h2>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border mb-6">
          <div className="prose prose-sm max-w-none text-foreground">
            {mod.content.split("\n\n").map((para, i) => {
              const html = para
                .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                .replace(/\n/g, "<br/>");
              return (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-foreground/90 mb-3"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 pt-3 border-t border-border">Source: {mod.source}</p>
        </div>

        <Button onClick={handleStartQuiz} className="w-full h-12 rounded-xl text-base font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Play className="w-5 h-5" />
          {completed ? `Retake Quiz (${difficulty})` : "Take Quiz"}
        </Button>

        {completed && progress.quizScores[mod.id] !== undefined && (
          <p className="text-center text-sm text-muted-foreground mt-3">
            Your best score: <span className="font-semibold text-primary">{progress.quizScores[mod.id]}%</span>
          </p>
        )}
      </div>
    </Layout>
  );
}
