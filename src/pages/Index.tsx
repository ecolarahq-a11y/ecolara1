import { useUserProgress } from "@/hooks/useUserProgress";
import { modules } from "@/data/modules";
import { badges } from "@/data/badges";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { BookOpen, Flame, Trophy, Star, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Index() {
  const { progress } = useUserProgress();
  const completionPct = Math.round((progress.completedModules.length / modules.length) * 100);
  const nextModule = modules.find(m => !progress.completedModules.includes(m.id)) || modules[0];

  const levelThresholds = [0, 30, 60, 100, 140, 190, 250, 320, 400, 500, 999];
  const currentThreshold = levelThresholds[progress.level - 1] || 0;
  const nextThreshold = levelThresholds[progress.level] || 999;
  const levelProgress = Math.round(((progress.totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100);

  return (
    <Layout>
      <div className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Welcome Card */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <p className="text-muted-foreground text-sm">Welcome back,</p>
          <h2 className="text-xl font-bold text-foreground">{progress.name} 👋</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5">
              <Star className="w-4 h-4 text-eco-sun" />
              <span className="text-sm font-semibold text-foreground">Level {progress.level}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5">
              <Flame className="w-4 h-4 text-destructive" />
              <span className="text-sm font-semibold text-foreground">{progress.totalPoints} pts</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Level {progress.level}</span>
              <span>Level {Math.min(progress.level + 1, 10)}</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
        </div>

        {/* Continue Learning */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Continue Learning</h3>
          <Link to={`/module/${nextModule.id}`} className="block">
            <div className="eco-gradient rounded-2xl p-5 text-primary-foreground eco-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-80">Module {nextModule.id}</p>
                  <p className="text-lg font-bold mt-1">{nextModule.title}</p>
                  <p className="text-xs mt-2 opacity-80">{nextModule.description}</p>
                </div>
                <div className="text-4xl">{nextModule.icon}</div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                <BookOpen className="w-4 h-4" /> Start Learning
                <ChevronRight className="w-4 h-4 ml-auto" />
              </div>
            </div>
          </Link>
        </div>

        {/* Progress Overview */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Your Progress</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-xl p-4 text-center border border-border shadow-sm">
              <p className="text-2xl font-bold text-primary">{progress.completedModules.length}/{modules.length}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Modules</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center border border-border shadow-sm">
              <p className="text-2xl font-bold text-eco-sun">{progress.earnedBadges.length}/{badges.length}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Badges</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center border border-border shadow-sm">
              <p className="text-2xl font-bold text-eco-sky">{completionPct}%</p>
              <p className="text-[10px] text-muted-foreground mt-1">Complete</p>
            </div>
          </div>
        </div>

        {/* Quick Modules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">All Modules</h3>
            <Link to="/modules" className="text-xs text-primary font-medium">View All</Link>
          </div>
          <div className="space-y-2">
            {modules.map(m => {
              const completed = progress.completedModules.includes(m.id);
              const score = progress.quizScores[m.id];
              return (
                <Link key={m.id} to={`/module/${m.id}`}>
                  <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3 eco-card-hover">
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{m.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {completed ? `✅ Completed${score ? ` · ${score}%` : ""}` : "Not started"}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
