// قفل «یک تلاش» — قفل موقع شروع مسابقه زده می‌شه نه موقع تموم شدن،
// تا رفرش دادن یا بستن تب نتونه تلاش دوم بده.
// اگه VITE_QUIZ_API_URL تنظیم شده باشه چک سروری هم داریم (هاش آی‌پی)،
// و اگه سرور جواب نداد خودِ مسابقه ادامه پیدا می‌کنه.

export type AttemptStatus = "pending" | "completed";

export interface AttemptRecord {
  name: string;
  nameKey: string;
  status: AttemptStatus;
  score: number;
  correct: number;
  timeMs: number;
  startedAt: number;
  finishedAt: number | null;
  deviceId: string;
  ipHash: string | null;
  remote: boolean;
}

const ATTEMPT_KEY = "smart-village:attempt:v1";
const DEVICE_KEY = "smart-village:device:v1";
const NAME_KEY = "smart-village:used-names:v1";

// خوندن env بدون اینکه تایپ‌های vite/client لازم باشه
function env(key: string): string | undefined {
  const e = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const v = e?.[key];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

export function remoteApiBase(): string | undefined {
  return env("VITE_QUIZ_API_URL");
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ذخیره‌سازی بسته بود؛ خودِ مسابقه ادامه پیدا می‌کنه */
  }
}

// نرمال‌سازی اسم فارسی: «علی رضایی» و « علی  رضایی » یکی حساب می‌شن
export function normalizeName(name: string): string {
  return name
    .replace(/\u200c/g, " ") // ZWNJ -> space
    .replace(/[\u064a\u0643]/g, (c) => (c === "\u064a" ? "\u06cc" : "\u06a9")) // ي -> ی , ك -> ک
    .replace(/[\u064b-\u0652\u0670]/g, "") // diacritics
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function isValidName(name: string): boolean {
  const n = normalizeName(name);
  return n.length >= 2 && n.length <= 24;
}

export function getDeviceId(): string {
  let id = "";
  try {
    id = localStorage.getItem(DEVICE_KEY) || "";
  } catch {
    /* ignore */
  }
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    try {
      localStorage.setItem(DEVICE_KEY, id);
    } catch {
      /* ignore */
    }
  }
  return id;
}

// هش SHA-256 آی‌پی — خود آی‌پی رو هیچ‌جا ذخیره یا نمی‌فرستیم
async function fetchIpHash(): Promise<string | null> {
  if (!remoteApiBase()) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch("https://api.ipify.org?format=json", { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = (await res.json()) as { ip?: string };
    if (!data?.ip) return null;
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data.ip));
      return Array.from(new Uint8Array(buf))
        .slice(0, 16)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    return `ip-${data.ip.length}-${data.ip.charCodeAt(0)}`;
  } catch {
    return null;
  }
}

function readUsedNames(): string[] {
  const v = readJSON<string[]>(NAME_KEY);
  return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
}

export function isNameUsed(name: string): boolean {
  const key = normalizeName(name);
  if (!key) return false;
  return readUsedNames().includes(key);
}

function addUsedName(name: string): void {
  const key = normalizeName(name);
  if (!key) return;
  const list = readUsedNames();
  if (!list.includes(key)) {
    list.push(key);
    writeJSON(NAME_KEY, list.slice(-100));
  }
}

function coerce(raw: unknown): AttemptRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<AttemptRecord>;
  if (typeof r.name !== "string" || (r.status !== "pending" && r.status !== "completed")) return null;
  return {
    name: r.name.slice(0, 24),
    nameKey: String(r.nameKey ?? normalizeName(r.name)),
    status: r.status,
    score: Math.max(0, Math.min(100, Math.round(Number(r.score) || 0))),
    correct: Math.max(0, Math.min(10, Math.round(Number(r.correct) || 0))),
    timeMs: Math.max(0, Math.min(600_000, Math.round(Number(r.timeMs) || 0))),
    startedAt: Number(r.startedAt) || Date.now(),
    finishedAt: Number(r.finishedAt) || null,
    deviceId: String(r.deviceId ?? getDeviceId()),
    ipHash: typeof r.ipHash === "string" ? r.ipHash : null,
    remote: Boolean(r.remote),
  };
}

// تلاشی که روی این مرورگر ثبت شده (اگه چیزی نبود یعنی هنوز کسی بازی نکرده)
export function getAttempt(): AttemptRecord | null {
  return coerce(readJSON<AttemptRecord>(ATTEMPT_KEY));
}

export function isLocked(): boolean {
  return getAttempt() !== null;
}

export interface StartResult {
  ok: boolean;
  reason?: "browser_used" | "name_used" | "ip_used" | "remote_error";
  attempt?: AttemptRecord;
}

// رزرو کردن تلاش؛ قفل همین‌جا زده می‌شه تا اگه مسابقه نیمه‌کاره موند هم حساب بشه
export async function startAttempt(name: string): Promise<StartResult> {
  const clean = name.replace(/\s+/g, " ").trim().slice(0, 24);
  if (!isValidName(clean)) return { ok: false, reason: "name_used" };
  if (isNameUsed(clean)) return { ok: false, reason: "name_used" };
  if (isLocked()) return { ok: false, reason: "browser_used", attempt: getAttempt() ?? undefined };

  const ipHash = await fetchIpHash();
  const base = remoteApiBase();
  let remote = false;

  if (base) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4000);
      const res = await fetch(`${base}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ipHash, name: clean }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (res.status === 409) return { ok: false, reason: "ip_used" };
      if (res.ok) remote = true;
      // اگه سرور جواب نداد یا خطا داد، رد می‌شیم که کلاس معطل نمونه
    } catch {
      /* offline: fall back to the local gate */
    }
  }

  const attempt: AttemptRecord = {
    name: clean,
    nameKey: normalizeName(clean),
    status: "pending",
    score: 0,
    correct: 0,
    timeMs: 0,
    startedAt: Date.now(),
    finishedAt: null,
    deviceId: getDeviceId(),
    ipHash,
    remote,
  };
  writeJSON(ATTEMPT_KEY, attempt);
  addUsedName(clean);
  return { ok: true, attempt };
}

export function completeAttempt(score: number, correct: number, timeMs: number): AttemptRecord | null {
  const current = getAttempt();
  if (!current) return null;
  const next: AttemptRecord = {
    ...current,
    status: "completed",
    score: Math.max(0, Math.min(100, Math.round(score))),
    correct: Math.max(0, Math.min(10, Math.round(correct))),
    timeMs: Math.max(0, Math.min(600_000, Math.round(timeMs))),
    finishedAt: Date.now(),
  };
  writeJSON(ATTEMPT_KEY, next);

  const base = remoteApiBase();
  if (base && next.remote) {
    void fetch(`${base}/attempt/finish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ipHash: next.ipHash, name: next.name, score: next.score, correct: next.correct, timeMs: next.timeMs }),
    }).catch(() => undefined);
  }
  return next;
}

// اسمی که از قفل دراومده هم آزاد می‌شه تا همون دانش‌آموز بتونه دوباره شروع کنه
export function resetAttempt(): void {
  const current = getAttempt();
  try {
    localStorage.removeItem(ATTEMPT_KEY);
  } catch {
    /* ignore */
  }
  if (current?.nameKey) {
    const list = readUsedNames().filter((k) => k !== current.nameKey);
    writeJSON(NAME_KEY, list);
  }
}

export function resetAll(): void {
  resetAttempt();
  [NAME_KEY, "smart-village:leaderboard:v1", "smart-village:game-best:v1"].forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  });
}

export const TEACHER_KEY = "ادیبیان";
