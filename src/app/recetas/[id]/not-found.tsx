import Link from "next/link";

export default function RecetaNoEncontrada() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <span
        aria-hidden="true"
        className="grid h-16 w-16 place-items-center rounded-full bg-orange-100 text-2xl"
      >
        🔍
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Receta no encontrada
      </h1>
      <p className="mt-3 max-w-md text-base text-stone-600">
        La receta que buscas no existe o ya no está disponible en TheMealDB.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link
          href="/recetas"
          className="inline-flex items-center justify-center rounded-full bg-orange-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-800"
        >
          Ver el recetario
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-100"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
