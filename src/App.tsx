import { useEffect, useState } from "react";
import Nav, { type PageId } from "./components/Nav";
import VillagePage from "./pages/VillagePage";
import QuizPage from "./pages/QuizPage";
import GamePage from "./pages/GamePage";

const VALID: PageId[] = ["village", "quiz", "game"];

// صفحه‌ی فعلی رو از hash می‌خونیم — تا لینک هر بخش قابل اشتراک باشه
function pageFromHash(): PageId {
  const h = window.location.hash.replace("#", "") as PageId;
  return VALID.includes(h) ? h : "village";
}

export default function App() {
  const [page, setPage] = useState<PageId>(() => pageFromHash());

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (p: PageId) => {
    setPage(p);
    if (pageFromHash() !== p) window.location.hash = p;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [page]);

  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <Nav page={page} onNavigate={navigate} />
      <main key={page} className="page-in">
        {page === "village" && <VillagePage />}
        {page === "quiz" && <QuizPage />}
        {page === "game" && <GamePage />}
      </main>
      <footer className="border-t border-ink/8 bg-parchment/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-right">
          <p className="text-xs font-bold text-ink-soft">
            پروژه‌ی درسی: نقش سواد فناورانه در زندگی روستایی — روستای هوشمند
          </p>
          <p className="text-[0.72rem] font-black tracking-wide text-pine">
          ❤️🤡 ساخته شده توسط ادیب اسکواد با عشقققق
          </p>
        </div>
      </footer>
    </div>
  );
}
