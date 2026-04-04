import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MoodPicker from "../components/MoodPicker";
import MoodChart from "../components/MoodChart";
import DiaryCard from "../components/DiaryCard";
import { useRecentEntries, useEntryByDate, useDiaryCRUD, useAllEntries } from "../hooks/useDiary";
import { MOODS } from "../types";
import type { MoodLevel } from "../types";

const todayStr = () => new Date().toISOString().slice(0, 10);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "夜深了 🌙";
  if (h < 12) return "早上好 ☀️";
  if (h < 18) return "下午好 ☁️";
  return "晚上好 🌙";
}

function formatDate() {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 · 星期${
    ["日", "一", "二", "三", "四", "五", "六"][d.getDay()]
  }`;
}

export default function Home() {
  const navigate = useNavigate();
  const todayEntry = useEntryByDate(todayStr());
  const recentEntries = useRecentEntries(3);
  const allEntries = useAllEntries();
  const { save } = useDiaryCRUD();

  // Calculate streak
  const streak = (() => {
    if (!allEntries) return 0;
    const dates = new Set(allEntries.map((e) => e.date));
    let count = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().slice(0, 10);
      if (dates.has(ds)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return count;
  })();

  const handleMoodQuick = async (mood: MoodLevel) => {
    if (todayEntry) {
      await save({ id: todayEntry.id, mood, tags: todayEntry.tags, content: todayEntry.content });
    } else {
      const id = await save({ mood, tags: [], content: "" });
      navigate(`/write/${id}`);
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="text-xl font-medium"
          style={{
            background: "linear-gradient(135deg, var(--lavender-deep), var(--pink))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Reverie<span className="text-sm opacity-70 ml-1">Diary</span>
        </div>
        <div className="flex gap-3">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(196,181,224,0.2)",
            }}
            onClick={() => navigate("/settings")}
          >
            ⚙️
          </button>
        </div>
      </motion.div>

      {/* Greeting */}
      <motion.section
        className="mt-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1 className="text-2xl font-normal leading-snug">
          {getGreeting()}
          <br />
          今天感觉
          <em
            className="not-italic font-medium"
            style={{
              background:
                "linear-gradient(90deg, var(--lavender-deep), var(--pink), var(--lavender-deep))",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}
          >
            怎么样
          </em>
          ？
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-light)" }}>
          {formatDate()}
        </p>
        {streak > 0 && (
          <div
            className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-full text-xs font-normal"
            style={{
              background:
                "linear-gradient(135deg, rgba(196,181,224,0.2), rgba(242,198,208,0.2))",
              color: "var(--lavender-deep)",
            }}
          >
            ✨ 已连续记录 {streak} 天
          </div>
        )}
      </motion.section>

      {/* Mood selection */}
      <motion.section
        className="mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="text-sm font-normal mb-3" style={{ color: "var(--text-light)" }}>
          选择你此刻的心情
        </div>
        <MoodPicker value={todayEntry?.mood} onChange={handleMoodQuick} />
      </motion.section>

      {/* Quick write */}
      <motion.section
        className="mt-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div
          className="glass p-4 cursor-pointer"
          onClick={() =>
            todayEntry ? navigate(`/write/${todayEntry.id}`) : navigate("/write")
          }
        >
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-light)" }}>
            此刻有什么想说的吗？
            <br />
            写下来，让文字温柔地承接你的感受…
          </p>
          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="px-6 py-2 rounded-full text-sm text-white border-none cursor-pointer font-normal transition-all hover:-translate-y-0.5"
              style={{
                background:
                  "linear-gradient(135deg, var(--lavender-deep), #B08FD8)",
                boxShadow: "0 6px 20px rgba(155,142,196,0.4)",
              }}
            >
              开始书写 ✍️
            </button>
          </div>
        </div>
      </motion.section>

      {/* Weekly mood mini chart */}
      {allEntries && allEntries.length > 0 && (
        <motion.section
          className="mt-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <div className="text-sm mb-3" style={{ color: "var(--text-light)" }}>
            本周心情
          </div>
          <div className="glass p-4" style={{ borderRadius: "var(--radius)" }}>
            <MoodChart entries={allEntries} />
          </div>
        </motion.section>
      )}

      {/* Recent diaries */}
      {recentEntries && recentEntries.length > 0 && (
        <motion.section
          className="mt-9"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm" style={{ color: "var(--text-light)" }}>
              最近日记
            </span>
            <span
              className="text-xs cursor-pointer"
              style={{ color: "var(--lavender-deep)" }}
              onClick={() => navigate("/calendar")}
            >
              查看全部 →
            </span>
          </div>
          {recentEntries.map((e) => (
            <DiaryCard
              key={e.id}
              entry={e}
              onClick={() => navigate(`/write/${e.id}`)}
            />
          ))}
        </motion.section>
      )}

      {/* Stats */}
      <motion.section
        className="mt-9 mb-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="text-sm mb-3" style={{ color: "var(--text-light)" }}>
          本月概览
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              value: allEntries
                ? allEntries.filter(
                    (e) => e.date.slice(0, 7) === todayStr().slice(0, 7)
                  ).length
                : 0,
              label: "记录天数",
            },
            {
              value: (() => {
                if (!allEntries || allEntries.length === 0) return "—";
                const counts: Record<number, number> = {};
                allEntries
                  .filter((e) => e.date.slice(0, 7) === todayStr().slice(0, 7))
                  .forEach((e) => (counts[e.mood] = (counts[e.mood] || 0) + 1));
                const top = Object.entries(counts).sort(
                  (a, b) => b[1] - a[1]
                )[0];
                if (!top) return "—";
                return MOODS[Number(top[0]) as MoodLevel].emoji;
              })(),
              label: "最常情绪",
            },
            { value: streak, label: "连续天数" },
          ].map((s, i) => (
            <div
              key={i}
              className="glass p-4 text-center"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <div className="text-2xl font-medium gradient-text">{s.value}</div>
              <div
                className="text-xs mt-1"
                style={{ color: "var(--text-light)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
