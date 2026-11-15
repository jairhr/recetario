import type { Metadata } from "next";
import { FavoritosContenido } from "@/components/FavoritosContenido";

export const metadata: Metadata = {
  title: "Favoritos",
  description:
    "Las recetas que guardaste en este navegador, listas para volver a cocinar.",
};

export default function FavoritosPage() {
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

      <FavoritosContenido />
    </div>
  );
}
