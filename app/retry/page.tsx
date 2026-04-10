"use client";

import { useEffect, useState } from "react";

type RetryQuestion = {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  area: string;
  difficulty: string;
  isCorrect: boolean;
};

type RetryTestQuestion = {
  question: string;
  answers: string[];
  correct: string;
  area: string;
  difficulty: string;
};

function shuffleArray<T>(array: T[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getDifficultyStyle(difficulty: string) {
  if (difficulty === "Lako") {
    return "bg-green-100 text-green-700 border-green-200";
  }
  if (difficulty === "Srednje") {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
  return "bg-red-100 text-red-700 border-red-200";
}

export default function RetryPage() {
  const [questions, setQuestions] = useState<RetryTestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("retryQuestions");
    if (!saved) return;

    const parsed: RetryQuestion[] = JSON.parse(saved);

    const transformed: RetryTestQuestion[] = parsed.map((item) => {
      const wrongOptions = shuffleArray([
        item.selectedAnswer,
        "Ne znam",
        "Preskačem",
      ]).slice(0, 3);

      const uniqueAnswers = Array.from(
        new Set([item.correctAnswer, ...wrongOptions])
      );

      return {
        question: item.question,
        answers: shuffleArray(uniqueAnswers),
        correct: item.correctAnswer,
        area: item.area,
        difficulty: item.difficulty,
      };
    });

    setQuestions(transformed);
  }, []);

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore((prev) => prev + 1);
    }

    setHasCheckedAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasCheckedAnswer(false);
    } else {
      setFinished(true);
    }
  };

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <header className="sticky top-0 z-20 border-b border-white/40 bg-slate-950/85 backdrop-blur text-white">
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
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-10 shadow-xl text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Nema sačuvanih grešaka
            </h1>
            <p className="text-slate-600 mb-6">
              Završite regularan test da bi sistem mogao da generiše vežbanje iz grešaka.
            </p>

            <a
              href="/"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold"
            >
              Nazad na početnu
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <header className="sticky top-0 z-20 border-b border-white/40 bg-slate-950/85 backdrop-blur text-white">
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
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-white/60 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-4">
                Loop iz grešaka
              </div>

              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Vežbanje grešaka je završeno
              </h1>

              <p className="text-slate-600 text-lg">
                Uspešnost u ponovnom savladavanju problematičnih pitanja
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-2xl p-6 shadow-lg">
                <p className="text-sm opacity-90 mb-2">Ponovljena pitanja</p>
                <p className="text-3xl font-bold">{questions.length}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow border border-slate-100">
                <p className="text-sm text-slate-500 mb-2">Tačni odgovori</p>
                <p className="text-3xl font-bold text-green-600">{score}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow border border-slate-100">
                <p className="text-sm text-slate-500 mb-2">Uspešnost</p>
                <p className="text-3xl font-bold text-slate-900">{percentage}%</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <h2 className="text-2xl font-semibold mb-3 text-slate-900">
                Zaključak
              </h2>
              <p className="text-slate-700 text-lg leading-7">
                {percentage >= 80
                  ? "Odlično! Većina prethodnih grešaka je uspešno savladana."
                  : percentage >= 50
                  ? "Napredak je vidljiv, ali je preporučeno još jedno ponavljanje problematičnih oblasti."
                  : "Potrebno je dodatno sistematsko vežbanje oblasti u kojima su uočene greške."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Pokušaj ponovo
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

  const current = questions[currentQuestion];
  const isSelectedCorrect = selectedAnswer === current.correct;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="sticky top-0 z-20 border-b border-white/40 bg-slate-950/85 backdrop-blur text-white">
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
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm opacity-90 mb-1">Loop iz grešaka</p>
                <h1 className="text-3xl font-bold">
                  Pitanje {currentQuestion + 1}/{questions.length}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Napredak vežbanja</span>
                <span>{Math.round(progress)}%</span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold border border-indigo-200">
                {current.area}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyStyle(
                  current.difficulty
                )}`}
              >
                {current.difficulty}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-6">
              <p className="text-2xl font-semibold text-slate-900 leading-9">
                {current.question}
              </p>
            </div>

            <div className="grid gap-4 mb-6">
              {current.answers.map((answer, index) => {
                let buttonClass =
                  "bg-white text-slate-800 border-slate-200 hover:border-red-400 hover:bg-red-50";

                if (selectedAnswer === answer && !hasCheckedAnswer) {
                  buttonClass =
                    "bg-red-500 text-white border-red-600 shadow-lg";
                }

                if (hasCheckedAnswer) {
                  if (answer === current.correct) {
                    buttonClass =
                      "bg-green-600 text-white border-green-700 shadow-lg";
                  } else if (answer === selectedAnswer && answer !== current.correct) {
                    buttonClass =
                      "bg-red-600 text-white border-red-700 shadow-lg";
                  } else {
                    buttonClass = "bg-slate-100 text-slate-500 border-slate-200";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => !hasCheckedAnswer && setSelectedAnswer(answer)}
                    disabled={hasCheckedAnswer}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 font-medium ${buttonClass}`}
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/10 mr-3 text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {answer}
                  </button>
                );
              })}
            </div>

            {hasCheckedAnswer && (
              <div
                className={`mb-6 p-4 rounded-2xl font-semibold text-center border ${
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
                onClick={selectedAnswer ? handleCheckAnswer : undefined}
                disabled={selectedAnswer === null}
                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
                  selectedAnswer === null
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg hover:scale-[1.01]"
                }`}
              >
                Proveri odgovor
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full py-4 rounded-2xl font-semibold text-lg transition-all bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-[1.01]"
              >
                {currentQuestion === questions.length - 1
                  ? "Završi vežbanje"
                  : "Sledeće pitanje"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}