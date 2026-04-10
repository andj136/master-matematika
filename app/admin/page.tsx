"use client";

import { useEffect, useState } from "react";

type CustomQuestion = {
  question: string;
  answers: string[];
  correct: string;
  area: string;
  difficulty: string;
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
};

export default function AdminPage() {
  const [form, setForm] = useState(emptyForm);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("customQuestions");
    if (saved) {
      setCustomQuestions(JSON.parse(saved));
    }
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="sticky top-0 z-20 border-b border-white/40 bg-slate-950/85 backdrop-blur text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-xl">
            Matematički test sistem
          </a>

          <a
            href="/"
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition text-sm"
          >
            Početna
          </a>
        </div>
      </header>

      <div className="px-4 py-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">
              Admin unos pitanja
            </h1>

            <div className="space-y-4">
              <textarea
                value={form.question}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, question: e.target.value }))
                }
                placeholder="Unesi pitanje"
                className="w-full border border-slate-200 rounded-2xl p-4 min-h-[120px]"
              />

              <input
                value={form.answerA}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, answerA: e.target.value }))
                }
                placeholder="Odgovor A"
                className="w-full border border-slate-200 rounded-2xl p-4"
              />

              <input
                value={form.answerB}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, answerB: e.target.value }))
                }
                placeholder="Odgovor B"
                className="w-full border border-slate-200 rounded-2xl p-4"
              />

              <input
                value={form.answerC}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, answerC: e.target.value }))
                }
                placeholder="Odgovor C"
                className="w-full border border-slate-200 rounded-2xl p-4"
              />

              <input
                value={form.answerD}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, answerD: e.target.value }))
                }
                placeholder="Odgovor D"
                className="w-full border border-slate-200 rounded-2xl p-4"
              />

              <input
                value={form.correct}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, correct: e.target.value }))
                }
                placeholder="Tačan odgovor"
                className="w-full border border-slate-200 rounded-2xl p-4"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={form.area}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, area: e.target.value }))
                  }
                  className="w-full border border-slate-200 rounded-2xl p-4"
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
                  className="w-full border border-slate-200 rounded-2xl p-4"
                >
                  <option>Lako</option>
                  <option>Srednje</option>
                  <option>Teško</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold"
              >
                Sačuvaj pitanje
              </button>

              {message && (
                <div className="bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl p-4">
                  {message}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Dodata pitanja ({customQuestions.length})
            </h2>

            <div className="space-y-4 max-h-[700px] overflow-auto pr-2">
              {customQuestions.length === 0 && (
                <p className="text-slate-500">Još nema dodatih pitanja.</p>
              )}

              {customQuestions.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl p-5"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {item.area}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {item.difficulty}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-900 mb-3">
                    {item.question}
                  </p>

                  <p className="text-slate-600 text-sm mb-1">
                    Tačan odgovor: <span className="font-semibold">{item.correct}</span>
                  </p>

                  <button
                    onClick={() => handleDelete(index)}
                    className="mt-3 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    Obriši
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}