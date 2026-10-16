import { useCallback, useState } from "react";
import VillageScene from "../components/village/VillageScene";
import LocationPanel from "../components/LocationPanel";
import { LOCATIONS, type LocationId } from "../data/locations";
import { IconHandPoint, IconCheck, IconSparkle } from "../components/icons";
import { faNum } from "../lib/fa";
import { useIsMobile } from "../hooks/useMediaQuery";
import { cn } from "../utils/cn";

export default function VillagePage() {
  const [selected, setSelected] = useState<LocationId | null>(null);
  const [visited, setVisited] = useState<Set<LocationId>>(new Set());
  const isMobile = useIsMobile();

  const handleSelect = useCallback((id: LocationId) => {
    setSelected(id);
    setVisited((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const allVisited = visited.size === LOCATIONS.length;

  return (
    <div className="mx-auto max-w-7xl px-3 pb-16 pt-5 sm:px-6 sm:pt-8">
      {/* معرفی صفحه */}
      <div className="fade-up mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-[1.7rem] leading-tight text-pine sm:text-5xl">
            به <span className="text-clay">روستای هوشمند</span> خوش آمدی
          </h1>
          <p className="mt-1.5 max-w-2xl text-[0.9rem] leading-7 text-ink-soft sm:text-base">
            این روستا را با موس یا انگشتت چیز کن؛ هر ساختمون یک داستان داره. روی هر مکان بزن  ببین
            زندگی اونجا، «با» و «بدون» سواد فناورانه چه فرق می‌کند.
            مخلصیم.
          </p>
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2 text-[0.82rem] font-black transition-colors sm:px-4 sm:py-2.5 sm:text-sm",
            allVisited ? "border-leaf/40 bg-leaf-soft text-leaf-deep" : "border-wheat/50 bg-wheat-soft text-wheat-deep"
          )}
        >
          <IconSparkle size={17} />
          {allVisited ? "روستا را کامل کشف کردی!" : "مسیر کشف شما"}
          <span className="rounded-lg bg-parchment px-2 py-0.5 text-xs">
            {faNum(visited.size)} / {faNum(LOCATIONS.length)}
          </span>
        </div>
      </div>

      {/* راهنما + صحنه */}
      <div className="relative mx-auto" style={{ maxWidth: isMobile ? "100%" : "min(100%, calc((100dvh - 230px) * 1.6))" }}>
        <div className="pointer-events-none absolute inset-x-0 -top-3 z-10 flex justify-center px-2">
          <span className="float-y flex max-w-full items-center gap-2 rounded-full bg-ink/90 px-3.5 py-2 text-[0.78rem] font-bold text-cream shadow-lg sm:gap-2.5 sm:px-5 sm:py-2.5 sm:text-sm">
            <IconHandPoint size={17} className="wobble shrink-0 text-wheat sm:w-[19px]" />
            <span className="truncate">{isMobile ? "روی نشان‌های طلایی روستا بزن" : "روی بخش‌های مختلف روستا کلیک کن"}</span>
          </span>
        </div>
        <VillageScene selectedId={selected} visited={visited} onSelect={handleSelect} />
      </div>

      {/* فهرست مکان‌ها */}
      <div className="fade-up mt-4 rounded-2xl border border-ink/8 bg-parchment/70 p-3.5 sm:mt-6 sm:p-5" style={{ animationDelay: "0.3s" }}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <h2 className="text-sm font-black text-ink">مکان‌های روستا</h2>
          <p className="text-[0.7rem] font-bold text-ink-soft sm:text-xs">
            <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-wheat align-middle" /> نشانه‌ی طلایی = جای قابل کلیک
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {LOCATIONS.map((loc, i) => {
            const done = visited.has(loc.id);
            return (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[0.82rem] font-bold transition-all duration-300 active:scale-95 sm:px-3.5 sm:py-2",
                  done
                    ? "border-leaf/35 bg-leaf-soft text-leaf-deep"
                    : "border-dashed border-ink/20 bg-cream/60 text-ink-soft hover:border-pine/40 hover:bg-leaf-soft/50 hover:text-ink"
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {done ? (
                  <span className="grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-leaf text-cream">
                    <IconCheck size={11} />
                  </span>
                ) : (
                  <span className="h-4.5 w-4.5 shrink-0 rounded-full border-2 border-dashed border-ink/25" />
                )}
                <span className="truncate">{loc.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <LocationPanel
          id={selected}
          visitedCount={visited.size}
          onClose={() => setSelected(null)}
          onNavigate={handleSelect}
        />
      )}
    </div>
  );
}
