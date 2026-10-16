import { cn } from "../utils/cn";
import { IconMap, IconQuiz, IconGame } from "./icons";

export type PageId = "village" | "quiz" | "game";

const ITEMS: { id: PageId; label: string; icon: (p: { size?: number; className?: string }) => React.ReactNode }[] = [
  { id: "village", label: "روستا", icon: IconMap },
  { id: "quiz", label: "کوییز", icon: IconQuiz },
  { id: "game", label: "بازی", icon: IconGame },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pine shadow-[0_6px_16px_-6px_rgba(20,54,41,0.6)] sm:h-11 sm:w-11">
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M6 17 16 8l10 9" stroke="#E8B24A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 15.5V25h12v-9.5" stroke="#F6F2E6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 25v-4.5" stroke="#58AEE0" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M22.5 6.5c1.6 0 3 .7 4 2M24 3.5c2.6 0 5 1.1 6.8 3" stroke="#58AEE0" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" transform="translate(-2 2) scale(0.9)" />
        </svg>
      </span>
      {!compact && (
        <span className="hidden leading-none min-[420px]:block">
          <span className="block font-display text-[1.15rem] tracking-tight text-pine sm:text-[1.35rem]">
            روستای هوشمند
          </span>
          <span className="mt-0.5 block text-[0.6rem] font-bold tracking-[0.3em] text-ink-soft" dir="ltr">
            SMART VILLAGE
          </span>
        </span>
      )}
    </div>
  );
}

export default function Nav({ page, onNavigate }: { page: PageId; onNavigate: (p: PageId) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-parchment/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-2 px-3 sm:h-[4.5rem] sm:gap-4 sm:px-6">
        <button
          onClick={() => onNavigate("village")}
          className="shrink-0 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
          aria-label="بازگشت به روستای هوشمند"
        >
          <Logo />
        </button>

        <nav aria-label="ناوبری اصلی" className="flex shrink-0 items-center gap-1 rounded-2xl bg-ink/5 p-1 sm:gap-1.5 sm:p-1.5">
          {ITEMS.map(({ id, label, icon: Icon }) => {
            const active = page === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-2.5 py-2.5 text-[0.78rem] font-bold transition-all duration-300 sm:gap-2 sm:px-4 sm:text-sm",
                  active
                    ? "bg-pine text-cream shadow-[0_8px_18px_-8px_rgba(20,54,41,0.7)]"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                )}
              >
                <Icon size={18} />
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden">{label.split(" ")[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
