import {
  CATCH_HALF,
  CLOUDS,
  CONFETTI_COLORS,
  DURATION,
  DROP_BASE_SPEED,
  DROP_POINTS,
  GOLD_BURST,
  GOLDEN_CHANCE,
  GOLDEN_POINTS,
  HAZ_BASE_SPEED,
  HAZ_SPAWN_BASE,
  HAZ_SPAWN_MIN,
  HIT_BURST,
  HIT_HALF,
  H,
  INVULN_TIME,
  MOISTURE_PER_DROP,
  PLAYER_SPEED,
  PLAYER_Y,
  SPAWN_BASE,
  SPAWN_MIN,
  STREAK_BONUS_CAP,
  STREAK_BONUS_STEP,
  W,
  WATER_BURST,
  HAZARD_BURST,
  SPLASH_BURST,
  COUNTDOWN_STEP,
} from "./constants";
import {
  drawClouds,
  drawCountdown,
  drawCrops,
  drawDrops,
  drawDrone,
  drawFarmer,
  drawField,
  drawHazards,
  drawHills,
  drawParticles,
  drawPops,
  drawSky,
  drawSun,
  drawVignette,
} from "./draw";
import { playSfx, vibrate } from "./audio";
import { faDigits } from "../lib/fa";
import type { EngineCallbacks, FinalStats, GameState, Phase } from "./types";

type Ctx = CanvasRenderingContext2D;

function freshState(phase: Phase = "ready"): GameState {
  return {
    phase,
    loseReason: "time",
    t: 0,
    timeLeft: DURATION,
    score: 0,
    streak: 0,
    bestStreak: 0,
    catches: 0,
    moisture: 0,
    hearts: 3,
    playerX: W / 2,
    targetX: null,
    invuln: 0,
    shake: 0,
    countdown: 0,
    drops: [],
    hazards: [],
    parts: [],
    pops: [],
    spawnT: 0.7,
    hazT: 2.4,
    keyL: false,
    keyR: false,
  };
}

export interface GameHandle {
  start(): void;
  pause(): void;
  resume(): void;
  setMuted(m: boolean): void;
  steer(x: number): void;
  setKey(dir: "L" | "R", down: boolean): void;
  destroy(): void;
}

// موتور بازی: حلقه‌ی رندر، به‌روزرسانی وضعیت و ورودی‌ها اینجا جمعه.
// React فقط نتیجه رو با callback می‌گیره.
export function createGame(canvas: HTMLCanvasElement, cb: EngineCallbacks): GameHandle {
  const ctx = canvas.getContext("2d") as Ctx;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = W * dpr;
  canvas.height = H * dpr;

  let s = freshState();
  let raf = 0;
  let last = performance.now();
  let muted = false;

  const setPhase = (p: Phase) => {
    s.phase = p;
    cb.onPhase(p);
  };

  const burst = (x: number, y: number, colors: string[], n: number, speed = 150) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.4 + Math.random() * 0.9);
      s.parts.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 60,
        life: 0.55 + Math.random() * 0.3,
        max: 0.85,
        r: 2.5 + Math.random() * 3,
        g: 420,
        color: colors[i % colors.length],
      });
    }
  };

  const finish = (phase: "won" | "lost") => {
    const stats: FinalStats = {
      score: s.score,
      catches: s.catches,
      bestStreak: s.bestStreak,
      timeLeft: Math.max(0, s.timeLeft),
      loseReason: s.loseReason,
    };
    setPhase(phase);
    if (phase === "won") {
      playSfx("win", muted);
      for (let i = 0; i < 90; i++) {
        s.parts.push({
          x: Math.random() * W,
          y: -20 - Math.random() * 120,
          vx: (Math.random() - 0.5) * 60,
          vy: 60 + Math.random() * 140,
          life: 1.6,
          max: 1.6,
          r: 3 + Math.random() * 4,
          g: 60,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        });
      }
    } else {
      playSfx("lose", muted);
    }
    cb.onEnd(phase, stats);
  };

  const update = (dt: number) => {
    // ذرات و نوشته‌های شناور بعد از پایان بازی هم ادامه پیدا می‌کنن
    if (s.phase !== "playing") {
      s.parts = s.parts.filter((p) => (p.life -= dt) > 0);
      for (const p of s.parts) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.g * dt;
      }
      s.pops = s.pops.filter((p) => (p.life -= dt) > 0);
      for (const p of s.pops) p.y -= 34 * dt;
      return;
    }

    s.t += dt;
    s.timeLeft = DURATION - s.t;
    if (s.timeLeft <= 0) {
      s.loseReason = "time";
      finish("lost");
      return;
    }
    s.invuln = Math.max(0, s.invuln - dt);
    s.shake = Math.max(0, s.shake - dt * 1.6);

    // تولید قطره — با گذشت زمان فشرده‌تر و سریع‌تر
    s.spawnT -= dt;
    if (s.spawnT <= 0) {
      s.spawnT = Math.max(SPAWN_MIN, SPAWN_BASE - s.t * 0.007);
      const cx = CLOUDS[Math.floor(Math.random() * CLOUDS.length)];
      s.drops.push({
        x: cx + (Math.random() * 150 - 75),
        y: 84,
        vy: DROP_BASE_SPEED + Math.min(150, s.t * 2.6),
        golden: Math.random() < GOLDEN_CHANCE,
      });
    }
    // تولید موانع
    s.hazT -= dt;
    if (s.hazT <= 0) {
      s.hazT = Math.max(HAZ_SPAWN_MIN, HAZ_SPAWN_BASE - s.t * 0.016);
      const cx = CLOUDS[Math.floor(Math.random() * CLOUDS.length)];
      s.hazards.push({
        x: cx + (Math.random() * 150 - 75),
        y: 84,
        vy: HAZ_BASE_SPEED + Math.min(150, s.t * 2.8),
        rot: Math.random() * 1.2 - 0.6,
        vr: (Math.random() - 0.5) * 3,
      });
    }

    // حرکت پهپاد: کیبورد اولویت داره، بعد مقصد لمسی
    if (s.keyL) {
      s.playerX -= PLAYER_SPEED * dt;
      s.targetX = null;
    } else if (s.keyR) {
      s.playerX += PLAYER_SPEED * dt;
      s.targetX = null;
    } else if (s.targetX !== null) {
      s.playerX += (s.targetX - s.playerX) * Math.min(1, dt * 13);
    }
    s.playerX = Math.max(36, Math.min(W - 36, s.playerX));

    // قطره‌ها
    const kept: typeof s.drops = [];
    for (const d of s.drops) {
      d.y += d.vy * dt;
      const caught =
        d.y > PLAYER_Y - 26 && d.y < PLAYER_Y + 20 && Math.abs(d.x - s.playerX) < CATCH_HALF;
      if (caught) {
        const base = d.golden ? GOLDEN_POINTS : DROP_POINTS;
        const bonus = Math.min(s.streak, STREAK_BONUS_CAP) * STREAK_BONUS_STEP;
        s.score += base + bonus;
        s.streak += 1;
        s.bestStreak = Math.max(s.bestStreak, s.streak);
        s.catches += 1;
        s.moisture = Math.min(100, s.moisture + MOISTURE_PER_DROP);
        burst(
          d.x,
          PLAYER_Y - 6,
          d.golden ? GOLD_BURST : WATER_BURST,
          d.golden ? 16 : 10,
          d.golden ? 190 : 150
        );
        s.pops.push({
          x: d.x,
          y: PLAYER_Y - 34,
          text: `+${faDigits(base + bonus)}`,
          life: 0.9,
          color: d.golden ? "#D9A13A" : "#2F8F9D",
        });
        playSfx(d.golden ? "golden" : "catch", muted);
        cb.onStreak(s.streak);
        if (s.moisture >= 100) {
          finish("won");
          return;
        }
        continue;
      }
      if (d.y > 464) {
        if (s.streak > 0) {
          s.streak = 0;
          cb.onStreak(0);
        }
        burst(d.x, 462, SPLASH_BURST, 4, 70);
        continue;
      }
      kept.push(d);
    }
    s.drops = kept;

    // موانع
    const keptH: typeof s.hazards = [];
    for (const h of s.hazards) {
      h.y += h.vy * dt;
      h.rot += h.vr * dt;
      const hit =
        s.invuln <= 0 && Math.abs(h.x - s.playerX) < HIT_HALF && Math.abs(h.y - PLAYER_Y) < 26;
      if (hit) {
        s.hearts -= 1;
        s.invuln = INVULN_TIME;
        s.shake = 0.4;
        s.streak = 0;
        cb.onHearts(s.hearts);
        cb.onStreak(0);
        burst(s.playerX, PLAYER_Y, HIT_BURST, 16, 200);
        playSfx("hit", muted);
        vibrate([70, 40, 70], muted);
        if (s.hearts <= 0) {
          s.loseReason = "hearts";
          finish("lost");
          return;
        }
        continue;
      }
      if (h.y > 466) {
        burst(h.x, 462, HAZARD_BURST, 5, 90);
        continue;
      }
      keptH.push(h);
    }
    s.hazards = keptH;

    s.parts = s.parts.filter((p) => (p.life -= dt) > 0);
    for (const p of s.parts) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.g * dt;
    }
    s.pops = s.pops.filter((p) => (p.life -= dt) > 0);
    for (const p of s.pops) p.y -= 34 * dt;
  };

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (s.shake > 0) {
      ctx.translate((Math.random() - 0.5) * s.shake * 22, (Math.random() - 0.5) * s.shake * 16);
    }

    drawSky(ctx);
    drawSun(ctx, s.t);
    drawHills(ctx);
    drawClouds(ctx, s.t);
    drawField(ctx, s.moisture);
    drawCrops(ctx, s.moisture / 100, s.t);
    drawFarmer(ctx, 74, 448, s.t, s.phase === "won");
    drawDrops(ctx, s);
    drawHazards(ctx, s);
    drawDrone(ctx, s);
    drawParticles(ctx, s.parts);
    drawPops(ctx, s.pops);

    ctx.restore();
    drawVignette(ctx);

    if (s.phase === "countdown") drawCountdown(ctx, s.countdown);
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (s.phase === "playing") update(dt);
    else {
      // شمارش معکوس و ذرات در حالت‌های دیگه هم زندگی می‌کنن
      if (s.phase === "countdown") {
        const prev = Math.ceil(s.countdown);
        s.countdown -= dt;
        const cur = Math.ceil(s.countdown);
        if (cur < prev && cur > 0) playSfx("tick", muted);
        if (s.countdown <= 0) {
          setPhase("playing");
          playSfx("go", muted);
        }
      }
      s.parts = s.parts.filter((p) => (p.life -= dt) > 0);
      for (const p of s.parts) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.g * dt;
      }
      s.pops = s.pops.filter((p) => (p.life -= dt) > 0);
      for (const p of s.pops) p.y -= 34 * dt;
    }
    draw();
    cb.onFrame?.({ score: s.score, timeLeft: Math.max(0, s.timeLeft), moisture: s.moisture });
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  /* ---------- ورودی‌ها ---------- */

  const onKey = (e: KeyboardEvent, down: boolean) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      if (s.phase === "playing") e.preventDefault();
      s.keyL = down;
      if (down) s.targetX = null;
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      if (s.phase === "playing") e.preventDefault();
      s.keyR = down;
      if (down) s.targetX = null;
    }
  };
  const kd = (e: KeyboardEvent) => onKey(e, true);
  const ku = (e: KeyboardEvent) => onKey(e, false);
  window.addEventListener("keydown", kd);
  window.addEventListener("keyup", ku);

  // وقتی تب مخفی می‌شه، بازی خودش رو نگه می‌داره که امتیاز بی‌دلیل نسوزه
  const onVisibility = () => {
    if (document.hidden && s.phase === "playing") {
      pause();
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  function pause() {
    if (s.phase !== "playing") return;
    s.keyL = false;
    s.keyR = false;
    playSfx("pause", muted);
    setPhase("paused");
  }

  return {
    start() {
      s = freshState("countdown");
      s.countdown = 3 * COUNTDOWN_STEP;
      cb.onHearts(3);
      cb.onStreak(0);
      setPhase("countdown");
      playSfx("tick", muted);
    },
    pause,
    resume() {
      if (s.phase !== "paused") return;
      last = performance.now(); // نگذار زمانِ مکث حساب بشه
      setPhase("playing");
    },
    setMuted(m: boolean) {
      muted = m;
    },
    steer(x: number) {
      if (s.phase === "playing") s.targetX = Math.max(36, Math.min(W - 36, x));
    },
    setKey(dir: "L" | "R", down: boolean) {
      if (dir === "L") s.keyL = down;
      else s.keyR = down;
      if (down) s.targetX = null;
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
