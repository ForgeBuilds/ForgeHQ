import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ScreenshotFrame from "./ScreenshotFrame";
import mcpusage from "../src/assets/mcpsection.png";
import chatPreview from "../src/assets/chat.png";
import aiSettings from "../src/assets/aisettings.png";

const docGroups = [
  {
    label: "Getting started",
    items: [
      { id: "what-is-struct", label: "What is Struct?" },
      { id: "requirements", label: "System requirements" },
      { id: "installation", label: "Installation" },
      { id: "first-launch", label: "First launch" },
      { id: "first-workspace", label: "Open a workspace" },
      { id: "first-task", label: "Run your first task" },
      { id: "updating", label: "Updating Struct" },
    ],
  },
  {
    label: "Working with the agent",
    items: [
      { id: "how-agent-works", label: "How the agent works" },
      { id: "agent-tools", label: "Agent tools" },
      { id: "approvals", label: "Permissions & approvals" },
      { id: "prompting", label: "Writing prompts" },
      { id: "change-review", label: "Reviewing changes" },
      { id: "project-context", label: "Project context" },
      { id: "sessions", label: "Chat history & sessions" },
      { id: "instructions", label: "Custom instructions" },
    ],
  },
  {
    label: "AI & extensibility",
    items: [
      { id: "providers", label: "Model providers" },
      { id: "local-models", label: "Local models with Ollama" },
      { id: "cost-context", label: "Cost & context windows" },
      { id: "mcp", label: "MCP connections" },
      { id: "web-search", label: "Web search" },
      { id: "ai-troubleshooting", label: "AI troubleshooting" },
    ],
  },
  {
    label: "Reference",
    items: [
      { id: "shortcuts", label: "Keyboard shortcuts" },
      { id: "privacy", label: "Privacy & local data" },
      { id: "accounts", label: "Accounts" },
      { id: "data-locations", label: "Data & storage" },
      { id: "app-troubleshooting", label: "App troubleshooting" },
      { id: "faq", label: "FAQ" },
      { id: "building", label: "Building from source" },
      { id: "contributing", label: "Contributing" },
      { id: "status", label: "Project status" },
    ],
  },
] as const;

const quickLinks = [
  {
    id: "installation",
    kicker: "Start",
    title: "Install Struct",
    body: "Get the right build for your platform and finish setup.",
  },
  {
    id: "first-task",
    kicker: "Tutorial",
    title: "Run your first task",
    body: "A small, safe workflow from prompt to reviewed change.",
  },
  {
    id: "providers",
    kicker: "Configure",
    title: "Connect a model",
    body: "Hosted provider, compatible endpoint, or local Ollama.",
  },
  {
    id: "ai-troubleshooting",
    kicker: "Fix",
    title: "Troubleshoot AI",
    body: "Work through connection, auth, and context problems.",
  },
] as const;

const shortcuts = [
  { keys: "Ctrl+B", action: "Toggle the AI settings sidebar" },
  { keys: "Ctrl+Shift+H", action: "Toggle chat history" },
  { keys: "Ctrl+Shift+P", action: "Open the command palette" },
  { keys: "Ctrl+Shift+O", action: "Open a workspace folder" },
  { keys: "Ctrl+N", action: "Start a new chat" },
  { keys: "Escape", action: "Close an open panel or dialog" },
];

const agentTools = [
  ["read_file", "Read a complete file from the workspace."],
  ["read_file_range", "Read a targeted line range from a large file."],
  ["search_files", "Find files by name or content."],
  ["list_dir", "Inspect the contents of a workspace directory."],
  ["write_file", "Create a file or replace its full contents."],
  ["append_file", "Add content without replacing existing content."],
  ["replace_in_file", "Apply a targeted edit to an existing file."],
  ["create_dir", "Create a workspace directory."],
  ["rename", "Rename a file or directory."],
  ["delete_file", "Delete a file after confirmation."],
  ["delete_dir", "Delete a directory after confirmation."],
  ["web_search", "Search the web and use the result in the task."],
  ["Gmail tools", "Interact with Gmail for sending and reading emails."],
  [
    "Spotify tools",
    "Play, search, and edit playlists through a connected account.",
  ],
  ["mcp_server", "Access tools exposed by a configured MCP server."],
] as const;

const devRequirements = ["Node.js and npm", "Git", "Electron", "A GitHub account"];

function CodeBlock({
  children,
  label = "Output",
}: {
  children: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="code-block">
      <div className="code-block-head">
        <span>{label}</span>
        <button onClick={copy} type="button" aria-label="Copy code">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="doc-section">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function Callout({
  title,
  children,
  warning = false,
}: {
  title: string;
  children: ReactNode;
  warning?: boolean;
}) {
  return (
    <aside className={`callout ${warning ? "callout-warning" : ""}`}>
      <p className="callout-title">{title}</p>
      <div>{children}</div>
    </aside>
  );
}

function Steps({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <ol className="steps">
      {items.map((item, index) => (
        <li key={item.title} className="step-item">
          <span className="step-index">{index + 1}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Documentation() {
  const [activeId, setActiveId] = useState<string>("what-is-struct");
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return docGroups;
    return docGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(term),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  };

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) window.setTimeout(() => scrollToSection(id), 50);
  }, []);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".doc-section"),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-12% 0px -72% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="docs-page">
      <div className="site-shell docs-layout">
        <aside className="docs-sidebar" aria-label="Documentation contents">
          <p className="docs-sidebar-title">Struct handbook</p>

          <div className="docs-search">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter chapters"
              aria-label="Filter documentation chapters"
              className="field"
            />
          </div>

          {filteredGroups.map((group) => (
            <div className="docs-nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`docs-nav-link ${activeId === item.id ? "is-active" : ""}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <p className="docs-nav-empty">
              No chapter matches “{query.trim()}”.
            </p>
          )}
        </aside>

        <div className="docs-content">
          <div className="docs-mobile-nav">
            <select
              id="docs-mobile-nav"
              value={activeId || ""}
              onChange={(event) => {
                const id = event.target.value;
                if (id) scrollToSection(id);
              }}
              aria-label="Jump to a documentation section"
              className="field"
            >
              <option value="">Jump to section</option>
              {docGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <header className="docs-header">
            <p className="eyebrow">Struct handbook</p>
            <h1>Documentation</h1>
            <p>
              Everything from installing Struct to running a safe, repeatable
              workflow with an AI agent. Start at the beginning, or jump to the
              problem you are trying to solve.
            </p>
            <div className="docs-chips">
              <span className="chip">30 chapters</span>
              <span className="chip">Updated November 2026</span>
              <span className="chip">Beginner friendly</span>
            </div>

            <div className="docs-quick">
              {quickLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(link.id);
                  }}
                  className="docs-quick-card"
                >
                  <span className="mono-label">{link.kicker}</span>
                  <strong>{link.title}</strong>
                  <p>{link.body}</p>
                </a>
              ))}
            </div>
          </header>

          <div className="docs-prose">
            <DocSection id="what-is-struct" title="What is Struct?">
              <p>
                Struct is a lightweight desktop app built with React and
                TypeScript. It combines an AI agent, filesystem tools, model
                connections, and optional encrypted account sync in one
                application.
              </p>
              <p>
                The important idea is not only that Struct can generate text. It
                can operate on a real folder: inspect project structure, read
                relevant files, search code, propose edits, run commands, and
                show you exactly what changed before you accept it.
              </p>
              <ScreenshotFrame
                src={chatPreview}
                alt="The Struct desktop workspace with an agent conversation"
                title="Struct workspace"
              />
              <h3>What you get</h3>
              <ul>
                <li>
                  A chat workspace that stays attached to a project folder rather
                  than a single file.
                </li>
                <li>
                  Filesystem tools for reading, searching, creating, editing, and
                  deleting files with review.
                </li>
                <li>
                  Provider-independent model configuration, including local
                  models through Ollama.
                </li>
                <li>
                  MCP connections for compatible external tools and services.
                </li>
                <li>
                  Optional accounts for cloud sync and encrypted provider-key
                  storage shared with the Struct app.
                </li>
              </ul>
              <Callout title="What Struct does not do">
                <p>
                  Struct does not silently take ownership of your repository.
                  The agent is a collaborator: it works from the context you
                  provide and the files it is allowed to inspect, while you keep
                  control of consequential changes. It is not a replacement for
                  version control, tests, or reading the diff.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="requirements" title="System requirements">
              <p>
                Struct runs as a desktop application. Exact package availability
                varies by release, so check the Downloads page for the builds
                published for your platform.
              </p>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Minimum</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Windows</td>
                      <td>Windows 11 or later</td>
                      <td>64-bit installer.</td>
                    </tr>
                    <tr>
                      <td>macOS</td>
                      <td>macOS 12 or later</td>
                      <td>
                        Choose the build for Apple silicon or Intel if both are
                        published.
                      </td>
                    </tr>
                    <tr>
                      <td>Linux</td>
                      <td>Ubuntu 20.04+ / Fedora 34+</td>
                      <td>AppImage or distribution package, when available.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>Hardware and network</h3>
              <ul>
                <li>4 GB of RAM minimum; 8 GB or more for comfortable use.</li>
                <li>
                  A few hundred megabytes for the app, plus space for chat
                  history, models, and project files.
                </li>
                <li>
                  An internet connection for downloads, accounts, hosted model
                  providers, and web search.
                </li>
                <li>
                  Local models need enough memory and disk for the model itself;
                  check the model provider&apos;s requirements.
                </li>
              </ul>
              <Callout title="No compiler bundle">
                <p>
                  Struct uses the development tools already installed on your
                  machine rather than bundling every compiler and runtime. If a
                  task needs a toolchain, install it for your platform first.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="installation" title="Installation">
              <p>
                Struct is distributed through GitHub Releases. Use the Downloads
                page to get the installer for your operating system, or build the
                application from source if you need unreleased changes.
              </p>
              <Steps
                items={[
                  {
                    title: "Check your platform",
                    body: (
                      <>
                        Confirm that your operating system and processor match a
                        published build. Hosted providers need a connection;
                        local models can work offline.
                      </>
                    ),
                  },
                  {
                    title: "Download the release",
                    body: (
                      <>
                        Open the <Link to="/downloads">Downloads page</Link> and
                        choose the asset for your operating system and processor.
                        Prefer the latest stable release.
                      </>
                    ),
                  },
                  {
                    title: "Install and launch",
                    body: (
                      <>
                        Run the installer, open Struct, and create or open a
                        folder. If your OS warns about a downloaded application,
                        verify that the file came from the official release
                        before continuing.
                      </>
                    ),
                  },
                ]}
              />
              <h3>Platform notes</h3>
              <ul>
                <li>
                  <strong>Windows:</strong> use the installer rather than running
                  files from inside the archive. SmartScreen may ask you to
                  confirm an unrecognised publisher.
                </li>
                <li>
                  <strong>macOS:</strong> drag Struct into Applications. If
                  Gatekeeper blocks the first launch, open it from Finder with
                  the context menu and confirm.
                </li>
                <li>
                  <strong>Linux:</strong> make AppImage files executable before
                  launching, and install any distribution libraries the release
                  notes list.
                </li>
              </ul>
              <Callout title="Verify the source" warning>
                <p>
                  Only install builds from the official Struct repository or the
                  Downloads page. Do not run installers from mirrors, chat
                  attachments, or file-sharing links.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="first-launch" title="First launch">
              <p>
                The first launch is about three choices: whether to sign in,
                which model to use, and which folder to open. You can change all
                three later.
              </p>
              <Steps
                items={[
                  {
                    title: "Read the welcome screen",
                    body: (
                      <>
                        Struct explains the basics and asks whether you want to
                        sign in. An account is optional for local features.
                      </>
                    ),
                  },
                  {
                    title: "Configure a model",
                    body: (
                      <>
                        Add a hosted provider, a compatible endpoint, or a local
                        Ollama server. Test it with a short prompt before opening
                        a large project.
                      </>
                    ),
                  },
                  {
                    title: "Open a workspace",
                    body: (
                      <>
                        Choose a project folder. Use the repository root when
                        possible so searches and agent context have the full
                        project.
                      </>
                    ),
                  },
                  {
                    title: "Send a harmless first message",
                    body: (
                      <>
                        Ask the agent to describe the project structure without
                        editing anything. This confirms the model, connection,
                        and workspace access are working.
                      </>
                    ),
                  },
                ]}
              />
              <Callout title="Accounts are optional">
                <p>
                  Local workspaces, filesystem tools, and local models work
                  without signing in. Accounts add cloud sync and encrypted
                  provider-key storage shared with the Struct app.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="first-workspace" title="Open a workspace">
              <p>
                Struct is folder-based. A workspace is the project directory you
                open. Choose the repository root when possible so searches and
                agent context have the full project context.
              </p>
              <h3>A good first workspace</h3>
              <ul>
                <li>
                  Use a project you understand well enough to verify the result.
                </li>
                <li>
                  Make sure important work is committed or backed up before an
                  agent session.
                </li>
                <li>
                  Avoid opening your entire home directory or a drive containing
                  unrelated personal files.
                </li>
                <li>
                  Keep generated dependencies and large build folders in mind
                  when asking for repository-wide searches.
                </li>
                <li>
                  Prefer one project per workspace so context and file searches
                  stay focused.
                </li>
              </ul>
              <Callout title="Workspace access is powerful" warning>
                <p>
                  The agent can read and modify files inside the workspace you
                  open. Use a dedicated folder or a clean repository when
                  experimenting for the first time. Keep secrets and unrelated
                  personal data outside that folder.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="first-task" title="Run your first task">
              <p>
                Start with a small, verifiable change. The goal is to learn the
                workflow, not to hand the entire repository to the model at
                once.
              </p>
              <Steps
                items={[
                  {
                    title: "Describe one outcome",
                    body: (
                      <>
                        Write what should be different when the task is complete,
                        where the relevant code appears, and any constraints.
                      </>
                    ),
                  },
                  {
                    title: "Watch the activity",
                    body: (
                      <>
                        The agent may list directories, read files, or search
                        content. Interrupt it if it starts exploring somewhere
                        unrelated.
                      </>
                    ),
                  },
                  {
                    title: "Review every proposed edit",
                    body: (
                      <>
                        Open the diff, read the changed lines in context, and
                        reject changes you cannot explain.
                      </>
                    ),
                  },
                  {
                    title: "Run the checks yourself",
                    body: (
                      <>
                        Use the project&apos;s own scripts for tests, builds,
                        linters, and formatters. A successful edit is not the
                        same as a verified feature.
                      </>
                    ),
                  },
                ]}
              />
              <CodeBlock label="Example first prompt">{`Goal: add input validation to the sign-in form.

Scope:
- Inspect the existing form and its tests.
- Follow the current validation style.
- Do not change the visual design.

Before finishing:
- Run the smallest relevant test suite.
- Summarize the files you changed.`}</CodeBlock>
              <Callout title="Good first tasks">
                <p>
                  Fixing a typo, adding a missing empty state, writing a focused
                  test, or updating one documented behavior are better first
                  tasks than a broad refactor. Small diffs are easier to review
                  and teach you how the agent behaves.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="updating" title="Updating Struct">
              <p>
                New builds are published through GitHub Releases. Updating is
                usually a matter of quitting the app, installing the newer build,
                and reopening your workspace.
              </p>
              <Steps
                items={[
                  {
                    title: "Check the current version",
                    body: (
                      <>
                        Find the version in Struct&apos;s settings or about
                        panel, then compare it with the latest release notes.
                      </>
                    ),
                  },
                  {
                    title: "Back up important work",
                    body: (
                      <>
                        Commit or stash changes before updating. The installer
                        should preserve app data, but a backup is cheap insurance.
                      </>
                    ),
                  },
                  {
                    title: "Install the newer build",
                    body: (
                      <>
                        Download the matching package and install it over the
                        existing app. Close Struct first so files are not in use.
                      </>
                    ),
                  },
                  {
                    title: "Reopen and verify",
                    body: (
                      <>
                        Confirm your workspace, chat history, and provider
                        settings are present, then send a short test prompt.
                      </>
                    ),
                  },
                ]}
              />
              <Callout title="Beta software" warning>
                <p>
                  Struct is in beta. Features, settings, and data formats may
                  change between releases. Read the release notes before
                  updating, especially if you rely on a specific provider or MCP
                  server.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="how-agent-works" title="How the agent works">
              <p>
                An agent is more than a chat model. Struct gives the model a
                small set of tools and a loop: understand the request, inspect
                the workspace, decide on an action, observe the result, and
                continue until it can answer or propose a change.
              </p>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Stage</th>
                      <th>What happens</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Understand</td>
                      <td>
                        The model reads your message, instructions, and selected
                        context.
                      </td>
                    </tr>
                    <tr>
                      <td>Inspect</td>
                      <td>
                        It lists folders, searches, and reads files it considers
                        relevant.
                      </td>
                    </tr>
                    <tr>
                      <td>Act</td>
                      <td>
                        It proposes a file edit, runs an approved command, or
                        calls a connected tool.
                      </td>
                    </tr>
                    <tr>
                      <td>Observe</td>
                      <td>
                        Tool output is returned to the model, which decides what
                        to do next.
                      </td>
                    </tr>
                    <tr>
                      <td>Report</td>
                      <td>
                        It summarizes the change and leaves the final decision to
                        you.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>The loop can go wrong</h3>
              <p>
                Models can choose the wrong file, misread an error, repeat a
                failed action, or propose a change that compiles but breaks
                behavior. Watch the activity timeline and interrupt early when
                the agent heads in the wrong direction.
              </p>
              <Callout title="You are the supervisor">
                <p>
                  The agent can be fast, but it does not know your intent better
                  than you do. Keep tasks scoped, read the diffs, and stop the
                  run when the work stops matching the request.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="agent-tools" title="Agent tools">
              <p>
                Tools are the actions the agent can request inside a workspace.
                The exact list depends on the build and any connected MCP
                servers, but the core filesystem tools are stable.
              </p>
              <div className="data-table-wrap">
                <table className="data-table">
                  <tbody>
                    {agentTools.map(([name, description]) => (
                      <tr key={name}>
                        <td className="whitespace-nowrap">
                          <code>{name}</code>
                        </td>
                        <td>{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Agent activity appears in a timeline with tool status and
                output. Destructive operations require explicit approval, but
                approval alone is not a substitute for reviewing the resulting
                diff.
              </p>
              <ScreenshotFrame
                src={chatPreview}
                alt="Chat interface with an agent conversation"
                title="Chat section"
              />

              <Callout title="Context is selected">
                <p>
                  Struct does not automatically send your entire repository to a
                  provider. The agent can work with open editor files, files you
                  select, files discovered by search, and files reached through
                  its tools.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="approvals" title="Permissions & approvals">
              <p>
                Struct separates low-risk inspection from actions that can change
                your project. The goal is not to slow you down, but to make
                consequential steps explicit.
              </p>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Operation</th>
                      <th>Typical behavior</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>List, read, search</td>
                      <td>Usually runs automatically inside the workspace.</td>
                    </tr>
                    <tr>
                      <td>Create or edit a file</td>
                      <td>
                        Shows a proposed diff. Review it before accepting.
                      </td>
                    </tr>
                    <tr>
                      <td>Rename or move</td>
                      <td>
                        Review the old and new paths; imports may need updates.
                      </td>
                    </tr>
                    <tr>
                      <td>Delete a file or folder</td>
                      <td>Requires explicit confirmation.</td>
                    </tr>
                    <tr>
                      <td>Run a command</td>
                      <td>
                        Review the command and working directory before allowing
                        it.
                      </td>
                    </tr>
                    <tr>
                      <td>Call an MCP tool</td>
                      <td>
                        Depends on the server. Treat it as a new capability with
                        its own permissions.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>Before you approve</h3>
              <ul>
                <li>Is the action inside the workspace you intended?</li>
                <li>Does the command only do what the label suggests?</li>
                <li>Will this delete or overwrite something you can recover?</li>
                <li>Does the diff contain unrelated changes?</li>
              </ul>
              <Callout title="Approval is not verification" warning>
                <p>
                  Clicking approve means you allow the action, not that you have
                  checked the result. Run the relevant tests and read the final
                  diff after the agent finishes.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="prompting" title="Writing effective prompts">
              <p>
                A useful request gives the agent an outcome, constraints, and a
                definition of done. More context is not always better; relevant
                context is.
              </p>
              <div className="data-table-wrap">
                <table className="data-table">
                  <tbody>
                    {[
                      [
                        "State the outcome",
                        "Describe the behavior or change in plain language before implementation details.",
                      ],
                      [
                        "Set boundaries",
                        "Name files, folders, dependencies, APIs, or patterns the agent must not change.",
                      ],
                      [
                        "Explain why",
                        "Share the bug, requirement, or user experience behind the request.",
                      ],
                      [
                        "Define verification",
                        "Specify the test, command, or manual check that proves the task worked.",
                      ],
                    ].map(([title, body]) => (
                      <tr key={title}>
                        <td className="whitespace-nowrap">
                          <strong>{title}</strong>
                        </td>
                        <td>{body}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3>Break large requests into stages</h3>
              <p>
                For broad work, ask the agent to investigate and propose a plan
                first. Then approve the plan, implement one stage, verify it, and
                only then continue. This creates clear checkpoints and reduces
                accidental scope.
              </p>
              <CodeBlock label="Prompt structure">{`Outcome: [what should work afterward]
Context: [relevant behavior, error, or architecture]
Constraints: [what must remain unchanged]
Verification: [tests or checks to run]

First inspect the relevant files and summarize your plan before editing.`}</CodeBlock>
              <h3>Weak vs. useful</h3>
              <ul>
                <li>
                  <strong>Weak:</strong> “Fix the app.” There is no outcome,
                  location, or way to know when it is done.
                </li>
                <li>
                  <strong>Useful:</strong> “The account page shows a blank
                  display name after saving. Find the profile update path, keep
                  the current API, and add a test for an empty name.”
                </li>
              </ul>
              <Callout title="Ask for a plan first">
                <p>
                  On unfamiliar code, request an investigation and plan before
                  any edits. A short plan is much cheaper to correct than a large
                  diff built on the wrong assumption.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="change-review" title="Reviewing changes">
              <p>
                Agent-generated modifications are not the same as finished work.
                Review the diff at three levels: what changed, whether it belongs
                in the requested scope, and whether the project still passes its
                own checks.
              </p>
              <ol>
                <li>
                  <span className="font-medium text-[var(--ink-2)]">
                    Read the summary.
                  </span>{" "}
                  Compare the claimed files and behavior with your request.
                </li>
                <li>
                  <span className="font-medium text-[var(--ink-2)]">
                    Inspect every hunk.
                  </span>{" "}
                  Look for unrelated formatting, silent behavior changes, and
                  weakened error handling.
                </li>
                <li>
                  <span className="font-medium text-[var(--ink-2)]">
                    Check surrounding code.
                  </span>{" "}
                  A small diff can still break assumptions elsewhere in the
                  module.
                </li>
                <li>
                  <span className="font-medium text-[var(--ink-2)]">
                    Run focused checks first.
                  </span>{" "}
                  Start with the relevant test file, then broaden when it
                  passes.
                </li>
                <li>
                  <span className="font-medium text-[var(--ink-2)]">
                    Verify manually.
                  </span>{" "}
                  Exercise the user flow when tests cannot capture the behavior.
                </li>
              </ol>
              <h3>Review checklist</h3>
              <ul>
                <li>No secrets, debug output, or personal paths were added.</li>
                <li>No dependency was added without a clear reason.</li>
                <li>Error handling still covers the failure paths.</li>
                <li>Types and public APIs match the existing style.</li>
                <li>Generated files and lockfiles changed only when expected.</li>
              </ul>
              <Callout title="Never approve a change you cannot explain" warning>
                <p>
                  If a diff introduces a dependency, changes security behavior,
                  deletes data, or rewrites unrelated code, pause and investigate
                  before accepting it.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="project-context" title="Project context">
              <p>
                Good context is relevant, small, and current. Struct can gather
                context through the files you open, selections you make, searches
                you request, and the filesystem tools it uses. You remain in
                control of what the model sees.
              </p>
              <h3>A practical context checklist</h3>
              <ul>
                <li>Name the entry point, component, route, or package involved.</li>
                <li>Include the current error message when debugging a failure.</li>
                <li>Share the relevant type, schema, or API contract.</li>
                <li>Point out generated folders that should not be edited.</li>
                <li>
                  Ask the agent to search for an existing pattern before creating
                  a new one.
                </li>
              </ul>
              <h3>Context that usually does not help</h3>
              <ul>
                <li>An entire lockfile or build output.</li>
                <li>Unrelated screenshots and logs.</li>
                <li>API keys, tokens, and customer records.</li>
                <li>Large generated folders such as dependencies or caches.</li>
              </ul>
              <Callout title="Large repositories">
                <p>
                  Ask for targeted searches such as “find where user sessions
                  are created” rather than “read everything.” It is faster, less
                  expensive, and reduces irrelevant context.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="sessions" title="Chat history & sessions">
              <p>
                Each conversation is a session with its own history. Sessions are
                stored locally so you can return to a task, compare approaches,
                or review what the agent did.
              </p>
              <h3>Working habits that help</h3>
              <ul>
                <li>Start a new session for a new task or a different project.</li>
                <li>
                  Keep long investigations in one session so the agent retains
                  the thread.
                </li>
                <li>
                  Start fresh when a conversation becomes confused or full of
                  abandoned attempts.
                </li>
                <li>
                  Summarize decisions in your own words before moving to a new
                  stage.
                </li>
              </ul>
              <h3>History and privacy</h3>
              <p>
                Chat history can contain code, file paths, error output, and
                anything you pasted into the conversation. Treat it as project
                data. If you share a machine, sign out and review what is stored
                locally.
              </p>
              <Callout title="Long sessions drift">
                <p>
                  As a session grows, older context may be shortened or omitted.
                  If the agent forgets a constraint, restate it explicitly or
                  begin a focused new session with a short summary.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="instructions" title="Custom instructions">
              <p>
                Struct lets you set a system prompt or project instructions that
                apply to agent requests. Use this for stable preferences, not for
                one-off task details.
              </p>
              <h3>Good instructions</h3>
              <ul>
                <li>Project conventions, package manager, and test commands.</li>
                <li>Files or folders that must not be edited.</li>
                <li>Preferred response style and level of explanation.</li>
                <li>Safety rules, such as never committing secrets.</li>
              </ul>
              <h3>Poor instructions</h3>
              <ul>
                <li>Long pasted documentation the agent does not need.</li>
                <li>Contradictory rules from different projects.</li>
                <li>Credentials, private URLs, or personal information.</li>
                <li>Temporary task details that will soon be stale.</li>
              </ul>
              <CodeBlock label="Example project instructions">{`Project: Forge website (React + TypeScript + Vite).

Conventions:
- Use the existing design tokens and component patterns.
- Prefer small, focused diffs over broad rewrites.
- Do not edit generated files in dist/ or node_modules/.

Checks:
- Run npm run build before claiming a change is complete.
- Mention any check you could not run.`}</CodeBlock>
              <Callout title="Instructions are sent with requests" warning>
                <p>
                  Anything in custom instructions may be included in model
                  requests. Do not put API keys, passwords, customer data, or
                  confidential material there.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="providers" title="Model providers">
              <p>
                Struct is provider-independent. Configure a compatible endpoint
                with the model name, base URL, credentials, and optional system
                prompt or provider-specific settings. This keeps you in control
                of cost, privacy, latency, and model choice.
              </p>
              <Steps
                items={[
                  {
                    title: "Choose an endpoint",
                    body: (
                      <>
                        Select a hosted service or a compatible local endpoint.
                        Confirm that it supports the model format Struct expects.
                      </>
                    ),
                  },
                  {
                    title: "Enter the model and base URL",
                    body: (
                      <>
                        Use the exact model identifier and API path from the
                        provider. A wrong URL usually produces a connection or
                        parsing error.
                      </>
                    ),
                  },
                  {
                    title: "Add credentials securely",
                    body: (
                      <>
                        Treat API keys like passwords. Do not paste them into
                        source files, screenshots, prompts, or issue reports.
                      </>
                    ),
                  },
                  {
                    title: "Test with a small prompt",
                    body: (
                      <>
                        Start with a short request before giving the agent a
                        large repository task.
                      </>
                    ),
                  },
                ]}
              />
              <h3>Provider checklist</h3>
              <ul>
                <li>The endpoint is reachable from the machine running Struct.</li>
                <li>The model name is spelled exactly as the provider documents it.</li>
                <li>The API key has permission for that model and account.</li>
                <li>
                  The selected context window can hold the files you plan to
                  send.
                </li>
                <li>
                  You understand the provider&apos;s retention and training
                  terms.
                </li>
              </ul>
              <ScreenshotFrame
                src={aiSettings}
                alt="AI model provider settings and system prompt"
                title="Provider settings"
              />
              <Callout title="One provider at a time">
                <p>
                  When debugging, change one setting at a time: model, base URL,
                  key, or prompt. Changing several at once makes it hard to tell
                  what fixed or broke the connection.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="local-models" title="Local models with Ollama">
              <Callout title="Local server setup" warning>
                <p>
                  For Ollama or other local servers you need to download the
                  Ollama runtime for your system first. Once it is running,
                  Struct can connect to the local endpoint.
                </p>
              </Callout>
              <p>
                Struct can connect to a model server running on your own machine
                through{" "}
                <a
                  href="https://ollama.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ollama
                </a>
                . This is useful when you want inference to stay local or need to
                work without a hosted provider connection.
              </p>
              <CodeBlock label="Ollama setup">{`# install Ollama from ollama.com
ollama pull llama3.1
ollama serve`}</CodeBlock>

              <p>
                In Struct, use the local endpoint and the model identifier
                reported by Ollama. The exact setup varies by machine and model,
                so check the Ollama documentation and Struct&apos;s provider
                settings if the names do not match.
              </p>
              <h3>What local models are good at</h3>
              <ul>
                <li>Offline drafts, explanations, and small edits.</li>
                <li>Work where code cannot leave the machine.</li>
                <li>Experiments without per-token API cost.</li>
              </ul>
              <h3>What to expect</h3>
              <ul>
                <li>
                  Larger models need more RAM and disk, and may run slowly on
                  laptops.
                </li>
                <li>
                  Tool-calling quality varies. A model that chats well may still
                  struggle with precise edits.
                </li>
                <li>
                  Context windows are often smaller than hosted models, so
                  targeted context matters more.
                </li>
              </ul>
              <Callout title="Local does not automatically mean private" warning>
                <p>
                  Check what the model, OS, and any extensions can access. Avoid
                  sending secrets or sensitive files to a model simply because
                  the interface is running locally.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="cost-context" title="Cost & context windows">
              <p>
                Hosted providers charge by tokens, and every message, file, tool
                result, and instruction counts. A focused request is usually
                cheaper and more accurate than a large dump of files.
              </p>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Habit</th>
                      <th>Effect</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Targeted search</td>
                      <td>Fewer irrelevant files, lower cost, better answers.</td>
                    </tr>
                    <tr>
                      <td>Small first prompt</td>
                      <td>Confirms the connection before a large request.</td>
                    </tr>
                    <tr>
                      <td>Plan before editing</td>
                      <td>Avoids expensive rewrites built on wrong assumptions.</td>
                    </tr>
                    <tr>
                      <td>New session per task</td>
                      <td>Prevents old context from being resent repeatedly.</td>
                    </tr>
                    <tr>
                      <td>Local model</td>
                      <td>No per-token API charge, but uses your hardware.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>Signs the context is too large</h3>
              <ul>
                <li>The provider rejects the request for exceeding a limit.</li>
                <li>Answers become vague or ignore recent instructions.</li>
                <li>The agent repeats work it already completed.</li>
                <li>Latency and cost rise sharply for small changes.</li>
              </ul>
              <Callout title="You control the budget">
                <p>
                  Struct does not add a markup or subscription on top of your
                  provider. Check your provider dashboard for actual usage, and
                  set spending limits there if available.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="mcp" title="MCP connections">
              <Callout title="MCP is still limited" warning>
                <p>
                  The MCP server feature is currently very limited and is being
                  actively worked on. Expect the configuration and available
                  tools to change.
                </p>
              </Callout>
              <p>
                MCP, or Model Context Protocol, lets Struct connect to compatible
                tools and services. Treat a connection as adding another capable
                system to your agent session: review what data it can access and
                which actions it can perform before enabling it.
              </p>
              <ScreenshotFrame
                src={mcpusage}
                alt="Example of MCP server usage in Roblox Studio"
                title="MCP server usage"
              />

              <Steps
                items={[
                  {
                    title: "Choose a trusted server",
                    body: (
                      <>
                        Prefer a server you understand, with a clear source,
                        documentation, and permission model.
                      </>
                    ),
                  },
                  {
                    title: "Review the configuration",
                    body: (
                      <>
                        Look at the command, arguments, environment variables,
                        network destination, and exposed tools.
                      </>
                    ),
                  },
                  {
                    title: "Connect with minimal scope",
                    body: (
                      <>
                        Start in a test workspace. Do not grant broad filesystem
                        or network access to an unfamiliar server.
                      </>
                    ),
                  },
                  {
                    title: "Test one action",
                    body: (
                      <>
                        Confirm the tool appears, returns expected output, and
                        does not perform unexpected writes.
                      </>
                    ),
                  },
                ]}
              />
              <Callout title="MCP servers can be powerful" warning>
                <p>
                  Use the same review discipline for MCP as for a shell command.
                  A server that can write files, run commands, or call external
                  APIs can change your project and your accounts.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="web-search" title="Web search">
              <p>
                The web search tool lets the agent look up current information
                that is not in your workspace or its training data. Search
                results are returned as context, then the model decides how to
                use them.
              </p>
              <h3>When it helps</h3>
              <ul>
                <li>Checking current API documentation or release notes.</li>
                <li>Looking up an error message or dependency behavior.</li>
                <li>Comparing library options before adding one.</li>
              </ul>
              <h3>When to be careful</h3>
              <ul>
                <li>
                  Search queries leave your machine. Do not include secrets,
                  customer data, or private code in a query.
                </li>
                <li>
                  Results can be outdated, wrong, or malicious. Prefer primary
                  documentation.
                </li>
                <li>
                  A search result is not a license to run code. Review commands
                  and dependencies before using them.
                </li>
              </ul>
              <Callout title="Verify before installing">
                <p>
                  If a search suggests a package or command, confirm it exists in
                  the official registry or documentation. Typosquatted packages
                  and copy-pasted shell commands are common risks.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="ai-troubleshooting" title="AI troubleshooting">
              <p>
                When an agent task fails, separate the problem into the model,
                the connection, the context, and the task itself. The fastest
                diagnostic is usually a small, deterministic request.
              </p>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Symptom</th>
                      <th>Check first</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Connection error</td>
                      <td>Base URL, network, firewall, and provider status</td>
                    </tr>
                    <tr>
                      <td>Authentication error</td>
                      <td>API key, account permissions, and model availability</td>
                    </tr>
                    <tr>
                      <td>Empty or truncated answer</td>
                      <td>Context size, model name, and provider response format</td>
                    </tr>
                    <tr>
                      <td>Agent misses relevant code</td>
                      <td>
                        Scope the search and name the entry point or existing
                        pattern
                      </td>
                    </tr>
                    <tr>
                      <td>Changes break the build</td>
                      <td>Inspect the diff and run the smallest relevant check</td>
                    </tr>
                    <tr>
                      <td>Tool calls fail repeatedly</td>
                      <td>
                        Model tool support, workspace permissions, and malformed
                        arguments
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CodeBlock label="Diagnostic order">{`1. Send "Reply with OK" using the same model.
2. If that fails, check base URL, key, and network.
3. If it works, send one small file-related request.
4. If that fails, check workspace permissions and tool support.
5. Only then retry the original task with a narrower scope.`}</CodeBlock>
              <p>
                Capture the exact error, the provider, the model, and the
                smallest prompt that reproduces it. That information is much more
                useful than saying “the AI is broken.”
              </p>
            </DocSection>

            <DocSection id="shortcuts" title="Keyboard shortcuts">
              <p>
                Use the command palette for actions that are not listed here. On
                Windows and Linux, the primary modifier is Ctrl; keyboard
                bindings can depend on your operating system and build.
              </p>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Shortcut</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortcuts.map(({ keys, action }) => (
                      <tr key={keys}>
                        <td className="whitespace-nowrap">
                          <code>{keys}</code>
                        </td>
                        <td>{action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Callout title="Shortcuts can change">
                <p>
                  Struct is in beta, so bindings may change between releases. If
                  a shortcut does nothing, check the command palette and the
                  current release notes.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="privacy" title="Privacy & local data">
              <p>
                Struct stores application data locally on your device, including
                chat history, settings, model and API configuration, system
                prompts, and other persisted data. Core local file operations do
                not require a Struct cloud account.
              </p>
              <p>
                If you use a hosted AI provider, the context sent to that
                provider is subject to that provider&apos;s privacy policy and
                terms. Review what you include before sending proprietary code,
                credentials, customer data, or personal information.
              </p>
              <h3>Practical privacy habits</h3>
              <ul>
                <li>
                  Keep API keys out of prompts, source files, screenshots, and
                  bug reports.
                </li>
                <li>
                  Use a local endpoint when local inference is required by your
                  workflow.
                </li>
                <li>
                  Remove generated or sensitive files from a workspace when they
                  are not needed.
                </li>
                <li>
                  Review the{" "}
                  <Link to="/privacypolicyandterms">
                    Privacy Policy &amp; Terms
                  </Link>{" "}
                  for the website and account services.
                </li>
              </ul>
              <Callout title="Local-first is not a guarantee">
                <p>
                  Local-first means core features run on your machine. It does
                  not mean every action is offline. Hosted providers, web search,
                  accounts, and MCP servers can send data outside your device
                  when you use them.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="accounts" title="Accounts">
              <p>
                The Forge website and Struct use the same account system. Signing
                in on the website gives you access to your profile, so everything
                follows you between the site and the app.
              </p>
              <Steps
                items={[
                  {
                    title: "Sign in",
                    body: (
                      <>
                        Use the account menu in the navbar or the{" "}
                        <Link to="/account">Account page</Link>.
                      </>
                    ),
                  },
                  {
                    title: "Check your account",
                    body: (
                      <>
                        Return to your profile to see your display name, avatar,
                        and member-since date.
                      </>
                    ),
                  },
                  {
                    title: "Sign out when needed",
                    body: (
                      <>
                        Use sign out on a shared device, or sign out of all
                        devices if you think a session is compromised.
                      </>
                    ),
                  },
                ]}
              />
              <h3>What accounts are for</h3>
              <ul>
                <li>Cloud sync of supported app data.</li>
                <li>Encrypted storage of your own provider API keys.</li>
                <li>A consistent profile across the website and Struct.</li>
              </ul>
              <Callout title="Keep control of your account">
                <p>
                  Use a unique password, sign out of shared devices, and review
                  sign-in methods from account settings. For account deletion or
                  a security concern, use the official support channel rather
                  than posting private details publicly.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="data-locations" title="Data & storage">
              <p>
                Struct keeps local application data in your operating
                system&apos;s standard application-data location. The exact
                folder name depends on the build and platform.
              </p>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Typical location</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Windows</td>
                      <td>
                        <code>%APPDATA%</code> (Roaming application data)
                      </td>
                    </tr>
                    <tr>
                      <td>macOS</td>
                      <td>
                        <code>~/Library/Application Support</code>
                      </td>
                    </tr>
                    <tr>
                      <td>Linux</td>
                      <td>
                        <code>~/.config</code> or <code>~/.local/share</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>What may be stored</h3>
              <ul>
                <li>Chat history and session metadata.</li>
                <li>App settings, theme, and layout preferences.</li>
                <li>Provider configuration and system prompts.</li>
                <li>Encrypted account data and sync state.</li>
              </ul>
              <Callout title="Back up before clearing" warning>
                <p>
                  Removing app data can delete chat history and settings. Back up
                  anything important first, and close Struct before moving or
                  deleting files in its data folder.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="app-troubleshooting" title="App troubleshooting">
              <p>
                Most desktop problems fall into four groups: the app does not
                launch, the window is blank, a workspace cannot be opened, or a
                feature cannot reach its service.
              </p>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Problem</th>
                      <th>Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>App will not launch</td>
                      <td>
                        Reinstall the matching build, check OS version, and
                        review any security warning.
                      </td>
                    </tr>
                    <tr>
                      <td>Blank window</td>
                      <td>
                        Restart the app, update the build, and check whether a
                        proxy or security tool is blocking local assets.
                      </td>
                    </tr>
                    <tr>
                      <td>Workspace will not open</td>
                      <td>
                        Confirm the folder exists, you have read/write permission,
                        and it is not on a disconnected drive.
                      </td>
                    </tr>
                    <tr>
                      <td>Model requests fail</td>
                      <td>
                        Recheck provider settings, network, and API key
                        permissions.
                      </td>
                    </tr>
                    <tr>
                      <td>Settings or history missing</td>
                      <td>
                        Confirm you are signed into the intended account and that
                        local app data was not cleared.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>When reporting a problem</h3>
              <ul>
                <li>Struct version and operating system.</li>
                <li>Exact steps to reproduce, starting from launch.</li>
                <li>The full error text, with secrets removed.</li>
                <li>Whether the issue happens in a fresh workspace.</li>
                <li>Provider and model name, if the issue is AI-related.</li>
              </ul>
              <Callout title="Do not share secrets" warning>
                <p>
                  Remove API keys, tokens, private code, and personal data from
                  screenshots and logs before posting them in a public issue.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="faq" title="Frequently asked questions">
              <div className="faq-list">
                {[
                  [
                    "Does Struct need an account?",
                    "The core desktop workspace and local file tools can be used without a cloud account. An account is useful for cloud sync, encrypted provider-key storage, and shared app features.",
                  ],
                  [
                    "Can I use my own API key?",
                    "Yes. Struct supports provider-independent configuration, including API keys, model names, base URLs, system prompts, and provider-specific options.",
                  ],
                  [
                    "Can I use a local model?",
                    "Yes. Struct can connect to a local Ollama server so inference can remain on your machine. Hardware and model quality determine how well it works.",
                  ],
                  [
                    "Will the agent delete my files?",
                    "Destructive actions require explicit approval. You should still read the diff and understand the requested action before approving it.",
                  ],
                  [
                    "Can I use MCP?",
                    "Yes, with compatible MCP servers. Review each server's commands, permissions, network access, and available tools before connecting it.",
                  ],
                  [
                    "Does Struct send my whole repository to the model?",
                    "No. The agent works with selected context, search results, and files it reads through tools. You still control what you add to a conversation.",
                  ],
                  [
                    "Is Struct free?",
                    "Yes. Struct is free to use. There are no subscriptions or paywalls. Hosted model providers may charge you directly for usage.",
                  ],
                  [
                    "Where should I report a bug?",
                    "Use the relevant issue or discussion on the official Struct GitHub repository. Include your platform, version, exact steps, and a minimal reproduction when possible.",
                  ],
                ].map(([question, answer]) => (
                  <details key={question} className="faq-item">
                    <summary>
                      {question}
                      <span aria-hidden="true">+</span>
                    </summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </DocSection>

            <DocSection id="building" title="Building from source">
              <p>
                Development requires {devRequirements.join(", ")}. Then clone
                the official repository and start the development shell.
              </p>
              <CodeBlock label="Development setup">{`git clone https://github.com/ForgeBuilds/Struct.git
cd Struct
npm install
npm run dev:electron`}</CodeBlock>
              <h3>Useful commands</h3>
              <div className="data-table-wrap">
                <table className="data-table">
                  <tbody>
                    <tr>
                      <td className="whitespace-nowrap">
                        <code>npm run dev</code>
                      </td>
                      <td>Start the renderer development server.</td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap">
                        <code>npm run dev:electron</code>
                      </td>
                      <td>Start the Electron development shell.</td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap">
                        <code>npm run build</code>
                      </td>
                      <td>Type-check and create a production build.</td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap">
                        <code>npm run lint</code>
                      </td>
                      <td>Run the project&apos;s linter.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>Before opening a pull request</h3>
              <ul>
                <li>Run the project&apos;s lint, type-check, and test commands.</li>
                <li>
                  Keep changes focused and explain the user-facing behavior.
                </li>
                <li>
                  Do not commit secrets, local model files, build output, or
                  personal paths.
                </li>
                <li>
                  Test the affected platform when the change touches native
                  behavior.
                </li>
              </ul>
              <Callout title="License" warning>
                <p>
                  The Struct desktop app is licensed separately under the STRUCT
                  Source-Available License 1.0. Read the repository&apos;s
                  LICENSE file before copying, modifying, distributing, or
                  commercially using the code.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="contributing" title="Contributing">
              <p>
                Struct is under active development, and focused contributions are
                welcome. The most useful reports are specific, reproducible, and
                respectful of the time of the people reading them.
              </p>
              <h3>Ways to help</h3>
              <ul>
                <li>Report a bug with a minimal reproduction.</li>
                <li>Improve documentation where something was unclear.</li>
                <li>Request a feature with the user problem it solves.</li>
                <li>Submit a focused pull request with tests where practical.</li>
              </ul>
              <h3>Before you post</h3>
              <ul>
                <li>Search existing issues to avoid duplicates.</li>
                <li>Remove secrets, private code, and personal data.</li>
                <li>Describe expected and actual behavior separately.</li>
                <li>Follow the repository&apos;s code of conduct.</li>
              </ul>
              <Callout title="Security reports">
                <p>
                  Do not publicly disclose exploit details, private code, or
                  credentials. Use a private reporting channel if one is
                  available, or contact the maintainers without publishing the
                  details.
                </p>
              </Callout>
            </DocSection>

            <DocSection id="status" title="Project status">
              <p>
                Struct is currently in beta and under active development.
                Architecture, agent capabilities, APIs, shortcuts, and platform
                support may change between releases. Some features are
                experimental or incomplete.
              </p>
              <p>
                Development began in May 2026. The project source, releases, and
                issue tracking live on{" "}
                <a
                  href="https://github.com/ForgeBuilds/Struct"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                .
              </p>
              <h3>Known limitations</h3>
              <ul>
                <li>MCP support is limited and changing.</li>
                <li>
                  Local model quality depends heavily on hardware and model
                  choice.
                </li>
                <li>
                  Platform packages and shortcuts may differ between releases.
                </li>
                <li>
                  Some settings and data formats may change during beta.
                </li>
              </ul>
              <Callout title="Help improve Struct">
                <p>
                  Bug reports with a minimal reproduction, focused feature
                  requests, documentation fixes, and careful contributions are
                  all useful. Do not include API keys, private code, or personal
                  data in a public issue.
                </p>
              </Callout>
            </DocSection>
          </div>
        </div>
      </div>
    </div>
  );
}
