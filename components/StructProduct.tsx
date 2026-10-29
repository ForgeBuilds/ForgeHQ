import { Link } from "react-router-dom";
import { IoArrowForward, IoLogoGithub } from "react-icons/io5";
import chatPreview from "../src/assets/chat.png";

const STRUCT_URL = "https://github.com/ForgeBuilds/Struct";

const features = [
  { number: "01", title: "Works in your workspace", body: "Open a project folder and let the agent read, search, and edit files there. You choose which workspace to open." },
  { number: "02", title: "Review edits first", body: "Inspect the proposed changes before accepting them. File and directory deletions require confirmation." },
  { number: "03", title: "Choose your model", body: "Connect a supported hosted provider or run a local model through Ollama." },
  { number: "04", title: "Connect MCP tools", body: "Add compatible MCP servers and review the tools they make available to Struct." },
];

export default function StructProduct() {
  return (
    <div className="product-page">
      <section className="page-shell product-hero">
        <div className="product-hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" />Forge / Product</p>
          <h1>Struct<span className="accent-period">.</span></h1>
          <p>A lightweight desktop workspace for working with an AI coding agent. Open a project, choose a model, and stay close to every change.</p>
          <div className="hero-actions">
            <Link to="/downloads" className="button button-primary">Get Struct <IoArrowForward aria-hidden="true" /></Link>
            <Link to="/documentation" className="button button-quiet">Read the guide</Link>
            <a href={STRUCT_URL} target="_blank" rel="noopener noreferrer" className="button button-quiet"><IoLogoGithub aria-hidden="true" /> Repository</a>
          </div>
          <p className="hero-note">Available builds are listed on the downloads page.</p>
        </div>
      </section>

      <section className="page-shell product-preview-section">
        <div className="product-preview-top"><span>STRUCT / WORKSPACE</span><span>INTERFACE PREVIEW</span></div>
        <img src={chatPreview} alt="Struct chat and project workspace interface" />
      </section>

      <section className="page-shell product-features">
        <div className="product-section-heading">
          <p className="eyebrow">How it works</p>
          <h2>Useful tools.<br /><span>Clear decisions.</span></h2>
        </div>
        <div className="product-feature-grid">
          {features.map((feature) => (
            <article className="product-feature" key={feature.number}>
              <span>{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell product-bottom-cta">
        <div>
          <p className="eyebrow">No subscription</p>
          <h2>Struct is free to use.</h2>
          <p>A Struct account is optional for local features. Account features include cloud sync and encrypted provider-key storage.</p>
        </div>
        <div className="hero-actions">
          <Link to="/downloads" className="button button-primary">View downloads <IoArrowForward aria-hidden="true" /></Link>
          <Link to="/documentation" className="button button-quiet">Setup instructions</Link>
        </div>
      </section>
    </div>
  );
}
