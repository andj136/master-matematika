"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { questions as baseQuestions } from "../../data/questions";

type AreaStats = {
  total: number;
  correct: number;
};

type Question = {
  question: string;
  answers: string[];
  correct: string;
  area: string;
  difficulty: string;
  grade?: string;
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
Master matematika

Režim testa: ${data.modeLabel}
Oblast: ${data.area}
Rezultat: ${data.score}/${data.total}
Uspešnost: ${data.percentage}%
Ocena: ${data.gradeLabel}
Najbolja oblast: ${data.bestArea}
${data.percentage === 100
  ? "Sve oblasti su uspešno rešene."
  : `Oblast za dodatno vežbanje: ${data.weakestArea}`}

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
}: {
  data: { area: string; percentage: number }[];
}) {
  const getBarStyle = (percentage: number) => {
    if (percentage >= 80) return "from-emerald-500 to-green-500";
    if (percentage >= 50) return "from-blue-500 to-violet-500";
    return "from-red-500 to-orange-500";
  };

  return (
    <div className="mb-8 rounded-[32px] border border-white/70 bg-white p-6 shadow-xl">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">
          📊 Analitika
        </div>

        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Uspešnost po oblastima
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Pregled rezultata po oblastima prikazuje u kojim delovima testa je
          ostvaren najbolji rezultat.
        </p>
      </div>

      <div className="space-y-5">
        {data.map((item) => (
          <div key={item.area} className="rounded-3xl bg-slate-50 p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="font-black text-slate-800">{item.area}</p>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-900 shadow-sm">
                {item.percentage}%
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getBarStyle(
                  item.percentage
                )} transition-all duration-700`}
                style={{ width: `${item.percentage}%` }}
              />
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
const gradeFilter = searchParams.get("grade") || "5. razred";

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
const customQuestions: Question[] = custom ? JSON.parse(custom) : [];

let allQuestions: Question[] = [
  ...customQuestions,
  ...(baseQuestions as Question[]),
];

allQuestions = allQuestions.filter((q) => {
  const questionGrade = q.grade;
  return !questionGrade || questionGrade === gradeFilter;
});


    if (areaFilter !== "Sve oblasti") {
      allQuestions = allQuestions.filter((q) => q.area === areaFilter);
    }

    let filteredQuestions = allQuestions;
let selectedCount = 12;
let selectedTime = 900;

if (mode === "easy") {
  filteredQuestions = allQuestions.filter((q) => q.difficulty === "Lako");
  selectedCount = 8;
  selectedTime = 600;
} else if (mode === "mixed") {
  filteredQuestions = allQuestions;
  selectedCount = 12;
  selectedTime = 900;
} else if (mode === "hard") {
  filteredQuestions = allQuestions.filter((q) => q.difficulty === "Teško");
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
  }, [mode, areaFilter, gradeFilter]);

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
  user: localStorage.getItem("currentUser") || "Gost",
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
    const user = localStorage.getItem("currentUser");

if (user) {
  const existing = localStorage.getItem(`testHistory_${user}`);
  const parsed = existing ? JSON.parse(existing) : [];
  const updated = [newResult, ...parsed].slice(0, 3);

  localStorage.setItem(
    `testHistory_${user}`,
    JSON.stringify(updated)
  );
  
const globalExisting = localStorage.getItem("allTestResults");
const globalParsed = globalExisting ? JSON.parse(globalExisting) : [];
const globalUpdated = [newResult, ...globalParsed];

localStorage.setItem("allTestResults", JSON.stringify(globalUpdated));
}
    setSavedHistory(true);
  }

return (
  <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 print:bg-white">
    <header className="sticky top-0 z-30 border-b border-white/40 bg-slate-950/90 text-white backdrop-blur-xl print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <a href="/" className="text-2xl font-black tracking-tight">
            Master<span className="text-blue-300">Matematika</span>
          </a>
          <p className="mt-1 text-sm font-medium text-slate-300">
            Analiza rezultata testa
          </p>
        </div>

        <a
          href="/"
          className="rounded-2xl bg-white px-6 py-3 font-bold text-slate-900 shadow-lg transition hover:scale-105"
        >
          🏠 Početna
        </a>
      </div>
    </header>

    <div className="px-4 py-10">
      <div className="mx-auto max-w-6xl rounded-[40px] border border-white/70 bg-white/90 p-7 shadow-2xl backdrop-blur-xl md:p-10 print:border-none print:shadow-none">
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-700">
            {modeLabel}
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Test je završen 🎉
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
            Rezultat je sačuvan i automatski dodat na rang listu.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[28px] bg-gradient-to-br from-blue-600 to-violet-600 p-6 text-white shadow-xl">
            <p className="text-sm font-semibold text-white/80">Ukupan rezultat</p>
            <p className="mt-3 text-4xl font-black">
              {score}/{testQuestions.length}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Uspešnost</p>
            <p className="mt-3 text-4xl font-black text-slate-900">
              {percentage}%
            </p>
          </div>

          <div className="rounded-[28px] bg-emerald-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Tačni odgovori</p>
            <p className="mt-3 text-4xl font-black text-emerald-600">
              {correctCount}
            </p>
          </div>

          <div className="rounded-[28px] bg-red-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Netačni odgovori</p>
            <p className="mt-3 text-4xl font-black text-red-600">
              {incorrectCount}
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-[28px] border border-blue-100 bg-blue-50 p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-black text-slate-900">
            Kratak pregled
          </h2>
          <p className="text-lg leading-8 text-slate-700">
            {percentage >= 90
              ? "Odličan rezultat! Nastavi da održavaš ovaj nivo znanja."
              : percentage >= 60
              ? "Dobar rezultat. Uz dodatno vežbanje rezultat može biti još bolji."
              : "Potrebno je dodatno vežbanje i ponavljanje gradiva."}
          </p>
        </div>

        <AreaChart data={areaResults} />

        <div className="mb-8 rounded-[28px] border border-slate-100 bg-slate-50 p-6 print:hidden">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-slate-900">
              Pregled testa
            </h2>

            <button
              onClick={() => setShowReview((prev) => !prev)}
              className="rounded-full bg-slate-200 px-5 py-2 text-sm font-bold transition hover:bg-slate-300"
            >
              {showReview ? "Sakrij pregled" : "Prikaži pregled"}
            </button>
          </div>

          {showReview && (
            <div className="space-y-4">
              {answerReview.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-3xl border p-5 ${
                    item.isCorrect
                      ? "border-green-100 bg-green-50"
                      : "border-red-100 bg-red-50"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">
                      Pitanje {index + 1}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">
                      {item.area}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">
                      {item.difficulty}
                    </span>
                  </div>

                  <p className="mb-3 font-bold text-slate-900">
                    {item.question}
                  </p>

                  <p className="text-slate-700">
                    Tvoj odgovor:{" "}
                    <span className="font-bold">{item.selectedAnswer}</span>
                  </p>

                  <p className="text-slate-700">
                    Tačan odgovor:{" "}
                    <span className="font-bold">{item.correctAnswer}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-4 print:hidden sm:flex-row sm:flex-wrap">
          <button
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02]"
          >
            Pokušaj ponovo
          </button>

          {wrongQuestions.length > 0 && (
            <a
              href="/retry"
              className="inline-flex justify-center rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02]"
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
            className="rounded-2xl bg-slate-800 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02]"
          >
            Preuzmi rezultat
          </button>

          <button
            onClick={() => window.print()}
            className="rounded-2xl bg-violet-600 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02]"
          >
            Sačuvaj kao PDF
          </button>

          <a
            href="/"
            className="inline-flex justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02]"
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
  className="text-2xl font-black tracking-tight"
>
  <span className="text-white">Master</span>
  <span className="text-blue-400">Matematika</span>
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

   <h1 className="text-4xl md:text-5xl font-black mb-4">
  Spremni za test?
</h1>

<p className="text-lg text-white/90 max-w-2xl leading-relaxed">
  Pogledaj osnovne informacije i započni rešavanje kada budeš spremna.
</p>

  </div>
</div>

            <div className="p-8">
             <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
  <div className="rounded-[24px] border border-slate-100 bg-white p-5 text-center shadow-sm">
    <p className="text-base font-semibold tracking-tight text-slate-500">
      Broj pitanja
    </p>

    <p className="mt-3 text-4xl font-black tracking-tight text-slate-900">
      {testQuestions.length}
    </p>
  </div>

  <div className="rounded-[24px] border border-slate-100 bg-blue-50 p-5 text-center shadow-sm">
    <p className="text-base font-semibold tracking-tight text-slate-500">
      Vreme
    </p>

    <p className="mt-3 text-4xl font-black tracking-tight text-slate-900">
      {formatTime(timeLeft)}
    </p>
  </div>

  <div className="rounded-[24px] border border-slate-100 bg-violet-50 p-5 text-center shadow-sm">
    <p className="text-base font-semibold tracking-tight text-slate-500">
      Oblasti
    </p>

    <p className="mt-3 text-4xl font-black tracking-tight text-slate-900">
      {new Set(testQuestions.map((q) => q.area)).size}
    </p>
  </div>

  <div className="rounded-[24px] border border-slate-100 bg-emerald-50 p-5 text-center shadow-sm">
    <p className="text-base font-semibold tracking-tight text-slate-500">
      Filter oblasti
    </p>

    <p className="mt-3 text-xl font-black tracking-tight text-slate-900">
      {areaFilter}
    </p>
  </div>
</div>

              <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
  <h3 className="mb-5 text-2xl font-black tracking-tight text-slate-900">
    Kako funkcioniše test?
  </h3>

  <div className="grid gap-3 md:grid-cols-2">
    {[
      ["01", "Izaberi jedan odgovor za svako pitanje."],
      ["02", "Klikni na „Proveri odgovor” za povratnu informaciju."],
      ["03", "Nakon provere prelaziš na sledeće pitanje."],
      ["04", "Na kraju dobijaš detaljnu analizu rezultata."],
    ].map(([number, text]) => (
      <div
        key={number}
        className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4 text-left"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white">
          {number}
        </span>

        <p className="text-base font-semibold leading-7 text-slate-700">
          {text}
        </p>
      </div>
    ))}
  </div>
</div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
               <div className="mt-10 flex flex-wrap justify-center gap-5">
  <button
    onClick={() => setStarted(true)}
    className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-10 py-4 font-bold text-white shadow-lg transition hover:scale-105"
  >
    🚀 Započni test
  </button>

  <a
    href="/"
    className="rounded-full bg-slate-200 px-10 py-4 font-bold text-slate-800 transition hover:bg-slate-300"
  >
    Nazad na početnu
  </a>
</div>

 
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
       <a
  href="/"
  className="text-2xl font-black tracking-tight"
>
  Master<span className="text-blue-300">Matematika</span>
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
         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-12 text-white">
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