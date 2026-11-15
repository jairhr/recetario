"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import {
  EnlacesNavegacion,
  EnlacesNavegacionEsqueleto,
} from "@/components/EnlacesNavegacion";

export function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          onClick={cerrarMenu}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-stone-900"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-full bg-orange-700 text-sm font-semibold text-white"
          >
            R
          </span>
          Recetario
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          <Suspense fallback={<EnlacesNavegacionEsqueleto />}>
            <EnlacesNavegacion />
          </Suspense>
        </ul>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 md:hidden"
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          {menuAbierto ? (
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="h-6 w-6"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="h-6 w-6"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {menuAbierto && (
        <div
          id="menu-movil"
          className="border-t border-stone-200 bg-stone-50 md:hidden"
        >
          <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            <Suspense
              fallback={
                <EnlacesNavegacionEsqueleto movil onNavigate={cerrarMenu} />
              }
            >
              <EnlacesNavegacion movil onNavigate={cerrarMenu} />
            </Suspense>
          </ul>
        </div>
      )}
    </header>
  );
}
