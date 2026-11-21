import { Link } from "react-router-dom";
import { IoArrowForward, IoLogoGithub } from "react-icons/io5";
import { MaintenanceBanner } from "./alert";
import chatPreview from "../src/assets/chat.png";

const steps = [
  {
    number: "Workspace",
    title: "Open a folder",
    body: "Choose the project you want Struct to work in. The agent stays focused on the files that matter.",
  },
  {
    number: "Model",
    title: "Bring your own",
    body: "Connect a hosted provider or run a local model through Ollama. You stay in control of cost and privacy.",
  },
  {
    number: "Review",
    title: "See every change",
    body: "Inspect proposed edits before accepting them. File deletions always require confirmation.",
  },
];

export default function Home() {
  return (
    <div className="site-page">
      <MaintenanceBanner message="Back up and running" variant="info" />

      <section className="site-shell hero">
        <div className="hero-copy rise">
          <p className="eyebrow">Forge builds</p>

          <h1 className="display display-xl hero-title">
            Software made to be used, not admired.
          </h1>

          <div className="hero-bottom">
            <p className="lead hero-lead">
              Forge is a small studio for software projects. Struct is our
              current project: a desktop workspace for working with an AI coding
              agent.
            </p>

            <div className="hero-actions">
              <Link to="/products/struct" className="btn btn-primary">
                Explore Struct
                <IoArrowForward aria-hidden="true" />
              </Link>
              <a
                href="https://github.com/ForgeBuilds"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-quiet"
              >
                <IoLogoGithub aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>

          <div className="hero-meta">
            <span>Desktop app</span>
            <span>Local-first</span>
            <span>Free to use</span>
          </div>
        </div>

        <figure className="hero-figure rise rise-delay-2">
          <img
            src={chatPreview}
            alt="The Struct desktop workspace with an agent conversation"
            className="hero-shot"
          />
          <figcaption>Struct — agent workspace</figcaption>
        </figure>
      </section>

      <section className="section hairline">
        <div className="site-shell">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">The project</p>
              <h2 className="display display-md mt-3">
                Meet Struct<span className="accent">.</span>
              </h2>
              <p className="section-intro">
                A lightweight desktop app that brings an AI agent into the
                project folder you open. You choose the model, and review the
                work before accepting changes.
              </p>
            </div>

            <Link className="text-link" to="/products/struct">
              Product details
              <IoArrowForward aria-hidden="true" />
            </Link>
          </div>

          <div className="feature-grid mt-12">
            {steps.map((step) => (
              <article className="feature-cell" key={step.number}>
                <span className="feature-kicker">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-band">
        <div className="site-shell quote-inner">
          <div>
            <p className="eyebrow">The idea</p>
            <p className="quote-source">A collaborator, not an autopilot</p>
          </div>

          <div className="quote-aside">
            <blockquote>
              “The agent should feel like a capable teammate — one that shows its
              work, and leaves the final decision to you.”
            </blockquote>
            <p>
              Struct can read, search, and propose edits inside a real folder.
              It does not silently take ownership of your repository.
            </p>
            <p>
              Every consequential change is reviewable. That is the whole point.
            </p>
          </div>
        </div>
      </section>

      <section className="closer">
        <div className="site-shell closer-inner">
          <div className="closer-copy">
            <p className="eyebrow">Start here</p>
            <h2 className="display display-lg">Want to try it?</h2>
            <p>
              Get the latest available build, or read the guide before
              installing.
            </p>
          </div>

          <div className="closer-actions">
            <Link to="/downloads" className="btn btn-primary">
              Downloads
              <IoArrowForward aria-hidden="true" />
            </Link>
            <Link to="/documentation" className="btn btn-quiet">
              Read the guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
