const PASOS = [0, 1, 2, 3];

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="aspect-[4/3] animate-pulse rounded-3xl border border-stone-200 bg-stone-200" />
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-stone-200" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-stone-200" />
          </div>
          <div className="h-10 w-full animate-pulse rounded bg-stone-200" />
          <div className="h-10 w-2/3 animate-pulse rounded bg-stone-200" />
          <div className="h-12 w-44 animate-pulse rounded-full bg-stone-200" />
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <div className="h-7 w-40 animate-pulse rounded bg-stone-200" />
          <div className="mt-4 space-y-3 rounded-2xl border border-stone-200 bg-white p-4">
            {[0, 1, 2, 3, 4].map((fila) => (
              <div key={fila} className="flex justify-between gap-4">
                <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-stone-200" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-7 w-40 animate-pulse rounded bg-stone-200" />
          <div className="mt-4 space-y-5">
            {PASOS.map((paso) => (
              <div key={paso} className="flex gap-4">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-stone-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-stone-200" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
