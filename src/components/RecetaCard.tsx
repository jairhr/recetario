import Image from "next/image";
import Link from "next/link";
import { BotonFavorito } from "@/components/BotonFavorito";
import type { RecetaResumen } from "@/types/receta";

interface RecetaCardProps {
  receta: RecetaResumen;
}

export function RecetaCard({ receta }: RecetaCardProps) {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/recetas/${receta.id}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          {receta.imagen ? (
            <Image
              src={receta.imagen}
              alt={receta.nombre}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-500">
              Sin imagen disponible
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between gap-3 p-4">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-stone-900">
            {receta.nombre}
          </h3>
          <span className="text-sm font-semibold text-orange-700">
            Ver receta <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-10">
        <BotonFavorito recetaId={receta.id} nombre={receta.nombre} />
      </div>
    </article>
  );
}
