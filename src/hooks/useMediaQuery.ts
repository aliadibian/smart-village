import { useEffect, useState } from "react";

// یک هوک ساده برای media query — جاهایی که رفتار صفحه باید با عرض صفحه عوض بشه
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

// موبایل کوچیک — برای چیدمان‌های تک‌ستونه
export const useIsMobile = () => useMediaQuery("(max-width: 639px)");
