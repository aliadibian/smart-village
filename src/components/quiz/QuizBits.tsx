import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { faNum } from "../../lib/fa";

// بارش конфتی بعد از نتیجه‌ی خوب — با احترام به تنظیم reduced-motion
export function Confetti() {
  const reduced = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.6,
        dur: 2.6 + Math.random() * 1.8,
        size: 6 + Math.random() * 6,
        color: ["#E8B24A", "#4C8C55", "#4E9FB5", "#C4623A", "#F6F2E6", "#D9A13A"][i % 6],
        round: i % 3 === 0,
      })),
    []
  );
  if (reduced) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.round ? 1 : 1.6),
            backgroundColor: p.color,
            borderRadius: p.round ? "50%" : 2,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// گیج گرد امتیاز با شمارش نرم
export function ScoreDial({ score }: { score: number }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? score : 0);

  useEffect(() => {
    if (reduced) {
      setShown(score);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 1100;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setShown(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, reduced]);

  const R = 62;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 150 150" className="h-full w-full -rotate-90">
        <circle cx={75} cy={75} r={R} fill="none" stroke="#24312B14" strokeWidth={13} />
        <circle
          cx={75}
          cy={75}
          r={R}
          fill="none"
          stroke={score >= 70 ? "#4C8C55" : score >= 40 ? "#E8B24A" : "#C4623A"}
          strokeWidth={13}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - shown / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl leading-none text-pine">{faNum(shown)}</span>
        <span className="mt-1 text-xs font-black text-ink-soft">از {faNum(100)}</span>
      </div>
    </div>
  );
}
