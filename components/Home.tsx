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

const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] bg-ink px-4 py-2.5 text-sm font-medium text-cream shadow-[0_10px_24px_-16px_rgba(27,26,23,0.65)] transition hover:-translate-y-px hover:bg-[#2f2c26]";
const quietButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] border border-line-strong px-4 py-2.5 text-sm font-medium text-ink transition hover:-translate-y-px hover:border-ink hover:bg-white/35";
const textLink =
  "inline-flex items-center gap-2 text-sm font-medium text-ink-2 underline decoration-transparent underline-offset-4 transition hover:gap-2.5 hover:text-accent hover:decoration-accent/40";

export default function Home() {
  return (
    <div className="relative overflow-clip">
      <MaintenanceBanner message="Github and google login methods are currently down. Stay updated!" variant="info" />

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:pt-28">
        <div className="rise max-w-4xl">
          <h1 className="max-w-4xl text-balance text-[clamp(3.2rem,7.2vw,5.4rem)] font-bold leading-[0.98] tracking-[-0.038em] text-ink">
            Software made to be used, not admired.
          </h1>

          <div className="mt-8 grid max-w-4xl grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
            <p className="max-w-[38rem] text-pretty text-[clamp(1.02rem,1.5vw,1.16rem)] leading-[1.72] text-muted">
              Forge is a small github organization that builds software projects. Struct is our
              current project: a desktop workspace for working with an AI coding
              agent.
            </p>

            <div className="flex flex-wrap gap-2.5 pb-0.5">
              <Link to="/products/struct" className={primaryButton}>
                Explore Struct
                <IoArrowForward aria-hidden="true" />
              </Link>
              <a
                href="https://github.com/ForgeBuilds"
                target="_blank"
                rel="noopener noreferrer"
                className={quietButton}
              >
                <IoLogoGithub aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-y-1 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-faint [&>span+span]:before:mx-2.5 [&>span+span]:before:text-faint [&>span+span]:before:content-['·']">
            <span>Desktop app</span>
            <span>Local-first</span>
            <span>Free to use</span>
          </div>
        </div>

        <figure className="rise rise-delay-2 mt-12 sm:mt-16 lg:mt-20">
          <img
            src={chatPreview}
            alt="The Struct desktop workspace with an agent conversation"
            className="block w-full rounded-2xl shadow-deep"
          />
          <figcaption className="mt-3 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-faint">
            Struct — agent workspace
          </figcaption>
        </figure>
      </section>

      <section className="py-16 sm:py-20 lg:py-28">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div>
              <h2 className="mt-3 text-[clamp(2rem,3.6vw,2.9rem)] font-bold leading-[1.06] tracking-[-0.038em] text-ink">
                Meet Struct
              </h2>
              <p className="my-3 max-w-xl text-[0.95rem] leading-[1.72] text-muted">
                A lightweight desktop app that brings an AI agent into the
                project folder you open. You choose the model, and review the
                work before accepting changes.
              </p>
            </div>

            <Link className={textLink} to="/products/struct">
              Product details
              <IoArrowForward aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-1 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 lg:gap-12">
            {steps.map((step) => (
              <article
                className="border-t border-line pt-5"
                key={step.number}
              >
                <span className="block font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">
                  {step.number}
                </span>
                <h3 className="mt-4 text-[1.55rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-[1.7] text-muted">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-7 px-5 sm:px-6 lg:grid-cols-[0.55fr_1.45fr] lg:gap-16">
          <div>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-faint">
              The idea
            </p>
            <p className="mt-5 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-faint">
              A beta tester
            </p>
          </div>

          <div>
            <blockquote className="text-balance text-[clamp(2rem,4.2vw,3.4rem)] font-bold leading-[1.12] tracking-[-0.03em] text-ink">
              “The agent should feel like a capable teammate. One that shows its
              work, and leaves the final decision to you.”
            </blockquote>
            <p className="my-10 text-[0.92rem] leading-[1.72] text-muted">
              Every consequential change is reviewable. That is the whole point.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
