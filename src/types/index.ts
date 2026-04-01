// Mood types and constants
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodInfo {
  emoji: string;
  label: string;
  color: string;
}

export const MOODS: Record<MoodLevel, MoodInfo> = {
  5: { emoji: "😊", label: "开心", color: "#FFD700" },
  4: { emoji: "🙂", label: "平静", color: "#87CEEB" },
  3: { emoji: "😐", label: "一般", color: "#C4B5E0" },
  2: { emoji: "😔", label: "低落", color: "#B0B0B0" },
  1: { emoji: "😢", label: "难过", color: "#8B8BA0" },
};

// Preset emotion tags
export const EMOTION_TAGS = [
  "感恩",
  "兴奋",
  "满足",
  "放松",
  "焦虑",
  "疲惫",
  "孤独",
  "压力",
  "希望",
  "怀念",
  "社交",
  "阅读",
  "运动",
  "工作",
  "休息",
  "旅行",
];

// Diary entry
export interface DiaryEntry {
  id?: number;
  date: string; // YYYY-MM-DD
  mood: MoodLevel;
  tags: string[];
  content: string;
  createdAt: number;
  updatedAt: number;
}
