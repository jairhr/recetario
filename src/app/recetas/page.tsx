import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BuscadorRecetas } from "@/components/BuscadorRecetas";
import { GrillaEsqueleto } from "@/components/GrillaEsqueleto";
import { GrillaRecetas } from "@/components/GrillaRecetas";
import {
  buscarRecetas,
  filtrarPorCategoria,
  listarCategorias,
} from "@/lib/mealdb";
import type { RecetaResumen } from "@/types/receta";

export const metadata: Metadata = {
  title: "Recetas",
  description:
    "Busca recetas por nombre o filtra por categoría y encuentra tu próxima receta favorita.",
};

const BUSQUEDA_POR_DEFECTO = "chicken";

interface Filtros {
  q: string;
  categoria: string;
}

function valorUnico(valor: string | string[] | undefined): string {
  const primero = Array.isArray(valor) ? valor[0] : valor;

  return primero?.trim() ?? "";
}

function normalizarFiltros(params: Record<string, string | string[] | undefined>): Filtros {
  return {
    q: valorUnico(params.q),
    categoria: valorUnico(params.categoria),
  };
}

async function obtenerRecetas({
  q,
  categoria,
}: Filtros): Promise<RecetaResumen[]> {
  if (categoria) {
    const recetas = await filtrarPorCategoria(categoria);

    if (!q) {
      return recetas;
    }

    const aguja = q.toLocaleLowerCase("es");

    return recetas.filter((receta) =>
      receta.nombre.toLocaleLowerCase("es").includes(aguja),
    );
  }

  return buscarRecetas(q || BUSQUEDA_POR_DEFECTO);
}

function tituloResultados({ q, categoria }: Filtros): string {
  if (q && categoria) {
    return `Resultados para “${q}” en ${categoria}`;
  }

  if (q) {
    return `Resultados para “${q}”`;
  }

  if (categoria) {
    return `Categoría: ${categoria}`;
  }

  return "Sugerencias para empezar";
}

function textoCantidad(total: number): string {
  return total === 1 ? "1 receta" : `${total} recetas`;
}

function EstadoVacio({ filtros }: { filtros: Filtros }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
      <span aria-hidden="true" className="text-3xl">
        🍽️
      </span>
      <h3 className="mt-3 text-lg font-semibold text-stone-900">
        No encontramos recetas
      </h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-stone-600">
        {filtros.q
          ? `No hay resultados para “${filtros.q}”${
              filtros.categoria ? ` en ${filtros.categoria}` : ""
            }. Prueba con otro término o quita los filtros.`
          : "Prueba con otra categoría o quita los filtros."}
      </p>
      <Link
        href="/recetas"
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
      >
        Ver todas las sugerencias
      </Link>
    </div>
  );
}

interface ContenidoProps {
  searchParams: PageProps<"/recetas">["searchParams"];
}

async function Contenido({ searchParams }: ContenidoProps) {
  const params = await searchParams;
  const filtros = normalizarFiltros(params);

  const [recetas, categorias] = await Promise.all([
    obtenerRecetas(filtros),
    listarCategorias(),
  ]);

  return (
    <>
      <BuscadorRecetas
        q={filtros.q}
        categoria={filtros.categoria}
        categorias={categorias}
      />

      <section className="mt-10" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            {tituloResultados(filtros)}
          </h2>
          <p className="text-sm text-stone-600">{textoCantidad(recetas.length)}</p>
        </div>

        {recetas.length === 0 ? (
          <EstadoVacio filtros={filtros} />
        ) : (
          <GrillaRecetas recetas={recetas} />
        )}
      </section>
    </>
  );
}

function ContenidoEsqueleto() {
  return (
    <>
      <div className="h-28 animate-pulse rounded-3xl border border-stone-200 bg-white sm:h-32" />
      <div className="mt-10 space-y-3">
        <div className="h-7 w-64 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
      </div>
      <div className="mt-6">
        <GrillaEsqueleto cantidad={8} />
      </div>
    </>
  );
}

export default function RecetasPage({ searchParams }: PageProps<"/recetas">) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
          Explora el recetario
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Recetas
        </h1>
        <p className="mt-3 text-base text-stone-600">
          Busca por nombre o filtra por categoría. La búsqueda se actualiza
          automáticamente mientras escribes.
        </p>
      </header>

      <div className="mt-8">
        <Suspense fallback={<ContenidoEsqueleto />}>
          <Contenido searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
