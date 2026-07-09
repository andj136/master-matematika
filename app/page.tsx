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

const GRADES = ["5. razred", "6. razred", "7. razred", "8. razred"];

export default function Home() {
  const [history, setHistory] = useState<LastResult[]>([]);
  const [selectedArea, setSelectedArea] = useState("Sve oblasti");
  const [selectedGrade, setSelectedGrade] = useState("5. razred");
  const [customQuestionsCount, setCustomQuestionsCount] = useState(0);
  const [currentUser, setCurrentUser] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    const role = localStorage.getItem("currentRole");

    if (user) {
      setCurrentUser(user);

      const saved = localStorage.getItem(`testHistory_${user}`);
      setHistory(saved ? JSON.parse(saved) : []);
    } else {
      setHistory([]);
    }

    if (role) setCurrentRole(role);

    const custom = localStorage.getItem("customQuestions");
    if (custom) setCustomQuestionsCount(JSON.parse(custom).length);
  }, []);

  const getModeLabel = (mode: string) => {
    if (mode === "easy") return "Laka verzija";
    if (mode === "hard") return "Napredna verzija";
    return "Mešovita verzija";
  };

  const stats = useMemo(() => {
    const totalTests = history.length;
    const bestResult =
      history.length > 0
        ? Math.max(...history.map((item) => item.percentage))
        : 0;
    const lastResult = history.length > 0 ? history[0].percentage : 0;
    const xp = history.reduce((sum, item) => sum + item.percentage, 0);
    const level = Math.floor(xp / 300) + 1;
    const levelProgress = xp % 300;

    return {
      totalTests,
      bestResult,
      lastResult,
      xp,
      level,
      levelProgress,
    };
  }, [history]);

const buildTestLink = (mode: string) => {
  const params = new URLSearchParams();
  params.set("mode", mode);
  params.set("grade", selectedGrade);

  if (selectedArea !== "Sve oblasti") {
    params.set("area", selectedArea);
  }

  return `/test?${params.toString()}`;
};

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),radial-gradient(circle_at_top_right,#ede9fe,transparent_30%),linear-gradient(135deg,#f8fafc,#eef2ff,#dbeafe)] text-slate-900">
     <header className="sticky top-0 z-30 border-b border-white/30 bg-slate-950/90 text-white backdrop-blur-xl">
  <div className="mx-auto max-w-7xl px-5 py-4">
    <div className="flex items-center justify-between">
      <a href="/" className="text-xl font-black tracking-tight">
        Master<span className="text-blue-300">Matematika</span>
      </a>

      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="rounded-2xl bg-white/10 px-4 py-2 text-xl font-bold md:hidden"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

     <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur md:flex">

  {currentUser ? (
    <>
      <span className="rounded-full bg-white/10 px-5 py-2 font-semibold">
        👤 {currentUser}
      </span>

      <button
        onClick={() => {
          localStorage.removeItem("currentUser");
          localStorage.removeItem("currentRole");
          window.location.reload();
        }}
        className="rounded-full bg-red-500 px-5 py-2 font-bold text-white transition hover:bg-red-600"
      >
        Odjava
      </button>
    </>
  ) : (
    <a
      href="/login"
      className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2 font-bold text-white shadow-lg transition hover:scale-105"
    >
      Prijava
    </a>
  )}

  <a
    href="#testovi"
    className="rounded-full px-5 py-2 font-semibold transition hover:bg-white/10 hover:text-blue-300"
  >
    Testovi
  </a>

  <a
    href="/leaderboard"
    className="rounded-full px-5 py-2 font-semibold transition hover:bg-white/10 hover:text-blue-300"
  >
    Rang lista
  </a>

  <a
    href="/about"
    className="rounded-full px-5 py-2 font-semibold transition hover:bg-white/10 hover:text-blue-300"
  >
    O projektu
  </a>

  {currentRole === "admin" && (
    <a
      href="/admin"
      className="rounded-full bg-amber-500 px-5 py-2 font-bold text-white shadow-lg transition hover:bg-amber-600"
    >
      Admin
    </a>
  )}

</nav>
    </div>

   {menuOpen && (
  <nav className="mt-4 grid gap-2 rounded-3xl border border-white/10 bg-white/10 p-3 md:hidden">
    {currentUser ? (
      <>
        <div className="rounded-2xl bg-white/10 px-4 py-3 font-semibold">
          👤 {currentUser}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("currentRole");
            window.location.reload();
          }}
          className="rounded-2xl bg-red-500 px-4 py-3 text-left font-bold"
        >
          Odjava
        </button>
      </>
    ) : (
      <a href="/login" className="rounded-2xl bg-blue-600 px-4 py-3 font-bold">
        Prijava
      </a>
    )}

    <a href="#testovi" className="rounded-2xl px-4 py-3 font-semibold hover:bg-white/10">
      Testovi
    </a>

    <a href="/leaderboard" className="rounded-2xl px-4 py-3 font-semibold hover:bg-white/10">
      Rang lista
    </a>

    <a href="/about" className="rounded-2xl px-4 py-3 font-semibold hover:bg-white/10">
      O projektu
    </a>

    {currentRole === "admin" && (
      <a href="/admin" className="rounded-2xl bg-amber-500 px-4 py-3 font-bold">
        Admin
      </a>
    )}
  </nav>

    )}
  </div>
</header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
  <div className="text-center md:text-left">
    <div className="mb-5 inline-flex rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur">
      📘 Edukativna web platforma
    </div>

   <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
  Tvoja digitalna učionica
  <br />
  <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
    matematike.
  </span>
</h1>

    <p className="mx-auto mb-6 max-w-xl text-base leading-7 text-slate-600 md:mx-0 md:text-lg md:leading-8">
      Rešavaj interaktivne testove, prati svoj napredak i unapredi znanje iz
      matematike kroz jasnu analizu rezultata.
    </p>

    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
      <a
        href={currentUser ? "#testovi" : "/login"}
        className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-center font-bold text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-1 hover:shadow-2xl md:px-8 md:py-4"
      >
        ▶️ {currentUser ? "Započni test" : "Prijava"}
      </a>

      <a
        href="/leaderboard"
        className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-3 text-center font-bold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg md:px-8 md:py-4"
      >
        🏆 Rang lista
      </a>
    </div>
  </div>

  <div className="relative">
    <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />
    <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl" />

    {currentUser ? (
      <div className="relative rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.16)] backdrop-blur-2xl md:rounded-[40px] md:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Dashboard učenika
            </p>

            <h2 className="text-2xl font-black">
              Zdravo, {currentUser} 👋
            </h2>
          </div>

          <div className="rounded-2xl bg-blue-100 px-4 py-3 text-2xl">
            📊
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Testova</p>
            <p className="text-3xl font-black">{stats.totalTests}</p>
          </div>

          <div className="rounded-3xl bg-blue-50 p-5">
            <p className="text-sm text-slate-500">Najbolji rezultat</p>
            <p className="text-3xl font-black">{stats.bestResult}%</p>
          </div>

          <div className="rounded-3xl bg-violet-50 p-5">
            <p className="text-sm text-slate-500">Poslednji rezultat</p>
            <p className="text-3xl font-black">{stats.lastResult}%</p>
          </div>

          <div className="rounded-3xl bg-emerald-50 p-5">
            <p className="text-sm text-slate-500">Dodata pitanja</p>
            <p className="text-3xl font-black">{customQuestionsCount}</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="relative rounded-[32px] border border-white/70 bg-white/90 p-7 shadow-[0_25px_70px_rgba(15,23,42,0.16)] backdrop-blur-xl md:rounded-[40px] md:p-10">
        <div className="flex min-h-[270px] flex-col items-center justify-center text-center md:min-h-[370px]">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-violet-100 text-4xl md:h-24 md:w-24 md:text-5xl">
            👋
          </div>

          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
            Dobrodošli!
          </h2>

          <p className="mt-4 max-w-md text-base leading-7 text-slate-600 md:text-lg md:leading-8">
            Prijavite se ili kreirajte nalog kako biste pratili rezultate,
            napredak i preporuke za vežbanje.
          </p>

          <a
            href="/login"
            className="mt-7 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-3 font-bold text-white shadow-xl transition hover:-translate-y-1 md:px-8 md:py-4"
          >
            Prijava / Registracija
          </a>
        </div>
      </div>
    )}
  </div>
</section>

      {currentUser && history.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <div className="rounded-[28px] border border-white/20 bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-6 text-white shadow-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-sm font-black uppercase tracking-[0.25em] text-white/70">
                  Preporuka sistema
                </p>

                <h2 className="text-2xl font-black">
                  Sledeće vežbaj: {history[0].weakestArea}
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-white/85">
                  Na osnovu poslednjeg testa, sistem preporučuje dodatno
                  vežbanje oblasti u kojoj je ostvaren najslabiji rezultat.
                </p>
              </div>

              <a
                href={`/test?mode=mixed&area=${encodeURIComponent(
                  history[0].weakestArea
                )}`}
                className="inline-flex justify-center rounded-2xl bg-white px-7 py-4 font-black text-blue-700 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
              >
                Pokreni preporučeni test
              </a>
            </div>
          </div>
        </section>
      )}
    

      <section id="testovi" className="mx-auto max-w-7xl px-5 pb-16">
        
        
        <div className="mb-8 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl">
  <h2 className="mb-4 text-2xl font-black">Izaberi razred</h2>


  <div className="flex flex-wrap gap-3">
   {GRADES.map((grade) => (
  <button
    key={grade}
    type="button"
    onClick={() => setSelectedGrade(grade)}
    className={`rounded-full border px-5 py-3 font-semibold transition ${
      selectedGrade === grade
        ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-500/20"
        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
    }`}
  >
    {grade}
    
  </button>

))}
  </div>
</div>
<div className="mb-8 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl">
  <h2 className="mb-4 text-2xl font-black">Izaberi oblast</h2>

  <div className="flex flex-wrap gap-3">
    {AREAS.map((area) => (
      <button
        key={area}
        type="button"
        onClick={() => setSelectedArea(area)}
        className={`rounded-full border px-5 py-3 font-semibold transition ${
          selectedArea === area
            ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        {area}
      </button>
    ))}
  </div>
</div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              href: buildTestLink("easy"),
              tag: "Laka verzija",
              title: "Osnovni test",
              icon: "🌱",
              desc: "Brza provera osnovnog znanja kroz lakša pitanja.",
              details: ["8 pitanja", "10 minuta", "osnovni nivo"],
            },
            {
              href: buildTestLink("mixed"),
              tag: "Preporučeno",
              title: "Standardni test",
              icon: "⭐",
              desc: "Najbolji izbor za realnu proveru znanja iz više oblasti.",
              details: ["12 pitanja", "15 minuta", "analiza po oblastima"],
              featured: true,
            },
            {
              href: buildTestLink("hard"),
              tag: "Napredna verzija",
              title: "Napredni test",
              icon: "🚀",
              desc: "Zahtevniji zadaci za učenike koji žele viši nivo i ozbiljniju proveru znanja.",
              details: ["15 pitanja", "20 minuta", "teži nivo"],
            },
          ].map((card) => (
          <a
  key={card.title}
  href={currentUser ? card.href : "/login"}
  className={`group relative rounded-[36px] border bg-white/90 p-7 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_30px_80px_rgba(37,99,235,0.18)] ${
    card.featured
      ? "border-blue-300 ring-4 ring-blue-100"
      : "border-white/70"
  }`}
>
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                  {card.tag}
                </span>

                <span className="text-4xl transition group-hover:scale-125">
                  {card.icon}
                </span>
              </div>

              <h3 className="mb-3 text-3xl font-black">{card.title}</h3>

              <p className="mb-6 leading-7 text-slate-600">{card.desc}</p>

              <div className="space-y-3 text-sm font-semibold text-slate-500">
  {card.details.map((detail) => (
    <p key={detail}>✓ {detail}</p>
  ))}
</div>

<div className="mt-8">
  <div className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 py-3 text-center font-bold text-white shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
    🚀 Započni test
  </div>
</div>
            </a>
          ))}
        </div>
      </section>

      {currentUser && (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <div className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-600">Dostignuća</p>
                <h2 className="text-3xl font-black">Bedževi</h2>
              </div>

              <div className="rounded-3xl bg-yellow-100 px-5 py-4 text-3xl">
                🏅
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-500 p-6 text-center text-white shadow-lg">
                <div className="text-5xl">🥇</div>
                <h3 className="mt-3 font-black">Prvi test</h3>
                <p className="text-sm opacity-90">Uspešno završen prvi test.</p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-center text-white shadow-lg">
                <div className="text-5xl">📚</div>
                <h3 className="mt-3 font-black">10 testova</h3>
                <p className="text-sm opacity-90">Rešeno najmanje 10 testova.</p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-center text-white shadow-lg">
                <div className="text-5xl">🏆</div>
                <h3 className="mt-3 font-black">90%+</h3>
                <p className="text-sm opacity-90">Ostvaren rezultat preko 90%.</p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-6 text-center text-white shadow-lg">
                <div className="text-5xl">🔥</div>
                <h3 className="mt-3 font-black">Aktivan učenik</h3>
                <p className="text-sm opacity-90">
                  Kontinuirano rešavanje testova.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {currentUser && history.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <div className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-600">Analitika</p>
                <h2 className="text-3xl font-black">Graf napretka</h2>
              </div>

              <div className="rounded-3xl bg-blue-100 px-5 py-4 text-3xl">
                📈
              </div>
            </div>

            <div className="flex h-64 items-end gap-4 overflow-x-auto rounded-3xl bg-slate-50 p-6">
              {[...history].reverse().map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex min-w-[80px] flex-col items-center"
                >
                  <p className="mb-2 text-sm font-black text-slate-700">
                    {item.percentage}%
                  </p>

                  <div
                    className="w-12 rounded-t-2xl bg-gradient-to-t from-blue-600 to-violet-500 shadow-lg transition-all hover:scale-105"
                    style={{ height: `${Math.max(item.percentage * 2, 12)}px` }}
                  ></div>

                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    Test {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      
      <footer className="border-t border-white/50 bg-white/50 px-5 py-8 text-center text-sm text-slate-500 backdrop-blur-xl">
        <p className="font-semibold text-slate-700">Master Matematika</p>
        <p>
          Edukativna web aplikacija za proveru znanja iz matematike.
          <br />
          Razvijeno u okviru master rada · Fakultet tehničkih nauka · 2026.
        </p>
      </footer>
    </main>
  );
}