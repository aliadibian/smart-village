import { useRef, useState } from "react";
import { supabase } from '../supabase';
import { QUIZ, QUIZ_POINTS, QUIZ_TOTAL } from "../data/quiz";
import { leaderboard, type ScoreEntry } from "../lib/storage";
import {
  getAttempt,
  isNameUsed,
  isValidName,
  startAttempt,
  completeAttempt,
  remoteApiBase,
  type AttemptRecord,
} from "../lib/attemptGate";
import { faNum, faTime, faPercent } from "../lib/fa";
import Leaderboard from "../components/Leaderboard";
import { Confetti, ScoreDial } from "../components/quiz/QuizBits";
import { TeacherPanel } from "../components/quiz/TeacherPanel";
import { Logo } from "../components/Nav";
import {
  IconCheck,
  IconClose,
  IconSparkle,
  IconClock,
  IconTrophy,
  IconChevronLeft,
  IconUsers,
  IconTarget,
  IconAlert,
  IconLock,
} from "../components/icons";
import { cn } from "../utils/cn";

type Phase = "name" | "confirm" | "quiz" | "result" | "board" | "blocked";

const LETTERS = ["الف", "ب", "ج", "د"];

function findRank(entries: ScoreEntry[], a: AttemptRecord | null): number | null {
  if (!a) return null;
  const i = entries.findIndex((e) => e.name === a.name && e.score === a.score && e.timeMs === a.timeMs);
  return i >= 0 ? i + 1 : null;
}

function RankBadge({ rank }: { rank: number | null }) {
  if (rank === null) return null;
  const style =
    rank === 1
      ? "bg-wheat text-pine-deep"
      : rank <= 3
        ? "bg-leaf text-cream"
        : "bg-ink/8 text-ink";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-black", style)}>
      <IconTrophy size={15} />
      رتبه‌ی {faNum(rank)} از {faNum(leaderboard.list().length)}
    </span>
  );
}

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>(() => (getAttempt() ? "blocked" : "name"));
  const [attempt, setAttempt] = useState<AttemptRecord | null>(() => getAttempt());

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [starting, setStarting] = useState(false);
  const [gateError, setGateError] = useState("");

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastEntry, setLastEntry] = useState<ScoreEntry | null>(null);
  const [entries, setEntries] = useState<ScoreEntry[]>(() => leaderboard.list());

  const startRef = useRef(0);
  const submittedRef = useRef(false);

  const q = QUIZ[qIndex];
  const answered = selected !== null;
  const score = correctCount * QUIZ_POINTS;
  const finished = attempt?.status === "completed" ? attempt : null;
  const rank = findRank(entries, finished ?? attempt);

  const validateName = (raw: string): string => {
    const value = raw.trim();
    if (!value) return "لطفاً اول نام خود را وارد کن";
    if (!isValidName(value)) return "نام باید بین ۲ تا ۲۴ نویسه باشد";
    if (isNameUsed(value)) return "این نام قبلاً در این دستگاه ثبت شده است";
    return "";
  };

  const goConfirm = () => {
    const err = validateName(name);
    setNameError(err);
    if (!err) setPhase("confirm");
  };

  const beginQuiz = async () => {
    if (starting) return;
    const err = validateName(name);
    setNameError(err);
    if (err) {
      setPhase("name");
      return;
    }
    setStarting(true);
    setGateError("");
    const res = await startAttempt(name);
    setStarting(false);

    if (!res.ok) {
      if (res.reason === "ip_used") setGateError("از این اتصال اینترنتی قبلاً در مسابقه شرکت شده است.");
      else if (res.reason === "browser_used") {
        setAttempt(res.attempt ?? getAttempt());
        setPhase("blocked");
        return;
      } else setGateError("این نام قبلاً ثبت شده است؛ نام دیگری وارد کن.");
      setPhase("name");
      return;
    }

    setAttempt(res.attempt ?? null);
    setQIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setLastEntry(null);
    submittedRef.current = false;
    startRef.current = Date.now();
    setPhase("quiz");
  };

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    if (i === q.correct) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (!answered) return;
    if (qIndex < QUIZ.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      return;
    }
    if (submittedRef.current) return;
    submittedRef.current = true;

    const finalCorrect = correctCount;
    const finalScore = finalCorrect * QUIZ_POINTS;
    const finalTime = Date.now() - startRef.current;

    supabase.from('leaderboard').insert([
      { username: name, score: finalScore, type: 'quiz' }
    ]).then(({ error }) => {
      if (error) console.error('خطا در ثبت امتیاز کوییز:', error);
    });

    const record = completeAttempt(finalScore, finalCorrect, finalTime);
    setAttempt(record);

    try {
      const entry = leaderboard.add({ name, score: finalScore, correct: finalCorrect, timeMs: finalTime });
      setLastEntry(entry);
    } catch {
      /* اگه localStorage در دسترس نبود، صفحه‌ی نتیجه بازم کار می‌کنه */
    }
    setEntries(leaderboard.list());
    setPhase("result");
  };

  const message =
    score === 100
      ? "بی‌نقص! تو افسانه‌ی سواد فناورانه‌ی این روستایی."
      : score >= 70
        ? "آفرین! سواد فناورانه را خوب فهمیدی."
        : score >= 40
          ? "خوب بود؛ با مرور روستای هوشمند، عالی می‌شوی."
          : "اشکالی ندارد؛ روستا را بکاوش و دوباره نگاه کن!";

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6">
      {/* از قبل بازی کرده */}
      {phase === "blocked" && (
        <div className="pop-in mx-auto max-w-xl">
          <div className="rounded-3xl border border-ink/8 bg-parchment p-5 text-center shadow-[0_30px_60px_-35px_rgba(20,54,41,0.5)] sm:p-8">
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-wheat-soft text-wheat-deep">
              <IconLock size={30} />
            </span>
            <h1 className="font-display text-3xl leading-tight text-pine sm:text-4xl">تلاش تو ثبت شده است</h1>
            <p className="mx-auto mt-2 max-w-md text-[0.95rem] leading-7 text-ink-soft">
              هر کاربر فقط یک بار می‌تواند در این مسابقه شرکت کند — و همین دستگاه/اتصال
              قبلاً استفاده شده است.
            </p>

            {attempt && (
              <div className="mt-6 rounded-2xl border border-ink/8 bg-cream/60 p-5 text-right">
                <p className="text-xs font-black text-ink-soft">نتیجه‌ی ثبت‌شده</p>
                <p className="mt-1 font-display text-2xl text-ink">{attempt.name}</p>
                {attempt.status === "completed" ? (
                  <>
                    <div className="mt-4 grid grid-cols-3 gap-2.5">
                      <div className="rounded-xl bg-leaf-soft px-2 py-3">
                        <p className="font-display text-2xl text-leaf-deep">{faNum(attempt.score)}</p>
                        <p className="text-[0.65rem] font-black text-ink-soft">امتیاز</p>
                      </div>
                      <div className="rounded-xl bg-river-soft px-2 py-3">
                        <p className="font-display text-2xl text-river-deep">{faNum(attempt.correct)}/{faNum(QUIZ.length)}</p>
                        <p className="text-[0.65rem] font-black text-ink-soft">پاسخ درست</p>
                      </div>
                      <div className="rounded-xl bg-wheat-soft px-2 py-3">
                        <p className="font-display text-2xl text-wheat-deep">{faTime(attempt.timeMs)}</p>
                        <p className="text-[0.65rem] font-black text-ink-soft">زمان</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <RankBadge rank={findRank(leaderboard.list(), attempt)} />
                    </div>
                  </>
                ) : (
                  <p className="mt-3 flex items-start gap-2 rounded-xl bg-clay-soft px-3.5 py-3 text-xs font-bold leading-6 text-clay-deep">
                    <IconAlert size={16} className="mt-0.5 shrink-0" />
                    آزمون شما نیمه‌کاره رها شد؛ چون قفل از لحظه‌ی شروع فعال می‌شود، این تلاش
                    با امتیاز {faNum(0)} ثبت شده است.
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setEntries(leaderboard.list());
                setPhase("board");
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-pine px-6 py-4 text-base font-black text-cream shadow-[0_16px_30px_-14px_rgba(20,54,41,0.8)] transition-all hover:-translate-y-0.5 hover:bg-pine-deep"
            >
              <IconTrophy size={19} />
              مشاهده‌ی جدول امتیازات
            </button>

            <TeacherPanel
              onReset={() => {
                const a = getAttempt();
                setAttempt(a);
                setEntries(leaderboard.list());
                if (!a) setPhase("name");
              }}
            />
          </div>
        </div>
      )}

      {/* گرفتن اسم */}
      {phase === "name" && (
        <div className="pop-in mx-auto max-w-xl">
          <div className="rounded-3xl border border-ink/8 bg-parchment p-5 text-center shadow-[0_30px_60px_-35px_rgba(20,54,41,0.5)] sm:p-10">
            <div className="mb-5 flex justify-center">
              <Logo />
            </div>
            <h1 className="font-display text-3xl text-pine sm:text-4xl">مسابقه‌ی دانایی</h1>
            <p className="mx-auto mt-2 max-w-md text-[0.95rem] leading-7 text-ink-soft">
              {faNum(QUIZ.length)} سؤال درباره‌ی نقش سواد فناورانه در زندگی روستایی؛ هر پاسخ درست{" "}
              {faNum(QUIZ_POINTS)} امتیاز.
            </p>

            {/* single-attempt notice */}
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-wheat/40 bg-wheat-soft px-4 py-3.5 text-right">
              <IconLock size={19} className="mt-0.5 shrink-0 text-wheat-deep" />
              <p className="text-[0.82rem] font-bold leading-6 text-wheat-deep">
                هر کاربر فقط <span className="underline decoration-wheat decoration-2 underline-offset-4">یک بار</span> می‌تواند
                شرکت کند. قفل از لحظه‌ی شروع فعال می‌شود، پس وقتی مطمئنی شروع کن!
              </p>
            </div>
            <p className="mt-2.5 text-[0.68rem] font-bold leading-5 text-ink-soft/80">
              {remoteApiBase()
                ? "محدودیت یک‌بار شرکت کردن روی سرور و بر اساس IP اتصال نیز بررسی می‌شود."
                : "این نسخه هر مرورگر/دستگاه را یک تلاش می‌شمارد (نسخه‌ی بدون سرور)."}
            </p>

            <div className="mx-auto mt-6 max-w-sm text-right">
              <label htmlFor="player-name" className="mb-2 block text-sm font-black text-ink">
                نام و نام خانوادگی
              </label>
              <input
                id="player-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && goConfirm()}
                maxLength={24}
                placeholder="مثلاً: سارا محمدی"
                className={cn(
                  "w-full rounded-2xl border-2 bg-cream/60 px-5 py-3.5 text-base font-bold text-ink outline-none transition-all placeholder:font-medium placeholder:text-ink-soft/50",
                  nameError ? "shake-x border-clay" : "border-ink/10 focus:border-pine"
                )}
              />
              {nameError && (
                <p className="mt-2 text-xs font-black text-clay">{nameError}</p>
              )}
              {gateError && (
                <p className="mt-2 flex items-start gap-1.5 text-xs font-black leading-6 text-clay">
                  <IconAlert size={14} className="mt-0.5 shrink-0" />
                  {gateError}
                </p>
              )}
            </div>

            <button
              onClick={goConfirm}
              className="mt-6 w-full rounded-2xl bg-pine px-6 py-4 text-lg font-black text-cream shadow-[0_16px_30px_-14px_rgba(20,54,41,0.8)] transition-all hover:-translate-y-0.5 hover:bg-pine-deep active:translate-y-0 active:scale-[0.99]"
            >
              ادامه
            </button>
            <button
              onClick={() => {
                setEntries(leaderboard.list());
                setPhase("board");
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-cream/50 px-6 py-3 text-sm font-black text-ink-soft transition-all hover:border-pine/30 hover:text-pine"
            >
              <IconTrophy size={17} />
              مشاهده‌ی جدول امتیازات فعلی
            </button>
            <p className="mt-4 text-[0.7rem] leading-5 text-ink-soft/80">
              فقط نام نمایشی لازم است؛ هیچ اطلاعات دیگری جمع نمی‌شود.
            </p>
          </div>
        </div>
      )}

      {/* تأیید قبل از قفل شدن */}
      {phase === "confirm" && (
        <div className="pop-in mx-auto max-w-lg">
          <div className="overflow-hidden rounded-3xl border border-ink/8 bg-parchment shadow-[0_30px_60px_-35px_rgba(20,54,41,0.5)]">
            <div className="bg-pine px-6 py-5 text-cream sm:px-8">
              <p className="text-xs font-bold text-cream/70">آماده‌ی شروع؟</p>
              <h2 className="mt-0.5 font-display text-3xl">{name}</h2>
            </div>
            <div className="px-6 py-6 sm:px-8">
              <ul className="space-y-2.5 text-right">
                {[
                  `${faNum(QUIZ.length)} سؤال چهارگزینه‌ای`,
                  `هر پاسخ درست ${faNum(QUIZ_POINTS)} امتیاز — بیشینه‌ی ${faNum(QUIZ_TOTAL)}`,
                  "پس از انتخاب گزینه، پاسخ قابل تغییر نیست",
                  "امتیاز و زمان، هر دو در رتبه‌بندی مؤثرند",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[0.9rem] font-bold leading-7 text-ink/85">
                    <span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf/20 text-leaf-deep">
                      <IconCheck size={12} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-clay/30 bg-clay-soft px-4 py-3.5">
                <IconAlert size={19} className="mt-0.5 shrink-0 text-clay" />
                <p className="text-[0.82rem] font-bold leading-6 text-clay-deep">
                  با زدن دکمه‌ی شروع، تلاش شما ثبت می‌شود و راهی برای شرکت دوباره وجود نخواهد داشت.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={beginQuiz}
                  disabled={starting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-pine px-5 py-4 text-base font-black text-cream shadow-[0_14px_26px_-14px_rgba(20,54,41,0.8)] transition-all hover:-translate-y-0.5 hover:bg-pine-deep disabled:opacity-60"
                >
                  {starting ? "در حال ثبت..." : <>شروع آزمون <IconChevronLeft size={18} /></>}
                </button>
                <button
                  onClick={() => setPhase("name")}
                  disabled={starting}
                  className="flex-1 rounded-2xl border border-ink/12 bg-cream/50 px-5 py-4 text-base font-black text-ink transition-all hover:border-pine/40 hover:bg-leaf-soft/50 disabled:opacity-60"
                >
                  ویرایش نام
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* خودِ مسابقه */}
      {phase === "quiz" && (
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between gap-2">
            <span className="rounded-xl bg-pine px-3.5 py-1.5 text-sm font-black text-cream">
              سؤال {faNum(qIndex + 1)} از {faNum(QUIZ.length)}
            </span>
            <span className="flex items-center gap-3 text-sm font-black text-ink-soft">
              <span className="hidden items-center gap-1.5 sm:flex">
                <IconUsers size={16} className="text-pine" />
                {name}
              </span>
              <span className="flex items-center gap-1.5">
                <IconTarget size={16} className="text-leaf" />
                {faNum(score)} امتیاز
              </span>
            </span>
          </div>
          <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-ink/8">
            <div
              className="h-full rounded-full bg-gradient-to-l from-leaf to-river transition-all duration-700 ease-out"
              style={{ width: `${((qIndex + (answered ? 1 : 0.2)) / QUIZ.length) * 100}%` }}
            />
          </div>

          <div key={qIndex} className="q-in">
            <div className="rounded-3xl border border-ink/8 bg-parchment p-6 shadow-[0_24px_50px_-32px_rgba(20,54,41,0.5)] sm:p-8">
              <p className="mb-2 inline-block rounded-full bg-wheat-soft px-3 py-1 text-xs font-black text-wheat-deep">{q.topic}</p>
              <h2 className="text-xl font-black leading-9 text-ink sm:text-[1.4rem] sm:leading-[2.1rem]">{q.question}</h2>

              <div className="mt-6 grid gap-3">
                {q.choices.map((choice, i) => {
                  const isCorrect = i === q.correct;
                  const isPicked = selected === i;
                  const state = !answered ? "idle" : isCorrect ? "correct" : isPicked ? "wrong" : "dim";
                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      disabled={answered}
                      className={cn(
                        "group flex items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 text-right text-[0.95rem] font-bold leading-7 transition-all duration-300",
                        state === "idle" &&
                          "border-ink/10 bg-cream/40 text-ink hover:-translate-y-0.5 hover:border-pine/50 hover:bg-parchment hover:shadow-md active:translate-y-0",
                        state === "correct" && "border-leaf bg-leaf-soft text-leaf-deep shadow-[0_10px_24px_-14px_rgba(53,112,74,0.6)]",
                        state === "wrong" && "shake-x border-clay bg-clay-soft text-clay-deep",
                        state === "dim" && "border-ink/8 bg-cream/30 text-ink-soft/60"
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black transition-colors",
                          state === "idle" && "bg-ink/8 text-ink-soft group-hover:bg-pine group-hover:text-cream",
                          state === "correct" && "bg-leaf text-cream",
                          state === "wrong" && "bg-clay text-cream",
                          state === "dim" && "bg-ink/5 text-ink-soft/50"
                        )}
                      >
                        {state === "correct" ? <IconCheck size={17} /> : state === "wrong" ? <IconClose size={17} /> : LETTERS[i]}
                      </span>
                      {choice}
                    </button>
                  );
                })}
              </div>
            </div>

            {answered && (
              <div className="q-in mt-4 rounded-3xl border border-river/25 bg-river-soft/70 p-5 sm:p-6" style={{ animationDelay: "0.12s" }}>
                <div className="flex items-start gap-3">
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl text-cream", selected === q.correct ? "bg-leaf" : "bg-clay")}>
                    {selected === q.correct ? <IconCheck size={20} /> : <IconClose size={20} />}
                  </span>
                  <div className="flex-1">
                    <p className={cn("text-base font-black", selected === q.correct ? "text-leaf-deep" : "text-clay-deep")}>
                      {selected === q.correct ? "درست است! " : "کمی دیگر..."}
                      <span className="text-sm font-bold text-ink-soft">
                        {selected === q.correct ? `${faNum(QUIZ_POINTS)} امتیاز گرفتی` : "پاسخ درست، سبز شده است"}
                      </span>
                    </p>
                    <p className="mt-1.5 text-[0.9rem] leading-7 text-ink/80">{q.explain}</p>
                  </div>
                </div>
                <button
                  onClick={next}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-pine px-6 py-3.5 text-base font-black text-cream shadow-[0_14px_26px_-14px_rgba(20,54,41,0.8)] transition-all hover:-translate-y-0.5 hover:bg-pine-deep active:translate-y-0"
                >
                  {qIndex < QUIZ.length - 1 ? <>سؤال بعدی <IconChevronLeft size={18} /></> : <>مشاهده‌ی نتیجه <IconTrophy size={18} /></>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* نتیجه (بدون تلاش دوباره) */}
      {phase === "result" && (
        <div className="space-y-8">
          {score >= 60 && <Confetti />}
          <div className="pop-in rounded-3xl border border-ink/8 bg-parchment p-5 text-center shadow-[0_30px_60px_-35px_rgba(20,54,41,0.5)] sm:p-8">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-wheat-soft text-wheat-deep">
              <IconSparkle size={30} />
            </span>
            <h2 className="font-display text-3xl text-pine sm:text-4xl">مسابقه تمام شد!</h2>
            <p className="mt-1 text-sm font-bold text-ink-soft">{name} عزیز، نتیجه‌ی تو:</p>

            <div className="mt-6">
              <ScoreDial score={score} />
            </div>
            <p className="mt-4 text-lg font-black text-ink">{message}</p>

            <div className="mt-4 flex justify-center">
              <RankBadge rank={rank} />
            </div>

            <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
              <div className="rounded-2xl bg-leaf-soft px-3 py-3.5">
                <p className="font-display text-2xl text-leaf-deep">{faNum(correctCount)}<span className="text-sm">/{faNum(QUIZ.length)}</span></p>
                <p className="mt-0.5 text-[0.7rem] font-black text-ink-soft">پاسخ درست</p>
              </div>
              <div className="rounded-2xl bg-river-soft px-3 py-3.5">
                <p className="font-display text-2xl text-river-deep">{faPercent((score / QUIZ_TOTAL) * 100)}</p>
                <p className="mt-0.5 text-[0.7rem] font-black text-ink-soft">درصد موفقیت</p>
              </div>
              <div className="rounded-2xl bg-wheat-soft px-3 py-3.5">
                <p className="font-display text-2xl text-wheat-deep">{faTime(attempt?.timeMs ?? 0)}</p>
                <p className="mt-0.5 flex items-center justify-center gap-1 text-[0.7rem] font-black text-ink-soft"><IconClock size={12} />زمان</p>
              </div>
            </div>

            <div className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setEntries(leaderboard.list());
                  setPhase("board");
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-pine px-5 py-3.5 text-base font-black text-cream shadow-[0_14px_26px_-14px_rgba(20,54,41,0.8)] transition-all hover:-translate-y-0.5 hover:bg-pine-deep active:translate-y-0"
              >
                <IconTrophy size={18} />
                جدول امتیازات
              </button>
              <button
                onClick={() => setPhase("blocked")}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-ink/12 bg-cream/50 px-5 py-3.5 text-base font-black text-ink transition-all hover:border-pine/40 hover:bg-leaf-soft/50"
              >
                <IconLock size={18} />
                تلاش من ثبت شد
              </button>
            </div>

            <p className="mt-4 text-[0.72rem] leading-6 text-ink-soft">
              هر کاربر فقط یک بار شرکت می‌کند. برای ثبت نتیجه‌ی کاربر بعدی، این صفحه را در دستگاه او باز کنید.
            </p>
          </div>

          <Leaderboard type="quiz" />
        </div>
      )}

      {/* جدول امتیاز */}
      {phase === "board" && (
        <div className="mx-auto max-w-3xl space-y-4">
          <button
            onClick={() => setPhase(getAttempt() ? "blocked" : "name")}
            className="flex items-center gap-1.5 rounded-xl border border-ink/12 bg-parchment px-4 py-2.5 text-sm font-black text-ink transition-all hover:border-pine/40 hover:bg-leaf-soft active:scale-95"
          >
            <span className="rotate-180"><IconChevronLeft size={16} /></span>
            بازگشت
          </button>
          <Leaderboard type="quiz" />
          {getAttempt() && (
            <TeacherPanel
              onReset={() => {
                setAttempt(getAttempt());
                setEntries(leaderboard.list());
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}