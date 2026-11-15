import Link from "next/link";

const ENLACES_PIE = [
  { href: "/recetas", etiqueta: "Recetas" },
  { href: "/favoritos", etiqueta: "Favoritos" },
  { href: "/acerca", etiqueta: "Acerca" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="font-semibold text-stone-900">Recetario</p>
        <p>Cocina simple, sabores de casa.</p>
        <nav aria-label="Navegación del pie">
          <ul className="flex flex-wrap gap-4">
            {ENLACES_PIE.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 rounded"
                >
                  {enlace.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
