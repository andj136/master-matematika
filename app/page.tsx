"use client";

import { useEffect, useMemo, useState } from "react";

type LastResult = {
  id: string;
  score: number;
  total: number;
  percentage: number;
  mode: string;
  area: string;
  bestArea: string;
  weakestArea: string;
  gradeLabel: string;
  date: string;
};

const AREAS = [
  "Sve oblasti",
  "Brojevi i operacije",
  "Algebarski izrazi i jednačine",
  "Geometrija",
  "Tekstualni zadaci",
  "Statistika i verovatnoća",
];

export default function Home() {
  const [history, setHistory] = useState<LastResult[]>([]);
  const [selectedArea, setSelectedArea] = useState("Sve oblasti");
  const [customQuestionsCount, setCustomQuestionsCount] = useState(0);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("testHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }

    const custom = localStorage.getItem("customQuestions");
    if (custom) {
      const parsed = JSON.parse(custom);
      setCustomQuestionsCount(parsed.length);
    }

    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const getModeLabel = (mode: string) => {
    if (mode === "easy") return "Laka verzija";
    if (mode === "hard") return "Napredna verzija";
    return "Mešovita verzija";
  };

  const stats = useMemo(() => {
    const totalTests = history.length;
    const bestResult =
      history.length > 0 ? Math.max(...history.map((item) => item.percentage)) : 0;
    const lastResult = history.length > 0 ? history[0].percentage : 0;

    return {
      totalTests,
      bestResult,
      lastResult,
    };
  }, [history]);

  const buildTestLink = (mode: string) => {
    const params = new URLSearchParams();
    params.set("mode", mode);

    if (selectedArea !== "Sve oblasti") {
      params.set("area", selectedArea);
    }

    return `/test?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="sticky top-0 z-20 border-b border-white/40 bg-slate-950/85 backdrop-blur text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-xl">
            Matematički test sistem
          </a>

          <nav className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap justify-end">
            <a
              href="#rezimi"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              Režimi testa
            </a>

            <a
              href="#funkcije"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              Funkcionalnosti
            </a>

            <a
              href="/leaderboard"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              Rang lista
            </a>

            <a
              href="/admin"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              Admin
            </a>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold">
                  👤 {currentUser}
                </div>

                <button
                  onClick={() => {
                    localStorage.removeItem("currentUser");
                    window.location.reload();
                  }}
                  className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                >
                  Odjava
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Prijava
              </a>
            )}
          </nav>
        </div>
      </header>

      <div className="px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <section className="bg-white/90 backdrop-blur rounded-[32px] shadow-2xl border border-white/60 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-14 text-white text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                Digitalna edukativna platforma
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
                Sistem za proveru znanja iz matematike
              </h1>

              <p className="text-base md:text-lg max-w-3xl mx-auto text-white/90 leading-8">
                Web aplikacija za testiranje učenika, automatsko bodovanje,
                analizu uspešnosti po oblastima, filtriranje zadataka po oblasti
                i generisanje preporuke za dalje vežbanje.
              </p>
            </div>

            <div className="p-8 md:p-10">
              <div className="grid md:grid-cols-4 gap-4 mb-10">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 mb-2">Ukupno testova</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.totalTests}
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 mb-2">Najbolji rezultat</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.bestResult}%
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 mb-2">Poslednji rezultat</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.lastResult}%
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 mb-2">Dodata pitanja</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {customQuestionsCount}
                  </p>
                </div>
              </div>

              {history.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Istorija poslednjih rezultata
                    </h2>

                    <button
                      onClick={() => {
                        localStorage.removeItem("testHistory");
                        setHistory([]);
                      }}
                      className="text-sm bg-slate-200 hover:bg-slate-300 transition px-4 py-2 rounded-full"
                    >
                      Obriši istoriju
                    </button>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 rounded-3xl p-5 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                            {getModeLabel(item.mode)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.date}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {item.percentage}% · {item.gradeLabel}
                        </h3>

                        <p className="text-slate-600 mb-1">
                          Rezultat: {item.score}/{item.total}
                        </p>

                        <p className="text-slate-600 mb-1">
                          Oblast: {item.area}
                        </p>

                        <p className="text-slate-600 mb-1">
                          Najjača oblast: {item.bestArea}
                        </p>

                        <p className="text-slate-600">
                          Oblast za rad: {item.weakestArea}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Izaberi oblast
                </h2>

                <div className="flex flex-wrap gap-3">
                  {AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={`px-4 py-2 rounded-full border transition ${
                        selectedArea === area
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div id="rezimi" className="grid lg:grid-cols-3 gap-6 mb-10">
                <a
                  href={buildTestLink("easy")}
                  className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                      Laka verzija
                    </span>
                    <span className="text-2xl group-hover:scale-110 transition">
                      🌱
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    Osnovni test
                  </h2>

                  <p className="text-slate-600 leading-7 mb-5">
                    Test za brzu proveru osnovnog znanja kroz lakša pitanja.
                  </p>

                  <div className="text-sm text-slate-500 space-y-2">
                    <p>• 8 pitanja</p>
                    <p>• 10 minuta</p>
                    <p>• filtriranje po oblasti</p>
                  </div>
                </a>

                <a
                  href={buildTestLink("mixed")}
                  className="group bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all relative"
                >
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow">
                    Preporučeno
                  </div>

                  <div className="flex items-center justify-between mb-5 mt-2">
                    <span className="inline-flex px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                      Mešovita verzija
                    </span>
                    <span className="text-2xl group-hover:scale-110 transition">
                      ⭐
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    Standardni test
                  </h2>

                  <p className="text-slate-600 leading-7 mb-5">
                    Kombinacija lakih, srednjih i težih zadataka.
                  </p>

                  <div className="text-sm text-slate-500 space-y-2">
                    <p>• 12 pitanja</p>
                    <p>• 15 minuta</p>
                    <p>• analiza po oblastima</p>
                  </div>
                </a>

                <a
                  href={buildTestLink("hard")}
                  className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                      Napredna verzija
                    </span>
                    <span className="text-2xl group-hover:scale-110 transition">
                      🚀
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    Napredni test
                  </h2>

                  <p className="text-slate-600 leading-7 mb-5">
                    Veći udeo zahtevnijih zadataka za detaljniju procenu.
                  </p>

                  <div className="text-sm text-slate-500 space-y-2">
                    <p>• 15 pitanja</p>
                    <p>• 20 minuta</p>
                    <p>• zahtevniji nivo</p>
                  </div>
                </a>
              </div>

              <div id="funkcije" className="grid lg:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-5">
                    Ključne funkcionalnosti
                  </h2>

                  <div className="grid gap-4 text-slate-700">
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      Automatski izbor pitanja iz više matematičkih oblasti
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      Filtriranje testa po oblasti
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      Odbrojavanje vremena tokom rešavanja
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      Pregled tačnih i netačnih odgovora
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      Grafikon uspeha po oblastima
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      Preuzimanje izveštaja i čuvanje PDF-a
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
                  <h2 className="text-2xl font-semibold mb-5">O aplikaciji</h2>

                  <p className="text-white/90 leading-8 mb-6">
                    Ova aplikacija predstavlja prototip sistema za digitalnu
                    proveru znanja iz matematike. Sistem omogućava testiranje,
                    analitiku rezultata, pregled istorije i lokalni unos novih
                    pitanja preko administratorske strane.
                  </p>

                  <div className="space-y-4 text-white/90">
                    <div className="bg-white/10 rounded-2xl p-4">
                      <span className="font-semibold text-white">
                        Adaptivan pristup:
                      </span>{" "}
                      test može biti lak, mešovit ili napredan.
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4">
                      <span className="font-semibold text-white">
                        Analitički deo:
                      </span>{" "}
                      sistem prikazuje najjače i najslabije oblasti učenika.
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4">
                      <span className="font-semibold text-white">
                        Proširivost:
                      </span>{" "}
                      nova pitanja mogu se unositi kroz admin formu.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}