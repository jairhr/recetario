import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <span
        aria-hidden="true"
        className="grid h-16 w-16 place-items-center rounded-full bg-orange-100 text-2xl"
      >
        🍲
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Página no encontrada
      </h1>
      <p className="mt-3 max-w-md text-base text-stone-600">
        La página que buscas no existe o cambió de dirección. Puedes volver al
        inicio o seguir explorando el recetario.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-orange-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
        >
          Volver al inicio
        </Link>
        <Link
          href="/recetas"
          className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
        >
          Explorar recetas
        </Link>
      </div>
    </div>
  );
}
