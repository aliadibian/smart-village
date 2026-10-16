import { useRef, useState } from "react";
import { faNum } from "../lib/fa";
import { useFarmGame, saveGameName, clearGameName } from "../game/useFarmGame";
import { useIsMobile } from "../hooks/useMediaQuery";
import GameBoard from "../components/GameBoard";
import {
  IconPlay,
  IconRefresh,
  IconVolume,
  IconVolumeOff,
  IconSparkle,
  IconClock,
  IconTrophy,
  IconTarget,
  IconUsers,
  IconPause,
} from "../components/icons";
import { cn } from "../utils/cn";

export default function GamePage() {
  const game = useFarmGame();
  const { phase, hearts, streak, muted, best, isRecord, finalStats, lastEntryId } = game;
  const isMobile = useIsMobile();

  const [playerName, setPlayerName] = useState(() => {
    try {
      return (localStorage.getItem("smart-village:game-name:v1") || "").slice(0, 24);
    } catch {
      return "";
    }
  });
  const [draftName, setDraftName] = useState(playerName);
  const [nameError, setNameError] = useState("");
  const nameRef = useRef(playerName);
  nameRef.current = playerName;

  const start = () => {
    // قبل از اولین بازی، اسم بازیکن لازمه
    if (!nameRef.current) {
      const clean = draftName.replace(/\s+/g, " ").trim().slice(0, 24);
      if (clean.length < 2) {
        setNameError("لطفاً نام و نام خانوادگی‌ات را بنویس (حداقل ۲ نویسه).");
        return;
      }
      nameRef.current = clean;
      setPlayerName(clean);
      setNameError("");
      saveGameName(clean);
    }
    game.start();
  };

  const changeName = () => {
    setPlayerName("");
    nameRef.current = "";
    setDraftName("");
    setNameError("");
    clearGameName();
  };

  const playing = phase === "playing" || phase === "paused" || phase === "countdown";

  const readyContent = (
    <>
      <h2 className="font-display text-3xl text-pine sm:text-5xl">نجات مزرعه!</h2>
      <p className="mx-auto mt-2 max-w-md text-center text-sm leading-7 text-ink-soft">
        ۶۰ ثانیه وقت داری؛ قطره‌های آب را بگیر تا رطوبت مزرعه کامل شود.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-5 sm:gap-2.5">
        <Legend color="bg-river" label="قطره آب +۱۰" icon="drop" />
        <Legend color="bg-wheat" label="قطره طلایی +۳۰" icon="star" />
        <Legend color="bg-clay" label="لوله‌ی پوسیده: خطر!" icon="warn" />
      </div>

      <div className="mt-4 w-full max-w-xs sm:mt-5">
        {playerName ? (
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex max-w-full items-center gap-2 rounded-xl border border-pine/25 bg-leaf-soft px-3.5 py-2 text-sm font-black text-leaf-deep">
              <IconUsers size={16} className="shrink-0" />
              <span className="truncate">{playerName}</span>
            </span>
            <button
              onClick={changeName}
              className="text-[0.72rem] font-bold text-ink-soft underline underline-offset-4 transition-colors hover:text-pine"
            >
              تعویض نام
            </button>
          </div>
        ) : (
          <div className="text-right">
            <label htmlFor="game-name" className="mb-1.5 block text-center text-xs font-black text-ink">
              نام و نام خانوادگی
            </label>
            <input
              id="game-name"
              type="text"
              value={draftName}
              onChange={(e) => {
                setDraftName(e.target.value);
                if (nameError) setNameError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && start()}
              maxLength={24}
              placeholder="مثلاً: سارا محمدی"
              className={cn(
                "w-full rounded-xl border-2 bg-cream/70 px-4 py-3 text-center text-sm font-bold text-ink outline-none transition-all placeholder:font-medium placeholder:text-ink-soft/50",
                nameError ? "shake-x border-clay" : "border-ink/10 focus:border-pine"
              )}
            />
            {nameError && <p className="mt-1.5 text-center text-[0.72rem] font-black text-clay">{nameError}</p>}
          </div>
        )}
      </div>

      <button onClick={start} className={bigBtn}>
        <IconPlay size={22} />
        {playerName ? "شروع بازی" : "ثبت نام و شروع"}
      </button>
      <p className="mt-2.5 text-center text-xs font-bold leading-6 text-ink-soft">
        هر چقدر بخوای بازی کن؛ بهترین امتیازت توی جدول ثبت می‌شه.
      </p>
      <p className="mt-1 text-center text-[0.72rem] font-bold leading-5 text-ink-soft/80">
        {isMobile ? "با کشیدن انگشت یا دکمه‌های کنار صفحه پهپاد رو هدایت کن" : "کنترل: کلیدهای چپ/راست یا A/D — یا کشیدن با موس"}
      </p>
    </>
  );

  const resultContent = (
    <>
      <span
        className={cn(
          "mx-auto grid h-12 w-12 place-items-center rounded-2xl sm:h-16 sm:w-16",
          phase === "won" ? "bg-leaf-soft text-leaf-deep" : "bg-clay-soft text-clay"
        )}
      >
        {phase === "won" ? <IconSparkle size={30} /> : <IconRefresh size={30} />}
      </span>
      <h2 className="mt-2.5 font-display text-3xl text-pine sm:mt-3 sm:text-5xl">
        {phase === "won" ? "مزرعه نجات یافت!" : finalStats?.loseReason === "hearts" ? "پهپاد از کار افتاد!" : "زمان تمام شد..."}
      </h2>
      {phase === "won" && (
        <p className="mt-1 text-[0.82rem] font-bold text-ink-soft sm:text-sm">
          با سواد فناورانه، حتی کم‌آبی هم شکست می‌خورد.
        </p>
      )}
      {phase === "lost" && (
        <p className="mt-1 text-[0.82rem] font-bold text-ink-soft sm:text-sm">دوباره امتحان کن — پهپاد آماده است!</p>
      )}
      {isRecord && (
        <span
          className="pop-in mt-2.5 inline-flex items-center gap-2 rounded-full bg-wheat px-4 py-1.5 text-sm font-black text-pine-deep"
          style={{ animationDelay: "0.3s" }}
        >
          <IconTrophy size={16} />
          رکورد جدید!
        </span>
      )}
      <div className="mx-auto mt-4 grid w-full max-w-sm grid-cols-3 gap-2 sm:mt-5 sm:gap-2.5">
        <Stat label="امتیاز" value={faNum(finalStats?.score ?? 0)} />
        <Stat label="قطره‌ها" value={faNum(finalStats?.catches ?? 0)} />
        <Stat label="زنجیره" value={faNum(finalStats?.bestStreak ?? 0)} />
      </div>
      <button onClick={start} className={bigBtn}>
        <IconRefresh size={20} />
        {phase === "won" ? "یک بار دیگر" : "تلاش دوباره"}
      </button>
      <p className="mt-2.5 text-center text-[0.75rem] font-bold leading-6 text-ink-soft">
        {playerName} عزیز، هر بار بخوای می‌تونی دوباره بازی کنی.
      </p>
    </>
  );

  return (
    <div className="mx-auto max-w-5xl px-3 pb-16 pt-6 sm:px-6 sm:pt-8">
      {/* سرصفحه */}
      <div className="fade-up mb-4 flex flex-wrap items-start justify-between gap-3 sm:mb-5">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl text-pine sm:text-5xl">
            نجات <span className="text-river">مزرعه</span>!
          </h1>
          <p className="mt-1.5 max-w-xl text-[0.9rem] leading-7 text-ink-soft sm:text-base">
            آب باران قطع شده است! با پهپاد سطل‌دار حرکت کن، قطره‌های آب را بگیر و
            رطوبت مزرعه را تا {faNum(100)}٪ برسان — مراقب لوله‌های پوسیده باش!
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-2 rounded-xl border border-wheat/50 bg-wheat-soft px-3 py-2 text-xs font-black text-wheat-deep sm:px-3.5 sm:text-sm">
            <IconTrophy size={16} />
            رکورد تو: {faNum(best)}
          </span>
          {playing && (
            <button
              onClick={() => (phase === "paused" ? game.resume() : game.pause())}
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition-all active:scale-90 sm:h-10 sm:w-10",
                phase === "paused" ? "border-leaf/40 bg-leaf-soft text-leaf-deep" : "border-ink/12 bg-parchment text-ink hover:border-pine/40"
              )}
              aria-label={phase === "paused" ? "ادامه بازی" : "توقف بازی"}
            >
              {phase === "paused" ? <IconPlay size={17} /> : <IconPause size={17} />}
            </button>
          )}
          <button
            onClick={game.toggleMute}
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition-all active:scale-90 sm:h-10 sm:w-10",
              muted ? "border-clay/40 bg-clay-soft text-clay" : "border-ink/12 bg-parchment text-ink hover:border-pine/40"
            )}
            aria-label={muted ? "رو کردن صدا" : "خاموش کردن صدا"}
          >
            {muted ? <IconVolumeOff size={18} /> : <IconVolume size={18} />}
          </button>
        </div>
      </div>

      {/* قاب بازی */}
      <div className="fade-up overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(20,54,41,0.5)] ring-1 ring-ink/10" style={{ animationDelay: "0.1s" }}>
        {/* نوار وضعیت */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-pine px-3 py-2.5 text-cream sm:gap-x-5 sm:px-6 sm:py-3">
          <div className="flex items-center gap-2">
            <IconTarget size={17} className="text-wheat" />
            <span className="text-[0.7rem] font-bold text-cream/70 sm:text-xs">امتیاز</span>
            <span ref={game.scoreRef} className="min-w-8 font-display text-xl text-wheat sm:min-w-10 sm:text-2xl">{faNum(0)}</span>
            {streak >= 3 && (
              <span className="pop-in rounded-lg bg-wheat/20 px-2 py-0.5 text-[0.68rem] font-black text-wheat">
                زنجیره {faNum(streak)}
              </span>
            )}
          </div>
          <div className="flex min-w-[8rem] flex-1 items-center gap-2 sm:min-w-40 sm:gap-2.5">
            <span className="hidden text-[0.7rem] font-bold text-cream/80 sm:inline sm:text-xs">رطوبت مزرعه</span>
            <div className="h-4 flex-1 overflow-hidden rounded-full bg-cream/15">
              <div ref={game.moistBarRef} className="h-full rounded-full bg-gradient-to-l from-river to-leaf" style={{ width: "0%" }} />
            </div>
            <span ref={game.moistPctRef} className="w-9 text-xs font-black text-river-soft sm:w-10 sm:text-sm">۰٪</span>
          </div>
          <div className="flex items-center gap-0.5" aria-label={`جان‌ها: ${faNum(hearts)} از ۳`}>
            {[0, 1, 2].map((i) => (
              <svg key={i} width="18" height="16" viewBox="0 0 24 22" className={cn("transition-all duration-300 sm:w-5 sm:h-[18px]", i < hearts ? "scale-100 opacity-100" : "scale-75 opacity-25")}>
                <path d="M12 20.5C6 15.5 2 12 2 7.5 2 4.4 4.4 2 7.5 2c1.9 0 3.5 1 4.5 2.5C13 3 14.6 2 16.5 2 19.6 2 22 4.4 22 7.5c0 4.5-4 8-10 13Z" fill="#E4573D" />
              </svg>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-cream">
            <IconClock size={17} className="text-wheat" />
            <span ref={game.timerRef} className="font-display text-xl sm:text-2xl">۱:۰۰</span>
          </div>
        </div>

        {/* بوم + پوشش‌ها */}
        <div className="relative bg-[#9FD3E8]">
          <canvas
            ref={game.canvasRef}
            className={cn(
              "block w-full touch-none select-none",
              /* روی موبایل وقتی بازی در جریان نیست بوم رو جمع می‌کنیم که صفحه پرطول نشه */
              !isMobile || playing ? "" : "hidden"
            )}
            style={{ aspectRatio: "16 / 9" }}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              game.steer(toCanvasX(e));
            }}
            onPointerMove={(e) => {
              if (e.buttons > 0 || e.pointerType === "touch") game.steer(toCanvasX(e));
            }}
          />

          {/* دکمه‌های لمسی موبایل — فقط وسط بازی */}
          {isMobile && phase === "playing" && (
            <>
              <TouchSteer side="left" onPress={(down) => game.setKey("L", down)} />
              <TouchSteer side="right" onPress={(down) => game.setKey("R", down)} />
            </>
          )}

          {phase === "countdown" && <div className="pointer-events-none absolute inset-0" />}

          {!isMobile && phase === "ready" && <Overlay>{readyContent}</Overlay>}
          {!isMobile && (phase === "won" || phase === "lost") && <Overlay>{resultContent}</Overlay>}
          {phase === "paused" && (
            <Overlay>
              <h2 className="font-display text-4xl text-pine">یک نفس تازه کن!</h2>
              <p className="mt-2 text-sm font-bold text-ink-soft">هر وقت آماده بودی ادامه بده.</p>
              <button onClick={game.resume} className={bigBtn}>
                <IconPlay size={20} />
                ادامه بازی
              </button>
            </Overlay>
          )}

          {/* موبایل: پنل‌ها به‌جای اورلی، کارت معمولی زیر بوم */}
          {isMobile && !playing && (
            <div className="fade-in bg-parchment px-4 py-6">
              <div className="mx-auto flex w-full max-w-sm flex-col items-center">
                {phase === "ready" ? readyContent : resultContent}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="fade-up mt-4 text-center text-xs leading-6 text-ink-soft" style={{ animationDelay: "0.2s" }}>
        هر قطره‌ی طلایی امتیاز بیشتری دارد و زنجیره‌ی گرفتنِ پشت‌سرهم، امتیاز اضافی می‌دهد.
        {isMobile ? "" : " با کلید P بازی متوقف می‌شود."}
      </p>

      <GameBoard highlightId={lastEntryId} />
    </div>
  );

  function toCanvasX(e: React.PointerEvent): number {
    const canvas = e.currentTarget as HTMLElement;
    const r = canvas.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * 960;
  }
}

const bigBtn =
  "mx-auto mt-4 flex items-center gap-2.5 rounded-2xl bg-pine px-6 py-3.5 text-base font-black text-cream shadow-[0_18px_34px_-16px_rgba(20,54,41,0.85)] transition-all hover:-translate-y-0.5 hover:bg-pine-deep active:translate-y-0 sm:mt-6 sm:px-8 sm:py-4 sm:text-lg";

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fade-in nice-scroll absolute inset-0 flex flex-col items-center justify-center overflow-y-auto bg-parchment/85 px-4 py-6 backdrop-blur-[3px]">
      <div className="my-auto flex w-full flex-col items-center">{children}</div>
    </div>
  );
}

// دکمه‌های لمسی چپ/راست برای موبایل — بزرگ که انگشت راحت باشه
function TouchSteer({ side, onPress }: { side: "left" | "right"; onPress: (down: boolean) => void }) {
  const stop = (down: boolean) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPress(down);
  };
  return (
    <button
      aria-label={side === "left" ? "حرکت به چپ" : "حرکت به راست"}
      className={cn(
        "absolute bottom-3 z-10 grid h-16 w-16 touch-none select-none place-items-center rounded-full bg-ink/25 text-cream ring-1 ring-cream/40 backdrop-blur-[2px] transition-transform active:scale-90 active:bg-ink/40",
        side === "left" ? "left-3" : "right-3"
      )}
      onPointerDown={stop(true)}
      onPointerUp={stop(false)}
      onPointerCancel={stop(false)}
      onPointerLeave={stop(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {side === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );
}

function Legend({ color, label, icon }: { color: string; label: string; icon: "drop" | "star" | "warn" }) {
  return (
    <span className="flex items-center gap-2 rounded-xl border border-ink/10 bg-parchment px-3 py-1.5 text-xs font-black text-ink">
      <span className={cn("grid h-6 w-6 place-items-center rounded-lg text-cream", color)}>
        {icon === "drop" && (
          <svg width="13" height="15" viewBox="0 0 24 28" fill="currentColor"><path d="M12 1s10 11 10 17.5A10 10 0 0 1 2 18.5C2 12 12 1 12 1Z" /></svg>
        )}
        {icon === "star" && <IconSparkle size={14} />}
        {icon === "warn" && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 10v4M12 17h.01" /></svg>
        )}
      </span>
      {label}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/8 bg-parchment px-2 py-3">
      <p className="font-display text-3xl leading-none text-pine">{value}</p>
      <p className="mt-1 text-[0.68rem] font-black text-ink-soft">{label}</p>
    </div>
  );
}
import { supabase } from '../supabase';

// این تابع برای ثبت امتیاز است
const saveScoreToDatabase = async (username: string, score: number, type: 'game' | 'quiz') => {
  const { error } = await supabase
    .from('leaderboard')
    .insert([{ username, score, type }]);

  if (error) {
    console.error('خطا در ثبت امتیاز:', error);
  } else {
    console.log('امتیاز با موفقیت ثبت شد!');
  }
};