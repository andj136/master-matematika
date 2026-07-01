"use client";

import { useEffect, useState } from "react";



type CustomQuestion = {
  question: string;
  answers: string[];
  correct: string;
  area: string;
  difficulty: string;
  grade: string;
};
const emptyForm = {
  question: "",
  answerA: "",
  answerB: "",
  answerC: "",
  answerD: "",
  correct: "",
  area: "Brojevi i operacije",
  difficulty: "Lako",
  grade: "5. razred",
};

export default function AdminPage() {
  const [form, setForm] = useState(emptyForm);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("customQuestions");
    if (saved) setCustomQuestions(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    if (
      !form.question ||
      !form.answerA ||
      !form.answerB ||
      !form.answerC ||
      !form.answerD ||
      !form.correct
    ) {
      setMessage("Popuni sva polja.");
      return;
    }

    const answers = [form.answerA, form.answerB, form.answerC, form.answerD];

    if (!answers.includes(form.correct)) {
      setMessage("Tačan odgovor mora biti jedan od ponuđenih odgovora.");
      return;
    }

   const newQuestion: CustomQuestion = {
  question: form.question,
  answers,
  correct: form.correct,
  area: form.area,
  difficulty: form.difficulty,
  grade: form.grade,
};
    const updated = [...customQuestions, newQuestion];
    localStorage.setItem("customQuestions", JSON.stringify(updated));
    setCustomQuestions(updated);
    setForm(emptyForm);
    setMessage("Pitanje je uspešno dodato.");
  };

  const handleDelete = (index: number) => {
    const updated = customQuestions.filter((_, i) => i !== index);
    localStorage.setItem("customQuestions", JSON.stringify(updated));
    setCustomQuestions(updated);
  };
  const handleClearLeaderboard = () => {
  const confirmDelete = confirm(
    "Da li ste sigurni da želite da obrišete celu rang listu?"
  );

  if (!confirmDelete) return;

  localStorage.removeItem("allTestResults");
  setMessage("Rang lista je uspešno obrisana.");
};

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),radial-gradient(circle_at_top_right,#ede9fe,transparent_30%),linear-gradient(135deg,#f8fafc,#eef2ff,#dbeafe)] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/30 bg-slate-950/85 text-white backdrop-blur-xl">
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

      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-10">
          <div className="mb-4 inline-flex rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur">
            Admin panel
          </div>

          <h1 className="text-5xl font-black tracking-tight">
            Unos i upravljanje pitanjima
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Dodaj nova pitanja u bazu za testiranje. Pitanja se čuvaju lokalno u browseru
            i odmah se uključuju u testove.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-600">Novo pitanje</p>
                <h2 className="text-3xl font-black">Forma za unos</h2>
              </div>

              <div className="rounded-3xl bg-blue-100 px-5 py-4 text-3xl">
                🛠️
              </div>
            </div>

            <div className="space-y-5">
              <textarea
                value={form.question}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, question: e.target.value }))
                }
                placeholder="Unesi tekst pitanja..."
                className="min-h-[130px] w-full rounded-3xl border border-slate-200 bg-white p-5 font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["answerA", "Odgovor A"],
                  ["answerB", "Odgovor B"],
                  ["answerC", "Odgovor C"],
                  ["answerD", "Odgovor D"],
                ].map(([key, label]) => (
                  <input
                    key={key}
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    placeholder={label}
                    className="w-full rounded-3xl border border-slate-200 bg-white p-5 font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                ))}
              </div>

              <input
                value={form.correct}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, correct: e.target.value }))
                }
                placeholder="Tačan odgovor mora biti isti kao jedan od ponuđenih"
                className="w-full rounded-3xl border border-slate-200 bg-emerald-50 p-5 font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={form.area}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, area: e.target.value }))
                  }
                  className="w-full rounded-3xl border border-slate-200 bg-white p-5 font-semibold outline-none"
                >
                  <option>Brojevi i operacije</option>
                  <option>Algebarski izrazi i jednačine</option>
                  <option>Geometrija</option>
                  <option>Tekstualni zadaci</option>
                  <option>Statistika i verovatnoća</option>
                </select>

                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, difficulty: e.target.value }))
                  }
                  className="w-full rounded-3xl border border-slate-200 bg-white p-5 font-semibold outline-none"
                >
                  <option>Lako</option>
                  <option>Srednje</option>
                  <option>Teško</option>
                </select>
                <select
  value={form.grade}
  onChange={(e) =>
    setForm((prev) => ({ ...prev, grade: e.target.value }))
  }
  className="w-full rounded-3xl border border-slate-200 bg-white p-5 font-semibold outline-none"
>
  <option>5. razred</option>
  <option>6. razred</option>
  <option>7. razred</option>
  <option>8. razred</option>
</select>
              </div>

              <button
                onClick={handleSave}
                className="w-full rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 py-5 text-lg font-black text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                Sačuvaj pitanje
              </button>
              <button
  type="button"
  onClick={handleClearLeaderboard}
  className="w-full rounded-3xl bg-red-600 py-5 text-lg font-black text-white shadow-xl shadow-red-500/25 transition hover:-translate-y-1 hover:bg-red-700 hover:shadow-2xl"
>
  🗑 Obriši rang listu
</button>

              {message && (
                <div
                  className={`rounded-3xl border p-5 font-bold ${
                    message.includes("uspešno")
                      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border-red-100 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-blue-600">Baza pitanja</p>
                <h2 className="text-3xl font-black">
                  Dodata pitanja ({customQuestions.length})
                </h2>
              </div>

              <div className="rounded-3xl bg-violet-100 px-5 py-4 text-3xl">
                📚
              </div>
            </div>

            <div className="max-h-[720px] space-y-4 overflow-auto pr-2">
              {customQuestions.length === 0 && (
                <div className="rounded-3xl bg-slate-50 p-8 text-center">
                  <div className="mb-3 text-5xl">📝</div>
                  <p className="font-bold text-slate-700">
                    Još nema dodatih pitanja.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Kada dodaš pitanje, pojaviće se ovde.
                  </p>
                </div>
              )}

              {customQuestions.map((item, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {item.area}
                    </span>

                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                      {item.difficulty}
                    </span>
                  </div>

                  <p className="mb-4 font-bold leading-7 text-slate-900">
                    {item.question}
                  </p>

                  <div className="mb-4 rounded-2xl bg-white p-4 text-sm text-slate-600">
                    <p>
                      Tačan odgovor:{" "}
                      <span className="font-black text-emerald-700">
                        {item.correct}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(index)}
                    className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200"
                  >
                    Obriši pitanje
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}