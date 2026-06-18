// Tiny client-side log of verification email attempts for troubleshooting.
export type EmailLogEntry = {
  ts: string;
  email: string;
  action: "signup" | "resend" | "login";
  status: "ok" | "error" | "already_registered" | "needs_confirmation";
  message?: string;
};

const KEY = "ecolara_email_log";
const MAX = 25;

export function getEmailLog(): EmailLogEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as EmailLogEntry[]) : [];
  } catch {
    return [];
  }
}

export function logEmail(entry: Omit<EmailLogEntry, "ts">) {
  const next: EmailLogEntry = { ts: new Date().toISOString(), ...entry };
  const list = [next, ...getEmailLog()].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
  return next;
}

export function clearEmailLog() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
