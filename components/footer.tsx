import { Link } from "react-router-dom";
import { FaGithub, FaInstagram } from "react-icons/fa6";
import icon from "../src/assets/forgelogo.jpg";

const links = [
  { label: "Struct", href: "/products/struct" },
  { label: "Documentation", href: "/documentation" },
  { label: "Downloads", href: "/downloads" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy & terms", href: "/privacypolicyandterms" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <div className="footer-brand">
          <Link to="/" className="brand-lockup">
            <img src={icon} alt="" />
            <span>Forge<span className="accent-period">.</span></span>
          </Link>
          <p>Projects, releases, and issue tracking live on GitHub.</p>
        </div>
        <nav aria-label="Footer" className="footer-links">
          {links.map(({ label, href }) => <Link key={label} to={href}>{label}</Link>)}
          <a href="https://github.com/ForgeBuilds" target="_blank" rel="noopener noreferrer" aria-label="Forge on GitHub"><FaGithub /></a>
          <a href="https://www.instagram.com/forgebuilds1/" target="_blank" rel="noopener noreferrer" aria-label="Forge on Instagram"><FaInstagram /></a>
        </nav>
        <p className="footer-copyright">© {new Date().getFullYear()} Forge</p>
      </div>
    </footer>
  );
}
