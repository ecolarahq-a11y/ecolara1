import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setServerError(null);
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }
    setLoading(true);
    const { error: err } = await resetPassword(email.trim());
    setLoading(false);
    if (err) {
      setServerError(err.message);
    } else {
      setSent(true);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setServerError(null);
    const { error: err } = await resetPassword(email.trim());
    setLoading(false);
    if (err) setServerError(err.message);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <Link to="/auth?mode=login" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-foreground">Check your inbox</h2>
              <p className="text-sm text-muted-foreground mt-2">
                We sent a reset link to <span className="font-medium text-foreground">{email}</span>.
                The link expires in 1 hour.
              </p>
              {serverError && (
                <p className="text-xs text-destructive mt-3">{serverError}</p>
              )}
              <Button
                onClick={handleResend}
                disabled={loading}
                variant="outline"
                className="w-full h-11 rounded-xl mt-4"
              >
                {loading ? "Sending..." : "Resend reset link"}
              </Button>
              <Link
                to="/auth?mode=login"
                className="text-sm text-primary font-medium mt-3 inline-block"
              >
                Return to login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-foreground mb-2 text-center">Reset Password</h2>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  {error && <p className="text-xs text-destructive mt-1">{error}</p>}
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
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
