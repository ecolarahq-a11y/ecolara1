import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, ArrowLeft, MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/ecolara-logo.jpg.asset.json";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const { signIn, signUp, resendVerification } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = () => {
    const e: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (!isLogin && !displayName.trim()) e.name = "Display name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setPendingEmail(email.trim());
          toast({ title: "Verify your email", description: "Please confirm your email to log in.", variant: "destructive" });
        } else {
          toast({ title: "Login failed", description: error.message, variant: "destructive" });
        }
      } else {
        navigate("/home");
      }
    } else {
      const { error } = await signUp(email.trim(), password, displayName.trim());
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        setPendingEmail(email.trim());
      }
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResending(true);
    const { error } = await resendVerification(pendingEmail);
    setResending(false);
    if (error) {
      toast({ title: "Could not resend", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Verification email sent", description: `Check your inbox at ${pendingEmail}` });
    }
  };

  if (pendingEmail) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <MailCheck className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Verify your email</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We sent a verification link to <span className="font-medium text-foreground">{pendingEmail}</span>.
              Click the link to activate your account, then log in.
            </p>
            <Button
              onClick={handleResend}
              disabled={resending}
              variant="outline"
              className="w-full h-11 rounded-xl"
            >
              {resending ? "Sending..." : "Resend verification email"}
            </Button>
            <button
              onClick={() => { setPendingEmail(null); setIsLogin(true); }}
              className="text-sm text-primary font-medium mt-4 block w-full"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="text-center">
          <img src={logo.url} alt="EcoLara" className="w-24 h-24 mx-auto object-contain" />
          <p className="text-xs text-muted-foreground mt-1">Gamified Climate Action Platform</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!isLogin && (
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Display name"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="pl-10 rounded-xl"
                    maxLength={50}
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
            )}
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
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-semibold bg-primary text-primary-foreground"
            >
              {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <button
              onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
              className="text-sm text-primary font-medium block w-full"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
            {isLogin && (
              <div className="flex flex-col gap-1">
                <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
                  Forgot password?
                </Link>
                {EMAIL_RE.test(email.trim()) && (
                  <button
                    type="button"
                    onClick={() => { setPendingEmail(email.trim()); handleResend(); }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Didn't get a verification email? Resend
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
