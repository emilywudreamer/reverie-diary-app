import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";
import { db } from "../db";
import type { DiaryEntry, MoodLevel } from "../types";

/** Get today's date string */
const today = () => new Date().toISOString().slice(0, 10);

/** All diary entries, newest first */
export function useAllEntries() {
  return useLiveQuery(() => db.entries.orderBy("createdAt").reverse().toArray());
}

/** Get entry by date */
export function useEntryByDate(date: string) {
  return useLiveQuery(() => db.entries.where("date").equals(date).first(), [date]);
}

/** Get entry by id */
export function useEntryById(id: number | undefined) {
  return useLiveQuery(() => (id ? db.entries.get(id) : undefined), [id]);
}

/** Get entries for a date range */
export function useEntriesInRange(startDate: string, endDate: string) {
  return useLiveQuery(
    () =>
      db.entries
        .where("date")
        .between(startDate, endDate, true, true)
        .sortBy("date"),
    [startDate, endDate]
  );
}

/** Recent entries (last N) */
export function useRecentEntries(limit = 5) {
  return useLiveQuery(() =>
    db.entries.orderBy("createdAt").reverse().limit(limit).toArray()
  );
}

/** CRUD hooks */
export function useDiaryCRUD() {
  const save = useCallback(
    async (data: {
      id?: number;
      date?: string;
      mood: MoodLevel;
      tags: string[];
      content: string;
    }) => {
      const now = Date.now();
      if (data.id) {
        // update
        await db.entries.update(data.id, {
          mood: data.mood,
          tags: data.tags,
          content: data.content,
          updatedAt: now,
        });
        return data.id;
      }
      // create
      return db.entries.add({
        date: data.date || today(),
        mood: data.mood,
        tags: data.tags,
        content: data.content,
        createdAt: now,
        updatedAt: now,
      });
    },
    []
  );

  const remove = useCallback(async (id: number) => {
    await db.entries.delete(id);
  }, []);

  const exportAll = useCallback(async () => {
    const entries = await db.entries.toArray();
    const blob = new Blob([JSON.stringify(entries, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reverie-diary-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importData = useCallback(async (json: string) => {
    const entries = JSON.parse(json) as DiaryEntry[];
    await db.entries.bulkPut(entries);
  }, []);

  const clearAll = useCallback(async () => {
    await db.entries.clear();
  }, []);

  return { save, remove, exportAll, importData, clearAll };
}
