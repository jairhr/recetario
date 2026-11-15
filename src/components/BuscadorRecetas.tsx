"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Categoria } from "@/types/receta";

interface BuscadorRecetasProps {
  q: string;
  categoria: string;
  categorias: Categoria[];
}

const ESPERA_DEBOUNCE_MS = 400;

export function BuscadorRecetas({
  q,
  categoria,
  categorias,
}: BuscadorRecetasProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [texto, setTexto] = useState(q);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoria);
  const [qPrevio, setQPrevio] = useState(q);
  const [categoriaPrevia, setCategoriaPrevia] = useState(categoria);
  const [ultimaNavegacion, setUltimaNavegacion] = useState({
    q: q.trim(),
    categoria,
  });

  // Sincroniza cambios externos de la URL sin pisar lo que el usuario escribe.
  if (q !== qPrevio) {
    setQPrevio(q);

    if (q.trim() !== ultimaNavegacion.q) {
      setTexto(q);
    }
  }

  if (categoria !== categoriaPrevia) {
    setCategoriaPrevia(categoria);

    if (categoria !== ultimaNavegacion.categoria) {
      setCategoriaSeleccionada(categoria);
    }
  }

  const actualizarUrl = useCallback(
    (nuevoTexto: string, nuevaCategoria: string) => {
      const params = new URLSearchParams();
      const consulta = nuevoTexto.trim();

      if (consulta) {
        params.set("q", consulta);
      }

      if (nuevaCategoria) {
        params.set("categoria", nuevaCategoria);
      }

      setUltimaNavegacion({ q: consulta, categoria: nuevaCategoria });

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  useEffect(() => {
    if (texto.trim() === q.trim()) {
      return;
    }

    const temporizador = setTimeout(() => {
      actualizarUrl(texto, categoriaSeleccionada);
    }, ESPERA_DEBOUNCE_MS);

    return () => clearTimeout(temporizador);
  }, [texto, q, categoriaSeleccionada, actualizarUrl]);

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    actualizarUrl(texto, categoriaSeleccionada);
  }

  function manejarCategoria(evento: ChangeEvent<HTMLSelectElement>) {
    const valor = evento.target.value;
    setCategoriaSeleccionada(valor);
    actualizarUrl(texto, valor);
  }

  return (
    <form
      role="search"
      onSubmit={manejarEnvio}
      className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_16rem] sm:items-end">
        <div>
          <label
            htmlFor="buscar-recetas"
            className="mb-1.5 block text-sm font-medium text-stone-700"
          >
            Buscar por nombre
          </label>
          <div className="relative">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
            <input
              id="buscar-recetas"
              type="search"
              value={texto}
              onChange={(evento) => setTexto(evento.target.value)}
              placeholder="Ej. pasta, chicken, curry…"
              autoComplete="off"
              className="w-full rounded-full border border-stone-300 bg-stone-50 py-3 pl-11 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="categoria-recetas"
            className="mb-1.5 block text-sm font-medium text-stone-700"
          >
            Categoría
          </label>
          <select
            id="categoria-recetas"
            value={categoriaSeleccionada}
            onChange={manejarCategoria}
            className="w-full rounded-full border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((opcion) => (
              <option key={opcion.id} value={opcion.nombre}>
                {opcion.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}
