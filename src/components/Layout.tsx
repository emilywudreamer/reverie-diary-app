import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", icon: "🏠", label: "首页" },
  { to: "/calendar", icon: "📅", label: "日历" },
  { to: "/write", icon: "✏️", label: "", fab: true },
  { to: "/trends", icon: "📊", label: "趋势" },
  { to: "/settings", icon: "⚙️", label: "设置" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-dvh pb-20">
      {/* Decorative stars */}
      <Stars />

      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="max-w-[480px] mx-auto px-5 pt-4 pb-4 relative z-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(196,181,224,0.15)",
          paddingBottom: "env(safe-area-inset-bottom, 10px)",
        }}
      >
        <div className="max-w-[480px] mx-auto flex justify-around items-center py-2">
          {tabs.map((t) =>
            t.fab ? (
              <NavLink key={t.to} to={t.to}>
                <button
                  type="button"
                  className="w-13 h-13 rounded-full flex items-center justify-center text-2xl text-white border-none cursor-pointer -mt-5 transition-transform hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--lavender-deep), #B08FD8)",
                    boxShadow: "0 6px 24px rgba(155,142,196,0.4)",
                  }}
                >
                  {t.icon}
                </button>
              </NavLink>
            ) : (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.to === "/"}
                className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="text-xl"
                      style={{
                        color: isActive
                          ? "var(--lavender-deep)"
                          : "var(--text-light)",
                      }}
                    >
                      {t.icon}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{
                        color: isActive
                          ? "var(--lavender-deep)"
                          : "var(--text-light)",
                        fontWeight: isActive ? 400 : 300,
                      }}
                    >
                      {t.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          )}
        </div>
      </nav>
    </div>
  );
}

function Stars() {
  const positions = [
    { top: "8%", left: "15%", delay: 0 },
    { top: "12%", right: "20%", delay: 1.2 },
    { top: "25%", left: "70%", delay: 2.4 },
    { top: "40%", left: "8%", delay: 0.8 },
    { top: "60%", right: "12%", delay: 3 },
    { top: "75%", left: "30%", delay: 1.8 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {positions.map((p, i) => (
        <div
          key={i}
          className="absolute w-[3px] h-[3px] rounded-full"
          style={{
            ...p,
            background: "var(--lavender)",
            animation: `twinkle 4s ease-in-out ${p.delay}s infinite`,
            opacity: 0,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.6; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
