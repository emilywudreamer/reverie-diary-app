import { MOODS } from "../types";
import type { DiaryEntry, MoodLevel } from "../types";

interface Props {
  entries: DiaryEntry[];
}

/** Mini mood bar for last 7 days — used on home page */
export default function MoodChart({ entries }: Props) {
  // Build last 7 days
  const days: { date: string; dayLabel: string; entry?: DiaryEntry }[] = [];
  const dayNames = ["日", "一", "二", "三", "四", "五", "六"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const entry = entries.find((e) => e.date === ds);
    days.push({
      date: ds,
      dayLabel: dayNames[d.getDay()],
      entry,
    });
  }

  return (
    <div className="flex items-end justify-between gap-1.5">
      {days.map((d) => {
        const mood = d.entry?.mood as MoodLevel | undefined;
        const height = mood ? `${mood * 12 + 8}px` : "8px";

        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
            {mood && (
              <span className="text-xs">{MOODS[mood].emoji}</span>
            )}
            <div
              className="w-full rounded-full transition-all duration-500"
              style={{
                height,
                background: mood
                  ? "linear-gradient(to top, var(--lavender-deep), var(--pink))"
                  : "rgba(196,181,224,0.15)",
                minHeight: "4px",
              }}
            />
            <span
              className="text-[10px]"
              style={{
                color: d.date === new Date().toISOString().slice(0, 10)
                  ? "var(--lavender-deep)"
                  : "var(--text-light)",
                fontWeight: d.date === new Date().toISOString().slice(0, 10) ? 500 : 300,
              }}
            >
              {d.dayLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
