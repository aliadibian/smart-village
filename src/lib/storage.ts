import { normalizeName } from "./attemptGate";

// جدول امتیاز فعلاً از localStorage استفاده می‌کنه (سایت static هست و سرور نداره).
// اگه خواستید بین دستگاه‌ها مشترک بشه، کافیه یک پیاده‌سازی دیگه از
// LeaderboardStore بنویسید و export پایینی رو عوض کنید.

export interface ScoreEntry {
  id: string;
  name: string;
  score: number; // 0..100
  correct: number; // 0..10
  timeMs: number; // completion duration
  at: number; // timestamp
}

export type ScoreInput = Omit<ScoreEntry, "id" | "at">;

export interface LeaderboardStore {
  add(input: ScoreInput): ScoreEntry;
  list(): ScoreEntry[];
}

const STORAGE_KEY = "smart-village:leaderboard:v1";
const MAX_ENTRIES = 50;

function sanitize(input: ScoreInput): ScoreInput {
  const name =
    typeof input.name === "string" ? input.name.replace(/\s+/g, " ").trim().slice(0, 24) : "";
  const score = Math.max(0, Math.min(100, Math.round(Number(input.score) || 0)));
  const correct = Math.max(0, Math.min(10, Math.round(Number(input.correct) || 0)));
  const timeMs = Math.max(0, Math.min(600_000, Math.round(Number(input.timeMs) || 0)));
  return { name, score, correct, timeMs };
}

function sortEntries(list: ScoreEntry[]): ScoreEntry[] {
  return [...list].sort((a, b) =>
    a.score !== b.score ? b.score - a.score : a.timeMs - b.timeMs
  );
}

function read(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const clean = parsed.filter(
      (e): e is ScoreEntry =>
        e &&
        typeof e.id === "string" &&
        typeof e.name === "string" &&
        typeof e.score === "number" &&
        typeof e.correct === "number" &&
        typeof e.timeMs === "number"
    );
    return sortEntries(clean).slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

function write(list: ScoreEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* اگه جا کم بود یا ذخیره ممنوع بود، سکون می‌مونه */
  }
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const localLeaderboard: LeaderboardStore = {
  add(input: ScoreInput): ScoreEntry {
    const clean = sanitize(input);
    if (!clean.name) throw new Error("name is required");
    const entry: ScoreEntry = { ...clean, id: makeId(), at: Date.now() };
    // جلوگیری از ثبت تکراری: اگه همین اسم و امتیاز کمتر از ۵ ثانیه پیش رفته باشه
    const list = read();
    const now = Date.now();
    const dup = list.find(
      (e) => e.name === entry.name && e.score === entry.score && Math.abs(e.at - now) < 5000
    );
    if (dup) return dup;
    const next = sortEntries([entry, ...list]).slice(0, MAX_ENTRIES);
    write(next);
    return entry;
  },
  list(): ScoreEntry[] {
    return read();
  },
};

export const leaderboard: LeaderboardStore = localLeaderboard;

/* ---------- جدول امتیاز بازی «نجات مزرعه» ---------- */
// بازی محدودیت تلاش نداره؛ هر نفر هر بار که بخواد بازی می‌کنه.
// توی جدول فقط بهترین امتیاز هر اسم می‌مونه تا یک نفر کل جدول رو نگیره.

const GAME_KEY = "smart-village:game-board:v1";
const GAME_MAX = 50;

export interface GameScore {
  id: string;
  name: string;
  score: number;
  runs: number; // چند بار بازی کرده
  at: number;
}

function readGame(): GameScore[] {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const clean = parsed.filter(
      (e): e is GameScore =>
        e && typeof e.id === "string" && typeof e.name === "string" && typeof e.score === "number"
    );
    return clean.sort((a, b) => b.score - a.score).slice(0, GAME_MAX);
  } catch {
    return [];
  }
}

function writeGame(list: GameScore[]): void {
  try {
    localStorage.setItem(GAME_KEY, JSON.stringify(list));
  } catch {
    /* جا نبود، بی‌خیال */
  }
}

export function listGameScores(): GameScore[] {
  return readGame();
}

export function addGameScore(name: string, score: number): GameScore {
  const cleanName = name.replace(/\s+/g, " ").trim().slice(0, 24);
  const cleanScore = Math.max(0, Math.round(Number(score) || 0));
  const list = readGame();
  const key = normalizeName(cleanName);
  const found = list.find((e) => normalizeName(e.name) === key);

  if (found) {
    found.runs = (found.runs || 1) + 1;
    if (cleanScore > found.score) {
      found.score = cleanScore;
      found.at = Date.now();
    }
    writeGame(list.sort((a, b) => b.score - a.score).slice(0, GAME_MAX));
    return found;
  }

  const entry: GameScore = { id: makeId(), name: cleanName, score: cleanScore, runs: 1, at: Date.now() };
  writeGame([entry, ...list].sort((a, b) => b.score - a.score).slice(0, GAME_MAX));
  return entry;
}

/* ---------- بهترین امتیاز بازی ---------- */
const BEST_KEY = "smart-village:game-best:v1";

export function getBestScore(): number {
  try {
    const v = Number(localStorage.getItem(BEST_KEY) || 0);
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

export function setBestScore(score: number): boolean {
  const prev = getBestScore();
  if (score > prev) {
    try {
      localStorage.setItem(BEST_KEY, String(score));
    } catch {
      /* ignore */
    }
    return true;
  }
  return false;
}
