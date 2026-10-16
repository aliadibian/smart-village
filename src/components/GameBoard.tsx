import { useEffect, useState } from "react";
import { listGameScores, type GameScore } from "../lib/storage";
import { faNum } from "../lib/fa";
import { IconTrophy, IconTarget, IconRefresh } from "./icons";
import { cn } from "../utils/cn";

const MEDAL = [
  "bg-wheat text-pine-deep ring-wheat/60",
  "bg-cream text-ink-soft ring-ink/20",
  "bg-clay-soft text-clay-deep ring-clay/40",
];

export default function GameBoard({ highlightId }: { highlightId?: string | null }) {
  const [entries, setEntries] = useState<GameScore[]>([]);

  // هر بار که مسابقه تموم شد، دوباره از storage می‌خونیم
  useEffect(() => {
    setEntries(listGameScores());
    const onStorage = () => setEntries(listGameScores());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [highlightId]);

  return (
    <section className="fade-up mt-6 rounded-3xl border border-ink/8 bg-parchment p-4 shadow-[0_20px_50px_-30px_rgba(20,54,41,0.4)] sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pine text-wheat">
            <IconTrophy size={20} />
          </span>
          <div>
            <h2 className="font-display text-xl leading-tight text-ink sm:text-2xl">برترین‌های مزرعه</h2>
            <p className="text-[0.7rem] font-bold text-ink-soft sm:text-xs">
              هر نفر هر بار بخواد می‌تونه بازی کنه؛ بهترین امتیازش ثبت می‌شه
            </p>
          </div>
        </div>
        <span className="rounded-xl bg-leaf-soft px-3 py-1.5 text-xs font-black text-leaf-deep">
          {faNum(entries.length)} بازیکن
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-dashed border-ink/15 bg-cream/50 py-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-wheat-soft text-wheat-deep">
            <IconTarget size={26} />
          </span>
          <p className="text-base font-black text-ink">هنوز کسی امتیازی نزده</p>
          <p className="text-sm text-ink-soft">اولین نفر باش که اسمت روی تابلو می‌ره!</p>
        </div>
      ) : (
        <ol className="overflow-hidden rounded-2xl border border-ink/8">
          {entries.map((e, i) => {
            const me = e.id === highlightId;
            return (
              <li
                key={e.id}
                className={cn(
                  "flex items-center gap-2.5 border-b border-ink/6 px-3 py-2.5 last:border-b-0 sm:gap-3 sm:px-4",
                  me ? "bg-leaf-soft/80" : i % 2 ? "bg-cream/40" : "bg-parchment"
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-black",
                    i < 3 ? MEDAL[i] : "bg-ink/5 text-ink-soft",
                    i < 3 && "ring-2"
                  )}
                >
                  {faNum(i + 1)}
                </span>

                <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink" title={e.name}>
                  {e.name}
                  {me && (
                    <span className="mr-1.5 rounded-full bg-leaf px-2 py-0.5 text-[0.65rem] font-black text-cream">
                      شما
                    </span>
                  )}
                </span>

                <span className="hidden items-center gap-1 rounded-lg bg-cream/70 px-2 py-1 text-[0.7rem] font-black text-ink-soft sm:flex">
                  <IconRefresh size={11} />
                  {faNum(e.runs || 1)} تلاش
                </span>

                <span className="w-12 shrink-0 text-left font-display text-xl text-pine sm:w-14 sm:text-2xl">
                  {faNum(e.score)}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-4 flex items-start gap-2 rounded-xl bg-cream/70 px-3.5 py-3 text-[0.72rem] leading-6 text-ink-soft">
        <IconTarget size={14} className="mt-1 shrink-0" />
        جدول روی همین مرورگر ذخیره می‌شه. هر بار که امتیازت از قبلی بیشتر بشه، جایگاهت عوض می‌شه.
      </p>
    </section>
  );
}
