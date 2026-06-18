import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, ArrowLeft, MailCheck, Eye, EyeOff, Loader2, Bug, Trash2, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getEmailLog, logEmail, clearEmailLog, type EmailLogEntry } from "@/lib/email-log";
import logo from "@/assets/ecolara-logo.png.asset.json";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const slideUpStyle = `
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
`;

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.3-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.6 15.1 19 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.1z"/>
      <path fill="#4CAF50" d="M24 43.5c5.1 0 9.7-1.9 13.2-5.1l-6.1-5c-2 1.4-4.5 2.2-7.1 2.2-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39 16.2 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.4l6.1 5c-.4.4 6.7-4.9 6.7-14.4 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingState, setPendingState] = useState<"sent" | "already_registered" | "resend_failed">("sent");
  const [lastResendError, setLastResendError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [emailLog, setEmailLog] = useState<EmailLogEntry[]>(() => getEmailLog());
  const refreshLog = () => setEmailLog(getEmailLog());
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
        logEmail({ email: email.trim(), action: "login", status: "error", message: error.message });
        refreshLog();
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setPendingEmail(email.trim());
          setPendingState("sent");
          toast({ title: "Verify your email", description: "Please confirm your email to log in.", variant: "destructive" });
        } else {
          toast({ title: "Login failed", description: error.message, variant: "destructive" });
        }
      } else {
        logEmail({ email: email.trim(), action: "login", status: "ok" });
        navigate("/home");
      }
    } else {
      const { error, alreadyRegistered, needsConfirmation } = await signUp(email.trim(), password, displayName.trim());
      if (error) {
        logEmail({ email: email.trim(), action: "signup", status: "error", message: error.message });
        refreshLog();
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else if (alreadyRegistered) {
        logEmail({ email: email.trim(), action: "signup", status: "already_registered", message: "Email already in use — switched to login" });
        refreshLog();
        toast({
          title: "Email already registered",
          description: "This email is already in use. Switched to login — enter your password.",
        });
        setIsLogin(true);
        setPassword("");
      } else {
        logEmail({ email: email.trim(), action: "signup", status: needsConfirmation ? "needs_confirmation" : "ok" });
        refreshLog();
        setPendingEmail(email.trim());
        setPendingState("sent");
      }
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResending(true);
    setLastResendError(null);
    const { error } = await resendVerification(pendingEmail);
    setResending(false);
    if (error) {
      setLastResendError(error.message);
      setPendingState("resend_failed");
      logEmail({ email: pendingEmail, action: "resend", status: "error", message: error.message });
      refreshLog();
      toast({ title: "Could not resend", description: error.message, variant: "destructive" });
    } else {
      setPendingState("sent");
      logEmail({ email: pendingEmail, action: "resend", status: "ok" });
      refreshLog();
      toast({ title: "Verification email sent", description: `Check your inbox at ${pendingEmail}` });
    }
  };

  const handleGoogle = async () => {
    const { lovable } = await import("@/integrations/lovable");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/home`,
    });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: result.error.message, variant: "destructive" });
      return;
    }
    if (result.redirected) return;
    navigate("/home");
  };


  if (pendingEmail) {
    const statusBadge =
      pendingState === "resend_failed" ? (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-900/40 border border-red-700 text-red-300 text-xs mb-3">
          <AlertTriangle className="w-3 h-3" /> Delivery failed — retry below
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-900/40 border border-green-700 text-green-300 text-xs mb-3">
          <CheckCircle2 className="w-3 h-3" /> Email queued for delivery
        </div>
      );

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ backgroundColor: "#0D2818" }}>
        <style>{slideUpStyle}</style>
        <div className="w-full max-w-sm">
          <div className="bg-[#1a3a28] rounded-3xl p-6 border border-green-800/50 text-center animate-slide-up">
            <MailCheck className="w-12 h-12 text-green-400 mx-auto mb-3" />
            {statusBadge}
            <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
            <p className="text-sm text-green-300 mb-2">
              We sent a verification link to <span className="font-medium text-white">{pendingEmail}</span>.
              Click the link to activate your account, then log in.
            </p>
            <p className="text-xs text-green-500 mb-5">
              Can't find it? Check spam/promotions, or resend below. Delivery may take 1–2 minutes.
            </p>

            {lastResendError && (
              <div className="text-left text-xs bg-red-950/40 border border-red-800 rounded-xl p-3 mb-4 text-red-300">
                <div className="font-semibold mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Last resend error</div>
                <div className="break-words">{lastResendError}</div>
              </div>
            )}

            <Button
              onClick={handleResend}
              disabled={resending}
              variant="outline"
              className="w-full h-11 rounded-2xl border border-green-600 text-green-300 bg-transparent hover:bg-green-900/40 hover:text-green-200"
            >
              {resending ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Sending...</span>
              ) : pendingState === "resend_failed" ? "Retry sending email" : "Resend email"}
            </Button>

            <button
              onClick={() => { setPendingEmail(null); setIsLogin(true); setLastResendError(null); }}
              className="text-sm text-green-400 font-medium mt-4 block w-full"
            >
              Back to login
            </button>

            <button
              onClick={() => setShowDebug(s => !s)}
              className="text-xs text-green-600 hover:text-green-400 mt-3 inline-flex items-center gap-1"
            >
              <Bug className="w-3 h-3" /> {showDebug ? "Hide" : "Show"} troubleshooting panel
            </button>

            {showDebug && (
              <DebugPanel log={emailLog} onClear={() => { clearEmailLog(); refreshLog(); }} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0D2818" }}>
      <style>{slideUpStyle}</style>

      <div className="px-6 pt-10 pb-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-green-400">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="text-center mt-2">
          <img src={logo.url} alt="EcoLara" className="w-16 h-16 mx-auto object-contain" />
          <h1 className="text-2xl font-bold text-white mt-3">
            {isLogin ? "Welcome Back" : "Join the Mission"}
          </h1>
          <p className="text-sm text-green-300 mt-1">
            {isLogin ? "Continue your climate journey" : "Start your climate education journey"}
          </p>
        </div>
      </div>

      <div className="mx-4 bg-[#1a3a28] rounded-3xl p-6 border border-green-800/50 animate-slide-up">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {!isLogin && (
            <div>
              <div className="flex items-center border-b border-green-700 focus-within:border-green-400 transition-colors">
                <User className="w-4 h-4 text-green-500" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  maxLength={50}
                  className="bg-transparent text-white placeholder:text-green-700 text-sm py-3 pl-3 w-full outline-none"
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <div className="flex items-center border-b border-green-700 focus-within:border-green-400 transition-colors">
              <Mail className="w-4 h-4 text-green-500" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-transparent text-white placeholder:text-green-700 text-sm py-3 pl-3 w-full outline-none"
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center border-b border-green-700 focus-within:border-green-400 transition-colors">
              <Lock className="w-4 h-4 text-green-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={isLogin ? "Password" : "Create a password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-transparent text-white placeholder:text-green-700 text-sm py-3 pl-3 w-full outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="text-green-500 hover:text-green-300 p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>

          {isLogin && (
            <div className="flex justify-between items-center mt-2">
              <label className="flex items-center gap-2 text-xs text-green-300 cursor-pointer">
                <input type="checkbox" className="accent-green-500 w-3.5 h-3.5" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-xs text-green-400 hover:text-green-300">
                Forgot password?
              </Link>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-semibold mt-6"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isLogin ? "Logging in..." : "Creating account..."}
              </span>
            ) : isLogin ? "Log In" : "Create Account"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 border-t border-green-800" />
          <span className="text-green-600 text-xs">or</span>
          <div className="flex-1 border-t border-green-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full h-11 rounded-2xl border border-green-700 bg-transparent flex items-center justify-center gap-3 hover:bg-green-900/40 transition-colors"
        >
          <GoogleIcon />
          <span className="text-white text-sm font-medium">Continue with Google</span>
        </button>

        {isLogin && EMAIL_RE.test(email.trim()) && (
          <button
            type="button"
            onClick={() => { setPendingEmail(email.trim()); handleResend(); }}
            className="text-xs text-green-500 hover:text-green-300 mt-3 block w-full text-center"
          >
            Didn't get a verification email? Resend
          </button>
        )}
      </div>

      <div className="text-center mt-6 pb-10">
        <button
          onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
          className="text-sm text-green-400 hover:text-green-300"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

function DebugPanel({ log, onClear }: { log: EmailLogEntry[]; onClear: () => void }) {
  const iconFor = (s: EmailLogEntry["status"]) => {
    if (s === "ok") return <CheckCircle2 className="w-3 h-3 text-green-400" />;
    if (s === "needs_confirmation") return <Clock className="w-3 h-3 text-amber-400" />;
    if (s === "already_registered") return <AlertTriangle className="w-3 h-3 text-amber-400" />;
    return <AlertTriangle className="w-3 h-3 text-red-400" />;
  };
  return (
    <div className="mt-4 text-left bg-[#0D2818] border border-green-900 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-green-300 flex items-center gap-1">
          <Bug className="w-3 h-3" /> Email delivery log
        </span>
        <button onClick={onClear} className="text-xs text-green-600 hover:text-red-400 flex items-center gap-1">
          <Trash2 className="w-3 h-3" /> Clear
        </button>
      </div>
      {log.length === 0 ? (
        <p className="text-xs text-green-700">No attempts logged yet.</p>
      ) : (
        <ul className="space-y-1.5 max-h-48 overflow-auto">
          {log.map((e, i) => (
            <li key={i} className="text-xs text-green-300 flex items-start gap-2">
              {iconFor(e.status)}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <span className="font-medium text-white truncate">{e.action}</span>
                  <span className="text-green-700 shrink-0">{new Date(e.ts).toLocaleTimeString()}</span>
                </div>
                <div className="text-green-500 truncate">{e.email} · {e.status}</div>
                {e.message && <div className="text-red-400 break-words">{e.message}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[10px] text-green-700 mt-2">
        Tip: if resends consistently fail, set up a verified sender domain so emails reach your inbox reliably.
      </p>
    </div>
  );
}
