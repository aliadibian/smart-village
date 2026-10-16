// صداها با Web Audio ساخته می‌شن — هیچ فایل صوتی‌ای لازم نیست.
// AudioContext فقط بعد از اولین حرکت کاربر ساخته می‌شه (مرورگرها اجازه‌ی autoplay نمی‌دن).

let actx: AudioContext | null = null;

export function ensureAudio(): void {
  if (!actx) {
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) actx = new Ctor();
    } catch {
      actx = null;
    }
  }
  actx?.resume?.();
}

function tone(
  freq: number,
  dur = 0.09,
  type: OscillatorType = "sine",
  delay = 0,
  slideTo = 0,
  gain = 0.16
) {
  if (!actx) return;
  const t0 = actx.currentTime + delay;
  const osc = actx.createOscillator();
  const g = actx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(actx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

// هر افکت یک کلید داره؛ muted رو موتور چک می‌کنه
export const sfx = {
  catch: () => {
    tone(660, 0.07, "triangle");
    tone(990, 0.09, "triangle", 0.05);
  },
  golden: () => {
    tone(987, 0.08, "triangle");
    tone(1319, 0.12, "triangle", 0.06);
  },
  hit: () => tone(150, 0.22, "square", 0, 80, 0.14),
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.14, "triangle", i * 0.11, 0, 0.18)),
  lose: () => [392, 311, 233].forEach((f, i) => tone(f, 0.18, "sine", i * 0.16, 0, 0.14)),
  tick: () => tone(520, 0.06, "sine", 0, 0, 0.1),
  go: () => tone(780, 0.16, "triangle", 0, 1040, 0.16),
  pause: () => tone(300, 0.08, "sine", 0, 220, 0.1),
};

export type SfxName = keyof typeof sfx;

export function playSfx(name: SfxName, muted: boolean): void {
  if (!muted) sfx[name]();
}

export function vibrate(pattern: number | number[], muted: boolean): void {
  if (muted) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* مرورگری که لرزش نداره مشکلی پیش نمیاد */
  }
}
