import { motion } from "framer-motion";
import { useEntriesInRange } from "../hooks/useDiary";
import { MOODS } from "../types";
import type { MoodLevel } from "../types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function getMonthRange() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const start = `${y}-${String(m + 1).padStart(2, "0")}-01`;
  const last = new Date(y, m + 1, 0).getDate();
  const end = `${y}-${String(m + 1).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
  return { start, end, y, m };
}

export default function Trends() {
  const { start, end, m } = getMonthRange();
  const entries = useEntriesInRange(start, end);

  const chartData = (entries || []).map((e) => ({
    date: `${parseInt(e.date.slice(8), 10)}日`,
    mood: e.mood,
    label: MOODS[e.mood as MoodLevel].label,
  }));

  // Tag frequency
  const tagCounts: Record<string, number> = {};
  (entries || []).forEach((e) =>
    e.tags.forEach((t) => (tagCounts[t] = (tagCounts[t] || 0) + 1))
  );
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Mood distribution
  const moodCounts: Record<number, number> = {};
  (entries || []).forEach((e) => (moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1));

  return (
    <div>
      <motion.h2
        className="text-xl font-normal mb-6"
        style={{ color: "var(--text)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        情绪趋势 📊
      </motion.h2>

      <motion.p
        className="text-sm mb-4"
        style={{ color: "var(--text-light)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {m + 1}月情绪变化
      </motion.p>

      {/* Line chart */}
      <motion.div
        className="glass p-4 mb-6"
        style={{ borderRadius: "var(--radius)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(196,181,224,0.15)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#8A7FA0" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 11, fill: "#8A7FA0" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  MOODS[v as MoodLevel]?.emoji || ""
                }
              />
              <Tooltip
                formatter={(value) => {
                  const v = Number(value) as MoodLevel;
                  return [
                    `${MOODS[v]?.emoji ?? ""} ${MOODS[v]?.label ?? ""}`,
                    "心情",
                  ];
                }}
                contentStyle={{
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: "12px",
                  border: "1px solid var(--lavender-light)",
                  fontSize: "13px",
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#9B8EC4"
                strokeWidth={2.5}
                dot={{ fill: "#9B8EC4", r: 4 }}
                activeDot={{ r: 6, fill: "#B08FD8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p
            className="text-sm text-center py-12"
            style={{ color: "var(--text-light)" }}
          >
            本月还没有记录，开始写第一篇日记吧 ✨
          </p>
        )}
      </motion.div>

      {/* Mood distribution */}
      <motion.div
        className="glass p-4 mb-6"
        style={{ borderRadius: "var(--radius)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-sm mb-3" style={{ color: "var(--text-light)" }}>
          情绪分布
        </div>
        <div className="flex justify-between gap-2">
          {([5, 4, 3, 2, 1] as MoodLevel[]).map((level) => {
            const count = moodCounts[level] || 0;
            const total = entries?.length || 1;
            const pct = Math.round((count / total) * 100) || 0;
            return (
              <div key={level} className="flex-1 text-center">
                <div className="text-xl">{MOODS[level].emoji}</div>
                <div
                  className="mt-2 mx-auto rounded-full"
                  style={{
                    width: "4px",
                    height: `${Math.max(pct, 4)}px`,
                    maxHeight: "60px",
                    background:
                      "linear-gradient(to top, var(--lavender-deep), var(--pink))",
                    transition: "height 0.5s ease",
                  }}
                />
                <div
                  className="text-xs mt-1"
                  style={{ color: "var(--text-light)" }}
                >
                  {count > 0 ? `${pct}%` : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Tags */}
      {topTags.length > 0 && (
        <motion.div
          className="glass p-4"
          style={{ borderRadius: "var(--radius)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-sm mb-3" style={{ color: "var(--text-light)" }}>
            常用标签
          </div>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  background: "var(--lavender-light)",
                  color: "var(--lavender-deep)",
                }}
              >
                {tag} ×{count}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
