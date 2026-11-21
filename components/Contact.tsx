import { Link } from "react-router-dom";
import { IoArrowForward, IoMailOutline } from "react-icons/io5";
import { FaGithub } from "react-icons/fa6";

const EMAIL = "madhusudhant207@gmail.com";
const STRUCT_REPO = "https://github.com/ForgeBuilds/Struct";

export default function Contact() {
  return (
    <main className="contact-page">
      <div className="site-shell contact-layout">
        <div className="rise">
          <p className="eyebrow">Forge / Contact</p>
          <h1 className="display display-lg mt-4">
            Talk to us<span className="accent">.</span>
          </h1>
          <p className="contact-intro">
            For questions about Struct, bug reports, and feature requests, the
            project repository is the best place to start. For everything else,
            email works fine.
          </p>
          <p className="contact-footnote">
            You can also browse the{" "}
            <Link to="/documentation">Struct documentation</Link> or{" "}
            <Link to="/downloads">get the latest available build</Link>.
          </p>
        </div>

        <div className="contact-links rise rise-delay-2">
          <a
            className="contact-link"
            href={`${STRUCT_REPO}/issues`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-icon">
              <FaGithub aria-hidden="true" />
            </span>
            <span className="contact-link-body">
              <span className="contact-label">Project support</span>
              <strong>Struct on GitHub</strong>
              <span className="contact-link-copy">
                Open an issue or join a project discussion.
              </span>
            </span>
            <IoArrowForward className="contact-arrow" aria-hidden="true" />
          </a>

          <a className="contact-link" href={`mailto:${EMAIL}`}>
            <span className="contact-icon">
              <IoMailOutline aria-hidden="true" />
            </span>
            <span className="contact-link-body">
              <span className="contact-label">Email</span>
              <strong>Send a message</strong>
              <span className="contact-link-copy">{EMAIL}</span>
            </span>
            <IoArrowForward className="contact-arrow" aria-hidden="true" />
          </a>
        </div>
      </div>
    </main>
  );
}
