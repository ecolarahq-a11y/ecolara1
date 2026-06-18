## Enable Google Sign-In

Your auth logs show the Google button fails with `provider is not enabled` — Google OAuth has never been turned on for this project. I'll enable it using Lovable Cloud's managed Google OAuth (no Google Cloud Console setup, no client ID/secret needed from you).

### Steps
1. Enable the managed Google provider via `configure_social_auth` (providers: `["google"]`, keeping email enabled).
2. Generate the `src/integrations/lovable/` module and install `@lovable.dev/cloud-auth-js` (done automatically by the tool).
3. Update the web `handleGoogle` in `src/pages/Auth.tsx` to use `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })` instead of the raw `supabase.auth.signInWithOAuth` call (which is why it's currently hitting the disabled provider path).
4. Update the React Native `handleGoogle` in `app/auth.tsx` the same way so mobile works too.
5. Verify by clicking "Continue with Google" in the preview and confirming redirect + session.

### Not changing
- Email/password flow, verification screen, debug panel — all untouched.
- No Google Cloud Console work required (managed credentials). If you later want your own branded OAuth consent screen, that's a separate follow-up.
