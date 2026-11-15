"use client";

import { useFavoritos } from "@/hooks/useFavoritos";

interface BotonFavoritoProps {
  recetaId: string;
  nombre: string;
  variante?: "tarjeta" | "detalle";
}

function IconoCorazon({ relleno }: { relleno: boolean }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill={relleno ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function BotonFavorito({
  recetaId,
  nombre,
  variante = "tarjeta",
}: BotonFavoritoProps) {
  const { esFavorito, alternarFavorito } = useFavoritos();
  const activo = esFavorito(recetaId);

  if (variante === "detalle") {
    return (
      <button
        type="button"
        onClick={() => alternarFavorito(recetaId)}
        aria-pressed={activo}
        aria-label={
          activo
            ? `Quitar ${nombre} de favoritos`
            : `Añadir ${nombre} a favoritos`
        }
        className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 ${
          activo
            ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            : "border-stone-300 bg-white text-stone-700 hover:border-rose-300 hover:text-rose-700"
        }`}
      >
        <IconoCorazon relleno={activo} />
        {activo ? "En tus favoritos" : "Añadir a favoritos"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => alternarFavorito(recetaId)}
      aria-pressed={activo}
      aria-label={
        activo ? `Quitar ${nombre} de favoritos` : `Añadir ${nombre} a favoritos`
      }
      title={activo ? "Quitar de favoritos" : "Añadir a favoritos"}
      className={`grid h-11 w-11 place-items-center rounded-full border shadow-sm backdrop-blur transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 ${
        activo
          ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border-stone-200 bg-white/90 text-stone-600 hover:bg-white hover:text-rose-600"
      }`}
    >
      <IconoCorazon relleno={activo} />
    </button>
  );
}
