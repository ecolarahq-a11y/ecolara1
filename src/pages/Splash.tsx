import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Flame, Star, Trophy } from "lucide-react";
import logo from "@/assets/ecolara-logo.png.asset.json";

export default function Splash() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowActions(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && user) navigate("/home", { replace: true });
  }, [loading, user, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6"
      style={{ backgroundColor: "#0D2818" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full pt-12">
        <img
          src={logo.url}
          alt="EcoLara logo"
          className="w-36 h-36 object-contain animate-float"
        />
        <h1 className="mt-4 text-2xl font-bold text-white">EcoLara</h1>
        <p className="mt-1 text-sm text-green-300">
          Gamified Climate Action Platform
        </p>

        <div className="flex flex-row gap-3 mt-6">
          <span className="flex items-center gap-1 bg-green-900/50 rounded-full px-3 py-1 text-xs text-green-300 border border-green-700/50">
            <Flame className="w-3 h-3" /> Eco Streak
          </span>
          <span className="flex items-center gap-1 bg-green-900/50 rounded-full px-3 py-1 text-xs text-green-300 border border-green-700/50">
            <Star className="w-3 h-3" /> EcoPoints
          </span>
          <span className="flex items-center gap-1 bg-green-900/50 rounded-full px-3 py-1 text-xs text-green-300 border border-green-700/50">
            <Trophy className="w-3 h-3" /> Badges
          </span>
        </div>
      </div>

      <div
        className={`w-full max-w-sm mx-auto space-y-3 pb-12 transition-opacity duration-500 ${
          showActions ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button
          onClick={() => navigate("/auth?mode=signup")}
          className="w-full h-12 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-semibold text-base"
        >
          Get Started
        </Button>
        <Button
          onClick={() => navigate("/auth?mode=login")}
          variant="outline"
          className="w-full h-12 rounded-2xl border border-green-600 text-green-300 font-medium text-base bg-transparent hover:bg-green-900/40 hover:text-green-200"
        >
          Log In
        </Button>
        <p className="text-center text-xs text-green-400 pt-2">
          Learn. Earn. Protect the Planet.
        </p>
      </div>
    </div>
  );
}
