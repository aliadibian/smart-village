import { faDigits } from "../lib/fa";
import { CLOUDS, FIELD_Y, H, PALETTE, W } from "./constants";
import type { GameState, Particle, Pop } from "./types";

// همه‌ی ترسیم‌های بازی اینجاست؛ موتور فقط صدا می‌زنه

export function drawSky(ctx: CanvasRenderingContext2D): void {
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, PALETTE.skyTop);
  sky.addColorStop(0.62, PALETTE.skyMid);
  sky.addColorStop(1, PALETTE.skyLow);
  ctx.fillStyle = sky;
  ctx.fillRect(-20, -20, W + 40, H + 40);
}

export function drawSun(ctx: CanvasRenderingContext2D, t: number): void {
  const x = 868;
  const y = 74;
  // پرتوهای خورشید — خیلی محو، با چرخش آروم
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(t * 0.05);
  ctx.fillStyle = "rgba(247,201,72,0.07)";
  for (let i = 0; i < 10; i++) {
    ctx.rotate((Math.PI * 2) / 10);
    ctx.beginPath();
    ctx.moveTo(0, -46);
    ctx.lineTo(7, -92);
    ctx.lineTo(-7, -92);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.fillStyle = "rgba(247,201,72,0.25)";
  ctx.beginPath();
  ctx.arc(x, y, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.sun;
  ctx.beginPath();
  ctx.arc(x, y, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,235,170,0.85)";
  ctx.beginPath();
  ctx.arc(x - 8, y - 8, 9, 0, Math.PI * 2);
  ctx.fill();
}

export function drawHills(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = PALETTE.hillA;
  ctx.beginPath();
  ctx.ellipse(210, 400, 330, 90, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = PALETTE.hillB;
  ctx.beginPath();
  ctx.ellipse(760, 405, 380, 100, 0, Math.PI, 0);
  ctx.fill();
}

function cloudPath(ctx: CanvasRenderingContext2D): void {
  ctx.beginPath();
  ctx.arc(-34, 8, 22, 0, Math.PI * 2);
  ctx.arc(0, -6, 30, 0, Math.PI * 2);
  ctx.arc(36, 8, 24, 0, Math.PI * 2);
  ctx.rect(-46, 8, 92, 20);
}

export function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, pipe = false): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  cloudPath(ctx);
  ctx.fill();
  if (pipe) {
    ctx.save();
    ctx.translate(46, -18);
    ctx.rotate(-0.35);
    ctx.fillStyle = "#8B9AA6";
    ctx.fillRect(-20, -7, 40, 14);
    ctx.fillStyle = "#6E7F8A";
    ctx.fillRect(-22, -9, 6, 18);
    ctx.fillRect(16, -9, 6, 18);
    ctx.strokeStyle = "#4A5A62";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, -7);
    ctx.lineTo(2, 0);
    ctx.lineTo(-3, 7);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

export function drawClouds(ctx: CanvasRenderingContext2D, t: number): void {
  const bobY = Math.sin(t * 1.1) * 4;
  drawCloud(ctx, CLOUDS[0], 72 + bobY, 0.85);
  drawCloud(ctx, CLOUDS[1], 58 - bobY, 1.12, true);
  drawCloud(ctx, CLOUDS[2], 74 + bobY * 0.6, 0.9);
}

export function drawField(ctx: CanvasRenderingContext2D, moisture: number): void {
  const m = moisture / 100;
  const { dirt, green } = PALETTE;
  const fc = dirt.map((d, i) => Math.round(d + (green[i] - d) * m));
  ctx.fillStyle = `rgb(${fc[0]},${fc[1]},${fc[2]})`;
  ctx.fillRect(-20, FIELD_Y, W + 40, H - FIELD_Y + 20);
  ctx.fillStyle = "rgba(43,90,110,0.16)";
  ctx.fillRect(-20, FIELD_Y, (W + 40) * m, H - FIELD_Y + 20);
  ctx.strokeStyle = "rgba(90,70,40,0.35)";
  ctx.lineWidth = 3;
  [FIELD_Y + 16, FIELD_Y + 36, FIELD_Y + 56].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  });
}

export function drawCrop(ctx: CanvasRenderingContext2D, x: number, y: number, m: number, phase: number): void {
  const s = 0.45 + m * 0.75;
  const { cropDry, cropWet } = PALETTE;
  const c = cropDry.map((d, i) => Math.round(d + (cropWet[i] - d) * m));
  const sway = Math.sin(phase + x * 0.05) * 2 * s;
  ctx.strokeStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
  ctx.lineWidth = 2.4 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + sway, y - 12 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + sway * 0.4, y - 6 * s);
  ctx.quadraticCurveTo(x - 5 * s + sway, y - 10 * s, x - 7 * s + sway, y - 7 * s);
  ctx.moveTo(x + sway * 0.6, y - 8 * s);
  ctx.quadraticCurveTo(x + 5 * s + sway, y - 13 * s, x + 8 * s + sway, y - 9 * s);
  ctx.stroke();
}

export function drawCrops(ctx: CanvasRenderingContext2D, m: number, t: number): void {
  for (let row = 0; row < 3; row++) {
    const y = FIELD_Y + 14 + row * 19;
    for (let x = 14 + row * 17; x < W; x += 34) drawCrop(ctx, x, y, m, t * 1.6 + row);
  }
}

export function drawFarmer(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, happy: boolean): void {
  const jump = happy ? Math.abs(Math.sin(t * 4)) * 10 : 0;
  ctx.save();
  ctx.translate(x, y - jump);
  ctx.strokeStyle = "#5B4630";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-5, 26);
  ctx.lineTo(-6, 44);
  ctx.moveTo(6, 26);
  ctx.lineTo(7, 44);
  ctx.stroke();
  ctx.fillStyle = "#2F8F9D";
  ctx.beginPath();
  ctx.roundRect(-12, 0, 24, 28, 7);
  ctx.fill();
  ctx.strokeStyle = "#2F8F9D";
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (happy) {
    ctx.moveTo(-11, 6);
    ctx.lineTo(-20, -8);
    ctx.moveTo(11, 6);
    ctx.lineTo(20, -8);
  } else {
    ctx.moveTo(-11, 6);
    ctx.lineTo(-15, 20);
    ctx.moveTo(11, 6);
    ctx.lineTo(15, 20);
  }
  ctx.stroke();
  ctx.fillStyle = "#F2C9A0";
  ctx.beginPath();
  ctx.arc(0, -11, 9.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#E8B24A";
  ctx.beginPath();
  ctx.arc(0, -14, 11, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(-14, -15, 28, 4);
  ctx.fillStyle = "#5B4630";
  ctx.beginPath();
  ctx.arc(-3.5, -10, 1.3, 0, Math.PI * 2);
  ctx.arc(3.5, -10, 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#5B4630";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, happy ? -7.5 : -6.5, happy ? 4 : 2.5, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

export function drawDrops(ctx: CanvasRenderingContext2D, s: GameState): void {
  for (const d of s.drops) {
    ctx.save();
    ctx.translate(d.x, d.y);
    if (d.golden) {
      ctx.fillStyle = "#E8B24A";
      ctx.strokeStyle = "#C98F26";
    } else {
      ctx.fillStyle = "#58AEE0";
      ctx.strokeStyle = "#35748A";
    }
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.quadraticCurveTo(9, 0, 8, 6);
    ctx.arc(0, 6, 8.2, 0.1, Math.PI - 0.1);
    ctx.quadraticCurveTo(-9, 0, 0, -13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.ellipse(-2.6, 4, 2.4, 3.6, -0.4, 0, Math.PI * 2);
    ctx.fill();
    if (d.golden) {
      ctx.strokeStyle = "#FFF3D6";
      ctx.lineWidth = 1.6;
      const g = 13 + Math.sin(s.t * 8) * 2;
      ctx.beginPath();
      ctx.moveTo(-g, 0);
      ctx.lineTo(g, 0);
      ctx.moveTo(0, -g);
      ctx.lineTo(0, g);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export function drawHazards(ctx: CanvasRenderingContext2D, s: GameState): void {
  for (const h of s.hazards) {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(h.rot);
    ctx.fillStyle = "#8A5A44";
    ctx.strokeStyle = "#5F3D2D";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-21, -9, 42, 18, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#6B4433";
    ctx.fillRect(-25, -7, 5, 14);
    ctx.fillRect(20, -7, 5, 14);
    ctx.strokeStyle = "#3E2A1E";
    ctx.beginPath();
    ctx.moveTo(-6, -9);
    ctx.lineTo(-1, -1);
    ctx.lineTo(-7, 4);
    ctx.lineTo(-2, 9);
    ctx.stroke();
    ctx.fillStyle = "#7FC4D6";
    const dy = (s.t * 46) % 14;
    ctx.beginPath();
    ctx.arc(4, 13 + dy * 0.5, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function drawDrone(ctx: CanvasRenderingContext2D, s: GameState): void {
  const blink = s.invuln > 0 && Math.sin(s.t * 28) > 0;
  if (blink) return;
  const px = s.playerX;
  const py = 428 + Math.sin(s.t * 3.2) * 3;
  ctx.save();
  ctx.translate(px, py);
  // سطل
  ctx.fillStyle = "#D9A13A";
  ctx.strokeStyle = "#A8781F";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-22, 8);
  ctx.lineTo(22, 8);
  ctx.lineTo(16, 26);
  ctx.lineTo(-16, 26);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#BFE3EA";
  ctx.fillRect(-22, 8, 44, 5);
  // بازوها
  ctx.strokeStyle = "#143629";
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(-18, -6);
  ctx.lineTo(-36, -15);
  ctx.moveTo(18, -6);
  ctx.lineTo(36, -15);
  ctx.stroke();
  // پروانه‌ها
  const spin = Math.abs(Math.sin(s.t * 42));
  ctx.fillStyle = "rgba(74,90,82,0.75)";
  ctx.beginPath();
  ctx.ellipse(-36, -17, Math.max(5, 17 * spin), 3.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(36, -17, Math.max(5, 17 * spin), 3.4, 0, 0, Math.PI * 2);
  ctx.fill();
  // بدنه
  ctx.fillStyle = "#2F6F5E";
  ctx.strokeStyle = "#143629";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-24, -8, 48, 17, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#BFE3EA";
  ctx.beginPath();
  ctx.arc(0, -8, 9, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = Math.sin(s.t * 6) > 0 ? "#E4573D" : "#8F3E2C";
  ctx.beginPath();
  ctx.arc(0, -14, 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawParticles(ctx: CanvasRenderingContext2D, parts: Particle[]): void {
  for (const p of parts) {
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawPops(ctx: CanvasRenderingContext2D, pops: Pop[]): void {
  ctx.textAlign = "center";
  ctx.font = "800 19px Vazirmatn, sans-serif";
  for (const p of pops) {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 0.5));
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255,252,244,0.9)";
    ctx.strokeText(p.text, p.x, p.y);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
}

// شمارش معکوس وسط بوم — عدد بزرگ فارسی
export function drawCountdown(ctx: CanvasRenderingContext2D, remaining: number): void {
  const n = Math.max(1, Math.ceil(remaining));
  const frac = remaining - Math.floor(remaining);
  const scale = 1 + Math.max(0, frac - 0.75) * 1.4;
  ctx.save();
  ctx.translate(W / 2, 240);
  ctx.scale(scale, scale);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 96px Vazirmatn, sans-serif";
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = "#143629";
  ctx.fillText(faDigits(n), 0, 6);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#1E4D3B";
  ctx.fillText(faDigits(n), 0, 0);
  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "700 22px Vazirmatn, sans-serif";
  ctx.fillStyle = "rgba(20,54,41,0.75)";
  ctx.fillText("قطره‌ها رو بگیر، از لوله‌ها فرار کن!", W / 2, 310);
  ctx.restore();
}

// ویگنت خیلی ملایم دور بوم — به صحنه عمق می‌ده
export function drawVignette(ctx: CanvasRenderingContext2D): void {
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.55, W / 2, H / 2, H * 1.05);
  v.addColorStop(0, "rgba(20,54,41,0)");
  v.addColorStop(1, "rgba(20,54,41,0.14)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}
