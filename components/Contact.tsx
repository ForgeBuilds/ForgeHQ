import { Link } from "react-router-dom";
import { IoArrowForward, IoMailOutline } from "react-icons/io5";
import { FaGithub } from "react-icons/fa6";

const EMAIL = "madhusudhant207@gmail.com";
const STRUCT_REPO = "https://github.com/ForgeBuilds/Struct";

const contactLink =
  "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-line py-5 transition-colors hover:bg-card/55";
const contactIcon =
  "grid h-10 w-10 place-items-center rounded-[0.6rem] bg-surface text-[1.05rem] text-accent";

export default function Contact() {
  return (
    <main className="py-16 sm:py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-5 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div className="rise">
          {/* <p className="inline-flex items-center gap-2.5 font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-faint before:h-px before:w-6 before:bg-current before:opacity-55 before:content-['']">
            Forge / Contact
          </p> */}
          <h1 className="mt-4 text-[clamp(2.6rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.038em] text-ink">
            Talk to us<span className="text-accent">.</span>
          </h1>
          <p className="mt-5 max-w-md text-[1.02rem] leading-[1.72] text-muted">
            For questions about Struct, bug reports, and feature requests, the
            project repository is the best place to start. For everything else,
            email works fine.
          </p>
          <p className="mt-7 max-w-md text-[0.8rem] leading-[1.8] text-faint [&_a]:text-ink-2 [&_a]:underline [&_a]:decoration-line-strong [&_a]:underline-offset-4 [&_a:hover]:text-accent [&_a:hover]:decoration-accent/40">
            You can also browse the{" "}
            <Link to="/documentation">Struct documentation</Link> or{" "}
            <Link to="/downloads">get the latest available build</Link>.
          </p>
        </div>

        <div className="rise rise-delay-2 grid border-t border-line">
          <a
            className={contactLink}
            href={`${STRUCT_REPO}/issues`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={contactIcon}>
              <FaGithub aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-faint">
                Project support
              </span>
              <strong className="mt-1 block text-[1.35rem] font-bold tracking-[-0.02em] text-ink">
                Struct on GitHub
              </strong>
              <span className="mt-1 block truncate text-[0.82rem] text-muted max-[620px]:whitespace-normal">
                Open an issue or join a project discussion.
              </span>
            </span>
            <IoArrowForward
              className="text-faint transition group-hover:translate-x-0.5 group-hover:text-accent"
              aria-hidden="true"
            />
          </a>

          <a className={contactLink} href={`mailto:${EMAIL}`}>
            <span className={contactIcon}>
              <IoMailOutline aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-faint">
                Email
              </span>
              <strong className="mt-1 block text-[1.35rem] font-bold tracking-[-0.02em] text-ink">
                Send a message
              </strong>
              <span className="mt-1 block truncate text-[0.82rem] text-muted max-[620px]:whitespace-normal">
                {EMAIL}
              </span>
            </span>
            <IoArrowForward
              className="text-faint transition group-hover:translate-x-0.5 group-hover:text-accent"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </main>
  );
}
