"use client";

import { useEffect, useState } from "react";

type StoredUser = {
  name: string;
  password: string;
  role: "student" | "admin";
};

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedRole = localStorage.getItem("currentRole");

    if (savedUser) setCurrentUser(savedUser);
    if (savedRole) setCurrentRole(savedRole);
  }, []);

  const getUsers = (): StoredUser[] => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [];
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleRegister = () => {
    if (!name.trim() || !password.trim()) {
      setMessage("Unesi ime i šifru.");
      return;
    }

    const users = getUsers();
    const exists = users.some(
      (user) => user.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists || name.trim().toLowerCase() === "profesor") {
      setMessage("Korisnik sa tim imenom već postoji.");
      return;
    }

    const newUser: StoredUser = {
      name: name.trim(),
      password: password.trim(),
      role: "student",
    };

    saveUsers([...users, newUser]);

    localStorage.setItem("currentUser", newUser.name);
    localStorage.setItem("currentRole", newUser.role);

    window.location.href = "/";
  };

  const handleLogin = () => {
    if (!name.trim() || !password.trim()) {
      setMessage("Unesi ime i šifru.");
      return;
    }

    if (
      name.trim().toLowerCase() === "profesor" &&
      password.trim() === "profesor123"
    ) {
      localStorage.setItem("currentUser", "Profesor");
      localStorage.setItem("currentRole", "admin");
      window.location.href = "/";
      return;
    }

    const users = getUsers();
    const foundUser = users.find(
      (user) =>
        user.name.toLowerCase() === name.trim().toLowerCase() &&
        user.password === password.trim()
    );

    if (!foundUser) {
      setMessage("Pogrešno ime ili šifra.");
      return;
    }

    localStorage.setItem("currentUser", foundUser.name);
    localStorage.setItem("currentRole", foundUser.role);

    window.location.href = "/";
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentRole");
    setCurrentUser("");
    setCurrentRole("");
    setName("");
    setPassword("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),radial-gradient(circle_at_top_right,#ede9fe,transparent_30%),linear-gradient(135deg,#f8fafc,#eef2ff,#dbeafe)] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/30 bg-slate-950/85 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
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

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-2">
        <section>
          <div className="mb-6 inline-flex rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur">
  🔐 Prijava korisnika
</div>

<h1 className="mb-5 text-5xl font-black leading-tight tracking-tight md:text-6xl">
  Dobro došli na
  <br />
  <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
    Master Matematiku.
  </span>
</h1>

<p className="max-w-xl text-lg leading-8 text-slate-600">
  Prijavite se ili kreirajte korisnički nalog kako biste rešavali
  interaktivne testove, pratili svoj napredak i koristili sve funkcionalnosti
  platforme.
</p>
         
        </section>

        <section className="relative">
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/85 shadow-2xl backdrop-blur-xl">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-9 text-center text-white">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-4xl shadow-inner">
                {mode === "login" ? "🔐" : "✨"}
              </div>

              <h2 className="text-3xl font-black">
                {mode === "login" ? "Prijava korisnika" : "Registracija učenika"}
              </h2>

              <p className="mt-3 text-white/90">
                {mode === "login"
                  ? "Unesi ime i šifru za pristup platformi."
                  : "Kreiraj učenički nalog za praćenje rezultata."}
              </p>
            </div>

            <div className="p-8">
              {currentUser && (
                <div className="mb-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                  <p className="text-sm font-semibold text-emerald-700">
                    Trenutno prijavljen korisnik
                  </p>
                  <p className="mt-1 text-2xl font-black text-emerald-900">
                    {currentUser}
                  </p>
                  <p className="text-sm font-semibold text-emerald-700">
                    Uloga: {currentRole === "admin" ? "Profesor/Admin" : "Učenik"}
                  </p>
                </div>
              )}

              <div className="mb-5 grid grid-cols-2 gap-3 rounded-3xl bg-slate-100 p-2">
                <button
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                  className={`rounded-2xl py-3 font-black transition ${
                    mode === "login"
                      ? "bg-white text-blue-700 shadow"
                      : "text-slate-500"
                  }`}
                >
                  Prijava
                </button>

                <button
                  onClick={() => {
                    setMode("register");
                    setMessage("");
                  }}
                  className={`rounded-2xl py-3 font-black transition ${
                    mode === "register"
                      ? "bg-white text-blue-700 shadow"
                      : "text-slate-500"
                  }`}
                >
                  Registracija
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Korisničko ime
                  </label>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Na primer: Milica"
                    className="w-full rounded-3xl border border-slate-200 bg-white p-5 text-lg font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Šifra
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        mode === "login" ? handleLogin() : handleRegister();
                      }
                    }}
                    placeholder="Unesi šifru"
                    className="w-full rounded-3xl border border-slate-200 bg-white p-5 text-lg font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <button
                  onClick={mode === "login" ? handleLogin : handleRegister}
                  className="w-full rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 py-5 text-lg font-black text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  {mode === "login" ? "Uđi u platformu" : "Kreiraj nalog"}
                </button>

                {currentUser && (
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-3xl bg-red-500 py-5 text-lg font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-red-600"
                  >
                    Odjavi korisnika
                  </button>
                )}

                {message && (
                  <div className="rounded-3xl border border-red-100 bg-red-50 p-4 text-center font-bold text-red-700">
                    {message}
                  </div>
                )}

                <p className="text-center text-sm text-slate-500">
                  Podaci se čuvaju lokalno u browseru za potrebe demonstracije.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}