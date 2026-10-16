export type Phase = "ready" | "countdown" | "playing" | "paused" | "won" | "lost";

export interface Drop {
  x: number;
  y: number;
  vy: number;
  golden: boolean;
}

export interface Hazard {
  x: number;
  y: number;
  vy: number;
  rot: number;
  vr: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  r: number;
  g: number;
}

export interface Pop {
  x: number;
  y: number;
  text: string;
  life: number;
  color: string;
}

export interface GameState {
  phase: Phase;
  loseReason: "time" | "hearts";
  t: number;
  timeLeft: number;
  score: number;
  streak: number;
  bestStreak: number;
  catches: number;
  moisture: number;
  hearts: number;
  playerX: number;
  targetX: number | null;
  invuln: number;
  shake: number;
  countdown: number;
  drops: Drop[];
  hazards: Hazard[];
  parts: Particle[];
  pops: Pop[];
  spawnT: number;
  hazT: number;
  keyL: boolean;
  keyR: boolean;
}

export interface FinalStats {
  score: number;
  catches: number;
  bestStreak: number;
  timeLeft: number;
  loseReason: "time" | "hearts";
}

export interface EngineCallbacks {
  onPhase(phase: Phase): void;
  onHearts(hearts: number): void;
  onStreak(streak: number): void;
  onEnd(phase: "won" | "lost", stats: FinalStats): void;
  // هر فریم صدا زده می‌شه — برای به‌روزرسانی مستقیم HUD بدون رندر React
  onFrame?(data: { score: number; timeLeft: number; moisture: number }): void;
}
