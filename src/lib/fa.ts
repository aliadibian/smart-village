// تبدیل ارقام لاتین به فارسی
const toFaDigit = (d: number): string => String.fromCharCode(0x06f0 + d); // ۰..۹

export function faDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => toFaDigit(Number(d)));
}

export function faNum(value: number): string {
  return faDigits(value);
}

// ۲:۳۱ → مثلاً ۱۲۰۰۰۰ میلی‌ثانیه می‌شه ۲:۰۰
export function faTime(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${faDigits(m)}:${faDigits(String(s).padStart(2, "0"))}`;
}

export function faPercent(value: number): string {
  return `${faDigits(Math.round(value))}\u066a`;
}
