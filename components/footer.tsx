import { Link } from "react-router-dom";
import { FaGithub, FaInstagram } from "react-icons/fa6";
import icon from "../src/assets/forgelogo.jpg";

const productLinks = [
  { label: "Struct", href: "/products/struct" },
  { label: "Downloads", href: "/downloads" },
  { label: "Documentation", href: "/documentation" },
];

const forgeLinks = [
  { label: "Contact", href: "/contact" },
  { label: "Privacy & terms", href: "/privacypolicyandterms" },
];

export default function Footer() {
  return (
    <footer className=" bg-paper py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 font-sans text-[1.35rem] tracking-[-0.01em] text-ink"
            >
              <img
                src={icon}
                alt=""
                className="block h-[1.95rem] w-[1.95rem] rounded-[0.45rem] object-cover shadow-sm"
              />
              <span>Forge</span>
            </Link>
            <p className="mt-4 max-w-xs text-[0.82rem] leading-[1.7] text-muted">
              A small studio building software made to be used, not admired.
              Struct is our current project. (not an actual legal entity, just a github org)
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="https://github.com/ForgeBuilds"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Forge on GitHub"
                className="grid h-[2.2rem] w-[2.2rem] place-items-center rounded-[0.45rem] text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.instagram.com/forgebuilds1/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Forge on Instagram"
                className="grid h-[2.2rem] w-[2.2rem] place-items-center rounded-[0.45rem] text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-mono text-[0.58rem] font-medium uppercase tracking-[0.15em] text-faint">
              Product
            </h3>
            {productLinks.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                className="block py-1 text-[0.84rem] text-muted transition-colors hover:text-ink"
              >
                {label}
              </Link>
            ))}
          </div>

          <div>
            <h3 className="mb-3 font-mono text-[0.58rem] font-medium uppercase tracking-[0.15em] text-faint">
              Forge
            </h3>
            {forgeLinks.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                className="block py-1 text-[0.84rem] text-muted transition-colors hover:text-ink"
              >
                {label}
              </Link>
            ))}
            <a
              href="https://github.com/ForgeBuilds"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-1 text-[0.84rem] text-muted transition-colors hover:text-ink"
            >
              GitHub organization
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-5 text-[0.72rem] text-faint sm:flex-row sm:items-center lg:mt-16">
          <span>© {new Date().getFullYear()} Forge. All rights reserved.</span>
          <span>Struct is free to use</span>
        </div>
      </div>
    </footer>
  );
}
