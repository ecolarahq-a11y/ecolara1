import { modules } from "@/data/modules";
import { useUserProgress } from "@/hooks/useUserProgress";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { ChevronRight, CheckCircle2 } from "lucide-react";

export default function Modules() {
  const { progress } = useUserProgress();

  return (
    <Layout>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-foreground mb-1">Learning Modules</h2>
        <p className="text-sm text-muted-foreground mb-6">5 interactive climate education modules</p>

        <div className="space-y-3">
          {modules.map(m => {
            const completed = progress.completedModules.includes(m.id);
            const score = progress.quizScores[m.id];
            const difficulty = progress.currentDifficulty[m.id] || "medium";

            return (
              <Link key={m.id} to={`/module/${m.id}`}>
                <div className={`bg-card rounded-2xl p-5 border eco-card-hover ${completed ? "border-primary/30" : "border-border"}`}>
                  <div className="flex items-start gap-4">
                    <div className="text-3xl mt-0.5">{m.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Module {m.id}</span>
                        {completed && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-base font-bold text-foreground mt-0.5">{m.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium uppercase">
                          {difficulty}
                        </span>
                        {score !== undefined && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            Best: {score}%
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">{m.source}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
