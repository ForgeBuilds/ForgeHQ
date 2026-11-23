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
        className="inline-flex min-h-[2.45rem] items-center px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        Sign in
      </button>
    );
  }

  const initial = (user.name || user.email || "A").charAt(0).toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex min-h-[2.45rem] items-center gap-2 rounded-[0.55rem] py-1 pl-1 pr-2 text-[0.82rem] font-medium text-ink-2 transition-colors hover:bg-ink/5"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="grid h-7 w-7 place-items-center rounded-full bg-surface-2 object-cover text-[0.7rem] font-semibold text-ink-2"
          />
        ) : (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-2 text-[0.7rem] font-semibold text-ink-2">
            {initial}
          </span>
        )}
        <span className="hidden max-w-28 truncate sm:block">{user.name}</span>
        <IoChevronDown
          className={`h-3.5 w-3.5 text-current opacity-50 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] w-60 overflow-hidden rounded-xl border border-line bg-surface-0 shadow-deep"
        >
          <div className="p-4 bg-surface-2">
            <p className="m-0 truncate text-[0.84rem] font-semibold text-ink">
              {user.name}
            </p>
            <span className="mt-0.5 block truncate text-[0.72rem] text-faint">
              {user.email || user.provider}
            </span>
          </div>

          <div className=" p-1.5 text-ink">
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="flex min-h-[2.35rem] w-full items-center gap-2 rounded-[0.45rem] px-2 py-1.5 text-left text-[0.82rem] text-muted transition-colors"
            >
              <IoPersonCircleOutline className="h-4.5 w-4.5" />
              <span>Your profile</span>
              <IoChevronForward className="ml-auto h-3.5 w-3.5 opacity-50" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="flex min-h-[2.35rem] w-full items-center gap-2 rounded-[0.45rem] px-2 py-1.5 text-left text-[0.82rem] text-muted transition-colors hover:bg-gray hover:text-ink"
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
