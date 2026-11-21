import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import icon from "../src/assets/forgelogo.jpg";
import AccountMenu from "./AccountMenu";
import { IoArrowForward, IoClose, IoLogoGithub, IoMenu } from "react-icons/io5";

const navigation = [
  { label: "Struct", href: "/products/struct" },
  { label: "Docs", href: "/documentation" },
  { label: "Downloads", href: "/downloads" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const location = useLocation();

  // Close the mobile menu when the route changes (derived state, no effect).
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  // location.pathname is relative to the router basename (e.g. "/downloads")
  const isActive = (href: string) => {
    const current = location.pathname.toLowerCase();
    const target = href.toLowerCase();
    if (target === "/") return current === "/";
    return current === target || current.startsWith(`${target}/`);
  };

  // Close the mobile menu with Escape while it is open.
  const handleMenuKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") setMobileOpen(false);
  };

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 bg-[rgba(247,243,234,0.72)] backdrop-blur-xl backdrop-saturate-125"
    >
      <div className="relative mx-auto flex h-[4.4rem] w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link
          to="/"
          aria-label="Forge — home"
          className="inline-flex items-center gap-2.5 font-sans text-[1.35rem] tracking-[-0.01em] text-ink"
        >
          <img
            src={icon}
            alt="Forge logo"
            className="block h-[1.95rem] w-[1.95rem] rounded-[0.45rem] object-cover shadow-sm"
          />
          <span>Forge</span>
        </Link>

        <div className="hidden items-center gap-1 min-[861px]:flex">
          {navigation.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              aria-current={isActive(href) ? "page" : undefined}
              className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:bottom-0.5 aria-[current=page]:after:h-px aria-[current=page]:after:bg-ink aria-[current=page]:after:content-['']"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 min-[861px]:flex">
          <AccountMenu />
          <a
            href="https://github.com/ForgeBuilds/Struct"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[2.45rem] items-center gap-1.5 rounded-[0.55rem] bg-ink px-3.5 py-2 text-[0.83rem] font-medium text-cream transition hover:-translate-y-px hover:bg-[#2f2c26]"
          >
            <IoLogoGithub className="h-4 w-4" aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[0.55rem] text-ink transition-colors hover:bg-ink/5 min-[861px]:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <IoClose className="h-5 w-5" /> : <IoMenu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav"
          onKeyDown={handleMenuKeyDown}
          className="mx-auto mb-3 w-[calc(100%-2rem)] max-w-6xl overflow-hidden rounded-2xl border border-line bg-card/95 shadow-soft backdrop-blur-xl min-[861px]:hidden"
        >
          <div className="grid gap-0.5 p-2">
            {navigation.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(href) ? "page" : undefined}
                className="flex min-h-[2.9rem] items-center justify-between rounded-[0.55rem] px-3 py-2.5 text-[0.92rem] font-medium text-muted transition-colors hover:bg-surface hover:text-ink aria-[current=page]:bg-surface aria-[current=page]:text-ink"
              >
                <span>{label}</span>
                <IoArrowForward className="h-4 w-4 opacity-40" aria-hidden="true" />
              </Link>
            ))}

            <div className="mt-1.5 flex flex-wrap items-center gap-2 border-t border-line px-1 pb-1 pt-3">
              <AccountMenu />
              <a
                href="https://github.com/ForgeBuilds/Struct"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[2.35rem] items-center justify-center gap-2 rounded-[0.6rem] bg-ink px-3.5 py-2 text-[0.82rem] font-medium text-cream transition hover:-translate-y-px hover:bg-[#2f2c26]"
              >
                <IoLogoGithub className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
