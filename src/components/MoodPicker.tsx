import type { MoodLevel } from "../types";
import { MOODS } from "../types";
import { motion } from "framer-motion";

interface Props {
  value?: MoodLevel;
  onChange: (mood: MoodLevel) => void;
}

export default function MoodPicker({ value, onChange }: Props) {
  const levels = [5, 4, 3, 2, 1] as MoodLevel[];

  return (
    <div className="flex justify-between gap-2">
      {levels.map((level) => {
        const m = MOODS[level];
        const active = value === level;
        return (
          <motion.button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className="flex-1 flex flex-col items-center gap-2 py-4 px-2 rounded-xl cursor-pointer transition-all duration-300"
            style={{
              background: active
                ? "linear-gradient(135deg, var(--lavender-light), var(--pink-light))"
                : "rgba(255,255,255,0.65)",
              backdropFilter: "blur(12px)",
              border: active
                ? "1.5px solid var(--lavender)"
                : "1.5px solid rgba(196, 181, 224, 0.15)",
              boxShadow: active
                ? "0 8px 24px rgba(155, 142, 196, 0.25)"
                : "none",
            }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            animate={active ? { y: -4 } : { y: 0 }}
          >
            <span
              className="text-3xl"
              style={{
                animation: active ? "pulse 1.5s ease-in-out infinite" : "none",
              }}
            >
              {m.emoji}
            </span>
            <span className="text-xs" style={{ color: "var(--text-light)" }}>
              {m.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
