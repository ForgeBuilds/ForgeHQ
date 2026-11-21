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

const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] bg-ink px-4 py-2.5 text-sm font-medium text-cream shadow-[0_10px_24px_-16px_rgba(27,26,23,0.65)] transition hover:-translate-y-px hover:bg-[#2f2c26]";
const quietButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] border border-line-strong px-4 py-2.5 text-sm font-medium text-ink transition hover:-translate-y-px hover:border-ink hover:bg-white/35";
// const eyebrow =
  // "inline-flex items-center gap-2.5 font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-faint before:h-px before:w-6 before:bg-current before:opacity-55 before:content-['']";
const monoLabel =
  "font-mono text-[0.64rem] uppercase tracking-[0.15em] text-faint";

export default function StructProduct() {
  return (
    <div className="relative overflow-clip">
      <MaintenanceBanner message="Github and google login methods are currently down. Stay updated!"  variant="info" />

      <section className="mx-auto w-full max-w-6xl px-5 pb-0 pt-16 sm:px-6 sm:pt-20 lg:pt-28">
        <div className="rise max-w-4xl">
          <p>Forge / Product</p>

          <h1 className="mt-5 text-[clamp(4rem,10vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.065em] text-ink">
            Struct<span className="text-accent">.</span>
          </h1>

          <p className="mt-6 max-w-[40rem] text-[clamp(1.05rem,1.8vw,1.22rem)] leading-[1.7] text-muted">
            A lightweight desktop workspace for working with an AI coding agent.
            Open a project, choose a model, and stay close to every change.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link to="/downloads" className={primaryButton}>
              Get Struct
              <IoArrowForward aria-hidden="true" />
            </Link>
            <Link to="/documentation" className={quietButton}>
              Read the guide
            </Link>
            <a
              href={STRUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={quietButton}
            >
              <IoLogoGithub aria-hidden="true" />
              Repository
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-y-1 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-faint [&>span+span]:before:mx-2.5 [&>span+span]:before:text-faint [&>span+span]:before:content-['·']">
            <span>Free to use</span>
            <span>Local-first</span>
            <span>Windows · macOS · Linux</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-12 sm:px-6 sm:pb-20 lg:pb-24">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className={monoLabel}>Workspace preview</p>
          <span className={monoLabel}>Struct / 01</span>
        </div>
        <figure>
          <img
            src={chatPreview}
            alt="Struct chat and project workspace interface"
            className="block w-full rounded-2xl shadow-deep"
          />
          <figcaption className="mt-3 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-faint">
            Agent conversation — edits stay reviewable
          </figcaption>
        </figure>
      </section>

      <section className=" py-16 sm:py-20 lg:py-28">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-5 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-24">
            <p>How it works</p>
            <h2 className="mt-4 text-[clamp(2rem,3.6vw,2.9rem)] font-bold leading-[1.06] tracking-[-0.038em] text-ink">
              Useful tools.
              <br />
              <span className="text-faint">Clear decisions.</span>
            </h2>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-[1.72] text-muted">
              Struct stays close to the work. It can inspect a real folder, but
              every consequential change is yours to approve.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
            {features.map((feature) => (
              <article
                className="border-line py-6 lg:[&:nth-last-child(-n+2)]:border-b"
                key={feature.number}
              >
                <span className="font-mono text-[0.64rem] tracking-[0.08em] text-faint">
                  {feature.number}
                </span>
                <h3 className="mt-3.5 text-[1.45rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-[1.7] text-muted">
                  {feature.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-night text-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-5 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2.5 font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-cream/50 before:h-px before:w-6 before:bg-current before:opacity-55 before:content-['']">
              No subscription
            </p>
            <h2 className="mt-4 max-w-[40rem] text-[clamp(2.6rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.038em] text-cream">
              Struct is free to use<span className="text-[#e7a077]">.</span>
            </h2>
            <p className="mt-4 max-w-[32rem] text-[0.95rem] leading-[1.7] text-cream/60">
              A Struct account is optional for local features. Account features
              include cloud sync and encrypted provider-key storage.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pb-1">
            <Link
              to="/downloads"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] bg-cream px-4 py-2.5 text-sm font-medium text-night transition hover:-translate-y-px hover:bg-card"
            >
              View downloads
              <IoArrowForward aria-hidden="true" />
            </Link>
            <Link
              to="/documentation"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] border border-cream/25 px-4 py-2.5 text-sm font-medium text-cream transition hover:-translate-y-px hover:border-cream/50 hover:bg-cream/5"
            >
              Setup instructions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
