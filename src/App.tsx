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
    <div className="site-page min-h-screen">
      <Navbar />

      {/* Global auth modal (sign in / sign up) — opened by the navbar. */}
      <AuthModal />

      <main className="min-h-[65vh]">
        <Suspense fallback={<div className="site-shell py-24" aria-label="Loading page" />}>
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
                <div className="site-shell flex min-h-[60vh] flex-col items-start justify-center py-24">
                  <p className="eyebrow">Error 404</p>
                  <h1 className="display display-xl mt-4">Lost in the forge.</h1>
                  <p className="lead">
                    This page doesn&apos;t exist. It may have moved, or the link
                    might be out of date.
                  </p>
                  <Link to="/" className="btn btn-primary mt-8">
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
