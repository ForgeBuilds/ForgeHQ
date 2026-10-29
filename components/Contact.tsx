import { Link } from "react-router-dom";
import { IoArrowForward, IoMailOutline } from "react-icons/io5";
import { FaGithub } from "react-icons/fa6";

const EMAIL = "madhusudhant207@gmail.com";
const STRUCT_REPO = "https://github.com/ForgeBuilds/Struct";

export default function Contact() {
  return (
    <main className="contact-page">
      <section className="page-shell contact-content">
        <p className="eyebrow"><span className="eyebrow-dot" />Forge / Contact</p>
        <h1>Talk to us<span className="accent-period">.</span></h1>
        <p className="contact-intro">For questions about Struct, bug reports, and feature requests, the project repository is the best place to start.</p>

        <div className="contact-options">
          <a className="contact-card contact-card-featured" href={`${STRUCT_REPO}/issues`} target="_blank" rel="noopener noreferrer">
            <span className="contact-icon"><FaGithub aria-hidden="true" /></span>
            <span className="contact-card-label">PROJECT SUPPORT</span>
            <strong>Struct on GitHub</strong>
            <span className="contact-card-copy">Open an issue or join a project discussion.</span>
            <span className="contact-card-link">Visit repository <IoArrowForward aria-hidden="true" /></span>
          </a>
          <a className="contact-card" href={`mailto:${EMAIL}`}>
            <span className="contact-icon"><IoMailOutline aria-hidden="true" /></span>
            <span className="contact-card-label">EMAIL</span>
            <strong>Send a message</strong>
            <span className="contact-card-copy">Reach the Forge team by email.</span>
            <span className="contact-card-link">{EMAIL} <IoArrowForward aria-hidden="true" /></span>
          </a>
        </div>

        <p className="contact-footnote">You can also browse the <Link to="/documentation">Struct documentation</Link> or <Link to="/downloads">get the latest available build</Link>.</p>
      </section>
    </main>
  );
}
