"use client";

import { useEffect, useState } from "react";

type Result = {
  id?: string;
  user?: string;
  score: number;
  total: number;
  percentage: number;
  mode?: string;
  area?: string;
  gradeLabel?: string;
  date?: string;
};

export default function LeaderboardPage() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("testHistory");

    if (saved) {
      const parsed = JSON.parse(saved);
      const sorted = parsed.sort(
        (a: Result, b: Result) => b.percentage - a.percentage
      );

      setResults(sorted);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),radial-gradient(circle_at_top_right,#ede9fe,transparent_30%),linear-gradient(135deg,#f8fafc,#eef2ff,#dbeafe)] px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
              Master Matematika
            </p>

            <h1 className="text-5xl font-black tracking-tight">
              Rang lista 🏆
            </h1>

            <p className="mt-3 text-slate-600">
              Najbolji rezultati učenika nakon završenih testova.
            </p>
          </div>

          <a
            href="/"
            className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white shadow-lg hover:bg-slate-800"
          >
            Početna
          </a>
        </div>

        {results.length === 0 ? (
          <div className="rounded-[36px] border border-white/70 bg-white/85 p-12 text-center shadow-2xl backdrop-blur-xl">
            <div className="mb-4 text-6xl">📊</div>

            <h2 className="mb-3 text-3xl font-black">
              Još nema rezultata
            </h2>

            <p className="mb-8 text-slate-600">
              Reši prvi test i rezultat će se automatski pojaviti ovde.
            </p>

            <a
              href="/#testovi"
              className="inline-flex rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 font-bold text-white shadow-xl shadow-blue-500/25 hover:scale-105 transition"
            >
              Započni test
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {results.map((item, index) => {
              const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;

              const topClass =
                index === 0
                  ? "from-yellow-400 to-amber-500 text-white"
                  : index === 1
                  ? "from-slate-300 to-slate-500 text-white"
                  : index === 2
                  ? "from-orange-400 to-amber-700 text-white"
                  : "from-white to-white text-slate-900";

              return (
                <div
                  key={item.id || index}
                  className={`rounded-[32px] border border-white/70 bg-gradient-to-r ${topClass} p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-black/10 text-4xl font-black">
                        {medal}
                      </div>

                      <div>
                        <h2 className="text-3xl font-black">
                          {item.user || "Gost"}
                        </h2>

                        <p className={index < 3 ? "text-white/90" : "text-slate-500"}>
                          {item.date || "Bez datuma"} · {item.area || "Sve oblasti"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center md:min-w-[360px]">
                      <div className="rounded-2xl bg-black/10 p-4">
                        <p className="text-sm opacity-80">Uspešnost</p>
                        <p className="text-2xl font-black">{item.percentage}%</p>
                      </div>

                      <div className="rounded-2xl bg-black/10 p-4">
                        <p className="text-sm opacity-80">Rezultat</p>
                        <p className="text-2xl font-black">
                          {item.score}/{item.total}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-black/10 p-4">
                        <p className="text-sm opacity-80">Ocena</p>
                        <p className="text-lg font-black">
                          {item.gradeLabel || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}