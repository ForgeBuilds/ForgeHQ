
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  IoCheckmarkCircle,
  IoChevronForward,
  IoCloseOutline,
} from "react-icons/io5";
import {
  resetPassword,
  signOut,
  signOutEverywhere,
  updatePassword,
  updateProfile,
} from "../src/lib/auth";
import { openAuthModal } from "../src/lib/authModal";
import { isSupabaseConfigured } from "../src/lib/supabase";
import { notifyAccountRefresh, useAccount } from "../src/lib/useAccount";
import { MaintenanceBanner } from "./alert";

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function providerLabel(provider: string): string {
  if (provider === "github") return "GitHub";
  if (provider === "google") return "Google";
  return "Email & password";
}

/* ── UI primitives ── */

/** One settings block: a hairline rule, a quiet title, optional action on the right. */
function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="account-section">
      <div className="account-section-head">
        <h2>{title}</h2>
        {action}
      </div>
      {description && (
        <p className="account-section-desc">{description}</p>
      )}
      <div className="account-section-body">{children}</div>
    </section>
  );
}

/** Full-width action line used by the Security list. */
function ActionRow({
  label,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`row-button ${danger ? "is-danger" : ""}`}
    >
      <span className="min-w-0 truncate">{label}</span>
      <IoChevronForward className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

/** Inline status message — a left rule and tinted text, nothing boxed. */
function Alert({
  tone,
  children,
}: {
  tone: "error" | "success" | "warning";
  children: ReactNode;
}) {
  return (
    <p className={`alert-line alert-${tone}`}>{children}</p>
  );
}

/** Centered modal shell: dimmed backdrop, Escape + backdrop close, scroll lock. */
function Dialog({
  titleId,
  onClose,
  width = "",
  children,
}: {
  titleId: string;
  onClose: () => void;
  width?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="dialog-scrim"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`dialog-panel ${width}`}
      >
        {children}
      </div>
    </div>
  );
}

interface PasswordDialogProps {
  email: string;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  value: string;
  confirmValue: string;
  onValueChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  busy: boolean;
  error: string | null;
  note: string | null;
  reveal: boolean;
  onToggleReveal: () => void;
  onResetLink: () => void;
  resetBusy: boolean;
}

/** Focused "change password" modal, opened from the Security list. */
function PasswordDialog({
  email,
  onClose,
  onSubmit,
  value,
  confirmValue,
  onValueChange,
  onConfirmChange,
  busy,
  error,
  note,
  reveal,
  onToggleReveal,
  onResetLink,
  resetBusy,
}: PasswordDialogProps) {
  const inputType = reveal ? "text" : "password";
  return (
    <Dialog titleId="account-password-title" onClose={onClose}>
      <div className="dialog-head">
        <div>
          <h2 id="account-password-title">Change password</h2>
          <p>
            Signed in as {email || "your account"} · at least 6 characters.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="dialog-close"
        >
          <IoCloseOutline className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="dialog-body">
        <div className="field-label-row">
          <label htmlFor="account-new-password" className="label">
            New password
          </label>
          <button
            type="button"
            onClick={onToggleReveal}
            className="field-reveal"
          >
            {reveal ? "Hide" : "Show"}
          </button>
        </div>
        <input
          id="account-new-password"
          type={inputType}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          autoComplete="new-password"
          autoFocus
          placeholder="At least 6 characters"
          className="field"
        />
        <label
          htmlFor="account-confirm-password"
          className="label mt-4"
        >
          Confirm new password
        </label>
        <input
          id="account-confirm-password"
          type={inputType}
          value={confirmValue}
          onChange={(event) => onConfirmChange(event.target.value)}
          autoComplete="new-password"
          placeholder="Repeat it"
          className="field"
        />

        {(error || note) && (
          <div className="mt-4 space-y-2">
            {error && <Alert tone="error">{error}</Alert>}
            {note && <Alert tone="success">{note}</Alert>}
          </div>
        )}

        <div className="dialog-actions">
          <button type="button" onClick={onClose} className="btn btn-quiet btn-sm">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="btn btn-primary btn-sm">
            {busy ? "Updating…" : "Update password"}
          </button>
        </div>

        <p className="dialog-footnote">
          Don&apos;t know your current password?{" "}
          <button
            type="button"
            onClick={onResetLink}
            disabled={resetBusy}
          >
            {resetBusy ? "Sending the reset email…" : "Email me a reset link"}
          </button>
          .
        </p>
      </form>
    </Dialog>
  );
}

/** Small confirmation modal for destructive session actions. */
function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      titleId="account-confirm-title"
      onClose={onClose}
      width="dialog-panel-sm"
    >
      <div className="dialog-head">
        <h2 id="account-confirm-title">{title}</h2>
      </div>
      <div className="dialog-body">
        <p className="body-text">{body}</p>
        <div className="dialog-actions">
          <button type="button" onClick={onClose} className="btn btn-quiet btn-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-danger btn-sm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default function AccountPage() {
  const { loading, user, profile } = useAccount();

  // Profile drafts. `from` tracks the profile values the draft was derived
  // from, so a saved/loaded profile resets the draft during render instead of
  // via a cascading setState-in-effect (same pattern as AccountSection in Struct).
  const loadedName = profile?.name ?? "";
  const loadedAvatar = profile?.avatarUrl ?? "";
  const source = `${loadedName}\u0000${loadedAvatar}`;
  const [draft, setDraft] = useState({ name: loadedName, avatar: loadedAvatar, from: source });
  if (draft.from !== source) setDraft({ name: loadedName, avatar: loadedAvatar, from: source });
  const dirty = draft.name !== loadedName || draft.avatar !== loadedAvatar;

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  // Password dialog + security actions.
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordNote, setPasswordNote] = useState<string | null>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordReveal, setPasswordReveal] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [confirmSignOutAll, setConfirmSignOutAll] = useState(false);

  const handleProfileSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSavedNote(null);
    try {
      await updateProfile({
        displayName: draft.name.trim() || undefined,
        avatarUrl: draft.avatar.trim() || null,
      });
      // No supabase auth event fires for a profiles update — tell every
      // useAccount() instance (navbar menu, Pricing banner…) to re-read.
      notifyAccountRefresh();
      setSavedNote("Profile saved — it's updated in the Struct app too.");
    } catch (e) {
      setSaveError(messageOf(e));
    } finally {
      setSaving(false);
    }
  };

  const discardDraft = () => {
    setDraft({ name: loadedName, avatar: loadedAvatar, from: source });
    setSaveError(null);
    setSavedNote(null);
  };

  const handlePasswordChange = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordError(null);
    setPasswordNote(null);
    if (newPassword.length < 6) {
      setPasswordError("Password is too short — use at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("The two passwords don't match.");
      return;
    }
    setPasswordBusy(true);
    try {
      await updatePassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setPasswordNote("Password updated — use it next time you sign in.");
    } catch (e) {
      setPasswordError(messageOf(e));
    } finally {
      setPasswordBusy(false);
    }
  };

  const handleResetLink = async () => {
    if (!user) return;
    setPasswordError(null);
    setPasswordNote(null);
    setResetBusy(true);
    try {
      await resetPassword(user.email);
      setPasswordNote(`Reset link sent to ${user.email}.`);
    } catch (e) {
      setPasswordError(messageOf(e));
    } finally {
      setResetBusy(false);
    }
  };

  const openPasswordDialog = useCallback(() => {
    setPasswordError(null);
    setPasswordNote(null);
    setPasswordOpen(true);
  }, []);
  const closePasswordDialog = useCallback(() => {
    setPasswordOpen(false);
    setPasswordReveal(false);
  }, []);
  const closeConfirmDialog = useCallback(() => setConfirmSignOutAll(false), []);

  const handleSignOutEverywhere = () => {
    setConfirmSignOutAll(false);
    void signOutEverywhere();
  };

  return (
    <div className="site-page">
      <MaintenanceBanner message="Back up and running!!" variant="info" />

      <div className="account-page">
      <div className="account-shell">
        <header className="account-header">
          <p className="eyebrow">Forge / Account</p>
          <h1>Your account</h1>
          <p>
            One account for this site and the Struct app — your profile and
            settings live here.
          </p>
        </header>

        {/* Result of a security action taken from the Security list */}
        {user && !passwordOpen && (passwordError || passwordNote) && (
          <div className="account-alert-row">
            <Alert tone={passwordError ? "error" : "success"}>
              {passwordError ?? passwordNote}
            </Alert>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => {
                setPasswordError(null);
                setPasswordNote(null);
              }}
              className="account-dismiss"
            >
              <IoCloseOutline className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Supabase not configured on this deployment */}
        {!isSupabaseConfigured && (
          <div className="account-section">
            <Alert tone="warning">
              Accounts aren&apos;t switched on for this deployment yet. Add{" "}
              <code>VITE_SUPABASE_URL</code> and{" "}
              <code>VITE_SUPABASE_ANON_KEY</code> (see{" "}
              <code>.env.example</code>) to the build environment and redeploy.
            </Alert>
          </div>
        )}

        {/* First session probe */}
        {isSupabaseConfigured && loading && (
          <p className="account-loading">Loading your account…</p>
        )}

        {/* Signed out gate */}
        {isSupabaseConfigured && !loading && !user && (
          <section className="account-section">
            <div className="account-section-head">
              <h2 className="display display-sm">Sign in to view your account</h2>
            </div>
            <p className="account-section-desc mt-3">
              Your profile shows up here once you&apos;re signed in. Use the
              same account you sign into inside the Struct app.
            </p>
            <div className="account-actions">
              <button
                type="button"
                onClick={() => openAuthModal("sign-in")}
                className="btn btn-primary"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("sign-up")}
                className="btn btn-quiet"
              >
                Create an account
              </button>
            </div>
            <p className="hero-note">
              Free to create · no card required · cancel any time.
            </p>
          </section>
        )}

        {user && (
          <>
            {/* Who you are */}
            <div className="account-identity">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="account-avatar"
                />
              ) : (
                <span className="account-avatar">
                  {(user.name || user.email || "A").charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="account-name truncate">{user.name}</p>
                <p className="account-sub truncate">
                  {user.email || providerLabel(user.provider)}
                </p>
                <p className="account-meta">
                  Member since{" "}
                  {profile?.createdAt ? formatDate(profile.createdAt) : "—"}
                </p>
              </div>
            </div>

            {/* ── Profile ── */}
            <Section
              title="Profile"
              description="Shows on this page and inside the Struct app."
              action={
                dirty ? (
                  <span className="account-unsaved">Unsaved changes</span>
                ) : undefined
              }
            >
              <form onSubmit={(event) => void handleProfileSave(event)}>
                <div className="account-form-grid">
                  <div>
                    <label htmlFor="account-name" className="label">
                      Display name
                    </label>
                    <input
                      id="account-name"
                      value={draft.name}
                      onChange={(event) => {
                        setSavedNote(null);
                        setDraft((value) => ({ ...value, name: event.target.value }));
                      }}
                      placeholder="Your name"
                      maxLength={80}
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="account-avatar" className="label">
                      Avatar URL{" "}
                      <span className="text-[var(--faint)]">(optional)</span>
                    </label>
                    <input
                      id="account-avatar"
                      value={draft.avatar}
                      onChange={(event) => {
                        setSavedNote(null);
                        setDraft((value) => ({ ...value, avatar: event.target.value }));
                      }}
                      placeholder="https://example.com/avatar.png"
                      className="field"
                    />
                  </div>
                </div>
                <div className="account-actions">
                  <button
                    type="submit"
                    disabled={saving || !dirty}
                    className="btn btn-primary"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                  {dirty && (
                    <button
                      type="button"
                      onClick={discardDraft}
                      className="btn btn-ghost btn-sm"
                    >
                      Discard
                    </button>
                  )}
                  {savedNote && (
                    <p className="account-note">
                      <IoCheckmarkCircle className="h-3.5 w-3.5" />
                      {savedNote}
                    </p>
                  )}
                </div>
                {saveError && (
                  <div className="mt-6">
                    <Alert tone="error">{saveError}</Alert>
                  </div>
                )}
              </form>
            </Section>

            {/* ── Security ── */}
            <Section
              title="Security"
              description="Applies to this site and the Struct app on every device."
            >
              <div className="row-list">
                <ActionRow label="Change password" onClick={openPasswordDialog} />
                <ActionRow label="Sign out" onClick={() => void signOut()} />
                <ActionRow
                  label="Sign out of all devices"
                  onClick={() => setConfirmSignOutAll(true)}
                  danger
                />
              </div>
            </Section>

            {/* ── Help ── */}
            <Section
              title="Need a hand?"
              description="Billing question, or something off with your account? We read everything that comes in."
            >
              <div className="row-list">
                <Link to="/contact" className="row-button">
                  <span>Contact support</span>
                  <IoChevronForward className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="https://discord.gg/nMfbNrebs"
                  target="_blank"
                  rel="noreferrer"
                  className="row-button"
                >
                  <span>Join the Discord</span>
                  <IoChevronForward className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </Section>
          </>
        )}
      </div>

      {/* Change password — opened from the Security list */}
      {passwordOpen && (
        <PasswordDialog
          email={user?.email ?? ""}
          onClose={closePasswordDialog}
          onSubmit={(event) => void handlePasswordChange(event)}
          value={newPassword}
          confirmValue={confirmPassword}
          onValueChange={setNewPassword}
          onConfirmChange={setConfirmPassword}
          busy={passwordBusy}
          error={passwordError}
          note={passwordNote}
          reveal={passwordReveal}
          onToggleReveal={() => setPasswordReveal((value) => !value)}
          onResetLink={() => void handleResetLink()}
          resetBusy={resetBusy}
        />
      )}

      {/* Destructive session action */}
      {confirmSignOutAll && (
        <ConfirmDialog
          title="Sign out of all devices?"
          body="This revokes every active session — including the Struct app on any machine you've signed into. You'll need to sign in again there."
          confirmLabel="Sign out everywhere"
          onClose={closeConfirmDialog}
          onConfirm={handleSignOutEverywhere}
        />
      )}
      </div>
    </div>
  );
}
