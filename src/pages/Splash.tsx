import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/ecolara-logo.jpg.asset.json";

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-between px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <img
          src={logo.url}
          alt="EcoLara logo"
          className="w-56 h-56 object-contain animate-float"
        />
        <p className="mt-4 text-base text-muted-foreground font-medium">
          Gamified Climate Action Platform
        </p>
      </div>

      <div
        className={`w-full max-w-sm space-y-3 transition-opacity duration-500 ${
          showActions ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button
          onClick={() => navigate("/auth?mode=signup")}
          className="w-full h-12 rounded-xl text-base font-semibold bg-primary text-primary-foreground"
        >
          Sign Up
        </Button>
        <Button
          onClick={() => navigate("/auth?mode=login")}
          variant="outline"
          className="w-full h-12 rounded-xl text-base font-semibold"
        >
          Log In
        </Button>
        <p className="text-center text-xs text-muted-foreground pt-2">
          Learn. Act. Protect the planet.
        </p>
      </div>
    </div>
  );
}
