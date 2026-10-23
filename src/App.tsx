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

import BackgroundPixelStars from "../components/background";
import GradientASCII from "./component/GradientASCII";
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
  const { pathname } = useLocation();
  const isStructPage = pathname === "/products/struct";

  return (
    //credits to https://21st.dev/@uicapsule/components/background-pixel-stars for the background component
     <div className={isStructPage ? "h-dvh w-dvw bg-transparent" : "h-dvh w-dvw bg-black bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAIElEQVR42mIUEhJiwAbevXuHVZyJgUQwqmEUDB0AEGAADd8DEPTX6ksAAAAASUVORK5CYII=')] bg-[size:10px]"}>
       {pathname === "/" || isStructPage ? null : <BackgroundPixelStars/>}

      {/* Struct page alone posesses this bg*/}
      {isStructPage && (
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <GradientASCII
            colors={["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"]}
            shape="horizon"
            characters=" =+xX0S8#@"
            cellSize={18}
            density={0.8}
            glyphOpacity={0.85}
            glow={2}
            depthOfField={0}
            flicker={0.05}
            softness={0.1}
            scale={0.6}
            flow={0.3}
            speed={0.5}
            gradientOpacity={0.7}
            grain={0.03}
            variation={0}
            mouseInteraction={false}
            scrambleRadius={0}
            clickEffect="none"
            intro={false}
            lightMode={false}
            className="h-full w-full"
          />
        </div>
      )}
      {isStructPage && (
        <div className="pointer-events-none fixed inset-0 z-0 bg-slate-950/70" aria-hidden="true" />
      )}
    <div className={isStructPage ? "flex min-h-screen flex-col bg-transparent" : "flex min-h-screen flex-col bg-zinc-950"}>

        <div className={isStructPage ? "[&_nav]:bg-transparent [&_nav]:border-transparent [&_nav]:backdrop-blur-none" : ""}>
        <Navbar />
        </div>
      
        {/* Global auth modal (sign in / sign up) — opened by the navbar. */}
        <AuthModal />

        <main className="relative z-10 flex-1">
          <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-label="Loading page" />}>
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
                <div className="mx-auto max-w-7xl px-4 py-32 text-center sm:px-6">
                  <h1 className="text-5xl font-semibold text-white">
                    404
                  </h1>

                  <p className="mt-4 text-zinc-400">
                    This page doesn&apos;t exist.
                  </p>

                  <Link
                    to="/"
                    className="mt-8 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                  >
                    Back home
                  </Link>
                </div>
              }
            />

            </Routes>
          </Suspense>
        </main>
      </div>

      <div className={isStructPage ? "relative z-10 [&_footer]:bg-transparent [&_footer]:border-transparent" : ""}>
      <Footer />
      </div>
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