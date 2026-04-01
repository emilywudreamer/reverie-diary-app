import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";

const Write = lazy(() => import("./pages/Write"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Trends = lazy(() => import("./pages/Trends"));
const Settings = lazy(() => import("./pages/Settings"));

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div
        className="text-sm"
        style={{ color: "var(--text-light)" }}
      >
        加载中…
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/write" element={<Write />} />
            <Route path="/write/:id" element={<Write />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </Layout>
    </HashRouter>
  );
}
