import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import MoodPicker from "../components/MoodPicker";
import { useEntryById, useDiaryCRUD } from "../hooks/useDiary";
import { EMOTION_TAGS } from "../types";
import type { MoodLevel } from "../types";

export default function Write() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const navigate = useNavigate();
  const entry = useEntryById(id ? Number(id) : undefined);
  const { save } = useDiaryCRUD();

  const [mood, setMood] = useState<MoodLevel>(3);
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);

  // Sync from loaded entry
  useEffect(() => {
    if (entry) {
      setMood(entry.mood);
      setTags(entry.tags);
      setContent(entry.content);
    }
  }, [entry]);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    await save({
      id: id ? Number(id) : undefined,
      date: dateParam || undefined,
      mood,
      tags,
      content,
    });
    setSaved(true);
    setTimeout(() => navigate("/"), 600);
  };

  return (
    <div>
      {/* Back button */}
      <motion.button
        type="button"
        className="text-sm mb-4 cursor-pointer bg-transparent border-none"
        style={{ color: "var(--lavender-deep)" }}
        onClick={() => navigate(-1)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ← 返回
      </motion.button>

      <motion.h2
        className="text-xl font-normal mb-1"
        style={{ color: "var(--text)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {id ? "编辑日记" : "写日记"} ✨
      </motion.h2>

      {/* Date indicator */}
      <motion.p
        className="text-xs mb-6"
        style={{ color: "var(--text-light)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        {(() => {
          const ds = entry?.date || dateParam || new Date().toISOString().slice(0, 10);
          const d = new Date(ds + "T00:00:00");
          return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 · 星期${"日一二三四五六"[d.getDay()]}`;
        })()}
      </motion.p>

      {/* Mood */}
      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="text-sm mb-3" style={{ color: "var(--text-light)" }}>
          此刻的心情
        </div>
        <MoodPicker value={mood} onChange={setMood} />
      </motion.section>

      {/* Tags */}
      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-sm mb-3" style={{ color: "var(--text-light)" }}>
          情绪标签（可多选）
        </div>
        <div className="flex flex-wrap gap-2">
          {EMOTION_TAGS.map((tag) => {
            const active = tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                className="px-3 py-1 rounded-full text-xs cursor-pointer border-none transition-all"
                style={{
                  background: active
                    ? "linear-gradient(135deg, var(--lavender-deep), #B08FD8)"
                    : "rgba(255,255,255,0.65)",
                  color: active ? "white" : "var(--text-light)",
                  border: active
                    ? "none"
                    : "1px solid rgba(196,181,224,0.2)",
                }}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Content */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-sm mb-3" style={{ color: "var(--text-light)" }}>
          写点什么吧
        </div>
        <textarea
          className="w-full glass p-4 text-sm leading-relaxed resize-none outline-none"
          style={{
            minHeight: "200px",
            color: "var(--text)",
            fontFamily: "inherit",
            borderRadius: "var(--radius)",
          }}
          placeholder="此刻有什么想说的吗？写下来，让文字温柔地承接你的感受…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </motion.section>

      {/* Save */}
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          type="button"
          className="px-8 py-2.5 rounded-full text-sm text-white border-none cursor-pointer font-normal transition-all hover:-translate-y-0.5"
          style={{
            background: saved
              ? "linear-gradient(135deg, #7BC67E, #5DAF61)"
              : "linear-gradient(135deg, var(--lavender-deep), #B08FD8)",
            boxShadow: "0 6px 20px rgba(155,142,196,0.4)",
          }}
          onClick={handleSave}
        >
          {saved ? "已保存 ✓" : "保存日记 💾"}
        </button>
      </motion.div>
    </div>
  );
}
