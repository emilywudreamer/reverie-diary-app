import Dexie, { type EntityTable } from "dexie";
import type { DiaryEntry } from "../types";

const db = new Dexie("ReverieDiary") as Dexie & {
  entries: EntityTable<DiaryEntry, "id">;
};

db.version(1).stores({
  entries: "++id, date, mood, createdAt",
});

export { db };
