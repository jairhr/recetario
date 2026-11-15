import { RecetaCard } from "@/components/RecetaCard";
import type { RecetaResumen } from "@/types/receta";

interface GrillaRecetasProps {
  recetas: RecetaResumen[];
}

export function GrillaRecetas({ recetas }: GrillaRecetasProps) {
  return (
    <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recetas.map((receta) => (
        <li key={receta.id} className="h-full">
          <RecetaCard receta={receta} />
        </li>
      ))}
    </ul>
  );
}
