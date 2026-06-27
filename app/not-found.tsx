export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),radial-gradient(circle_at_top_right,#ede9fe,transparent_30%),linear-gradient(135deg,#f8fafc,#eef2ff,#dbeafe)] px-5">
      <div className="max-w-xl rounded-[36px] border border-white/70 bg-white/85 p-10 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] bg-gradient-to-br from-blue-600 to-violet-600 text-5xl text-white shadow-xl">
          ∑
        </div>

        <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-blue-600">
          Greška 404
        </p>

        <h1 className="mb-4 text-5xl font-black text-slate-900">
          Stranica nije pronađena
        </h1>

        <p className="mb-8 leading-7 text-slate-600">
          Izgleda da ova stranica ne postoji ili je adresa pogrešno uneta.
        </p>

        <a
          href="/"
          className="inline-flex rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-black text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-1 hover:shadow-2xl"
        >
          Nazad na početnu
        </a>
      </div>
    </main>
  );
}