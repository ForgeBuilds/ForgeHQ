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
    <a className="build-row" href={href}>
      <div className="min-w-0">
        <p className="build-row-name">{name}</p>
        <p className="build-row-size">{formatSize(size)}</p>
      </div>
      <IoDownloadOutline className="h-4 w-4" aria-hidden="true" />
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
    <main className="downloads-page">
      <div className="site-shell">
        <header className="page-header">
          <div className="page-header-copy">
            <p className="eyebrow">Forge / Struct</p>
            <h1 className="display page-title">
              Downloads<span className="accent">.</span>
            </h1>
            <p className="page-lead">
              Current release builds for Windows, macOS, and Linux when packages
              are published. See product details on the{" "}
              <Link className="text-link" to="/products/struct">
                Struct page
              </Link>
              .
            </p>
          </div>

          {version && (
            <div className="page-aside">
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

        <section className="download-hero" aria-label="Recommended download">
          {loading ? (
            <div className="download-hero-main">
              <div className="platform-icon">
                <PlatformIcon os={os} />
              </div>
              <div>
                <p className="mono-label">Recommended build</p>
                <h2>Checking the latest release…</h2>
                <p className="download-hero-meta">
                  Reading release information from GitHub.
                </p>
              </div>
            </div>
          ) : error ? (
            <div>
              <p className="mono-label">Recommended build</p>
              <h2>Release information unavailable</h2>
              <p className="download-hero-meta">{error}</p>
              <div className="download-actions mt-5">
                <a
                  href={RELEASES_PAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Open releases
                  <IoOpenOutline aria-hidden="true" />
                </a>
              </div>
            </div>
          ) : primary ? (
            <>
              <div className="download-hero-main">
                <div className="platform-icon">
                  <PlatformIcon os={os} />
                </div>

                <div className="min-w-0">
                  <p className="mono-label">Recommended build</p>
                  <h2>Struct v{version}</h2>
                  <p className="download-hero-meta">
                    {OS_LABEL[os]} · {primary.name} ·{" "}
                    {formatSize(primary.size)}
                  </p>
                </div>
              </div>

              <div className="download-actions">
                <a href={primary.browser_download_url} className="btn btn-primary">
                  Download
                  <IoDownloadOutline aria-hidden="true" />
                </a>
                <a
                  href={RELEASES_PAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-quiet"
                >
                  All releases
                </a>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="mono-label">Recommended build</p>
                <h2>Struct {version ? `v${version}` : ""}</h2>
                <p className="download-hero-meta">
                  No prebuilt package for {OS_LABEL[os]} is available in this
                  release.
                </p>
              </div>
              <div className="download-actions">
                <a
                  href={RELEASES_PAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View releases
                  <IoOpenOutline aria-hidden="true" />
                </a>
                <a
                  href={REPO_PAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-quiet"
                >
                  Build from source
                </a>
              </div>
            </>
          )}
        </section>

        <section className="builds-section" aria-labelledby="builds-title">
          <div className="builds-heading">
            <h2 id="builds-title">Available builds</h2>
            <span className="mono-label">Latest release</span>
          </div>

          <div className="builds-grid">
            <section className="build-card" aria-labelledby="windows-builds">
              <div className="build-card-head">
                <IoLogoWindows className="h-5 w-5" aria-hidden="true" />
                <div>
                  <h3 id="windows-builds">Windows</h3>
                  <p>Windows 11 or later · 64-bit</p>
                </div>
              </div>

              <div className="build-card-body">
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
                  <p className="build-empty">No Windows installer available.</p>
                )}
              </div>
            </section>

            <section className="build-card" aria-labelledby="unix-builds">
              <div className="build-card-head">
                {dmg ? (
                  <IoLogoApple className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <IoLogoTux className="h-5 w-5" aria-hidden="true" />
                )}
                <div>
                  <h3 id="unix-builds">Linux &amp; macOS</h3>
                  <p>Available release packages</p>
                </div>
              </div>

              <div className="build-card-body">
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
                    className="build-row"
                    href={REPO_PAGE}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="build-row-name">Build from source on GitHub</p>
                    <IoOpenOutline className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </section>
          </div>
        </section>

        <div className="builds-footer">
          <div>
            <p>Looking for an older build or release notes?</p>
            <a
              href={RELEASES_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Browse all releases
              <IoOpenOutline aria-hidden="true" />
            </a>
          </div>

          <details className="info-details">
            <summary>
              Important information
              <IoInformationCircleOutline className="h-4 w-4" aria-hidden="true" />
            </summary>
            <div className="info-body">
              <p>
                Struct is currently in beta and Windows, macOS, and Linux builds
                are unsigned, so Microsoft Defender SmartScreen may display a
                warning.
              </p>
              <p>
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
