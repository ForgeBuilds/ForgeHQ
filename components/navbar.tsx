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
    <nav aria-label="Primary" className="site-nav">
      <div className="nav-shell">
        <Link to="/" className="brand" aria-label="Forge — home">
          <img src={icon} alt="Forge logo" className="brand-mark" />
          <span>Forge</span>
        </Link>

        <div className="nav-links">
          {navigation.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              aria-current={isActive(href) ? "page" : undefined}
              className="nav-link"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <AccountMenu />
          <a
            href="https://github.com/ForgeBuilds/Struct"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
          >
            <IoLogoGithub className="h-4 w-4" aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="nav-toggle"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <IoClose className="h-5 w-5" /> : <IoMenu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-nav" onKeyDown={handleMenuKeyDown} className="mobile-menu">
          <div className="mobile-menu-inner">
            {navigation.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(href) ? "page" : undefined}
                className="mobile-link"
              >
                <span>{label}</span>
                <IoArrowForward className="h-4 w-4 opacity-40" aria-hidden="true" />
              </Link>
            ))}

            <div className="mobile-menu-actions">
              <AccountMenu />
              <a
                href="https://github.com/ForgeBuilds/Struct"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
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
