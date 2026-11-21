/**
 * Global auth modal — sign in / sign up / set-new-password / forgot password
 * against the same Supabase account the Struct app uses. Rendered once by the
 * AccountMenu in the navbar; any page opens it via openAuthModal()
 * (src/lib/authModal.ts).
 */

import { useEffect, useState, type FormEvent } from "react";
import { IoCloseOutline, IoLogoGithub, IoLogoGoogle } from "react-icons/io5";
import {
  providerDisabledMessage,
  refreshEnabledProviders,
  resetPassword,
  signInWithEmail,
  signInWithOAuth,
  signUpWithEmail,
  updatePassword,
  type AuthProvider,
  type EnabledProviders,
} from "../src/lib/auth";
import { arrivedWithRecoveryToken, supabase } from "../src/lib/supabase";
import { closeAuthModal, openAuthModal, useAuthModal, type AuthModalMode } from "../src/lib/authModal";

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export default function AuthModal() {
  const modal = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [providers, setProviders] = useState<EnabledProviders | null>(null);

  // Each open starts from a clean slate (Escape / backdrop / X all go through
  // `close`, mode switches through `switchMode` — no resets needed in effects).
  const close = () => {
    setError(null);
    setNotice(null);
    setPassword("");
    closeAuthModal();
  };
  const switchMode = (mode: AuthModalMode) => {
    setError(null);
    setNotice(null);
    setPassword("");
    openAuthModal(mode);
  };

  // Re-probe enabled providers whenever the modal opens, and lock scrolling.
  useEffect(() => {
    if (!modal.open) return;
    void refreshEnabledProviders().then(setProviders);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // `close` is recreated each render; only re-run when open/mode changes.
  }, [modal.open, modal.mode]);

  // A password-recovery link redirects back here with a one-shot token; once
  // the session lands, open the "set new password" form (and scrub the URL so
  // a refresh doesn't reopen it).
  useEffect(() => {
    if (!arrivedWithRecoveryToken) return;
    const sb = supabase();
    if (!sb) return;
    let opened = false;
    const open = () => {
      if (opened) return;
      opened = true;
      window.history.replaceState({}, "", window.location.pathname);
      openAuthModal("set-password");
    };
    void sb.auth.getSession().then(({ data }) => {
      if (data.session) open();
    });
    const { data } = sb.auth.onAuthStateChange((_event, session) => {
      if (session) open();
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const isSignUp = modal.mode === "sign-up";
  const isSetPassword = modal.mode === "set-password";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (isSetPassword) {
        await updatePassword(password);
        close();
      } else if (isSignUp) {
        const { needsEmailConfirmation } = await signUpWithEmail(email, password);
        if (needsEmailConfirmation) {
          setNotice("Check your inbox to confirm your email, then sign in.");
          setEmail("");
          setPassword("");
        } else {
          close();
        }
      } else {
        await signInWithEmail(email, password);
        close();
      }
    } catch (err) {
      setError(messageOf(err));
    }
    setBusy(false);
  };

  const handleForgot = async () => {
    if (!email.trim()) {
      setError("Enter your email above first, then click Forgot password.");
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await resetPassword(email.trim());
      setNotice("Check your inbox for a reset link — it opens back on this site.");
    } catch (err) {
      setError(messageOf(err));
    }
    setBusy(false);
  };

  const handleOAuth = async (provider: AuthProvider) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await signInWithOAuth(provider);
      /* the browser navigates away to the provider */
    } catch (err) {
      setError(messageOf(err));
      setBusy(false);
    }
  };

  if (!modal.open) return null;

  const githubOff = providers?.github === false;
  const googleOff = providers?.google === false;

  return (
    <div
      className="dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        aria-label="Close sign-in"
        onClick={close}
        className="dialog-scrim"
      />

      <div className="dialog-panel auth-panel">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="dialog-close absolute right-4 top-4"
        >
          <IoCloseOutline className="h-4 w-4" />
        </button>

        <h2 id="auth-modal-title">
          {isSetPassword
            ? "Set a new password"
            : isSignUp
              ? "Create your account"
              : "Sign in to Forge"}
        </h2>
        <p>
          {isSetPassword
            ? "Choose a new password for your account."
            : "The same account you use in the Struct app — chats, settings and keys follow you across devices."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isSetPassword && (
            <div>
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="field"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-password">
              {isSetPassword ? "New password" : "Password"}
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={isSetPassword || isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isSetPassword ? "At least 6 characters" : "Your password"}
              className="field"
            />
          </div>

          {error && (
            <p className="auth-message auth-message-error">{error}</p>
          )}
          {notice && !error && (
            <p className="auth-message auth-message-ok">{notice}</p>
          )}

          <button type="submit" disabled={busy} className="btn btn-primary btn-block">
            {busy
              ? "Working…"
              : isSetPassword
                ? "Save password"
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
          </button>
        </form>

        {!isSetPassword && (
          <>
            {!isSignUp && (
              <button
                type="button"
                onClick={() => void handleForgot()}
                disabled={busy}
                className="mt-3 text-sm text-[var(--muted)] underline underline-offset-4 transition hover:text-[var(--ink)] disabled:opacity-50"
              >
                Forgot password?
              </button>
            )}

            <div className="auth-divider">or continue with</div>

            <div className="auth-oauth">
              <button
                type="button"
                disabled={busy || githubOff}
                title={githubOff ? providerDisabledMessage("github") : "Continue with GitHub"}
                onClick={() => void handleOAuth("github")}
              >
                <IoLogoGithub className="h-4 w-4" />
                GitHub
              </button>
              <button
                type="button"
                disabled={busy || googleOff}
                title={googleOff ? providerDisabledMessage("google") : "Continue with Google"}
                onClick={() => void handleOAuth("google")}
              >
                <IoLogoGoogle className="h-4 w-4" />
                Google
              </button>
            </div>
            {(githubOff || googleOff) && (
              <p className="mt-2 text-xs leading-5 text-[var(--accent-dark)]">
                {[githubOff ? "GitHub" : null, googleOff ? "Google" : null]
                  .filter(Boolean)
                  .join(" and ")}{" "}
                sign-in is switched off in Supabase.
              </p>
            )}

            <p className="auth-switch">
              {isSignUp ? "Already have an account?" : "New to Forge?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(isSignUp ? "sign-in" : "sign-up")}
              >
                {isSignUp ? "Sign in" : "Create one"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
