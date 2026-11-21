import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import AuthModal from "../components/AuthModal";

const PrivacyPolicy = lazy(() => import("../components/Privacypolicyandterms"));
const Downloads = lazy(() => import("../components/Downloads"));
//const About = lazy(() => import("../components/About"));
const Contact = lazy(() => import("../components/Contact"));
const Documentation = lazy(() => import("../components/Documentation"));
const Home = lazy(() => import("../components/Home"));
const StructProduct = lazy(() => import("../components/StructProduct"));
const AccountPage = lazy(() => import("../components/AccountPage"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PageContent() {
  return (
    <div className="relative min-h-screen overflow-clip">
      <Navbar />

      {/* Global auth modal (sign in / sign up) — opened by the navbar. */}
      <AuthModal />

      <main className="min-h-[65vh]">
        <Suspense fallback={<div className="mx-auto min-h-[50vh] w-full max-w-6xl px-5 sm:px-6" aria-label="Loading page" />}>
            <Routes>

            {/* Home */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* Struct product page */}
            <Route
              path="/products/struct"
              element={<StructProduct />}
            />

            {/* Downloads */}
            <Route
              path="/downloads"
              element={<Downloads />}
            />

            {/* About */}
            {/* <Route
              path="/about"
              element={<About />}
            /> */}

            {/* Privacy */}
            <Route
              path="/privacypolicyandterms"
              element={<PrivacyPolicy />}
            />

            {/* Legacy privacy route */}
            <Route
              path="/Privacypolicyandterms"
              element={<PrivacyPolicy />}
            />

            {/* Contact */}
            <Route
              path="/contact"
              element={<Contact />}
            />

            {/* Documentation */}
            <Route
              path="/documentation"
              element={<Documentation />}
            />

            {/* Legacy documentation route */}
            <Route
              path="/Documentation"
              element={<Documentation />}
            />

            {/* Account */}
            <Route
              path="/account"
              element={<AccountPage />}
            />

            {/* Legacy account route */}
            <Route
              path="/Account"
              element={<AccountPage />}
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-start justify-center px-5 py-24 sm:px-6">
                  <p className="inline-flex items-center gap-2.5 font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-faint before:h-px before:w-6 before:bg-current before:opacity-55 before:content-['']">
                    Error 404
                  </p>
                  <h1 className="mt-4 max-w-4xl text-balance text-[clamp(3.2rem,7.2vw,5.4rem)] font-bold leading-[0.98] tracking-[-0.038em] text-ink">
                    Lost in the forge.
                  </h1>
                  <p className="mt-6 max-w-[38rem] text-pretty text-[clamp(1.02rem,1.5vw,1.16rem)] leading-[1.72] text-muted">
                    This page doesn&apos;t exist. It may have moved, or the link
                    might be out of date.
                  </p>
                  <Link
                    to="/"
                    className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] bg-ink px-4 py-2.5 text-sm font-medium text-cream shadow-[0_10px_24px_-16px_rgba(27,26,23,0.65)] transition hover:-translate-y-px hover:bg-[#2f2c26]"
                  >
                    Back home
                  </Link>
                </div>
              }
            />

            </Routes>
          </Suspense>
        </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <PageContent />
    </BrowserRouter>
  );
}
