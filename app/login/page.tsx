"use client";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(savedUser);
      setName(savedUser);
    }
  }, []);

  const handleLogin = () => {
    if (!name.trim()) return;

    localStorage.setItem("currentUser", name.trim());
    window.location.href = "/";
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser("");
    setName("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="sticky top-0 z-20 border-b border-white/40 bg-slate-950/85 backdrop-blur text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
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
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white text-center">
            <div className="inline-flex px-4 py-2 rounded-full bg-white/20 text-sm font-semibold mb-4">
              Korisnički profil
            </div>

            <h1 className="text-3xl font-bold mb-3">
              Prijava korisnika
            </h1>

            <p className="text-white/90">
              Unesi ime pod kojim želiš da pratiš rezultate i istoriju testova.
            </p>
          </div>

          <div className="p-8">
            {currentUser && (
              <div className="mb-6 bg-green-50 border border-green-100 rounded-2xl p-4">
                <p className="text-green-700 font-semibold">
                  Trenutno prijavljen korisnik: {currentUser}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ime korisnika
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Unesi svoje ime"
                  className="w-full border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:scale-[1.01] transition"
              >
                Sačuvaj prijavu
              </button>

              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-red-600 transition"
                >
                  Odjavi korisnika
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}