export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),radial-gradient(circle_at_top_right,#ede9fe,transparent_30%),linear-gradient(135deg,#f8fafc,#eef2ff,#dbeafe)] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/30 bg-slate-950/85 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="text-xl font-black tracking-tight">
            Master<span className="text-blue-300">Matematika</span>
          </a>

          <a
            href="/"
            className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold transition hover:bg-white/20"
          >
            Početna
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur">
            🎓 O projektu
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Master Matematika
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Edukativna web aplikacija razvijena kao prototip sistema za proveru
            znanja iz matematike, analizu rezultata i praćenje napretka učenika.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur-xl">
            <div className="mb-5 text-5xl">🎯</div>
            <h2 className="mb-3 text-2xl font-black">Cilj aplikacije</h2>
            <p className="leading-7 text-slate-600">
              Cilj sistema je da učenicima omogući jednostavnu proveru znanja,
              a nastavnicima bolji uvid u oblasti koje zahtevaju dodatno vežbanje.
            </p>
          </div>

          <div className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur-xl">
            <div className="mb-5 text-5xl">📊</div>
            <h2 className="mb-3 text-2xl font-black">Analiza rezultata</h2>
            <p className="leading-7 text-slate-600">
              Nakon testa sistem prikazuje rezultat, uspešnost po oblastima,
              najbolju oblast, najslabiju oblast i preporuku za dalje vežbanje.
            </p>
          </div>

          <div className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur-xl">
            <div className="mb-5 text-5xl">👥</div>
            <h2 className="mb-3 text-2xl font-black">Uloge korisnika</h2>
            <p className="leading-7 text-slate-600">
              Aplikacija razlikuje učenika i profesora. Učenik rešava testove,
              dok profesor ima pristup administratorskom panelu za unos pitanja.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur-xl">
            <h2 className="mb-6 text-3xl font-black">
              Funkcionalnosti aplikacije
            </h2>

            <div className="grid gap-4">
              {[
                "Registracija i prijava korisnika",
                "Poseban profesorski nalog",
                "Interaktivni testovi iz matematike",
                "Izbor oblasti i nivoa težine",
                "Automatsko bodovanje odgovora",
                "Analiza rezultata po oblastima",
                "Preporuka za sledeće vežbanje",
                "Rang lista učenika",
                "Admin panel za dodavanje pitanja",
                "Graf napretka i istorija testova",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 p-4 font-semibold text-slate-700 shadow-sm"
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] bg-gradient-to-br from-blue-600 to-violet-700 p-8 text-white shadow-2xl">
            <h2 className="mb-6 text-3xl font-black">Korišćene tehnologije</h2>

            <div className="grid gap-4">
              {[
                ["Next.js", "Struktura aplikacije i stranice"],
                ["React", "Interaktivne komponente i stanje aplikacije"],
                ["TypeScript", "Tipizacija podataka i sigurniji kod"],
                ["Tailwind CSS", "Moderan i responzivan dizajn"],
                ["LocalStorage", "Čuvanje korisnika, rezultata i pitanja"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl bg-white/10 p-5">
                  <p className="text-xl font-black">{title}</p>
                  <p className="mt-1 text-white/85">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[36px] border border-white/70 bg-white/85 p-8 text-center shadow-xl backdrop-blur-xl">
          <h2 className="mb-4 text-3xl font-black">Namena projekta</h2>

          <p className="mx-auto max-w-4xl text-lg leading-8 text-slate-600">
            Master Matematika predstavlja primer savremene edukativne platforme
            koja objedinjuje testiranje, analitiku, personalizovane preporuke i
            administratorsko upravljanje pitanjima. Projekat je osmišljen kao
            podrška učenicima u učenju matematike i kao alat za bolji uvid u
            njihov napredak.
          </p>

          <a
            href="/"
            className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-black text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-1"
          >
            Nazad na početnu
          </a>
        </div>
      </section>
    </main>
  );
}