"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { questions as baseQuestions } from "../../data/questions";

type AreaStats = {
  total: number;
  correct: number;
};

type Question = {
  question: string;
  answers: string[];
  correct: string;
  area: string;
  difficulty: string;
};

type AnswerReview = {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  area: string;
  difficulty: string;
  isCorrect: boolean;
};

function shuffleArray<T>(array: T[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getDifficultyStyle(difficulty: string) {
  if (difficulty === "Lako") {
    return "bg-green-100 text-green-700 border-green-200";
  }
  if (difficulty === "Srednje") {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
  return "bg-red-100 text-red-700 border-red-200";
}

function getModeLabel(mode: string) {
  if (mode === "easy") return "Laka verzija";
  if (mode === "hard") return "Napredna verzija";
  return "Mešovita verzija";
}

function getGradeLabel(percentage: number) {
  if (percentage >= 90) return "Odlično";
  if (percentage >= 75) return "Vrlo dobro";
  if (percentage >= 60) return "Dobro";
  return "Potrebno dodatno vežbanje";
}

function getMotivation(percentage: number, bestArea: string, weakestArea: string) {
  if (percentage >= 90) {
    return `Odličan rezultat! Posebno se ističe uspeh u oblasti: ${bestArea}.`;
  }
  if (percentage >= 75) {
    return `Vrlo dobar rezultat. Najjača oblast ti je ${bestArea}, a dodatni fokus može biti na oblasti ${weakestArea}.`;
  }
  if (percentage >= 60) {
    return `Dobar rezultat. Uz još malo vežbe, posebno u oblasti ${weakestArea}, rezultat može biti još bolji.`;
  }
  return `Potrebno je dodatno vežbanje. Preporuka je da poseban fokus bude na oblasti ${weakestArea}.`;
}

function exportTxtReport(data: {
  modeLabel: string;
  area: string;
  score: number;
  total: number;
  percentage: number;
  gradeLabel: string;
  bestArea: string;
  weakestArea: string;
  recommendation: string;
}) {
  const content = `
Matematički test sistem

Režim testa: ${data.modeLabel}
Oblast: ${data.area}
Rezultat: ${data.score}/${data.total}
Uspešnost: ${data.percentage}%
Ocena: ${data.gradeLabel}
Najbolja oblast: ${data.bestArea}
Oblast za dodatno vežbanje: ${data.weakestArea}

Preporuka:
${data.recommendation}
  `.trim();

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rezultat-testa.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function AreaChart({
  data,
}: {
  data: { area: string; percentage: number }[];
}) {
  const maxHeight = 180;

  return (
    <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
      <h2 className="text-2xl font-semibold mb-5 text-slate-900 text-center">
        Grafikon uspeha po oblastima
      </h2>

      <div className="flex items-end justify-center gap-4 h-[260px] overflow-x-auto">
        {data.map((item) => (
          <div
            key={item.area}
            className="flex flex-col items-center justify-end min-w-[110px] h-full"
          >
            <div className="text-sm font-semibold text-slate-700 mb-2">
              {item.percentage}%
            </div>

            <div
              className="w-16 rounded-t-2xl bg-gradient-to-t from-blue-600 to-indigo-400 transition-all duration-500"
              style={{ height: `${(item.percentage / 100) * maxHeight}px` }}
            ></div>

            <div className="mt-3 text-xs text-center text-slate-600 leading-5">
              {item.area}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestPageContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "mixed";
  const areaFilter = searchParams.get("area") || "Sve oblasti";

  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);
  const [started, setStarted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [answerReview, setAnswerReview] = useState<AnswerReview[]>([]);
  const [savedHistory, setSavedHistory] = useState(false);

  const [areaStats, setAreaStats] = useState<Record<string, AreaStats>>({});

  const modeLabel = useMemo(() => getModeLabel(mode), [mode]);

  useEffect(() => {
    const custom = localStorage.getItem("customQuestions");
    const customQuestions: Question[] = custom ? JSON.parse(custom) : [];
    let allQuestions = [...customQuestions, ...baseQuestions];

    if (areaFilter !== "Sve oblasti") {
      allQuestions = allQuestions.filter((q) => q.area === areaFilter);
    }

    let filteredQuestions = allQuestions;
    let selectedCount = 12;
    let selectedTime = 900;

    if (mode === "easy") {
      filteredQuestions = allQuestions.filter((q) => q.difficulty === "Lako");
      selectedCount = 8;
      selectedTime = 600;
    } else if (mode === "hard") {
      filteredQuestions = allQuestions.filter(
        (q) => q.difficulty === "Srednje" || q.difficulty === "Teško"
      );
      selectedCount = 15;
      selectedTime = 1200;
    }

    const randomizedQuestions = shuffleArray(filteredQuestions)
      .slice(0, selectedCount)
      .map((q) => ({
        ...q,
        answers: shuffleArray(q.answers),
      }));

    setTestQuestions(randomizedQuestions);
    setTimeLeft(selectedTime);

    const stats: Record<string, AreaStats> = {};
    randomizedQuestions.forEach((q) => {
      if (!stats[q.area]) {
        stats[q.area] = { total: 0, correct: 0 };
      }
      stats[q.area].total += 1;
    });

    setAreaStats(stats);
    setIsReady(true);
  }, [mode, areaFilter]);

  useEffect(() => {
    if (!isReady || finished || !started) return;

    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isReady, finished, timeLeft, started]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    const current = testQuestions[currentQuestion];
    const isCorrect = selectedAnswer === current.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setAreaStats((prev) => ({
        ...prev,
        [current.area]: {
          ...prev[current.area],
          correct: prev[current.area].correct + 1,
        },
      }));
    }

    setAnswerReview((prev) => [
      ...prev,
      {
        question: current.question,
        selectedAnswer,
        correctAnswer: current.correct,
        area: current.area,
        difficulty: current.difficulty,
        isCorrect,
      },
    ]);

    setHasCheckedAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasCheckedAnswer(false);
    } else {
      setFinished(true);
    }
  };

  if (!isReady) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white px-8 py-6 rounded-2xl shadow-lg">
          <p className="text-xl text-slate-800 font-semibold">Učitavanje testa...</p>
        </div>
      </main>
    );
  }

  if (testQuestions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Nema dostupnih pitanja
          </h1>
          <p className="text-slate-600 mb-6">
            Za izabrani režim i oblast trenutno nema dovoljno pitanja.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold"
          >
            Nazad na početnu
          </a>
        </div>
      </main>
    );
  }
 if (finished) {
  const percentage = Math.round((score / testQuestions.length) * 100);

  const areaResults = Object.entries(areaStats).map(([area, stats]) => ({
    area,
    total: stats.total,
    correct: stats.correct,
    percentage: Math.round((stats.correct / stats.total) * 100),
  }));

  const weakestArea = areaResults.reduce((prev, current) =>
    current.percentage < prev.percentage ? current : prev
  );

  const bestArea = areaResults.reduce((prev, current) =>
    current.percentage > prev.percentage ? current : prev
  );

  const correctCount = answerReview.filter((item) => item.isCorrect).length;
  const incorrectCount = answerReview.length - correctCount;
  const gradeLabel = getGradeLabel(percentage);
  const motivation = getMotivation(
    percentage,
    bestArea.area,
    weakestArea.area
  );

  const wrongQuestions = answerReview.filter((item) => !item.isCorrect);
  localStorage.setItem("retryQuestions", JSON.stringify(wrongQuestions));

  let recommendation = "";

  if (weakestArea.percentage < 50) {
    recommendation = `Potrebno je značajno dodatno vežbanje iz oblasti: ${weakestArea.area}.`;
  } else if (weakestArea.percentage < 70) {
    recommendation = `Preporučuje se dodatno vežbanje iz oblasti: ${weakestArea.area}.`;
  } else {
    recommendation =
      "Rezultati su dobri u svim oblastima. Preporučuje se redovno održavanje znanja.";
  }

  if (!savedHistory && typeof window !== "undefined") {
    const newResult = {
      id: Date.now().toString(),
      score,
      total: testQuestions.length,
      percentage,
      mode,
      area: areaFilter,
      bestArea: bestArea.area,
      weakestArea: weakestArea.area,
      gradeLabel,
      date: new Date().toLocaleDateString("sr-RS"),
    };

    const existing = localStorage.getItem("testHistory");
    const parsed = existing ? JSON.parse(existing) : [];
    const updated = [newResult, ...parsed].slice(0, 3);
    localStorage.setItem("testHistory", JSON.stringify(updated));
    setSavedHistory(true);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 print:bg-white">
      <header className="sticky top-0 z-20 border-b border-white/40 bg-slate-950/85 backdrop-blur text-white print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
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
        <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-white/60 p-8 md:p-10 print:shadow-none print:border-none">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {modeLabel}
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Test je završen
            </h1>

            <p className="text-slate-600 text-lg">{gradeLabel}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
              <p className="text-sm opacity-90 mb-2">Ukupan rezultat</p>
              <p className="text-3xl font-bold">
                {score}/{testQuestions.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow border border-slate-100">
              <p className="text-sm text-slate-500 mb-2">Uspešnost</p>
              <p className="text-3xl font-bold text-slate-900">{percentage}%</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow border border-slate-100">
              <p className="text-sm text-slate-500 mb-2">Tačni odgovori</p>
              <p className="text-3xl font-bold text-green-600">{correctCount}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow border border-slate-100">
              <p className="text-sm text-slate-500 mb-2">Netačni odgovori</p>
              <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <h2 className="text-2xl font-semibold mb-3 text-slate-900">
              Motivaciona poruka
            </h2>
            <p className="text-slate-700 text-lg leading-7">{motivation}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100 shadow-sm">
              <h2 className="text-xl font-semibold mb-2 text-green-700">
                Najbolja oblast
              </h2>
              <p className="text-lg font-semibold text-slate-900">{bestArea.area}</p>
              <p className="text-slate-600 mt-1">
                {bestArea.correct}/{bestArea.total} tačnih ({bestArea.percentage}%)
              </p>
            </div>

            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 shadow-sm">
              <h2 className="text-xl font-semibold mb-2 text-red-700">
                Oblast za dodatno vežbanje
              </h2>
              <p className="text-lg font-semibold text-slate-900">{weakestArea.area}</p>
              <p className="text-slate-600 mt-1">
                {weakestArea.correct}/{weakestArea.total} tačnih ({weakestArea.percentage}%)
              </p>
            </div>
          </div>

          <AreaChart data={areaResults} />

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 print:hidden">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-2xl font-semibold text-slate-900">
                Pregled testa
              </h2>

              <button
                onClick={() => setShowReview((prev) => !prev)}
                className="bg-slate-200 hover:bg-slate-300 transition px-4 py-2 rounded-full text-sm font-semibold"
              >
                {showReview ? "Sakrij pregled" : "Prikaži pregled"}
              </button>
            </div>

            {showReview && (
              <div className="space-y-4">
                {answerReview.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl p-5 border ${
                      item.isCorrect
                        ? "bg-green-50 border-green-100"
                        : "bg-red-50 border-red-100"
                    }`}
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-white text-slate-700 text-xs font-semibold border border-slate-200">
                        Pitanje {index + 1}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white text-slate-700 text-xs font-semibold border border-slate-200">
                        {item.area}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white text-slate-700 text-xs font-semibold border border-slate-200">
                        {item.difficulty}
                      </span>
                    </div>

                    <p className="font-semibold text-slate-900 mb-3">
                      {item.question}
                    </p>

                    <p className="text-slate-700">
                      Tvoj odgovor:{" "}
                      <span className="font-semibold">{item.selectedAnswer}</span>
                    </p>

                    <p className="text-slate-700">
                      Tačan odgovor:{" "}
                      <span className="font-semibold">{item.correctAnswer}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <h2 className="text-2xl font-semibold mb-3 text-slate-900">
              Preporuka sistema
            </h2>
            <p className="text-slate-700 text-lg leading-7">{recommendation}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Pokušaj ponovo
            </button>

            {wrongQuestions.length > 0 && (
              <a
                href="/retry"
                className="inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Vežbaj greške
              </a>
            )}

            <button
              onClick={() =>
                exportTxtReport({
                  modeLabel,
                  area: areaFilter,
                  score,
                  total: testQuestions.length,
                  percentage,
                  gradeLabel,
                  bestArea: bestArea.area,
                  weakestArea: weakestArea.area,
                  recommendation,
                })
              }
              className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Preuzmi rezultat
            </button>

            <button
              onClick={() => window.print()}
              className="bg-violet-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Sačuvaj kao PDF
            </button>

            <a
              href="/"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Nazad na početnu
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
  if (!started && !finished) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
  <header className="sticky top-0 z-20 backdrop-blur-xl bg-slate-950/85 border-b border-white/10 shadow-lg">
    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

      <a
        href="/"
        className="text-white font-bold text-2xl tracking-tight hover:text-blue-300 transition"
      >
        Matematički test sistem
      </a>

      <a
        href="/"
        className="px-6 py-2.5 rounded-full bg-white/10 text-white font-medium
        hover:bg-white/20 hover:scale-105 transition-all duration-300
        border border-white/10 shadow-md"
      >
        Početna
      </a>

    </div>
  </header>

        <div className="px-4 py-10">
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
     <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-10 text-white">
  <div className="flex flex-col items-center justify-center text-center">
    
    <div className="inline-flex px-5 py-2 rounded-full bg-white/20 text-sm font-semibold mb-4">
      {modeLabel}
    </div>

    <h1 className="text-4xl font-bold mb-4">
      Priprema testa
    </h1>

    <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
      Pregled osnovnih informacija pre početka rešavanja.
    </p>

  </div>
</div>

            <div className="p-8">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center shadow-sm">
    <p className="text-sm text-slate-500 mb-2">Broj pitanja</p>
    <p className="text-2xl md:text-3xl font-bold text-slate-900">
      {testQuestions.length}
    </p>
  </div>

  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center shadow-sm">
    <p className="text-sm text-slate-500 mb-2">Vreme</p>
    <p className="text-2xl md:text-3xl font-bold text-slate-900">
      {formatTime(timeLeft)}
    </p>
  </div>

  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center shadow-sm">
    <p className="text-sm text-slate-500 mb-2">Oblasti</p>
    <p className="text-2xl md:text-3xl font-bold text-slate-900">
      {new Set(testQuestions.map((q) => q.area)).size}
    </p>
  </div>

  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center shadow-sm">
    <p className="text-sm text-slate-500 mb-2">Filter oblasti</p>
    <p className="text-sm md:text-base font-bold text-slate-900 break-words">
      {areaFilter}
    </p>
  </div>
</div>

              <div className="bg-slate-100 rounded-3xl p-10 flex flex-col items-center text-center space-y-8">

  <h3 className="text-3xl font-bold text-slate-900">
    Uputstvo
  </h3>

  <div className="space-y-5 text-slate-700 text-lg max-w-2xl">
    <p>• Izaberi jedan odgovor za svako pitanje.</p>
    <p>• Klikni na „Proveri odgovor“ da vidiš rezultat pitanja.</p>
    <p>• Nakon toga prelaziš na sledeće pitanje.</p>
    <p>• Po završetku dobijaš detaljan analitički izveštaj.</p>
  </div>

</div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setStarted(true)}
                 className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-7 py-3 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
                >
                  Započni test
                </button>

               <a
  href="/"
  className="inline-flex items-center justify-center bg-slate-200 text-slate-800 px-7 py-3 rounded-2xl font-semibold hover:bg-slate-300 transition"
>
  Nazad na početnu
</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }


const current = testQuestions[currentQuestion];
const isSelectedCorrect = selectedAnswer === current.correct;
const progress = ((currentQuestion + 1) / testQuestions.length) * 100;

return (
  <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <header className="sticky top-0 z-20 border-b border-white/40 bg-slate-950/85 backdrop-blur text-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="font-bold text-xl">
          Matematički test sistem
        </a>

        <a
          href="/"
          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
        >
          Početna
        </a>
      </div>
    </header>

    <div className="px-4 py-8 md:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-[32px] shadow-2xl border border-white/60 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 md:px-8 py-6 md:py-8 text-white">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-sm md:text-base text-white/85 mb-2 font-medium">
                  {modeLabel}
                </p>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  Pitanje {currentQuestion + 1}/{testQuestions.length}
                </h1>
              </div>

              <div className="mx-auto md:mx-0 bg-white/20 px-5 py-3 rounded-2xl text-base md:text-lg font-semibold shadow-inner">
                ⏱ {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Napredak testa</span>
                <span>{Math.round(progress)}%</span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold border border-indigo-200">
                {current.area}
              </span>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${getDifficultyStyle(
                  current.difficulty
                )}`}
              >
                {current.difficulty}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 md:p-6 mb-6 shadow-sm">
              <p className="text-xl md:text-2xl font-bold text-slate-900 leading-snug text-center">
                {current.question}
              </p>
            </div>

            <div className="grid gap-4 mb-8">
              {current.answers.map((answer, index) => {
                let buttonClass =
                  "bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50";

                if (selectedAnswer === answer && !hasCheckedAnswer) {
                  buttonClass =
                    "bg-blue-600 text-white border-blue-700 shadow-lg";
                }

                if (hasCheckedAnswer) {
                  if (answer === current.correct) {
                    buttonClass =
                      "bg-green-600 text-white border-green-700 shadow-lg";
                  } else if (
                    answer === selectedAnswer &&
                    answer !== current.correct
                  ) {
                    buttonClass =
                      "bg-red-600 text-white border-red-700 shadow-lg";
                  } else {
                    buttonClass =
                      "bg-slate-100 text-slate-500 border-slate-200";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() =>
                      !hasCheckedAnswer && setSelectedAnswer(answer)
                    }
                    disabled={hasCheckedAnswer}
                    className={`w-full flex items-center gap-4 md:gap-5 p-5 md:p-6 rounded-3xl border-2 transition-all duration-200 text-left shadow-sm ${buttonClass}`}
                  >
                    <span className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/10 text-base font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="flex-1 text-lg md:text-xl font-medium leading-7">
                      {answer}
                    </span>
                  </button>
                );
              })}
            </div>

            {hasCheckedAnswer && (
              <div
                className={`mb-8 p-5 rounded-3xl font-semibold text-center border text-lg ${
                  isSelectedCorrect
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {isSelectedCorrect
                  ? "Tačan odgovor!"
                  : `Netačno. Tačan odgovor je: ${current.correct}`}
              </div>
            )}

            {!hasCheckedAnswer ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className={`w-full py-4 md:py-5 rounded-3xl font-semibold text-lg md:text-xl transition-all ${
                  selectedAnswer === null
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:scale-[1.01]"
                }`}
              >
                Proveri odgovor
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full py-4 md:py-5 rounded-3xl font-semibold text-lg md:text-xl transition-all bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-[1.01]"
              >
                {currentQuestion === testQuestions.length - 1
                  ? "Završi test"
                  : "Sledeće pitanje"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </main>
);
}
export default function TestPage() {
  return (
    <Suspense fallback={<div>Učitavanje testa...</div>}>
      <TestPageContent />
    </Suspense>
  );
}