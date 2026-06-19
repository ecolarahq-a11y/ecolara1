import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Trophy, User, CheckSquare, Bot } from "lucide-react";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/modules", icon: BookOpen, label: "Learn" },
  { path: "/mentor", icon: Bot, label: "Mentor" },
  { path: "/missions", icon: CheckSquare, label: "Missions" },
  { path: "/leaderboard", icon: Trophy, label: "Rankings" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="eco-gradient px-4 py-4 text-primary-foreground">
        <div className="container max-w-lg mx-auto flex items-center gap-3">
          <span className="text-2xl">🌍</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ECOLARA</h1>
            <p className="text-xs opacity-80">AI-Driven Climate Education</p>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
        <div className="container max-w-lg mx-auto flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
