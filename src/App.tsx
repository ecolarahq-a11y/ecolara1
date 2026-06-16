import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Modules from "./pages/Modules";
import ModuleDetail from "./pages/ModuleDetail";
import Quiz from "./pages/Quiz";
import Badges from "./pages/Badges";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Splash from "./pages/Splash";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Leaderboard from "./pages/Leaderboard";
import DailyMissions from "./pages/DailyMissions";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full eco-gradient mx-auto animate-pulse mb-3" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full eco-gradient mx-auto animate-pulse" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Splash />} />
      <Route path="/auth" element={user ? <Navigate to="/home" replace /> : <Auth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
      <Route path="/module/:id" element={<ProtectedRoute><ModuleDetail /></ProtectedRoute>} />
      <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
      <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/missions" element={<ProtectedRoute><DailyMissions /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
