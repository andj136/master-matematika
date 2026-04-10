"use client";

import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const saved =
      localStorage.getItem("testHistory");

    if (saved) {
      const parsed = JSON.parse(saved);

      const sorted = parsed.sort(
        (a: any, b: any) =>
          b.percentage - a.percentage
      );

      setResults(sorted);
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-xl">

        <h1 className="text-4xl font-bold mb-8">
          Rang lista 🏆
        </h1>

        {results.length === 0 ? (
          <p>Nema rezultata.</p>
        ) : (
          <div className="space-y-4">
            {results.map((item, index) => (
              <div
                key={index}
                className="p-5 bg-slate-50 rounded-2xl flex justify-between"
              >
                <span>
                  #{index + 1}
                </span>

                <span>
                  {item.percentage}%
                </span>

                <span>
                  {item.score}/{item.total}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}