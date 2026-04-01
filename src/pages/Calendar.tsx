import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEntriesInRange } from "../hooks/useDiary";
import { MOODS } from "../types";

const DAYS = ["日", "一", "二", "三", "四", "五", "六"];

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const totalDays = last.getDate();
  return { startDay, totalDays };
}

export default function Calendar() {
  const navigate = useNavigate();
  const [viewDate, setViewDate] = useState(new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const { startDay, totalDays } = getMonthDays(year, month);

  const startStr = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;
  const entries = useEntriesInRange(startStr, endStr);

  const entryMap = new Map<string, (typeof entries extends (infer T)[] | undefined ? T : never)>();
  entries?.forEach((e) => entryMap.set(e.date, e));

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <div>
      <motion.h2
        className="text-xl font-normal mb-6"
        style={{ color: "var(--text)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        日历 📅
      </motion.h2>

      {/* Month nav */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <button
          type="button"
          className="px-3 py-1 text-sm bg-transparent border-none cursor-pointer"
          style={{ color: "var(--lavender-deep)" }}
          onClick={prevMonth}
        >
          ← 上月
        </button>
        <span className="text-base font-normal" style={{ color: "var(--text)" }}>
          {year}年{month + 1}月
        </span>
        <button
          type="button"
          className="px-3 py-1 text-sm bg-transparent border-none cursor-pointer"
          style={{ color: "var(--lavender-deep)" }}
          onClick={nextMonth}
        >
          下月 →
        </button>
      </motion.div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs py-1"
            style={{ color: "var(--text-light)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <motion.div
        className="grid grid-cols-7 gap-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {cells.map((day, i) => {
          if (day === null)
            return <div key={`empty-${i}`} className="aspect-square" />;

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const entry = entryMap.get(dateStr);
          const isToday = dateStr === new Date().toISOString().slice(0, 10);

          return (
            <div
              key={dateStr}
              className="aspect-square glass flex flex-col items-center justify-center cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{
                borderRadius: "var(--radius-sm)",
                border: isToday
                  ? "1.5px solid var(--lavender)"
                  : "1.5px solid rgba(196,181,224,0.1)",
                background: entry
                  ? "linear-gradient(135deg, var(--lavender-light), var(--pink-light))"
                  : undefined,
              }}
              onClick={() => {
                if (entry?.id) navigate(`/write/${entry.id}`);
                else navigate(`/write?date=${dateStr}`);
              }}
            >
              <span
                className="text-xs"
                style={{
                  color: isToday ? "var(--lavender-deep)" : "var(--text-light)",
                  fontWeight: isToday ? 500 : 300,
                }}
              >
                {day}
              </span>
              {entry && (
                <span className="text-sm mt-0.5">
                  {MOODS[entry.mood].emoji}
                </span>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
