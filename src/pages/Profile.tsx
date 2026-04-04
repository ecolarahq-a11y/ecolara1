import { useState } from "react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { modules } from "@/data/modules";
import { badges } from "@/data/badges";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Flame, BookOpen, Trophy, RotateCcw } from "lucide-react";

export default function Profile() {
  const { progress, setName, resetProgress } = useUserProgress();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(progress.name);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim());
      setEditing(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl p-6 border border-border text-center">
          <div className="w-20 h-20 rounded-full eco-gradient mx-auto flex items-center justify-center text-3xl text-primary-foreground font-bold">
            {progress.name.charAt(0).toUpperCase()}
          </div>
          {editing ? (
            <div className="mt-4 flex gap-2">
              <Input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="rounded-lg"
                onKeyDown={e => e.key === "Enter" && handleSaveName()}
              />
              <Button onClick={handleSaveName} size="sm" className="rounded-lg bg-primary text-primary-foreground">Save</Button>
            </div>
          ) : (
            <div className="mt-3">
              <h2 className="text-xl font-bold text-foreground">{progress.name}</h2>
              <button onClick={() => setEditing(true)} className="text-xs text-primary mt-1">Edit name</button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
            <Star className="w-8 h-8 text-eco-sun" />
            <div>
              <p className="text-lg font-bold text-foreground">Level {progress.level}</p>
              <p className="text-[10px] text-muted-foreground">Current Level</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
            <Flame className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-lg font-bold text-foreground">{progress.totalPoints}</p>
              <p className="text-[10px] text-muted-foreground">Total Points</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <div>
              <p className="text-lg font-bold text-foreground">{progress.completedModules.length}/{modules.length}</p>
              <p className="text-[10px] text-muted-foreground">Modules Done</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
            <Trophy className="w-8 h-8 text-eco-sun" />
            <div>
              <p className="text-lg font-bold text-foreground">{progress.earnedBadges.length}/{badges.length}</p>
              <p className="text-[10px] text-muted-foreground">Badges</p>
            </div>
          </div>
        </div>

        {/* Quiz History */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Quiz Scores</h3>
          <div className="space-y-2">
            {modules.map(m => {
              const score = progress.quizScores[m.id];
              return (
                <div key={m.id} className="bg-card rounded-xl p-3 border border-border flex items-center gap-3">
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{m.title}</p>
                  </div>
                  <span className={`text-sm font-bold ${score !== undefined ? "text-primary" : "text-muted-foreground"}`}>
                    {score !== undefined ? `${score}%` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <Button
          variant="outline"
          onClick={() => {
            if (confirm("Reset all progress? This cannot be undone.")) resetProgress();
          }}
          className="w-full rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10 gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset Progress
        </Button>
      </div>
    </Layout>
  );
}
