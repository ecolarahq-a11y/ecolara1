import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase auto-parses recovery tokens from the URL hash and creates a session
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const hash = window.location.hash;
      const isRecovery = hash.includes("type=recovery") || hash.includes("access_token");
      setValidToken(Boolean(data.session) || isRecovery);
      setReady(true);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setValidToken(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const validate = () => {
    const e: typeof errors = {};
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (password !== confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) {
      setServerError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/home"), 2000);
    }
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          {success ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-foreground">Password updated</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Redirecting you to your dashboard...
              </p>
            </div>
          ) : !validToken ? (
            <div className="text-center py-4">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-foreground">Invalid or expired link</h2>
              <p className="text-sm text-muted-foreground mt-2">
                This reset link is invalid or has expired. Please request a new one.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block mt-4 text-sm text-primary font-medium"
              >
                Request new reset link
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-foreground mb-4 text-center">Set New Password</h2>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="New password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  {errors.confirm && <p className="text-xs text-destructive mt-1">{errors.confirm}</p>}
                </div>

                {serverError && (
                  <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 rounded-lg p-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-base font-semibold bg-primary text-primary-foreground"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
