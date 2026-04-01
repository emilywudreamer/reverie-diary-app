import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useDiaryCRUD } from "../hooks/useDiary";

export default function Settings() {
  const { exportAll, importData, clearAll } = useDiaryCRUD();
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  };

  const handleExport = async () => {
    await exportAll();
    flash("已导出 ✓");
  };

  const handleImport = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      await importData(text);
      flash("导入成功 ✓");
    } catch {
      flash("导入失败，请检查文件格式");
    }
    e.target.value = "";
  };

  const handleClear = async () => {
    if (confirm("确定要清除所有数据吗？此操作不可恢复。")) {
      await clearAll();
      flash("已清除 ✓");
    }
  };

  return (
    <div>
      <motion.h2
        className="text-xl font-normal mb-6"
        style={{ color: "var(--text)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        设置 ⚙️
      </motion.h2>

      {msg && (
        <motion.div
          className="mb-4 px-4 py-2 rounded-full text-sm text-center"
          style={{
            background: "var(--lavender-light)",
            color: "var(--lavender-deep)",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {msg}
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Export */}
        <motion.div
          className="glass p-4 cursor-pointer"
          style={{ borderRadius: "var(--radius)" }}
          onClick={handleExport}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📤</span>
            <div>
              <div className="text-sm font-normal" style={{ color: "var(--text)" }}>
                导出数据
              </div>
              <div className="text-xs" style={{ color: "var(--text-light)" }}>
                将所有日记导出为 JSON 文件
              </div>
            </div>
          </div>
        </motion.div>

        {/* Import */}
        <motion.div
          className="glass p-4 cursor-pointer"
          style={{ borderRadius: "var(--radius)" }}
          onClick={handleImport}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📥</span>
            <div>
              <div className="text-sm font-normal" style={{ color: "var(--text)" }}>
                导入数据
              </div>
              <div className="text-xs" style={{ color: "var(--text-light)" }}>
                从 JSON 文件恢复日记数据
              </div>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFile}
          />
        </motion.div>

        {/* Clear */}
        <motion.div
          className="glass p-4 cursor-pointer"
          style={{ borderRadius: "var(--radius)" }}
          onClick={handleClear}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗑️</span>
            <div>
              <div className="text-sm font-normal" style={{ color: "#C4788A" }}>
                清除所有数据
              </div>
              <div className="text-xs" style={{ color: "var(--text-light)" }}>
                不可恢复，请先导出备份
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="gradient-text text-lg font-normal mb-1">
          Reverie Diary
        </div>
        <div className="text-xs" style={{ color: "var(--text-light)" }}>
          v1.0.0 · 你的情绪日记本
        </div>
        <div
          className="text-xs mt-1"
          style={{ color: "var(--text-light)", opacity: 0.5 }}
        >
          数据仅存储在本设备
        </div>
      </motion.div>
    </div>
  );
}
