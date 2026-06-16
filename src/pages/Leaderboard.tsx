import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal } from "lucide-react";

interface Row {
  total_points: number;
  level: number;
  user_id: string;
  profiles: { display_name: string } | { display_name: string }[] | null;
}

interface Entry {
  name: string;
  points: number;
  level: number;
  user_id: string;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState(false);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("total_points, level, user_id, profiles!inner(display_name)")
        .order("total_points", { ascending: false })
        .limit(20);
      if (error || !data) {
        setError(true);
        return;
      }
      const list: Entry[] = (data as unknown as Row[]).map((r) => {
        const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
        return {
          name: p?.display_name || "Eco Learner",
          points: r.total_points,
          level: r.level,
          user_id: r.user_id,
        };
      });
      setEntries(list);
      if (user) {
        const idx = list.findIndex((e) => e.user_id === user.id);
        setMyRank(idx >= 0 ? idx + 1 : null);
      }
    })();
  }, [user]);

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-base font-bold text-muted-foreground w-6 text-center">{rank}</span>;
  };

  return (
    <Layout>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Climate Champions</h2>
            <p className="text-sm text-muted-foreground">Top climate learners globally</p>
          </div>
          {myRank !== null && (
            <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              #{myRank} — Your rank
            </span>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center py-8">
            Could not load leaderboard. Check your connection.
          </p>
        )}

        {!error && !entries && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        )}

        {!error && entries && entries.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No data yet. Be the first!</p>
        )}

        {!error && entries && entries.length > 0 && (
          <div className="space-y-2">
            {entries.map((e, i) => {
              const rank = i + 1;
              const mine = user && e.user_id === user.id;
              return (
                <div
                  key={e.user_id}
                  className={`bg-card rounded-xl p-4 border flex items-center gap-4 ${
                    mine ? "border-primary/30 bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="w-8 flex justify-center">{rankIcon(rank)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{e.name}</p>
                    <p className="text-xs text-muted-foreground">Level {e.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{e.points}</p>
                    <p className="text-xs text-muted-foreground">pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
