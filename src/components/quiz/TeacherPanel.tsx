import { useState } from "react";
import {
  resetAttempt,
  resetAll,
  TEACHER_KEY,
} from "../../lib/attemptGate";
import { IconKey } from "../icons";

// پنل بازنشانی برای ارائه‌دهنده — با یک واژه‌ی ساده باز می‌شه
export function TeacherPanel({ onReset }: { onReset: () => void }) {
  const [open, setOpen] = useState(false);
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);

  const ok = pass.trim() === TEACHER_KEY;

  const doReset = (all: boolean) => {
    if (!ok) return;
    all ? resetAll() : resetAttempt();
    setDone(true);
    setMsg(all ? "همه‌چیز پاک شد." : "قفل تک‌تلاش باز شد (جدول حفظ شد).");
    onReset();
  };

  return (
    <div className="mt-6 rounded-2xl border border-dashed border-ink/15 bg-cream/50 p-4 text-right">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="mx-auto flex items-center gap-1.5 text-[0.72rem] font-bold text-ink-soft transition-colors hover:text-pine"
        >
          <IconKey size={13} />
          بازنشانی آزمون (ویژه‌ی ارائه‌دهنده)
        </button>
      ) : (
        <div className="fade-in space-y-3">
          <p className="text-xs font-black text-ink">
          </p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="واژه‌ی عبور ارائه‌دهنده"
            className={`w-full rounded-xl border-2 bg-parchment px-3.5 py-2.5 text-sm font-bold text-ink outline-none transition-colors ${
              pass && !ok ? "border-clay" : "border-ink/10 focus:border-pine"
            }`}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => doReset(false)}
              disabled={!ok}
              className="flex-1 rounded-xl bg-pine px-3 py-2.5 text-xs font-black text-cream transition-all enabled:hover:bg-pine-deep disabled:opacity-40"
            >
              بازکردن قفل تک‌تلاش
            </button>
            <button
              onClick={() => doReset(true)}
              disabled={!ok}
              className="flex-1 rounded-xl border border-clay/40 bg-clay-soft px-3 py-2.5 text-xs font-black text-clay-deep transition-all enabled:hover:bg-clay/15 disabled:opacity-40"
            >
              پاک کردن کامل جدول و قفل
            </button>
          </div>
          {done && <p className="text-xs font-black text-leaf-deep">{msg}</p>}
          <button onClick={() => setOpen(false)} className="block w-full text-[0.7rem] font-bold text-ink-soft hover:text-ink">
            بستن
          </button>
        </div>
      )}
    </div>
  );
}
