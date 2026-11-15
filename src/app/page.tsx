import Link from "next/link";
import { Suspense } from "react";
import { RecetaCard } from "@/components/RecetaCard";
import { recetaAleatoria } from "@/lib/mealdb";

async function RecetaDelDia() {
  const receta = await recetaAleatoria();

  return <RecetaCard receta={receta} />;
}

function RecetaDelDiaEsqueleto() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-stone-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-stone-200 bg-linear-to-br from-amber-100 via-orange-50 to-rose-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <span className="rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-orange-800 ring-1 ring-orange-200">
            Cocina simple, sabores de casa
          </span>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Encuentra tu próxima receta favorita
          </h1>
          <p className="max-w-xl text-base text-stone-600 sm:text-lg">
            Explora recetas de todo el mundo, revisa sus ingredientes paso a
            paso y guarda las que más te gusten.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/recetas"
              className="inline-flex items-center justify-center rounded-full bg-orange-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              Explorar recetas
            </Link>
            <Link
              href="/favoritos"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-white"
            >
              Ver favoritos
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Receta del día
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Una sugerencia aleatoria para inspirar tu próxima comida.
            </p>
          </div>
          <Link
            href="/recetas"
            className="text-sm font-semibold text-orange-700 transition-colors hover:text-orange-800"
          >
            Ver todas las recetas <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-8 max-w-md">
          <Suspense fallback={<RecetaDelDiaEsqueleto />}>
            <RecetaDelDia />
          </Suspense>
        </div>
      </section>
    </>
  );
}
