import { Link } from "react-router-dom";
import { IoArrowForward, IoLogoGithub } from "react-icons/io5";
import { MaintenanceBanner } from "./alert";
import forgeCube from "../src/assets/forgelogo.jpg";

const steps = [
  {
    number: "01",
    title: "Open a workspace",
    body: "Choose the project folder you want Struct to work in. Keep the agent focused on the files that matter.",
  },
  {
    number: "02",
    title: "Choose a model",
    body: "Connect a supported hosted provider or use a local model through Ollama.",
  },
  {
    number: "03",
    title: "Review the changes",
    body: "See the proposed edits and decide what to keep. File deletions require confirmation.",
  },
];

export default function Home() {
  return (
    <div className="site-page">
      <MaintenanceBanner message="macOS support added" variant="info"/>

      <section className="home-hero page-shell">
        <div className="home-hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" />Forge builds in the open</p>
          <h1>Tools made to be<br /><span>used, not admired.</span></h1>
          <p className="hero-description">
            Forge is a GitHub organization for software projects. Struct is our current project: a desktop workspace for working with an AI coding agent.
          </p>
          <div className="hero-actions">
            <Link to="/products/struct" className="button button-primary">Explore Struct <IoArrowForward aria-hidden="true" /></Link>
            <a href="https://github.com/ForgeBuilds" target="_blank" rel="noopener noreferrer" className="button button-quiet"><IoLogoGithub aria-hidden="true" /> GitHub</a>
          </div>
          <p className="hero-note">Struct is free to use. A Struct account is optional for local features.</p>
        </div>
        <div className="home-hero-art" aria-label="Forge mark" role="img">
          <div className="hero-art-glow" />
          <img src={forgeCube} alt="" className="rounded-2xl" />
          <span className="hero-art-caption">FORGE / 001</span>
        </div>
      </section>

      <section className="home-project page-shell">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">The project</p>
            <h2>Meet Struct<span className="accent-period">.</span></h2>
          </div>
          <Link className="text-link" to="/products/struct">Product details <IoArrowForward aria-hidden="true" /></Link>
        </div>
        <p className="section-intro">A lightweight desktop app that brings an AI agent into the project folder you open. You choose the model, and review the work before accepting changes.</p>

        <div className="workflow-grid">
          {steps.map((step) => (
            <article className="workflow-card" key={step.number}>
              <span className="workflow-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-closer page-shell">
        <div>
          <p className="eyebrow">Start here</p>
          <h2>Want to try it?</h2>
          <p>Get the latest available build, or read the guide before installing.</p>
        </div>
        <div className="hero-actions">
          <Link to="/downloads" className="button button-primary">Downloads <IoArrowForward aria-hidden="true" /></Link>
          <Link to="/documentation" className="button button-quiet">Read the guide</Link>
        </div>
      </section>
    </div>
  );
}
