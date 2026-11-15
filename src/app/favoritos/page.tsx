"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { GrillaEsqueleto } from "@/components/GrillaEsqueleto";
import { GrillaRecetas } from "@/components/GrillaRecetas";
import { useFavoritos } from "@/hooks/useFavoritos";
import type { RecetaResumen } from "@/types/receta";

interface Resultado {
  clave: string;
  recetas: RecetaResumen[];
}

interface Fallo {
  clave: string;
  mensaje: string;
}

function extraerResumen(datos: unknown): RecetaResumen | null {
  if (typeof datos !== "object" || datos === null) {
    return null;
  }

  const receta = (datos as Record<string, unknown>).receta;

  if (typeof receta !== "object" || receta === null) {
    return null;
  }

  const registro = receta as Record<string, unknown>;

  if (
    typeof registro.id !== "string" ||
    typeof registro.nombre !== "string" ||
    typeof registro.imagen !== "string"
  ) {
    return null;
  }

  return {
    id: registro.id,
    nombre: registro.nombre,
    imagen: registro.imagen,
  };
}

async function obtenerResumen(id: string): Promise<RecetaResumen> {
  const respuesta = await fetch(`/api/recetas/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar la receta ${id}.`);
  }

  const datos: unknown = await respuesta.json();
  const receta = extraerResumen(datos);

  if (!receta) {
    throw new Error("La API devolvió una receta inválida.");
  }

  return receta;
}

function EstadoVacio() {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
      <span aria-hidden="true" className="text-3xl">
        🤍
      </span>
      <h2 className="mt-3 text-lg font-semibold text-stone-900">
        Aún no tienes favoritos
      </h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-stone-600">
        Explora el recetario y pulsa el corazón de las recetas que quieras
        guardar.
      </p>
      <Link
        href="/recetas"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-800"
      >
        Explorar recetas
      </Link>
    </div>
  );
}

interface EstadoErrorProps {
  mensaje: string;
  onReintentar: () => void;
}

function EstadoError({ mensaje, onReintentar }: EstadoErrorProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center">
      <span aria-hidden="true" className="text-3xl">
        ⚠️
      </span>
      <h2 className="mt-3 text-lg font-semibold text-stone-900">
        No pudimos cargar tus favoritos
      </h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-stone-600">{mensaje}</p>
      <button
        type="button"
        onClick={onReintentar}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-800"
      >
        Reintentar
      </button>
    </div>
  );
}

export default function FavoritosPage() {
  const { favoritos, hidratado } = useFavoritos();
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [fallo, setFallo] = useState<Fallo | null>(null);
  const [intento, setIntento] = useState(0);

  const clave = favoritos.join("|");
  const claveConsulta = `${clave}#${intento}`;

  const recetas = resultado?.clave === claveConsulta ? resultado.recetas : null;
  const error = fallo?.clave === claveConsulta ? fallo.mensaje : null;

  useEffect(() => {
    if (!hidratado || favoritos.length === 0) {
      return;
    }

    const claveActual = claveConsulta;
    const ids = [...favoritos];
    let cancelado = false;

    async function cargar() {
      try {
        const recetasCargadas = await Promise.all(ids.map(obtenerResumen));

        if (!cancelado) {
          setResultado({ clave: claveActual, recetas: recetasCargadas });
        }
      } catch {
        if (!cancelado) {
          setFallo({
            clave: claveActual,
            mensaje: "Revisa tu conexión e inténtalo de nuevo.",
          });
        }
      }
    }

    cargar();

    return () => {
      cancelado = true;
    };
  }, [claveConsulta, favoritos, hidratado]);

  function reintentar() {
    setFallo(null);
    setResultado(null);
    setIntento((actual) => actual + 1);
  }

  let contenido: ReactNode;

  if (!hidratado) {
    contenido = <GrillaEsqueleto cantidad={4} />;
  } else if (favoritos.length === 0) {
    contenido = <EstadoVacio />;
  } else if (error) {
    contenido = <EstadoError mensaje={error} onReintentar={reintentar} />;
  } else if (!recetas) {
    contenido = <GrillaEsqueleto cantidad={favoritos.length} />;
  } else {
    contenido = <GrillaRecetas recetas={recetas} />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
          Tu colección
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Favoritos
        </h1>
        <p className="mt-3 text-base text-stone-600">
          Las recetas que guardaste se conservan en este navegador. Puedes
          quitarlas con el corazón de cada tarjeta.
        </p>
      </header>

      <section className="mt-8" aria-live="polite">
        {hidratado && favoritos.length > 0 && recetas ? (
          <p className="mb-4 text-sm font-medium text-stone-600">
            {favoritos.length === 1
              ? "1 receta guardada"
              : `${favoritos.length} recetas guardadas`}
          </p>
        ) : null}
        {contenido}
      </section>
    </div>
  );
}
