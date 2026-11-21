import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoLogoApple,
  IoLogoTux,
  IoLogoWindows,
  IoDownloadOutline,
  IoOpenOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";

interface ReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface ReleaseInfo {
  tag_name: string;
  published_at?: string;
  html_url?: string;
  assets?: ReleaseAsset[];
}

const RELEASE_URL =
  "https://api.github.com/repos/ForgeBuilds/Struct/releases/latest";
const RELEASES_PAGE = "https://github.com/ForgeBuilds/Struct/releases";
const REPO_PAGE = "https://github.com/ForgeBuilds/Struct";

type OsKey = "windows" | "linux" | "macos" | "other";

function detectOs(): OsKey {
  if (typeof navigator === "undefined") return "other";

  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  if (ua.includes("mac")) return "macos";

  return "other";
}

const OS_LABEL: Record<OsKey, string> = {
  windows: "Windows",
  linux: "Linux",
  macos: "macOS",
  other: "your platform",
};

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(iso?: string) {
  if (!iso) return null;

  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function parseVersion(tag: string) {
  const match = tag.match(/(\d+\.\d+\.\d+)/);
  return match ? match[1] : tag.replace(/^release[_v-]*/i, "");
}

function findAsset(
  assets: ReleaseAsset[],
  matches: (asset: ReleaseAsset) => boolean,
) {
  return assets.find(matches);
}

function PlatformIcon({ os }: { os: OsKey }) {
  if (os === "windows") {
    return <IoLogoWindows className="h-5 w-5" />;
  }

  if (os === "macos") {
    return <IoLogoApple className="h-5 w-5" />;
  }

  return <IoLogoTux className="h-5 w-5" />;
}

const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] bg-ink px-4 py-2.5 text-sm font-medium text-cream shadow-[0_10px_24px_-16px_rgba(27,26,23,0.65)] transition hover:-translate-y-px hover:bg-[#2f2c26]";
const quietButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] border border-line-strong px-4 py-2.5 text-sm font-medium text-ink transition hover:-translate-y-px hover:border-ink hover:bg-white/35";
const monoLabel =
  "font-mono text-[0.64rem] uppercase tracking-[0.15em] text-faint";
const textLink =
  "inline-flex items-center gap-2 text-sm font-medium text-ink-2 underline decoration-transparent underline-offset-4 transition hover:gap-2.5 hover:text-accent hover:decoration-accent/40";

function BuildRow({
  href,
  name,
  size,
}: {
  href: string;
  name: string;
  size: number;
}) {
  return (
    <a
      className="group flex items-center justify-between gap-4 border-b border-line py-3.5 last:border-b-0"
      href={href}
    >
      <div className="min-w-0">
        <p className="truncate text-[0.84rem] text-ink-2 transition-colors group-hover:text-accent">
          {name}
        </p>
        <p className="mt-0.5 font-mono text-[0.64rem] text-faint">
          {formatSize(size)}
        </p>
      </div>
      <IoDownloadOutline
        className="h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-accent"
        aria-hidden="true"
      />
    </a>
  );
}

export default function Downloads() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [release, setRelease] = useState<ReleaseInfo | null>(null);

  const os = useMemo(() => detectOs(), []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(RELEASE_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not reach the releases service.");
        }

        const data = (await response.json()) as ReleaseInfo;

        if (!cancelled) {
          setRelease(data);
        }
      } catch (err) {
        if (
          !cancelled &&
          !(err instanceof DOMException && err.name === "AbortError")
        ) {
          setError(
            err instanceof Error ? err.message : "Could not load release info.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const assets = release?.assets ?? [];
  const version = release ? parseVersion(release.tag_name) : null;
  const date = formatDate(release?.published_at);

  const exe = findAsset(assets, (asset) => /\.exe$/i.test(asset.name));
  const msi = findAsset(assets, (asset) => /\.msi$/i.test(asset.name));
  const deb = findAsset(assets, (asset) => /\.deb$/i.test(asset.name));
  const rpm = findAsset(assets, (asset) => /\.rpm$/i.test(asset.name));
  const appImage = findAsset(assets, (asset) => /\.appimage$/i.test(asset.name));
  const dmg = findAsset(
    assets,
    (asset) =>
      /\.dmg$/i.test(asset.name) || /macos.*dmg.*\.zip$/i.test(asset.name),
  );

  const primary =
    os === "windows"
      ? exe ?? msi
      : os === "macos"
        ? dmg
        : os === "linux"
          ? deb ?? appImage ?? rpm
          : exe ?? msi ?? dmg ?? deb ?? appImage ?? rpm;

  return (
    <main className="pb-16 sm:pb-20 lg:pb-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <header className="flex flex-col items-start justify-between gap-4  pb-7 pt-14 sm:pb-11 sm:pt-20 lg:flex-row lg:items-end lg:pt-24">
          <div className="max-w-2xl">
            {/* <p className="inline-flex items-center gap-2.5 font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-faint before:h-px before:w-6 before:bg-current before:opacity-55 before:content-['']">
              Forge / Struct
            </p> */}
            <h1 className="mt-4 text-[clamp(3.2rem,7.5vw,6rem)] font-bold leading-[0.92] tracking-[-0.038em] text-ink">
              Downloads<span className="text-accent">.</span>
            </h1>
            <p className="mt-5 max-w-[38rem] text-base leading-[1.72] text-muted">
              Current release builds for Windows, macOS, and Linux when packages
              are published. See product details on the{" "}
              <Link className={textLink} to="/products/struct">
                Struct page
              </Link>
              .
            </p>
          </div>

          {version && (
            <div className="shrink-0 pb-1 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-faint lg:text-right">
              v{version}
              {date && (
                <>
                  <br />
                  {date}
                </>
              )}
            </div>
          )}
        </header>

        <section
          className="mt-8 flex flex-col items-start justify-between gap-5 rounded-3xl bg-surface p-6 shadow-soft sm:p-8 lg:flex-row lg:items-center lg:gap-8"
          aria-label="Recommended download"
        >
          {loading ? (
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[0.8rem] bg-card/70 text-ink shadow-sm">
                <PlatformIcon os={os} />
              </div>
              <div>
                <p className={monoLabel}>Recommended build</p>
                <h2 className="mt-1 text-[clamp(1.5rem,2.4vw,2rem)] font-bold tracking-[-0.02em] text-ink">
                  Checking the latest release…
                </h2>
                <p className="mt-1.5 break-words font-mono text-[0.68rem] leading-[1.6] text-muted">
                  Reading release information from GitHub.
                </p>
              </div>
            </div>
          ) : error ? (
            <div>
              <p className={monoLabel}>Recommended build</p>
              <h2 className="mt-1 text-[clamp(1.5rem,2.4vw,2rem)] font-bold tracking-[-0.02em] text-ink">
                Release information unavailable
              </h2>
              <p className="mt-1.5 break-words font-mono text-[0.68rem] leading-[1.6] text-muted">
                {error}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={RELEASES_PAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={primaryButton}
                >
                  Open releases
                  <IoOpenOutline aria-hidden="true" />
                </a>
              </div>
            </div>
          ) : primary ? (
            <>
              <div className="flex min-w-0 items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[0.8rem] bg-card/70 text-ink shadow-sm">
                  <PlatformIcon os={os} />
                </div>

                <div className="min-w-0">
                  <p className={monoLabel}>Recommended build</p>
                  <h2 className="mt-1 text-[clamp(1.5rem,2.4vw,2rem)] font-bold tracking-[-0.02em] text-ink">
                    Struct v{version}
                  </h2>
                  <p className="mt-1.5 break-words font-mono text-[0.68rem] leading-[1.6] text-muted">
                    {OS_LABEL[os]} · {primary.name} ·{" "}
                    {formatSize(primary.size)}
                  </p>
                </div>
              </div>

              <div className="flex w-full shrink-0 flex-wrap gap-2 max-[860px]:[&>*]:flex-1 lg:w-auto">
                <a href={primary.browser_download_url} className={primaryButton}>
                  Download
                  <IoDownloadOutline aria-hidden="true" />
                </a>
                <a
                  href={RELEASES_PAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={quietButton}
                >
                  All releases
                </a>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className={monoLabel}>Recommended build</p>
                <h2 className="mt-1 text-[clamp(1.5rem,2.4vw,2rem)] font-bold tracking-[-0.02em] text-ink">
                  Struct {version ? `v${version}` : ""}
                </h2>
                <p className="mt-1.5 break-words font-mono text-[0.68rem] leading-[1.6] text-muted">
                  No prebuilt package for {OS_LABEL[os]} is available in this
                  release.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-wrap gap-2 max-[860px]:[&>*]:flex-1 lg:w-auto">
                <a
                  href={RELEASES_PAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={primaryButton}
                >
                  View releases
                  <IoOpenOutline aria-hidden="true" />
                </a>
                <a
                  href={REPO_PAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={quietButton}
                >
                  Build from source
                </a>
              </div>
            </>
          )}
        </section>

        <section className="mt-10 sm:mt-14 lg:mt-16" aria-labelledby="builds-title">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2
              id="builds-title"
              className="text-[1.65rem] font-bold tracking-[-0.02em] text-ink"
            >
              Available builds
            </h2>
            <span className={monoLabel}>Latest release</span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section
              className="overflow-hidden rounded-2xl bg-card shadow-soft"
              aria-labelledby="windows-builds"
            >
              <div className="flex items-center gap-3 border-b border-line px-4 py-4">
                <IoLogoWindows
                  className="h-5 w-5 text-ink-2"
                  aria-hidden="true"
                />
                <div>
                  <h3 id="windows-builds" className="text-sm font-semibold text-ink">
                    Windows
                  </h3>
                  <p className="mt-0.5 text-[0.72rem] text-faint">
                    Windows 11 or later · 64-bit
                  </p>
                </div>
              </div>

              <div className="px-4">
                {exe && (
                  <BuildRow
                    href={exe.browser_download_url}
                    name={exe.name}
                    size={exe.size}
                  />
                )}
                {msi && (
                  <BuildRow
                    href={msi.browser_download_url}
                    name={msi.name}
                    size={msi.size}
                  />
                )}
                {!exe && !msi && (
                  <p className="py-5 text-[0.84rem] text-faint">
                    No Windows installer available.
                  </p>
                )}
              </div>
            </section>

            <section
              className="overflow-hidden rounded-2xl bg-card shadow-soft"
              aria-labelledby="unix-builds"
            >
              <div className="flex items-center gap-3 border-b border-line px-4 py-4">
                {dmg ? (
                  <IoLogoApple
                    className="h-5 w-5 text-ink-2"
                    aria-hidden="true"
                  />
                ) : (
                  <IoLogoTux
                    className="h-5 w-5 text-ink-2"
                    aria-hidden="true"
                  />
                )}
                <div>
                  <h3 id="unix-builds" className="text-sm font-semibold text-ink">
                    Linux &amp; macOS
                  </h3>
                  <p className="mt-0.5 text-[0.72rem] text-faint">
                    Available release packages
                  </p>
                </div>
              </div>

              <div className="px-4">
                {deb && (
                  <BuildRow
                    href={deb.browser_download_url}
                    name={deb.name}
                    size={deb.size}
                  />
                )}
                {rpm && (
                  <BuildRow
                    href={rpm.browser_download_url}
                    name={rpm.name}
                    size={rpm.size}
                  />
                )}
                {appImage && (
                  <BuildRow
                    href={appImage.browser_download_url}
                    name={appImage.name}
                    size={appImage.size}
                  />
                )}
                {dmg && (
                  <BuildRow
                    href={dmg.browser_download_url}
                    name={dmg.name}
                    size={dmg.size}
                  />
                )}
                {!deb && !rpm && !appImage && !dmg && (
                  <a
                    className="group flex items-center justify-between gap-4 py-3.5"
                    href={REPO_PAGE}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="truncate text-[0.84rem] text-ink-2 transition-colors group-hover:text-accent">
                      Build from source on GitHub
                    </p>
                    <IoOpenOutline
                      className="h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </a>
                )}
              </div>
            </section>
          </div>
        </section>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-line pt-6 sm:flex-row">
          <div>
            <p className="text-[0.85rem] text-muted">
              Looking for an older build or release notes?
            </p>
            <a
              href={RELEASES_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className={`${textLink} mt-2`}
            >
              Browse all releases
              <IoOpenOutline aria-hidden="true" />
            </a>
          </div>

          <details className="group max-w-sm">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[0.78rem] text-muted transition-colors hover:text-ink group-open:text-ink [&::-webkit-details-marker]:hidden">
              Important information
              <IoInformationCircleOutline
                className="h-4 w-4"
                aria-hidden="true"
              />
            </summary>
            <div className="mt-3 rounded-xl bg-surface p-4">
              <p className="text-[0.76rem] leading-[1.65] text-muted">
                Struct is currently in beta and Windows, macOS, and Linux builds
                are unsigned, so Microsoft Defender SmartScreen may display a
                warning.
              </p>
              <p className="mt-2.5 text-[0.76rem] leading-[1.65] text-muted">
                Only download Struct from this page or the official Forge GitHub
                repository. Never trust third-party builds or installers. Verify
                the source before installing.
              </p>
            </div>
          </details>
        </div>
      </div>
    </main>
  );
}
