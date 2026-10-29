import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import icon from "../src/assets/forgelogo.jpg";
import AccountMenu from "./AccountMenu";
import { IoClose, IoLogoGithub, IoMenu } from "react-icons/io5";

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
      className="site-nav sticky top-0 z-50 w-full border-b border-white/10 bg-[#10100f]/90 backdrop-blur-xl"
    >
      <div className="site-nav-inner mx-auto flex h-[clamp(4.25rem,5vw,5.5rem)] max-w-7xl items-center justify-between px-[clamp(1rem,3vw,2.5rem)]">
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
          <span>Forge</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden shrink-0 items-center gap-1 md:flex">
          {navigation.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
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
            className="ml-2 inline-flex items-center gap-1.5 rounded-md bg-[#ff8b52] px-4 py-2 text-sm font-semibold text-[#17100c] transition hover:bg-[#ffa274]"
          >
            <IoLogoGithub className="h-4 w-4 shrink-0" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? (
          <IoClose/>
          ) : (
          <IoMenu/>
          )}
        </button>
      </div>
      {mobileOpen && (
        <div
          id="mobile-nav"
          onKeyDown={handleMenuKeyDown}
          className="mobile-nav-menu md:hidden"
        >
          {navigation.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive(href) ? "page" : undefined}
              className={`flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}

          <AccountMenu />

          
        </div>
      )}
    </nav>
  );
}
