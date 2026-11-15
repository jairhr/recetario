const TARJETAS = [0, 1, 2];

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-44 animate-pulse rounded-3xl bg-linear-to-br from-amber-100 to-rose-100" />

      <div className="mt-10">
        <div className="h-7 w-48 animate-pulse rounded bg-stone-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-stone-200" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TARJETAS.map((tarjeta) => (
          <div
            key={tarjeta}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
          >
            <div className="aspect-[4/3] animate-pulse bg-stone-200" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
