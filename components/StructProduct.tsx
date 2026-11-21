import { Link } from "react-router-dom";
import { IoArrowForward, IoLogoGithub } from "react-icons/io5";
import chatPreview from "../src/assets/chat.png";
import { MaintenanceBanner } from "./alert";

const STRUCT_URL = "https://github.com/ForgeBuilds/Struct";

const features = [
  {
    number: "01",
    title: "Works in your workspace",
    body: "Open a project folder and let the agent read, search, and edit files there. You choose which workspace to open.",
  },
  {
    number: "02",
    title: "Review edits first",
    body: "Inspect the proposed changes before accepting them. File and directory deletions require confirmation.",
  },
  {
    number: "03",
    title: "Choose your model",
    body: "Connect a supported hosted provider or run a local model through Ollama.",
  },
  {
    number: "04",
    title: "Connect MCP tools",
    body: "Add compatible MCP servers and review the tools they make available to Struct.",
  },
];

export default function StructProduct() {
  return (
    <div className="site-page">
      <MaintenanceBanner message="Back up and running" variant="info" />

      <section className="site-shell product-hero">
        <div className="product-hero-copy rise">
          <p className="eyebrow">Forge / Product</p>

          <h1 className="display product-title">
            Struct<span className="accent">.</span>
          </h1>

          <p className="product-lead">
            A lightweight desktop workspace for working with an AI coding agent.
            Open a project, choose a model, and stay close to every change.
          </p>

          <div className="hero-actions">
            <Link to="/downloads" className="btn btn-primary">
              Get Struct
              <IoArrowForward aria-hidden="true" />
            </Link>
            <Link to="/documentation" className="btn btn-quiet">
              Read the guide
            </Link>
            <a
              href={STRUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-quiet"
            >
              <IoLogoGithub aria-hidden="true" />
              Repository
            </a>
          </div>

          <div className="product-meta">
            <span>Free to use</span>
            <span>Local-first</span>
            <span>Windows · macOS · Linux</span>
          </div>
        </div>
      </section>

      <section className="site-shell product-preview">
        <div className="product-preview-head">
          <p className="mono-label">Workspace preview</p>
          <span className="mono-label">Struct / 01</span>
        </div>
        <figure className="product-figure">
          <img
            src={chatPreview}
            alt="Struct chat and project workspace interface"
            className="product-shot"
          />
          <figcaption>Agent conversation — edits stay reviewable</figcaption>
        </figure>
      </section>

      <section className="section hairline">
        <div className="site-shell section-split">
          <div className="section-split-aside">
            <p className="eyebrow">How it works</p>
            <h2 className="display display-md mt-3">
              Useful tools.
              <br />
              <span className="display-muted">Clear decisions.</span>
            </h2>
            <p className="section-intro">
              Struct stays close to the work. It can inspect a real folder, but
              every consequential change is yours to approve.
            </p>
          </div>

          <div className="feature-list">
            {features.map((feature) => (
              <article className="feature-row" key={feature.number}>
                <span className="feature-number">{feature.number}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-body">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closer">
        <div className="site-shell closer-inner">
          <div className="closer-copy">
            <p className="eyebrow">No subscription</p>
            <h2 className="display display-lg">
              Struct is free to use<span className="accent">.</span>
            </h2>
            <p>
              A Struct account is optional for local features. Account features
              include cloud sync and encrypted provider-key storage.
            </p>
          </div>

          <div className="closer-actions">
            <Link to="/downloads" className="btn btn-primary">
              View downloads
              <IoArrowForward aria-hidden="true" />
            </Link>
            <Link to="/documentation" className="btn btn-quiet">
              Setup instructions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
