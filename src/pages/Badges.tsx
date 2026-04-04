import { badges } from "@/data/badges";
import { useUserProgress } from "@/hooks/useUserProgress";
import Layout from "@/components/Layout";

export default function Badges() {
  const { progress } = useUserProgress();

  return (
    <Layout>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-foreground mb-1">Your Badges</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {progress.earnedBadges.length}/{badges.length} earned
        </p>

        <div className="grid grid-cols-2 gap-3">
          {badges.map(badge => {
            const earned = progress.earnedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`bg-card rounded-2xl p-5 border text-center transition-all ${
                  earned ? "border-primary/30 shadow-sm" : "border-border opacity-50 grayscale"
                }`}
              >
                <div className={`text-4xl mb-2 ${earned ? "animate-float" : ""}`}>{badge.icon}</div>
                <p className="text-sm font-bold text-foreground">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{badge.description}</p>
                <p className="text-[10px] text-primary mt-2 font-medium">{earned ? "✅ Earned" : badge.criteria}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
