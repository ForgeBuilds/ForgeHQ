import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IoChevronDown,
  IoChevronForward,
  IoLogOutOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { signOut } from "../src/lib/auth";
import { openAuthModal } from "../src/lib/authModal";
import { isSupabaseConfigured } from "../src/lib/supabase";
import { useAccount } from "../src/lib/useAccount";

export default function AccountMenu() {
  const { user } = useAccount();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Close on route change (derived state — same pattern as the navbar).
  const path = location.pathname;
  const [lastPath, setLastPath] = useState(path);
  if (lastPath !== path) {
    setLastPath(path);
    if (open) setOpen(false);
  }

  if (!isSupabaseConfigured) return null;

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openAuthModal("sign-in")}
        className="nav-signin"
      >
        Sign in
      </button>
    );
  }

  const initial = (user.name || user.email || "A").charAt(0).toUpperCase();

  return (
    <div ref={containerRef} className="account-menu">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="account-trigger"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="account-trigger-avatar" />
        ) : (
          <span className="account-trigger-avatar">{initial}</span>
        )}
        <span className="hidden max-w-28 truncate sm:block">{user.name}</span>
        <IoChevronDown
          className={`h-3.5 w-3.5 text-current opacity-50 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div role="menu" className="account-dropdown">
          <div className="account-dropdown-head">
            <p>{user.name}</p>
            <span>{user.email || user.provider}</span>
          </div>

          <div className="account-dropdown-links">
            <Link to="/account" onClick={() => setOpen(false)}>
              <IoPersonCircleOutline className="h-4 w-4" />
              <span>Your profile</span>
              <IoChevronForward className="ml-auto h-3.5 w-3.5 opacity-50" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
            >
              <IoLogOutOutline className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
