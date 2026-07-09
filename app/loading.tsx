export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      <div className="text-center">

        <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

        <a
  href="/"
  className="text-2xl font-black tracking-tight"
>
  <span className="text-white">Master</span>
  <span className="text-blue-400">Matematika</span>
</a>

        <p className="mt-2 text-slate-500">
          Učitavanje...
        </p>

      </div>

    </main>
  );
}