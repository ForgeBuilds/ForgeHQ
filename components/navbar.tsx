
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import icon from "../src/assets/forgelogo.jpg";
import AccountMenu from "./AccountMenu";
import {IoLogoGithub} from "react-icons/io5"
const navigation = [
  { label: "Home", href: "/" },
  { label: "Downloads", href: "/downloads" },
  // { label: "About", href: "/about" },
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
    <nav aria-label="Primary" className="fixed top-0 z-50 w-full  border-zinc-800/60 bg-transparent backdrop-blur-xl">
      <div className="mx-auto flex h-[clamp(4.25rem,5vw,5.5rem)] max-w-7xl items-center justify-between px-[clamp(1rem,3vw,2.5rem)]">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(1rem,1.2vw,1.25rem)] font-semibold tracking-tight text-white"
          aria-label="Forge — home"
        >
          <img
            src={icon}
            alt="Forge logo"
            className="h-[clamp(1.75rem,2.5vw,2.25rem)] w-[clamp(1.75rem,2.5vw,2.25rem)] rounded-md bg-[#f4f2ec] object-cover"
          />
          <span>ForgeHQ</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden shrink-0 items-center gap-[clamp(0.25rem,0.6vw,0.75rem)] xl:flex">
          {navigation.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`rounded-lg px-[clamp(0.625rem,0.9vw,1rem)] py-[clamp(0.5rem,0.8vw,0.6875rem)] text-[clamp(0.8125rem,0.95vw,1rem)] font-medium transition-colors ${
                isActive(href)
                  ? "bg-zinc-800/80 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}

          <AccountMenu />

          <a
            href="https://github.com/ForgeBuilds/Struct"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-[clamp(0.5rem,1vw,1rem)] inline-flex items-center gap-1.5 rounded-lg bg-white px-[clamp(0.75rem,1vw,1.25rem)] py-[clamp(0.5rem,0.8vw,0.6875rem)] text-[clamp(0.8125rem,0.95vw,1rem)] font-medium text-zinc-950 transition hover:bg-zinc-200"
          >
            <IoLogoGithub className="h-4 w-4 shrink-0" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-[clamp(2.75rem,3.5vw,3.25rem)] w-[clamp(2.5rem,3vw,3rem)] items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-400 transition hover:bg-zinc-800 hover:text-white xl:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-[clamp(1.25rem,1.7vw,1.375rem)] w-[clamp(1.25rem,1.7vw,1.375rem)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-[clamp(1.25rem,1.7vw,1.375rem)] w-[clamp(1.25rem,1.7vw,1.375rem)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-nav" onKeyDown={handleMenuKeyDown} className="hidden sm:block absolute top-[clamp(4.25rem,5vw,5.5rem)] right-10 bg-zinc-800/50 w-[clamp(11rem,45vw,13rem)] px-[clamp(1rem,3vw,2.5rem)] pb-[clamp(1rem,2vw,1.5rem)] pt-[clamp(0.5rem,1vw,0.75rem)] rounded-lg shadow-xl">
          {navigation.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive(href) ? "page" : undefined}
              className={`flex min-h-[clamp(2.75rem,3.5vw,3.25rem)] items-center rounded-lg px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1.2vw,0.75rem)] text-[clamp(0.875rem,1.2vw,1rem)] font-medium transition-colors ${
                isActive(href)
                  ? "bg-transparent text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="mt-2">
            <AccountMenu />
          </div>

          <a
            href="https://github.com/ForgeBuilds"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 m-4 flex min-h-[clamp(2.75rem,3.5vw,3.25rem)] w-14 items-center justify-center rounded-2xl bg-transparent text-[clamp(0.875rem,1.2vw,1rem)] font-medium text-zinc-950 transition hover:bg-zinc-200"
          >
            <IoLogoGithub className="h-9 w-10 shrink-0" />
            {/* <span>GitHub</span> */}
          </a>
        </div>
      )}
    </nav>
  );
}
