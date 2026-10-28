import { Link } from "react-router-dom";
import { IoLogoGithub } from "react-icons/io5";
//import structPreview from "../src/assets/chat.png";
import {MaintenanceBanner} from "./alert.tsx"

const ORG_URL = "https://github.com/ForgeBuilds";
//const STRUCT_URL = "https://github.com/ForgeBuilds/Struct";
import SplitFlapText from "../src/component/SplitFlapText.tsx";
//import FaultyTerminal from "../src/component/FaultyTerminal.tsx";
import BackgroundPixelStars from "./background.tsx";
export default function Home() {
  return (
    
    <div>
     <BackgroundPixelStars/>
      
      <section className = "m-15">
        <MaintenanceBanner
          message="macOS support added"
          variant="info"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <p className = "text-lg font-semibold text-white py-5">Forge</p>
            {/* <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
              
            </p> */}
            
            <SplitFlapText
              words={[" Efficient","Always free","Open source"]}
              flipDuration={0.10}
              stagger={0.06}
              cycleDelay={2000}
              charset="alpha"
              flipsPerChar={8}
              order="left"
              align="left"
              tileStyle="board"
              tileColor="#00000000"
              textColor="#fdfdfd"
              glare={0}
              depth={0.5}
              tileRadius={8}
              gap={4}
              fontSize={52}
              loop
              padTo={10}
              intro
            />


            <p className="mt-6 max-w-lg text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              We at Forge build tools specialized for developers.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <Link
                to="/products/struct"
                className="rounded-md bg-white px-5 py-3 font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Explore Our projects
              </Link>
              <a
                href={ORG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition hover:text-white"
              >
                <IoLogoGithub className="mr-2 inline-block" />
                GitHub
              </a>
            </div>
              <a href="https://forgebuilds.github.io/ForgeHQ/downloads">
                <p className="mt-5 text-sm text-zinc-500 hover:text-blue-500">
              Available for Windows, macos and linux distros
            </p>
            </a>

            
            

          </div>

          <Link
            to="/products/struct"
            aria-label="See the Struct product page"
            className="group block"
          >
              
            {/* <img
              src={structPreview}
              alt="Struct main chat interface with coding agent"
              className="block h-auto w-full rounded-lg"
            /> //wouldnt need this as this the product image and 
            we already have this in the actual page so 
            this is deprecated dont touch it
            */}
            <p className="mt-3 text-sm text-zinc-500 transition group-hover:text-zinc-300">
              {/*Struct <span aria-hidden="true"></span>*/}
            </p>
          </Link>
        </div>
      </section>
                    {/* Additive homepage section: place after the existing products section */}
      <section
        id="how-struct-works"
        className="scroll-mt-24 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
              
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
             Your own agent that does whatever you ask it to do.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              Open a folder, choose a model, and give Struct a task. It can work
              with the files and tools in that workspace, while you stay in
              control of what it does. (Gotta get your own api keys for inference or run your own local model)
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl bg-white/[0.03] p-6">
              <h3 className="text-base font-semibold text-white">
                Context from your workspace
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Struct maps the project folder you open and can keep pinned
                files in context as you work.
              </p>
            </article>

            <article className="rounded-xl bg-white/[0.03] p-6">
              <h3 className="text-base font-semibold text-white">
                Use your model
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Connect a supported provider or run a local model through
                Ollama. You choose what powers the agent.
              </p>
            </article>

            <article className="rounded-xl bg-white/[0.03] p-6">
              <h3 className="text-base font-semibold text-white">
                See what the agent does
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Tool calls appear in an activity feed. Destructive actions wait
                for your approval.
              </p>
            </article>
          </div>

          <div className="mt-8 flex flex-col gap-5 rounded-xl bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="text-base font-semibold text-white">
                Free to use. Local features need no account.
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Struct has no subscriptions or paywall. An account is optional
                for features such as cloud sync and encrypted provider-key
                storage.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                to="/downloads"
                className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Download Struct
              </Link>
              <Link
                to="/documentation"
                className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* <section id="products" className="scroll-mt-24 py-30">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
              Struct, your personal agent utility
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Built for almost anything.
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-400 sm:text-base">
              Struct is a lightweight app that provides AI models with agent tools 
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link
              to="/products/struct"
              className="font-medium text-white transition hover:text-zinc-300"
            >
              Product details <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/downloads"
              className="text-zinc-400 transition hover:text-white"
            >
              Download
            </Link>
            <Link
              to="/documentation"
              className="text-zinc-400 transition hover:text-white"
            >
              Documentation
            </Link>
            <a
              href={STRUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition hover:text-white"
            >
              Source code
            </a>
            {/* <Link
              to="/about"
              className="text-zinc-400 transition hover:text-white"
            >
              About the studio
            </Link> 
          </div>
        </div>
      
     </section>*/}

    </div>
  );
}
