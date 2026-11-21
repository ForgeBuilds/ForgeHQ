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
    <footer className="site-footer">
      <div className="site-shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <img src={icon} alt="" className="brand-mark" />
              <span>Forge</span>
            </Link>
            <p>
              A small studio building software made to be used, not admired.
              Struct is our current project.
            </p>
            <div className="footer-social">
              <a
                href="https://github.com/ForgeBuilds"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Forge on GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.instagram.com/forgebuilds1/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Forge on Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Product</h3>
            {productLinks.map(({ label, href }) => (
              <Link key={label} to={href}>
                {label}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h3>Forge</h3>
            {forgeLinks.map(({ label, href }) => (
              <Link key={label} to={href}>
                {label}
              </Link>
            ))}
            <a
              href="https://github.com/ForgeBuilds"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub organization
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Forge. All rights reserved.</span>
          <span>Struct is free to use</span>
        </div>
      </div>
    </footer>
  );
}
