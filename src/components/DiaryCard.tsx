import type { DiaryEntry } from "../types";
import { MOODS } from "../types";

interface Props {
  entry: DiaryEntry;
  onClick?: () => void;
}

const TAG_STYLES: Record<string, string> = {
  purple: "background: var(--lavender-light); color: var(--lavender-deep);",
  pink: "background: var(--pink-light); color: #C4788A;",
  blue: "background: var(--moonblue-light); color: #6A8FAF;",
};
const TAG_VARIANTS = Object.values(TAG_STYLES);

export default function DiaryCard({ entry, onClick }: Props) {
  const mood = MOODS[entry.mood];
  const dateObj = new Date(entry.date + "T00:00:00");
  const dateStr = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日 · ${
    ["日", "一", "二", "三", "四", "五", "六"][dateObj.getDay()]
  }`;

  return (
    <div
      className="glass p-4 mb-3 cursor-pointer"
      style={{ borderRadius: "var(--radius)" }}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs" style={{ color: "var(--text-light)" }}>
          {dateStr}
        </span>
        <span className="text-xl">{mood.emoji}</span>
      </div>

      <p
        className="text-sm leading-relaxed"
        style={{
          color: "var(--text)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {entry.content || "无内容"}
      </p>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {entry.tags.map((tag, i) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full font-normal"
              style={{
                ...Object.fromEntries(
                  TAG_VARIANTS[i % TAG_VARIANTS.length]
                    .split(";")
                    .filter(Boolean)
                    .map((s) => {
                      const [k, v] = s.split(":");
                      return [k.trim(), v.trim()];
                    })
                ),
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
