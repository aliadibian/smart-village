import { useCallback, useEffect, useRef, useState } from "react";
import { addGameScore, getBestScore, setBestScore } from "../lib/storage";
import { faNum, faTime } from "../lib/fa";
import { createGame, type GameHandle } from "./engine";
import { ensureAudio } from "./audio";
import type { FinalStats, Phase } from "./types";

const NAME_KEY = "smart-village:game-name:v1";
const MUTE_KEY = "smart-village:game-muted:v1";

function readSavedName(): string {
  try {
    return (localStorage.getItem(NAME_KEY) || "").slice(0, 24);
  } catch {
    return "";
  }
}

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMuted(m: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, m ? "1" : "0");
  } catch {
    /* نبودش هم مهم نیست */
  }
}

// پل بین موتور بازی و رابط React — وضعیت‌هایی که UI لازم داره اینجا mirror می‌شه
export function useFarmGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameHandle | null>(null);

  // نوار وضعیت بازی هر فریم مستقیم روی DOM آپدیت می‌شه تا React وارد حلقه‌ی بازی نشه
  const scoreRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const moistBarRef = useRef<HTMLDivElement>(null);
  const moistPctRef = useRef<HTMLSpanElement>(null);

  const [phase, setPhase] = useState<Phase>("ready");
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [muted, setMutedState] = useState(() => readMuted());
  const [best, setBest] = useState(() => getBestScore());
  const [isRecord, setIsRecord] = useState(false);
  const [finalStats, setFinalStats] = useState<FinalStats | null>(null);
  const [lastEntryId, setLastEntryId] = useState<string | null>(null);

  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = createGame(canvas, {
      onPhase: setPhase,
      onHearts: setHearts,
      onStreak: setStreak,
      onFrame: ({ score, timeLeft, moisture }) => {
        if (scoreRef.current) scoreRef.current.textContent = faNum(score);
        if (timerRef.current) {
          timerRef.current.textContent = faTime(timeLeft * 1000);
          const parent = timerRef.current.parentElement;
          if (parent) {
            parent.style.color = timeLeft <= 8 ? "#FF8A70" : timeLeft <= 15 ? "#E8B24A" : "";
            timerRef.current.classList.toggle("tick-anim", timeLeft <= 8 && timeLeft > 0);
          }
        }
        if (moistBarRef.current) moistBarRef.current.style.width = `${moisture}%`;
        if (moistPctRef.current) moistPctRef.current.textContent = `${faNum(moisture)}٪`;
      },
      onEnd: (_phase, stats) => {
        setFinalStats(stats);
        if (setBestScore(stats.score)) {
          setIsRecord(true);
          setBest(getBestScore());
        }
        // ثبت در جدول — هر اسم فقط بهترین امتیازش می‌مونه
        try {
          const { id } = addGameScore(readSavedName(), stats.score);
          setLastEntryId(id);
        } catch {
          /* جدول در دسترس نبود؛ بازی بازم تموم می‌شه */
        }
      },
    });
    game.setMuted(mutedRef.current);
    gameRef.current = game;
    return () => game.destroy();
  }, []);

  const toggleMute = useCallback(() => {
    setMutedState((m) => {
      const next = !m;
      mutedRef.current = next;
      writeMuted(next);
      gameRef.current?.setMuted(next);
      return next;
    });
  }, []);

  const start = useCallback(() => {
    ensureAudio();
    setIsRecord(false);
    setFinalStats(null);
    gameRef.current?.start();
  }, []);

  const pause = useCallback(() => gameRef.current?.pause(), []);
  const resume = useCallback(() => gameRef.current?.resume(), []);
  const steer = useCallback((x: number) => gameRef.current?.steer(x), []);
  const setKey = useCallback((dir: "L" | "R", down: boolean) => gameRef.current?.setKey(dir, down), []);

  // Space/Enter برای شروع دوباره و P برای مکث
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) return;
      if ((e.key === " " || e.key === "Enter") && (phase === "ready" || phase === "won" || phase === "lost")) {
        e.preventDefault();
        start();
      }
      if ((e.key === "p" || e.key === "P" || e.key === "Escape") && phase === "playing") {
        e.preventDefault();
        pause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, start, pause]);

  return {
    canvasRef,
    scoreRef,
    timerRef,
    moistBarRef,
    moistPctRef,
    phase,
    hearts,
    streak,
    muted,
    best,
    isRecord,
    finalStats,
    lastEntryId,
    start,
    pause,
    resume,
    steer,
    setKey,
    toggleMute,
  };
}

export function saveGameName(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    /* ignore */
  }
}

export function clearGameName(): void {
  try {
    localStorage.removeItem(NAME_KEY);
  } catch {
    /* ignore */
  }
}
