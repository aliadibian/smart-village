import { useEffect, useRef } from "react";
import { LOCATIONS, type LocationId } from "../data/locations";
import { LocationIcon, IconClose, IconCheck, IconChevronLeft, IconChevronRight, IconSparkle, IconAlert } from "./icons";
import { faNum } from "../lib/fa";
import { cn } from "../utils/cn";

export default function LocationPanel({
  id,
  visitedCount,
  onClose,
  onNavigate,
}: {
  id: LocationId;
  visitedCount: number;
  onClose: () => void;
  onNavigate: (id: LocationId) => void;
}) {
  const loc = LOCATIONS.find((l) => l.id === id)!;
  const index = LOCATIONS.findIndex((l) => l.id === id);
  const prev = LOCATIONS[(index - 1 + LOCATIONS.length) % LOCATIONS.length];
  const next = LOCATIONS[(index + 1) % LOCATIONS.length];
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, [id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(next.id);
      if (e.key === "ArrowRight") onNavigate(prev.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate, next.id, prev.id]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`توضیحات ${loc.name}`}>
      <div className="fade-in absolute inset-0 bg-pine-deep/45 backdrop-blur-[3px]" onClick={onClose} />

      <aside className="panel-in absolute inset-y-0 left-0 flex w-full max-w-[620px] flex-col bg-parchment shadow-[-20px_0_60px_-20px_rgba(20,54,41,0.5)]">
        {/* header */}
        <header className="flex items-start justify-between gap-3 border-b border-ink/8 bg-cream/60 px-4 py-4 sm:gap-4 sm:px-8 sm:py-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-pine text-cream shadow-[0_10px_20px_-10px_rgba(20,54,41,0.7)] sm:h-14 sm:w-14">
              <LocationIcon name={loc.icon} size={26} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-leaf-deep">{loc.short}</p>
              <h2 className="truncate font-display text-xl leading-tight text-ink sm:text-[1.9rem]">{loc.name}</h2>
              <p className="mt-0.5 truncate text-[0.7rem] font-medium text-ink-soft sm:text-xs">
                مکان {faNum(index + 1)} از {faNum(LOCATIONS.length)} • {faNum(visitedCount)} مکان دیده شد
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink/10 bg-parchment text-ink transition-all hover:border-clay/40 hover:bg-clay-soft hover:text-clay active:scale-95 sm:h-11 sm:w-11"
            aria-label="بستن پنجره"
          >
            <IconClose size={20} />
          </button>
        </header>

        {/* body */}
        <div className="nice-scroll flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* without */}
            <section className="fade-up rounded-2xl border border-clay/25 bg-clay-soft/70 p-5" style={{ animationDelay: "0.15s" }}>
              <div className="mb-4 flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-clay/15 text-clay">
                  <IconAlert size={19} />
                </span>
                <h3 className="text-base font-black text-clay-deep">بدون سواد فناورانه</h3>
              </div>
              <ul className="space-y-3.5">
                {loc.without.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[0.92rem] leading-7 text-ink/85">
                    <span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-clay/15 text-clay">
                      <IconClose size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* with */}
            <section className="fade-up rounded-2xl border border-leaf/30 bg-leaf-soft/80 p-5" style={{ animationDelay: "0.25s" }}>
              <div className="mb-4 flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-leaf/15 text-leaf-deep">
                  <IconCheck size={19} />
                </span>
                <h3 className="text-base font-black text-leaf-deep">با سواد فناورانه</h3>
              </div>
              <ul className="space-y-3.5">
                {loc.with.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[0.92rem] leading-7 text-ink/85">
                    <span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf/20 text-leaf-deep">
                      <IconCheck size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* key insight */}
          <div className="fade-up mt-4 flex items-center gap-3 rounded-2xl bg-pine px-5 py-4 text-cream" style={{ animationDelay: "0.35s" }}>
            <IconSparkle size={22} className="shrink-0 text-wheat" />
            <div>
              <p className="text-[0.7rem] font-bold tracking-wide text-cream/70">تغییر کلیدی در این مکان</p>
              <p className="mt-0.5 text-[0.95rem] font-bold leading-7">{loc.key}</p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs leading-6 text-ink-soft">
            فناوری به‌تنهایی جادو نمی‌کند؛ «سواد فناورانه» یعنی دانشِ انتخاب درست، استفاده‌ی ایمن و قضاوت از فناوری.
          </p>
        </div>

        {/* footer nav */}
        <footer className="flex items-center justify-between gap-2 border-t border-ink/8 bg-cream/60 px-4 py-3.5 sm:gap-3 sm:px-8 sm:py-4">
          <button
            onClick={() => onNavigate(prev.id)}
            className="flex items-center gap-1.5 rounded-xl border border-ink/12 bg-parchment px-4 py-2.5 text-sm font-bold text-ink transition-all hover:border-pine/40 hover:bg-leaf-soft active:scale-95"
          >
            <IconChevronRight size={16} />
            <span className="hidden sm:inline">{prev.name}</span>
            <span className="sm:hidden">قبلی</span>
          </button>
          <span className="text-xs font-bold text-ink-soft">{faNum(index + 1)} / {faNum(LOCATIONS.length)}</span>
          <button
            onClick={() => onNavigate(next.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl bg-pine px-4 py-2.5 text-sm font-bold text-cream shadow-[0_8px_16px_-8px_rgba(20,54,41,0.7)] transition-all hover:bg-pine-deep active:scale-95"
            )}
          >
            <span className="hidden sm:inline">{next.name}</span>
            <span className="sm:hidden">بعدی</span>
            <IconChevronLeft size={16} />
          </button>
        </footer>
      </aside>
    </div>
  );
}
