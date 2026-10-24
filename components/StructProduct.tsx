import { Link } from "react-router-dom";
import chatPreview from "../src/assets/chat.png";
import { IoLogoGithub } from "react-icons/io5";
import { IoLogoWindows } from "react-icons/io";
import { IoLogoTux } from "react-icons/io";

const STRUCT_URL = "https://github.com/ForgeBuilds/Struct";

const features = [
  {
    title: "Agent that works in your project",
    body: "A built-in coding agent reads, searches, writes, replaces, and deletes inside the workspace you opened. Deletions ask first.",
  },
  {
    title: "Review before you accept",
    body: "The agent shows exactly what changed, so consequential edits are yours to keep or discard.",
  },
  {
    title: "Any provider",
    body: "Bring a hosted endpoint or run inference locally through Ollama. You control the model and the cost.",
  },
  {
    title: "MCP connections",
    body: "Connect compatible tools and services, reviewing what each server can read and change first.",
  },
  {
    title: "Lightweight by design",
    body: "A small, focused app that stays usable on modest hardware.",
  },
];

export default function StructProduct() {
  return (
    <div className="relative min-h-screen">
      {/* All content above the page-level bg in App.tsx */}
      <div className="relative z-10">
      {/* Product hero */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Forge · Product
            </p>
            <h1 className="text-5xl font-semibold tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
              Struct
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              A lightweight agentic app that works alongside you directly in
              the project you opened. Built to stay
              fast on modest hardware.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/downloads"
                className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Download
              </Link>
              <Link
                to="/documentation"
                className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Documentation
              </Link>
              <a
                href={STRUCT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
              >
                <IoLogoGithub className="mr-2 inline-block" />
                GitHub
              </a>
            </div>
            <a href = "https://forgebuilds.github.io/ForgeHQ/downloads">
            <p className="mt-6 flex items-center gap-2 text-xs text-zinc-500 hover:text-blue-500">
              <IoLogoWindows />
              <span>Windows 10+</span>
              <IoLogoTux />
              <span>Linux distros</span>
            </p>
            </a>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="relative">
        <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 sm:pb-28 lg:px-8">
          <img
            src={chatPreview}
            alt="Struct workspace preview"
            title="Main chat interface"
          />
        </div>
      </section>

      {/* Features */}
      <section className="relative">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
            Features
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            What it does
          </h2>
          <dl className="mt-12 space-y-10">
            {features.map((f) => (
              <div key={f.title}>
                <dt className="text-base font-medium text-white">{f.title}</dt>
                <dd className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                  {f.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Documentation entry point */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-4 sm:px-6 sm:pb-28 lg:px-8">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            New to Struct?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
            Installation, provider setup, the agent workflow, and a full FAQ are
            covered in the documentation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/documentation"
              className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              Read the documentation
            </Link>
            <Link
              to="/downloads"
              className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
            >
              Download Struct
            </Link>
            <a
              href="https://github.com/ForgeBuilds/Struct/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
            >
              Report an issue
            </a>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
