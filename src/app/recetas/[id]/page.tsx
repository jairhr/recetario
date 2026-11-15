import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotonFavorito } from "@/components/BotonFavorito";
import { obtenerReceta } from "@/lib/mealdb";

function dividirPasos(instrucciones: string): string[] {
  return instrucciones
    .split(/\r?\n+/)
    .map((paso) => paso.trim())
    .filter((paso) => paso.length > 0);
}

export async function generateMetadata({
  params,
}: PageProps<"/recetas/[id]">): Promise<Metadata> {
  const { id } = await params;
  const receta = await obtenerReceta(id);

  if (!receta) {
    return {
      title: "Receta no encontrada",
      description: "La receta solicitada no existe o ya no está disponible.",
    };
  }

  const descripcion = `Receta de ${receta.nombre}${
    receta.area ? ` de ${receta.area}` : ""
  }${receta.categoria ? ` · ${receta.categoria}` : ""}. Ingredientes e instrucciones paso a paso.`;

  return {
    title: receta.nombre,
    description: descripcion,
    openGraph: {
      title: receta.nombre,
      description: descripcion,
      images: receta.imagen
        ? [{ url: receta.imagen, alt: receta.nombre }]
        : undefined,
    },
  };
}

export default async function RecetaPage({
  params,
}: PageProps<"/recetas/[id]">) {
  const { id } = await params;
  const receta = await obtenerReceta(id);

  if (!receta) {
    notFound();
  }

  const pasos = dividirPasos(receta.instrucciones);
  const tieneYoutube = Boolean(receta.youtube);

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/recetas"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-stone-600 transition-colors hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 rounded"
      >
        <span aria-hidden="true">←</span> Volver a recetas
      </Link>

      <header className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-sm">
          {receta.imagen ? (
            <Image
              src={receta.imagen}
              alt={`Fotografía de ${receta.nombre}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-600">
              Sin imagen disponible
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {receta.categoria && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-800">
                {receta.categoria}
              </span>
            )}
            {receta.area && (
              <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-700">
                {receta.area}
              </span>
            )}
          </div>

          <h1 className="mt-4 break-words text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            {receta.nombre}
          </h1>

          <div data-slot="boton-favorito" className="mt-6">
            <BotonFavorito
              recetaId={receta.id}
              nombre={receta.nombre}
              variante="detalle"
            />
          </div>

          {tieneYoutube && (
            <a
              href={receta.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-red-300 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              <span aria-hidden="true">▶</span> Ver en YouTube
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section aria-labelledby="titulo-ingredientes">
          <h2
            id="titulo-ingredientes"
            className="text-xl font-bold tracking-tight text-stone-900"
          >
            Ingredientes
          </h2>

          {receta.ingredientes.length > 0 ? (
            <ul className="mt-4 divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white">
              {receta.ingredientes.map((ingrediente, indice) => (
                <li
                  key={`${ingrediente.ingrediente}-${indice}`}
                  className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm"
                >
                  <span className="min-w-0 break-words font-medium text-stone-800">
                    {ingrediente.ingrediente}
                  </span>
                  <span className="min-w-0 break-words text-right text-stone-500">
                    {ingrediente.medida || "Al gusto"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-600">
              Esta receta no tiene ingredientes registrados.
            </p>
          )}
        </section>

        <section aria-labelledby="titulo-instrucciones">
          <h2
            id="titulo-instrucciones"
            className="text-xl font-bold tracking-tight text-stone-900"
          >
            Instrucciones
          </h2>

          {pasos.length > 0 ? (
            <ol className="mt-4 space-y-5">
              {pasos.map((paso, indice) => (
                <li key={`${indice}-${paso.slice(0, 24)}`} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-sm font-semibold text-orange-800"
                  >
                    {indice + 1}
                  </span>
                  <p className="break-words text-sm leading-7 text-stone-700">
                    {paso}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-600">
              Esta receta no tiene instrucciones registradas.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
