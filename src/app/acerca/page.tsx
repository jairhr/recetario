import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acerca",
  description:
    "Conoce Recetario, las tecnologías con las que está construido y cómo se desarrolló con Vibe Coding y opencode.",
};

const TECNOLOGIAS = [
  {
    nombre: "Next.js 16",
    detalle:
      "App Router, Server Components, Cache Components y Route Handlers propios.",
  },
  {
    nombre: "React 19",
    detalle:
      "Componentes de servidor por defecto y componentes de cliente solo donde hay interacción.",
  },
  {
    nombre: "TypeScript",
    detalle:
      "Modo estricto, sin any y con tipos compartidos en src/types.",
  },
  {
    nombre: "Tailwind CSS 4",
    detalle:
      "Interfaz responsive mobile-first con una paleta cálida y coherente.",
  },
  {
    nombre: "TheMealDB",
    detalle:
      "Fuente pública de recetas, categorías, ingredientes e imágenes.",
  },
  {
    nombre: "localStorage",
    detalle:
      "Persistencia local de los ids favoritos, sin cuentas ni servidor.",
  },
] as const;

const PASOS_VIBE = [
  {
    titulo: "Reglas antes que código",
    detalle:
      "Definimos arquitectura, tipado, estilos, manejo de datos y rutas antes de la primera línea.",
  },
  {
    titulo: "Iteraciones pequeñas",
    detalle:
      "Capa de datos, layout, listado, detalle, favoritos y acerca, una entrega por vez.",
  },
  {
    titulo: "Verificación continua",
    detalle:
      "Cada iteración terminó con lint, typecheck y build de producción, además de pruebas reales.",
  },
  {
    titulo: "Bitácora abierta",
    detalle:
      "Los prompts, resultados y decisiones técnicas quedaron registrados en VIBE_CODING.md.",
  },
] as const;

export default function AcercaPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
          Sobre el proyecto
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Acerca de Recetario
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
          Recetario es una aplicación para descubrir recetas de todo el mundo,
          revisar sus ingredientes e instrucciones paso a paso y guardar tus
          favoritas. El objetivo es cocinar simple, con sabores de casa y una
          experiencia clara tanto en móvil como en escritorio.
        </p>
      </header>

      <section className="mt-10 rounded-3xl border border-orange-200 bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-stone-900">
          Qué puedes hacer
        </h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
          <li className="flex gap-3">
            <span aria-hidden="true" className="text-orange-700">
              ◆
            </span>
            Buscar recetas por nombre y filtrarlas por categoría.
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="text-orange-700">
              ◆
            </span>
            Consultar ingredientes con medidas e instrucciones numeradas.
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="text-orange-700">
              ◆
            </span>
            Guardar favoritos en el navegador y recuperarlos cuando vuelvas.
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="text-orange-700">
              ◆
            </span>
            Abrir el video de YouTube cuando la receta lo incluya.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-stone-900">
          Tecnologías
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {TECNOLOGIAS.map((tecnologia) => (
            <li
              key={tecnologia.nombre}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-stone-900">
                {tecnologia.nombre}
              </h3>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                {tecnologia.detalle}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-stone-900">
          Vibe Coding con opencode
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
          El proyecto se construyó en pareja con opencode y el modelo DeepSeek
          V4.1 Flash Free. Cada iteración partió de un prompt con objetivos
          concretos, se revisó el resultado y se dejaron por escrito las
          correcciones y decisiones técnicas.
        </p>

        <ol className="mt-6 space-y-5">
          {PASOS_VIBE.map((paso, indice) => (
            <li key={paso.titulo} className="flex gap-4">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-sm font-semibold text-orange-800"
              >
                {indice + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">
                  {paso.titulo}
                </h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  {paso.detalle}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-stone-900">
          Cómo viajan los datos
        </h2>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          Los componentes de cliente nunca llaman directamente a TheMealDB.
          Navegador y servidor se comunican con Route Handlers propios bajo{" "}
          <code className="rounded bg-stone-100 px-1.5 py-0.5 text-[0.85em] text-stone-800">
            src/app/api
          </code>
          , y esos handlers consultan TheMealDB del lado del servidor. Así la
          URL externa y cualquier configuración sensible quedan fuera del
          bundle del navegador.
        </p>
        <p className="mt-3 rounded-2xl bg-stone-100 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-stone-600">
          navegador → /api/recetas → TheMealDB
        </p>
      </section>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/recetas"
          className="inline-flex items-center justify-center rounded-full bg-orange-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
        >
          Explorar el recetario
        </Link>
        <Link
          href="/favoritos"
          className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
        >
          Ver mis favoritos
        </Link>
      </div>
    </div>
  );
}
