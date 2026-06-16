import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Circle } from "lucide-react";
import { toast } from "sonner";

interface MissionRow {
  mission_1_done: boolean;
  mission_2_done: boolean;
  mission_3_done: boolean;
  mission_1_rewarded: boolean;
  mission_2_rewarded: boolean;
  mission_3_rewarded: boolean;
}

const MISSIONS = [
  { n: 1, title: "Complete a quiz today", reward: 15, auto: true },
  { n: 2, title: "Score above 70% on a quiz", reward: 20, auto: true },
  { n: 3, title: "Read any module today", reward: 10, auto: false },
];

export default function DailyMissions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [row, setRow] = useState<MissionRow | null>(null);
  const prevDone: Record<number, boolean> = {};

  const load = async () => {
    if (!user) return;
    const { data, error } = await (supabase.rpc as any)("get_or_create_daily_missions");
    if (error) return;
    const newRow = data as MissionRow;
    if (row) {
      MISSIONS.forEach((m) => {
        const before = (row as any)[`mission_${m.n}_done`];
        const after = (newRow as any)[`mission_${m.n}_done`];
        if (!before && after) {
          toast.success(`🎉 Mission complete! +${m.reward} EcoPoints`);
        }
      });
    }
    setRow(newRow);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const done = (n: number) => row ? (row as any)[`mission_${n}_done`] as boolean : false;
  const completedCount = row ? [1, 2, 3].filter((n) => done(n)).length : 0;
  const earnedToday = row
    ? MISSIONS.reduce((sum, m) => sum + (done(m.n) ? m.reward : 0), 0)
    : 0;

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <Layout>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Eco Missions</h2>
            <p className="text-sm text-muted-foreground">Resets daily at midnight</p>
          </div>
          <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">
            {today}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          {MISSIONS.map((m) => {
            const isDone = done(m.n);
            return (
              <div
                key={m.n}
                className={`bg-card rounded-xl p-4 border flex items-center gap-3 ${
                  isDone ? "border-primary/30" : "border-border"
                }`}
              >
                <div className="shrink-0">
                  {isDone ? (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <Circle className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{m.title}</p>
                  <p className="text-xs text-primary">+{m.reward} pts</p>
                </div>
                <div className="shrink-0">
                  {isDone ? (
                    <span className="text-sm font-semibold text-green-500">Done ✓</span>
                  ) : m.auto ? (
                    <span className="text-xs text-muted-foreground">Complete a quiz to unlock</span>
                  ) : (
                    <Button size="sm" onClick={() => navigate("/modules")}>
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">{completedCount}/3 missions completed today</span>
            <span className="text-xs text-muted-foreground">{earnedToday} EcoPoints earned today</span>
          </div>
          <Progress value={(completedCount / 3) * 100} />
        </div>
      </div>
    </Layout>
  );
}
